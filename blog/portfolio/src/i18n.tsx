import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';
export type T = { zh: string; en: string };
type Theme = 'dark' | 'light';

const LANG_KEY = 'portfolio-lang';
// Shared with the Hexo blog so both sites keep the same theme.
const THEME_KEY = 'theme';

function read(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; theme: Theme; toggleTheme: () => void } | null>(null);

export function Prefs({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (read(LANG_KEY) === 'en' ? 'en' : 'zh'));
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'));

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    document.title = lang === 'zh' ? '林立人 · 軟體設計工程師' : 'Lin Li-Ren · Software Engineer';
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f8f5' : '#101816');
  }, [theme]);

  const setLang = useCallback((l: Lang) => { setLangState(l); write(LANG_KEY, l); }, []);
  const toggleTheme = useCallback(() => setTheme(prev => {
    const next = prev === 'dark' ? 'light' : 'dark';
    write(THEME_KEY, next);
    return next;
  }), []);

  return <Ctx.Provider value={{ lang, setLang, theme, toggleTheme }}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const value = useContext(Ctx);
  if (!value) throw new Error('usePrefs must be used inside <Prefs>');
  return value;
}

export function useT() {
  const { lang } = usePrefs();
  return useCallback((text: T) => text[lang], [lang]);
}
