"""Validate the generated Hexo/Portfolio boundary without third-party packages.

Run after npm run build:portfolio && npm run build. Kept outside scripts/,
because Hexo automatically loads that directory as JavaScript plugins.
Checks deployed assets byte-for-byte, article routes, structured data, and the
local links/assets on the homepage and About page. Browser interaction is separate.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
failures = []


def check(condition, message):
    if not condition:
        failures.append(message)


def target_for(url):
    parsed = urlparse(url)
    if parsed.scheme and parsed.netloc != "reedlin2002.github.io":
        return None
    if not parsed.path or not parsed.path.startswith("/"):
        return None
    target = PUBLIC / unquote(parsed.path).lstrip("/")
    return target / "index.html" if target.is_dir() else target


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.references = []
        self.structured = []
        self.ids = []
        self.in_json = False
        self.buffer = ""
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for key in ("src", "href"):
            if attrs.get(key):
                self.references.append(attrs[key])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_json = True
            self.buffer = ""

    def handle_data(self, data):
        if self.in_json:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag == "script" and self.in_json:
            self.structured.append(json.loads(self.buffer))
            self.in_json = False


source_files = [p for p in (ROOT / "source/portfolio").rglob("*") if p.is_file()]
for source in source_files:
    built = PUBLIC / source.relative_to(ROOT / "source")
    check(built.exists() and built.read_bytes() == source.read_bytes(), f"Portfolio copy mismatch: {built}")
check(len(source_files) == len([p for p in (PUBLIC / "portfolio").rglob("*") if p.is_file()]), "Stale Portfolio build files")

entries = ET.parse(PUBLIC / "search.xml").findall(".//entry")
check(len(entries) == len(list((ROOT / "source/_posts").glob("*.md"))), "Article count differs from search index")
for entry in entries:
    target = target_for(entry.findtext("url", ""))
    check(target is not None and target.is_file(), f"Missing article route: {entry.findtext('url')}")

html_files = list(PUBLIC.rglob("*.html"))
structured_count = 0
for path in html_files:
    page = Page(path.read_text(encoding="utf-8"))
    structured_count += len(page.structured)

for route in ("index.html", "about/index.html", "portfolio/index.html"):
    page = Page((PUBLIC / route).read_text(encoding="utf-8"))
    check(len(page.ids) == len(set(page.ids)), f"Duplicate IDs: {route}")
    for reference in page.references:
        target = target_for(reference)
        if target is not None:
            check(target.is_file(), f"Broken reference in {route}: {reference}")

portfolio_html = (PUBLIC / "portfolio/index.html").read_text(encoding="utf-8")
check('content="noindex, nofollow"' in portfolio_html, "Portfolio indexing policy changed")
check('/portfolio/assets/' in portfolio_html, "Portfolio asset base changed")
check((PUBLIC / "archives/index.html").is_file(), "Archive route missing")
check((PUBLIC / "search/index.html").is_file(), "Search route missing")

if failures:
    raise SystemExit("\n".join(failures))
print(f"PASS: {len(source_files)} identical Portfolio files; {len(entries)} article routes; "
      f"{len(html_files)} HTML files / {structured_count} valid JSON-LD blocks; "
      "homepage, About, Portfolio links/assets and indexing policy.")
