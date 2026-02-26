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

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div 
      className={clsx(
        "border rounded-2xl overflow-hidden transition-all duration-500",
        open ? "border-brand-500 bg-brand-50/30 shadow-sm" : "border-brand-100 bg-white hover:border-brand-300"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors"
      >
        <span className={clsx(
          "text-lg sm:text-xl font-black font-display leading-tight transition-colors",
          open ? "text-brand-900" : "text-ink"
        )}>
          {q}
        </span>
        <ChevronDown 
          className={clsx(
            "w-6 h-6 text-brand-500 transition-transform duration-500 shrink-0 ml-4",
            open && "rotate-180"
          )} 
        />
      </button>
      <div 
        className={clsx(
          "grid transition-all duration-500 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}
