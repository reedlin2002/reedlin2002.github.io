# Decision: server-only article-first design prototypes

**Date**: 2026-09-19
**Status**: Accepted

## Context
The owner wants articles to be immediately inviting, and wants to compare three working home/article designs before changing the public blog. The site uses Hexo/EJS, not React. The previous full-screen personal-brand landing is the baseline, not the goal of this experiment.

## Decision
Keep disposable templates/assets next to the cactus theme, outside its published `source/` tree. A double-gated Hexo server middleware reads existing rendered posts and renders the requested `?variant=A|B|C` on their existing paths. Only `npm run prototype` enables it; the server binds to 127.0.0.1. Development assets (including pinned Three.js) are served from an explicit allowlist, never a generator.

Use ordinary document navigation for prototype articles and variant changes. This intentionally avoids modifying production PJAX or widget lifecycles. The comparison toolbar uses replace navigation for variant changes, so it does not fill browser history. The 3D module disposes on pagehide and pauses when hidden/offscreen. Reduced motion, narrow screens and WebGL failures keep static artwork.

Retain the no-TOC reading layout. Following owner feedback, B reuses the actual Live2D Hibiki with its existing offline dialog mode. Add optional `persist_visibility` and `start_hidden` configuration to the existing widget; defaults preserve production behavior, while preview visibility stays in memory. A/C retain the initial collapsed mock. Music uses existing local tracks with explicit playback. No chat requests or writes to visitor preferences. Existing article sources, metadata, permalinks and production rendering stay authoritative.

The owner selected B for refinement and asked to retain their current logo and skills-marquee, and add the Folder Float interaction. Use the configured logo/skills, and implement a vanilla topic-folder adaptation of https://reactbits.dev/micro/folder-float with clickable, draggable floating links and reduced-motion support. No React runtime or additional physics dependency is needed for the small fixed set of topic pills. This is an independently implemented adaptation, not a copy of the React component.

## Consequences
All home/article variants use live Hexo data and real URLs. Normal builds cannot ship the prototype UI or Three.js assets. Full navigations restart optional music; uninterrupted playback is deferred to the chosen production design. This experiment does not supersede the production homepage decision until the owner selects a direction.
