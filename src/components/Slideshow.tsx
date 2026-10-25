import { useEffect, useRef, useState } from 'react';

type Slide = { src: string; title: string; subtitle: string; href?: string };
type Props = { slides: Slide[]; heading?: string; project?: boolean };

export default function Slideshow({ slides: input, heading, project = false }: Props) {
  const slides = input.slice(0, 5);
  const [active, setActive] = useState(0);
  const [visits, setVisits] = useState<number[]>(() => slides.map((_, i) => i === 0 ? 1 : 0));
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState<Set<number>>(() => new Set([0]));
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const select = (index: number) => {
    if (!ready.has(index) || index === active) return;
    setVisits(previous => previous.map((count, i) => i === index ? count + 1 : count));
    setActive(index);
  };

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update(); preference.addEventListener('change', update);
    // Cached images may finish before React hydrates and attaches onLoad.
    const loaded = new Set<number>();
    section.current?.querySelectorAll<HTMLImageElement>('.hero-frame img').forEach((image, index) => {
      if (image.complete && image.naturalWidth > 0) loaded.add(index);
    });
    setReady(previous => new Set([...previous, ...loaded]));
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    if (section.current) observer.observe(section.current);
    return () => { preference.removeEventListener('change', update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (paused || reduced || !visible || slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const next = (active + 1) % slides.length;
      if (ready.has(next)) {
        setVisits(previous => previous.map((count, i) => i === next ? count + 1 : count));
        setActive(next);
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active, paused, reduced, visible, ready, slides.length]);

  const slide = slides[active];
  const Heading = project ? 'h1' : 'h2';
  if (!slide) return null;
  return (
    <section className={`hero ${project ? 'hero--project' : ''} ${paused || reduced ? 'is-paused' : ''}`} aria-label={project ? 'Vizualizace projektu' : 'Vybrané projekty'} aria-roledescription="slideshow" ref={section}>
      <div className="hero-images" aria-hidden="true">
        {slides.map((item, index) => (
          <div className={`hero-frame ${index === active ? 'is-active' : ''}`} key={item.src}>
            <img key={visits[index]} className={visits[index] > 0 ? 'has-played' : ''} src={item.src} alt="" loading="eager" decoding="async" onLoad={() => setReady(previous => previous.has(index) ? previous : new Set(previous).add(index))} />
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="hero-caption" key={slide.title}>
        <span className="eyebrow">{project ? 'Architektura & vizualizace' : 'Vybrané projekty'}</span>
        <Heading>{heading || slide.title}</Heading>
        {slide.href ? <a className="hero-project-link" href={slide.href}>{slide.subtitle}<span aria-hidden="true">↗</span></a> : <p>{slide.subtitle}</p>}
      </div>
      <div className="hero-bottom">
        <a className="scroll-cue" href={project ? '#project' : '#work'}><span>{project ? 'O projektu' : 'Objevte projekty'}</span><span aria-hidden="true">↓</span></a>
        <div className="slide-controls">
          <span className="slide-count">{String(active + 1).padStart(2, '0')}<span> / {String(slides.length).padStart(2, '0')}</span></span>
          <div className="slide-dots" role="group" aria-label="Výběr snímku">{slides.map((item, index) => <button type="button" key={index} className={index === active ? 'active' : ''} aria-label={`Snímek ${index + 1}: ${item.title}`} aria-pressed={index === active} onClick={() => select(index)}><span /></button>)}</div>
          {slides.length > 1 && <button type="button" className="pause-button" aria-label={paused || reduced ? 'Spustit prezentaci' : 'Pozastavit prezentaci'} onClick={() => { const stopped = paused || reduced; setReduced(false); setPaused(!stopped); }}>{paused || reduced ? '▷' : 'Ⅱ'}</button>}
        </div>
      </div>
    </section>
  );
}
