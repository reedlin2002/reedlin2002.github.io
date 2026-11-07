import Pipeline from './Hero';
import Wrap from '../components/Wrap';
import { RESEARCH, UI } from '../data/portfolio';
import { useT } from '../i18n';

export default function Research() {
  const tr = useT();
  return <section className="wrap block" id="research" aria-labelledby="research-title">
    <h2 id="research-title">{tr(UI.nav.research)}</h2>
    <article className="research-card">
      <div className="research-media"><Pipeline /></div>
      <div className="research-body">
        <p className="project-meta">{RESEARCH.meta.map(m => <span key={m.en}>{tr(m)}</span>)}</p>
        <h3>{tr(RESEARCH.title)}</h3>
        <p><Wrap text={tr(RESEARCH.intro)} /></p>
        <h4>{tr(UI.whatIDid)}</h4>
        <ul className="did-list">{RESEARCH.did.map(d => <li key={d.en}><Wrap text={tr(d)} /></li>)}</ul>
        <ul className="tags" aria-label={tr(UI.tech)}>{RESEARCH.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <p className="text-links">{RESEARCH.links.map(link => <a key={link.href} href={link.href}>{tr(link.label)} ↗</a>)}</p>
      </div>
    </article>
  </section>;
}
