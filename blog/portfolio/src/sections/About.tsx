import { ABOUT, CONTACT, UI } from '../data/portfolio';
import { usePrefs, useT } from '../i18n';
import { MailIcon, GitHubIcon, ContrastIcon } from '../components/Icons';

const SECTIONS = ['about', 'experience', 'milestones', 'research', 'projects', 'awards'] as const;

export function SiteHeader() {
  const tr = useT();
  const { lang, setLang, theme, toggleTheme } = usePrefs();
  return <header className="site-header">
    <div className="wrap site-header-inner">
      <a className="brand" href="#about">{tr(ABOUT.name)}</a>
      <nav aria-label={lang === 'zh' ? '頁面區塊' : 'Sections'}>
        {SECTIONS.map(id => <a key={id} href={`#${id}`}>{tr(UI.nav[id])}</a>)}
        <a href={CONTACT.blog}>{tr(UI.nav.blog)} ↗</a>
      </nav>
      <div className="header-tools">
        <div className="lang-switch" role="group" aria-label={tr(UI.langLabel)}>
          <button type="button" aria-pressed={lang === 'zh'} onClick={() => setLang('zh')} lang="zh-Hant">中</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">EN</button>
        </div>
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={tr(theme === 'dark' ? UI.themeToLight : UI.themeToDark)} title={tr(theme === 'dark' ? UI.themeToLight : UI.themeToDark)}>
          <ContrastIcon />
        </button>
      </div>
    </div>
  </header>;
}

// Lines may wrap only between "|"-separated phrases; text without markers wraps normally.
function Phrases({ text }: { text: string }) {
  if (!text.includes('|')) return <>{text}</>;
  return <>{text.split('|').filter(Boolean).map((part, i) => <span className="ph" key={i}>{part}</span>)}</>;
}

export default function About() {
  const tr = useT();
  return <section className="wrap about" id="about" aria-labelledby="about-title">
    <h1 id="about-title">{tr(ABOUT.name)}<span>{tr(ABOUT.altName)}</span></h1>
    <p className="about-role">{tr(ABOUT.role)}</p>
    <div className="about-body">
      {ABOUT.paragraphs.map(p => <p key={p.en}><Phrases text={tr(p)} /></p>)}
      <p><Phrases text={tr(ABOUT.notes.before)} /><span className="ph">{tr(ABOUT.notes.lead)}<a href={CONTACT.blog}>{tr(ABOUT.notes.link)}</a>{tr(ABOUT.notes.after)}</span></p>
    </div>
    <ul className="about-contact" aria-label={tr(UI.contact)}>
      <li><a href={`mailto:${CONTACT.email}`}><MailIcon />{CONTACT.email}</a></li>
      <li><a href={CONTACT.github}><GitHubIcon />reedlin2002</a></li>
    </ul>
  </section>;
}
