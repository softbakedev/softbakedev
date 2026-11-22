import React from 'react';

type TapeProps = {
  items: string[];
  className?: string;
  reverse?: boolean;
  separator?: string;
};

/** Endless rotated marquee strip. Content is duplicated so the loop is seamless. */
export function Tape({ items, className = '', reverse = false, separator = '★' }: TapeProps) {
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-4">{item}</span>
          <span aria-hidden>{separator}</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`sb-tape ${reverse ? 'sb-tape--reverse' : ''} ${className}`} aria-hidden>
      <div className="sb-tape__track">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
