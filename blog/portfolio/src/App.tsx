import { useEffect } from 'react';
import About, { SiteHeader } from './sections/About';
import Experience from './sections/Experience';
import News from './sections/News';
import Research from './sections/Research';
import Projects from './sections/Projects';
import Awards, { Footer } from './sections/Awards';

export default function App() {
  useEffect(() => {
    // The browser tries the initial #fragment before React has rendered the target.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);

  return <>
    <a className="skip-link" href="#main-content">跳至主要內容</a>
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>
      <About /><Experience /><News /><Research /><Projects /><Awards />
    </main>
    <Footer />
  </>;
}
