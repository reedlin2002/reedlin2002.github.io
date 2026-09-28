import type { ReactNode } from 'react';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import CountUp from '../components/reactbits/CountUp';
import { useReducedMotion } from '../lib/media';
import { LINK_LABEL, TIMELINE, TRACK_LABEL, type NodeStat, type TimelineNode } from '../data/timeline';

// The animated number starts at 0; screen readers get the final value instead.
const statText = (stat: NodeStat) =>
  `${stat.prefix ?? ''}${stat.separator ? stat.value.toLocaleString('en-US') : stat.value}${stat.suffix ?? ''}`;

function Reveal({ children, reduced }: { children: ReactNode; reduced: boolean }) {
  if (reduced) return <>{children}</>;
  return (
    <AnimatedContent distance={48} duration={0.7} ease="power3.out" threshold={0.15}>
      {children}
    </AnimatedContent>
  );
}

function NodeCard({ node, reduced }: { node: TimelineNode; reduced: boolean }) {
  const primary = node.links[0];
  const track = TRACK_LABEL[node.track];

  return (
    <article className={`card${node.compact ? ' is-compact' : ''}`}>
      <div className="card-head">
        <span className="mono card-date">{node.date}</span>
        <span className={`track-chip is-${node.track}`}>{track.zh}</span>
        <span className="mono card-tag">{node.tag}</span>
      </div>
      <h3 className="card-title">{node.title}</h3>

      {node.image &&
        (primary ? (
          <a
            className={`card-media cursor-target${node.image.fit === 'contain' ? ' is-contain' : ''}`}
            href={primary.href}
            aria-label={`${node.title}：${LINK_LABEL[primary.kind]}`}
          >
            <img src={node.image.src} alt={node.image.alt} loading="lazy" />
          </a>
        ) : (
          <div className={`card-media${node.image.fit === 'contain' ? ' is-contain' : ''}`}>
            <img src={node.image.src} alt={node.image.alt} loading="lazy" />
          </div>
        ))}

      <p className="card-body">{node.body}</p>

      {node.stats && (
        <dl className="stats">
          {node.stats.map(stat => (
            <div className="stat" key={stat.label}>
              <dt className="stat-label">{stat.label}</dt>
              <dd className="stat-value">
                <span className="sr-only">{statText(stat)}</span>
                <span aria-hidden="true">
                  {stat.prefix && <span className="stat-affix">{stat.prefix}</span>}
                  <CountUp
                    to={stat.value}
                    from={reduced ? stat.value : 0}
                    duration={1.6}
                    separator={stat.separator ?? ''}
                    className="stat-num"
                  />
                  {stat.suffix && <span className="stat-affix">{stat.suffix}</span>}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {node.cases && (
        <ul className="card-cases">
          {node.cases.map(c => (
            <li key={c.title}>
              <strong>{c.title}</strong>
              <span>{c.detail}</span>
            </li>
          ))}
        </ul>
      )}

      {node.links.length > 0 && (
        <div className="card-links">
          {node.links.map(link => (
            <a key={link.href + link.kind} className={`btn cursor-target is-${link.kind}`} href={link.href}>
              {LINK_LABEL[link.kind]}
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function DualTimeline() {
  const reduced = useReducedMotion();
  let lastYear = '';

  return (
    <section className="timeline" id="timeline" aria-labelledby="timeline-title">
      <div className="section-head">
        <p className="kicker">TIMELINE · 2023 → NOW</p>
        <h2 id="timeline-title" className="section-title">
          兩條路徑，同一條時間軸
        </h2>
        <p className="section-sub">左邊是研究，右邊是工程。先有專題，再進業界，最後帶著工程經驗回頭把專題重構。</p>
      </div>

      <div className="tl-tracks" aria-hidden="true">
        <span className="tl-track is-research">
          {TRACK_LABEL.research.zh} <span className="mono">{TRACK_LABEL.research.en}</span>
        </span>
        <span className="tl-track is-engineering">
          {TRACK_LABEL.engineering.zh} <span className="mono">{TRACK_LABEL.engineering.en}</span>
        </span>
      </div>

      <ol className="tl-list">
        {TIMELINE.map(node => {
          const year = node.sortKey.slice(0, 4);
          const showYear = year !== lastYear;
          lastYear = year;
          return [
            showYear && (
              <li className="tl-year" key={`y-${year}`} aria-hidden="true">
                <span className="mono">{year}</span>
              </li>
            ),
            <li className={`tl-node is-${node.track}`} key={node.id}>
              <span className="tl-dot" aria-hidden="true" />
              <div className="tl-slot">
                <Reveal reduced={reduced}>
                  <NodeCard node={node} reduced={reduced} />
                </Reveal>
              </div>
            </li>
          ];
        })}
        <li className="tl-now">
          <span className="mono tl-now-key">NOW</span>
          <span className="tl-now-text">研究 × 工程持續累積</span>
        </li>
      </ol>
    </section>
  );
}
