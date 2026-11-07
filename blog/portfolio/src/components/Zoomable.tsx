import { useRef, type ReactNode } from 'react';

interface Props {
  label: string;
  closeLabel: string;
  children: ReactNode;
  full: ReactNode;
}

// Thumbnail button that opens the same media large in a native <dialog> (Esc and backdrop close it).
export default function Zoomable({ label, closeLabel, children, full }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button type="button" className="zoom-trigger" onClick={() => { dialog.current?.showModal(); void dialog.current?.querySelector('video')?.play(); }} aria-label={label}>
      {children}
      <span className="zoom-hint" aria-hidden="true">⤢</span>
    </button>
    <dialog ref={dialog} className="lightbox" aria-label={label} onClose={() => dialog.current?.querySelector('video')?.pause()} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="lightbox-inner">
        {full}
        <button type="button" className="lightbox-close" onClick={() => dialog.current?.close()} aria-label={closeLabel}>✕</button>
      </div>
    </dialog>
  </>;
}
