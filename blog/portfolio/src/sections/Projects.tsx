import { MORE_PROJECTS, PROJECTS, UI, node, type Project } from '../data/portfolio';
import Wrap from '../components/Wrap';
import Zoomable from '../components/Zoomable';
import { useT } from '../i18n';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Media({ project }: { project: Project }) {
  const tr = useT();
  const item = node(project.id);
  const label = `${tr(UI.zoom)}${tr({ zh: '：', en: ': ' })}${tr(project.title)}`;
  if (project.video) {
    const { src, poster } = project.video;
    return <Zoomable label={label} closeLabel={tr(UI.close)} full={<video src={src} poster={poster} controls muted loop playsInline preload="none" />}>
      <video src={src} poster={poster} muted loop playsInline autoPlay={!reducedMotion} preload={reducedMotion ? 'none' : 'auto'} aria-hidden="true" />
    </Zoomable>;
  }
  if (!item.image) return null;
  return <Zoomable label={label} closeLabel={tr(UI.close)} full={<img src={item.image.src} alt={tr(project.title)} />}>
    <img src={item.image.src} alt="" loading="lazy" width="960" height="540" />
  </Zoomable>;
}

function Links({ id }: { id: string }) {
  const tr = useT();
  return <p className="text-links">{node(id).links.map(link => <a key={link.href} href={link.href}>{tr(UI.link[link.kind])} ↗</a>)}</p>;
}

export default function Projects() {
  const tr = useT();
  return <section className="wrap block" id="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">{tr(UI.nav.projects)}</h2>
    <p className="block-lead">{tr(UI.projectsLead)}</p>
    <ul className="project-grid">
      {PROJECTS.map(project => <li className="project-card" id={project.id} key={project.id}>
        <div className="project-media"><Media project={project} /></div>
        <div className="project-body">
          <p className="project-meta"><span>{node(project.id).date}</span><span>{tr(project.kind)}</span></p>
          <h3>{tr(project.title)}</h3>
          <p><Wrap text={tr(project.summary)} /></p>
          <ul className="tags" aria-label={tr(UI.tech)}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
          <Links id={project.id} />
        </div>
      </li>)}
    </ul>
    <h3 className="sub-title">{tr(UI.moreProjects)}</h3>
    <ul className="more-list">
      {MORE_PROJECTS.map(more => <li key={more.id}>
        <time>{node(more.id).date}</time>
        <div><h4>{tr(more.title)}</h4><p><Wrap text={tr(more.summary)} /></p></div>
        <Links id={more.id} />
      </li>)}
    </ul>
  </section>;
}
