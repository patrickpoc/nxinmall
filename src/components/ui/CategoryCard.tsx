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
        'relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-500 ease-in-out cursor-pointer gap-2',
        selected
          ? 'border-current bg-white shadow-md scale-[1.02]'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      )}
      style={selected ? { borderColor: categoria.colorPrimario } : {}}
    >
      {selected && (
        <span
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: categoria.colorPrimario }}
        >
          ✓
        </span>
      )}
      <span className="text-4xl" role="img" aria-label={categoria.nombre}>
        {categoria.emoji}
      </span>
      <p
        className="font-semibold text-sm leading-tight"
        style={selected ? { color: categoria.colorPrimario } : { color: '#0b0b0b' }}
      >
        {categoria.nombre}
      </p>
      <p className="text-xs text-gray-500 leading-snug">
        {categoria.subtitulo}
      </p>
    </button>
  );
}
