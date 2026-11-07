import { useState } from 'react';
import { NEWS } from '../data/portfolio';

const INITIAL = 6;

export default function News() {
  const [all, setAll] = useState(false);
  const items = all ? NEWS : NEWS.slice(0, INITIAL);
  return <section className="wrap block" id="news" aria-labelledby="news-title">
    <h2 id="news-title">News</h2>
    <ul className="news-list" id="news-list">
      {items.map(item => <li key={item.date + item.text}>
        <time>{item.date}</time>
        <p>{item.href ? <a href={item.href}>{item.text}</a> : item.text}</p>
      </li>)}
    </ul>
    {NEWS.length > INITIAL && <button type="button" className="more-button" aria-expanded={all} aria-controls="news-list" onClick={() => setAll(!all)}>{all ? '收合' : `顯示全部 ${NEWS.length} 則`}</button>}
  </section>;
}
