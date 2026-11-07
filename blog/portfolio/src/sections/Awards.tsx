import { AWARDS, CERTIFICATIONS, CONTACT } from '../data/portfolio';

function List({ items }: { items: { date: string; title: string; detail: string }[] }) {
  return <ul className="award-list">
    {items.map(item => <li key={item.title}><time>{item.date}</time><div><strong>{item.title}</strong><span>{item.detail}</span></div></li>)}
  </ul>;
}

export default function Awards() {
  return <section className="wrap block" id="awards" aria-labelledby="awards-title">
    <h2 id="awards-title">Awards</h2>
    <List items={AWARDS} />
    <h3 className="sub-title">Certifications</h3>
    <List items={CERTIFICATIONS} />
  </section>;
}

export function Footer() {
  return <footer className="wrap site-footer">
    <span>© 2026 林立人</span>
    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
    <a href={CONTACT.github}>GitHub</a>
    <a href={CONTACT.blog}>Blog</a>
  </footer>;
}
