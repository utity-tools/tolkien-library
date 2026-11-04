import { forwardRef } from 'react';

/** Ring cursor; the engine moves it and sets `data-state` (spine | btn | open). */
export const Cursor = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="cursor" aria-hidden>
    <span className="cursor-ring" />
    <span className="cursor-dot" />
    <span className="cursor-label">
      OPEN
      <br />
      ABRIR
    </span>
  </div>
));
Cursor.displayName = 'Cursor';
