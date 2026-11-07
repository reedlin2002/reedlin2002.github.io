import { useEffect } from 'react';
import { Prefs, useT } from './i18n';
import { UI } from './data/portfolio';
import About, { SiteHeader } from './sections/About';
import Experience from './sections/Experience';
import Milestones from './sections/Milestones';
import Research from './sections/Research';
import Projects from './sections/Projects';
import Awards, { Footer } from './sections/Awards';

function Page() {
  const tr = useT();
  useEffect(() => {
    // The browser tries the initial #fragment before React has rendered the target.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);

  return <>
    <a className="skip-link" href="#main-content">{tr(UI.skip)}</a>
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>
      <About /><Experience /><Milestones /><Research /><Projects /><Awards />
    </main>
    <Footer />
  </>;
}

export default function App() {
  return <Prefs><Page /></Prefs>;
}
