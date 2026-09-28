import TargetCursor from './components/reactbits/TargetCursor';
import Hero from './sections/Hero';
import DualTimeline from './sections/DualTimeline';
import Practice from './sections/Practice';
import Converge from './sections/Converge';
import { useFinePointer, useReducedMotion } from './lib/media';

export default function App() {
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();

  return (
    <>
      <a className="skip-link" href="#timeline">
        跳到時間軸
      </a>
      {finePointer && !reduced && (
        <TargetCursor targetSelector=".cursor-target" spinDuration={2.4} cursorColor="#e8eef2" cursorColorOnTarget="#57c7e6" />
      )}
      <main>
        <Hero />
        <DualTimeline />
        <Practice />
        <Converge />
      </main>
    </>
  );
}
