'use client';

import { useState } from 'react';
import { IconNode } from '@/data/landing-content';

export function GradientIcon({ node, id }: { node: IconNode; id: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={`url(#${id})`} strokeWidth="1.8">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1973FA" />
          <stop offset="100%" stopColor="#B990FF" />
        </linearGradient>
      </defs>
      {node.map(([tag, attrs], index) => {
        const Tag = tag;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key: _key, ...rest } = attrs;
        return <Tag key={`${id}-${index}`} {...rest} />;
      })}
    </svg>
  );
}

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-brand-100 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium text-brand-900"
      >
        <span>{q}</span>
        <span className="text-brand-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">{a}</div>}
    </div>
  );
}
