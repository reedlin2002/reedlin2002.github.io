# B prototype — lanyard and flowing article previews

## Scope
Refine the selected B prototype with a draggable author ID lanyard and directional, flowing image previews for the real article list. Preserve the current logo, Hibiki, skills marquee and topic folder. A/C and production remain unchanged.

## Files Impacted
- `themes/cactus/prototype/home-B.ejs`, `preview.css`, `preview.js`.
- New `lanyard.js` and `flowing-menu.js` preview modules.
- `scripts/ui-prototype.js`: server-only asset allowlist.
- Prototype README and isolation decision log.

## DB Impact
None; interactions are document-local and all article links remain real anchors.

## Risk
- Keep article titles and metadata readable: the flowing image band occupies the excerpt area, not the title or tag links.
- Avoid requiring hover on phones. Show a static thumbnail and preserve one-tap article navigation.
- Lanyard uses existing Three.js with a small rope simulation, no React runtime or remote GLB asset. Provide the real logo as a static fallback on small screens, reduced motion or unavailable WebGL.
- Suspend offscreen/hidden animations and release 3D resources on navigation. Avoid arrow-shortcut conflicts for the keyboard-accessible lanyard.
- Prototype UI/assets must not leak into production generation.

## SDD Update
No SDD exists. Update the existing prototype isolation decision and README.

## Story Status
- [ ] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## Outcome — rejected, reverted 2026-09-20
Owner reviewed both interactions in the running B prototype and asked for them to be
removed. `lanyard.js` and `flowing-menu.js` are deleted; `home-B.ejs`, `preview.css`,
`preview.js` and the `scripts/ui-prototype.js` asset allowlist are back to the previous
notebook rows (hover thumbnail preview) and the plain logo emblem. The logo,
skills marquee, Live2D Hibiki and Folder Float topic folder are untouched and stay.

## Verification
Visual desktop/mobile review; drag/release and keyboard lanyard; directional article hover, direct article navigation and touch fallback; logo/Hibiki/folder regression checks; syntax and generation/isolation checks. No test framework for disposable code.

## References
- https://reactbits.dev/components/lanyard
- https://reactbits.dev/components/flowing-menu

These are independently implemented Hexo-compatible adaptations, not the React components copied unchanged.
