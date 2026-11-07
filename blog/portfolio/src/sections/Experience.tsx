import { EXPERIENCE } from '../data/portfolio';

export default function Experience() {
  return <section className="wrap block" id="experience" aria-labelledby="experience-title">
    <h2 id="experience-title">Experience</h2>
    <ol className="exp-list">
      {EXPERIENCE.map(item => <li className="exp-item" key={item.org}>
        <span className="exp-mark" aria-hidden="true">{item.mark}</span>
        <div className="exp-body">
          <div className="exp-head"><h3>{item.org}</h3><span className="exp-period">{item.period}</span></div>
          <ul className="exp-roles">{item.roles.map(role => <li key={role.title}><strong>{role.title}</strong><span>{role.period}</span></li>)}</ul>
          <p className="exp-summary">{item.summary}</p>
          {item.highlights && <ul className="exp-highlights">
            {item.highlights.map(h => <li key={h.title}><strong>{h.title}</strong>{h.detail}</li>)}
          </ul>}
          {item.tags && <ul className="tags" aria-label="使用技術">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
          {item.links && <p className="text-links">{item.links.map(link => <a key={link.href} href={link.href}>{link.label} {link.href.startsWith('#') ? '↓' : '↗'}</a>)}</p>}
        </div>
      </li>)}
    </ol>
  </section>;
}
