'use client';

import clsx from 'clsx';
import { CategoriaCatalogo } from '@/data/catalog';

interface CategoryCardProps {
  categoria: CategoriaCatalogo;
  selected: boolean;
  onClick: () => void;
}

export default function CategoryCard({ categoria, selected, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'relative flex flex-col items-center text-center p-6 rounded-3xl border-2 transition-all duration-500 ease-in-out cursor-pointer gap-3',
        selected
          ? 'border-current bg-white shadow-xl scale-[1.05] z-10'
          : 'border-gray-100 bg-gray-50/50 hover:border-brand-200 hover:bg-white hover:shadow-md'
      )}
      style={selected ? { borderColor: categoria.colorPrimario } : {}}
    >
      {selected && (
        <span
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg animate-fade-in"
          style={{ backgroundColor: categoria.colorPrimario }}
        >
          ✓
        </span>
      )}
      <span className="text-5xl filter drop-shadow-sm" role="img" aria-label={categoria.nombre}>
        {categoria.emoji}
      </span>
      <p
        className="font-black text-xs uppercase tracking-widest leading-tight"
        style={selected ? { color: categoria.colorPrimario } : { color: '#0b0b0b' }}
      >
        {categoria.nombre}
      </p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-snug">
        {categoria.subtitulo}
      </p>
    </button>
  );
}
