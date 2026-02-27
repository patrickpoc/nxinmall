'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { COUNTRIES, REGIONS, REGION_LABELS } from '@/data/countries';

interface CountryComboboxProps {
  value: string;
  onChange: (country: string) => void;
  placeholder?: string;
  /** Hidden input name for native form submission */
  name?: string;
  required?: boolean;
  error?: boolean;
  /** Override the full input className */
  inputClassName?: string;
}

export default function CountryCombobox({
  value,
  onChange,
  placeholder = 'Selecciona un país',
  name,
  required,
  error,
  inputClassName,
}: CountryComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : null; // null = show all grouped by region

  const handleSelect = (countryName: string) => {
    onChange(countryName);
    setOpen(false);
    setQuery('');
  };

  // Close when clicking outside
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const defaultInputClass = [
    'w-full px-4 py-3.5 text-sm rounded-2xl bg-gray-50 border-none shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md',
    'transition-all duration-300 pr-10',
    error ? 'ring-2 ring-red-400/20 bg-red-50/30' : '',
  ].join(' ');

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden input for native form submission */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      <input
        type="text"
        value={open ? query : value}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { setOpen(true); setQuery(''); }}
        placeholder={open ? 'Buscar...' : placeholder}
        className={inputClassName ?? defaultInputClass}
        autoComplete="off"
        spellCheck={false}
      />

      <ChevronDown
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      />

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto">
          {filtered !== null ? (
            // Search results — flat list
            filtered.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-400 text-center">Sin resultados</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(c.name)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-brand-50 hover:text-brand-900 ${c.name === value ? 'bg-brand-50/60 font-semibold text-brand-900' : 'text-gray-700'}`}
                >
                  {c.name}
                </button>
              ))
            )
          ) : (
            // All countries grouped by region
            REGIONS.map((region) => (
              <div key={region}>
                <p className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 sticky top-0">
                  {REGION_LABELS[region]}
                </p>
                {COUNTRIES.filter((c) => c.region === region).map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(c.name)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-brand-50 hover:text-brand-900 ${c.name === value ? 'bg-brand-50/60 font-semibold text-brand-900' : 'text-gray-700'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
