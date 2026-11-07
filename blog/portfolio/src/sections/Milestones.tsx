import { useState } from 'react';
import Wrap from '../components/Wrap';
import { MILESTONES, UI } from '../data/portfolio';
import { useT } from '../i18n';

const INITIAL = 6;

export default function Milestones() {
  const tr = useT();
  const [all, setAll] = useState(false);
  const items = all ? MILESTONES : MILESTONES.slice(0, INITIAL);
  return <section className="wrap block" id="milestones" aria-labelledby="milestones-title">
    <h2 id="milestones-title">{tr(UI.nav.milestones)}</h2>
    <ul className="dated-list" id="milestone-list">
      {items.map(item => <li key={item.date + item.text.en}>
        <time>{item.date}</time>
        <p>{item.href ? <a href={item.href}><Wrap text={tr(item.text)} /></a> : <Wrap text={tr(item.text)} />}</p>
      </li>)}
    </ul>
    {MILESTONES.length > INITIAL && <button type="button" className="more-button" aria-expanded={all} aria-controls="milestone-list" onClick={() => setAll(!all)}>{tr(all ? UI.collapse : UI.showAll(MILESTONES.length))}</button>}
  </section>;
}
