import { EXPERIENCE, UI } from '../data/portfolio';
import Wrap from '../components/Wrap';
import { useT } from '../i18n';

export default function Experience() {
  const tr = useT();
  return <section className="wrap block" id="experience" aria-labelledby="experience-title">
    <h2 id="experience-title">{tr(UI.nav.experience)}</h2>
    <ol className="exp-list">
      {EXPERIENCE.map(item => <li className="exp-item" key={item.org.en}>
        <span className="exp-logo"><img src={item.logo} alt="" width="40" height="40" /></span>
        <div className="exp-body">
          <div className="exp-head"><h3>{tr(item.org)}</h3><span className="exp-period">{tr(item.period)}</span></div>
          {item.roles.map(role => <div className="exp-role" key={role.title.en}>
            <p className="exp-role-head"><strong>{tr(role.title)}</strong><span>{tr(role.period)}</span></p>
            <ul className="exp-bullets">{role.bullets.map(b => <li key={b.en}><Wrap text={tr(b)} /></li>)}</ul>
          </div>)}
          {item.tags && <ul className="tags" aria-label={tr(UI.tech)}>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
        </div>
      </li>)}
    </ol>
  </section>;
}
