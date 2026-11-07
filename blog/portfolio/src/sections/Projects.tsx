import { LINK_LABEL, MORE_PROJECTS, PROJECTS, node, type Project } from '../data/portfolio';
import Zoomable from '../components/Zoomable';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Media({ project }: { project: Project }) {
  const item = node(project.id);
  if (project.video) {
    const { src, poster } = project.video;
    return <Zoomable label={`${item.title} 操作影片`} full={<video src={src} poster={poster} controls muted loop playsInline preload="none" />}>
      <video src={src} poster={poster} muted loop playsInline autoPlay={!reducedMotion} preload={reducedMotion ? 'none' : 'auto'} aria-hidden="true" />
    </Zoomable>;
  }
  if (!item.image) return null;
  return <Zoomable label={item.image.alt} full={<img src={item.image.src} alt={item.image.alt} />}>
    <img src={item.image.src} alt="" loading="lazy" width="960" height="540" />
  </Zoomable>;
}

export default function Projects() {
  return <section className="wrap block" id="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">Projects</h2>
    <p className="block-lead">Side projects 與黑客松作品，每個都附文章或程式碼。點圖片可以放大。</p>
    <ul className="project-grid">
      {PROJECTS.map(project => {
        const item = node(project.id);
        return <li className="project-card" id={project.id} key={project.id}>
          <div className="project-media"><Media project={project} /></div>
          <div className="project-body">
            <p className="project-meta"><span>{item.date}</span><span>{project.kind}</span></p>
            <h3>{item.title}</h3>
            <p>{project.summary}</p>
            <ul className="tags" aria-label="使用技術">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
            <p className="text-links">{item.links.map(link => <a key={link.href} href={link.href}>{LINK_LABEL[link.kind]} ↗</a>)}</p>
          </div>
        </li>;
      })}
    </ul>
    <h3 className="sub-title">其他作品</h3>
    <ul className="more-list">
      {MORE_PROJECTS.map(more => {
        const item = node(more.id);
        return <li key={more.id}>
          <time>{item.date}</time>
          <div><h4>{item.title}</h4><p>{more.summary}</p></div>
          <p className="text-links">{item.links.map(link => <a key={link.href} href={link.href}>{LINK_LABEL[link.kind]} ↗</a>)}</p>
        </li>;
      })}
    </ul>
  </section>;
}
