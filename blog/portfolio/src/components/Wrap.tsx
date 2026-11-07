import { useMemo } from 'react';
import { usePrefs } from '../i18n';

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl
  ? new Intl.Segmenter('zh-Hant', { granularity: 'word' })
  : null;
const CJK = /[㐀-鿿]/;

// Chinese text: wrap each dictionary word in a no-wrap span so lines break between words
// (never inside 工程師, 穩定性…). Punctuation rules still keep "，" off the start of a line.
export default function Wrap({ text }: { text: string }) {
  const { lang } = usePrefs();
  const words = useMemo(() => (lang === 'zh' && segmenter ? Array.from(segmenter.segment(text), s => s.segment) : null), [lang, text]);
  if (!words) return <>{text}</>;
  // Spaces and Latin words keep their normal break opportunities; only CJK words are glued.
  return <>{words.map((word, i) => (CJK.test(word) ? <span className="w" key={i}>{word}</span> : word))}</>;
}
