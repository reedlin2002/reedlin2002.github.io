import { ABOUT, AWARDS, CERTIFICATIONS, CONTACT, UI, type Award } from '../data/portfolio';
import Wrap from '../components/Wrap';
import { useT } from '../i18n';
import { GitHubIcon, MailIcon, NotesIcon } from '../components/Icons';

function List({ items }: { items: Award[] }) {
  const tr = useT();
  return <ul className="dated-list is-awards">
    {items.map(item => <li key={item.title.en}><time>{item.date}</time><div><strong>{tr(item.title)}</strong><span><Wrap text={tr(item.detail)} /></span></div></li>)}
  </ul>;
}

export default function Awards() {
  const tr = useT();
  return <section className="wrap block" id="awards" aria-labelledby="awards-title">
    <h2 id="awards-title">{tr(UI.nav.awards)}</h2>
    <List items={AWARDS} />
    <h3 className="sub-title">{tr(UI.certifications)}</h3>
    <List items={CERTIFICATIONS} />
  </section>;
}

export function Footer() {
  const tr = useT();
  return <footer className="site-footer">
    <ul aria-label={tr(UI.contact)}>
      <li><a href={`mailto:${CONTACT.email}`} aria-label="Email" title={CONTACT.email}><MailIcon /></a></li>
      <li><a href={CONTACT.github} aria-label="GitHub" title="GitHub"><GitHubIcon /></a></li>
      <li><a href={CONTACT.blog} aria-label={tr(UI.nav.blog)} title={tr(UI.nav.blog)}><NotesIcon /></a></li>
    </ul>
    <p>© 2026 {tr(ABOUT.name)}</p>
  </footer>;
}
