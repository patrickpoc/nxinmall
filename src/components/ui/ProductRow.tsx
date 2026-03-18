'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { ProductoCatalogo } from '@/data/catalog';
import { ProductoSeleccionado, Categoria } from '@/types/onboarding';
import { Idioma, t } from '@/lib/i18n';
import ImageUploadBox from './ImageUploadBox';

interface ProductRowProps {
  producto: ProductoCatalogo;
  categoria: Categoria;
  selected: boolean;
  selectedData?: ProductoSeleccionado;
  idioma: Idioma;
  onToggle: () => void;
  onUpdate: (data: Partial<ProductoSeleccionado>) => void;
}

const UNIDADES = ['kg', 'tonelada', 'caja', 'pallet', 'unidad', 'litro', 'saco', 'rollo', 'manojo', 'tallo', 'm2', 'kit'];

export default function ProductRow({
  producto,
  categoria,
  selected,
  selectedData,
  idioma,
  onToggle,
  onUpdate,
}: ProductRowProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    onToggle();
    if (!selected) setExpanded(true);
    else setExpanded(false);
  };

  const labelClass = "text-[10px] font-black text-brand-900/50 uppercase tracking-[0.2em] mb-1";
  const inputClass = "w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300";

  return (
    <div
      className={clsx(
        'rounded-2xl overflow-hidden transition-all duration-500',
        selected ? 'bg-brand-50/50 shadow-sm ring-1 ring-brand-500/30' : 'bg-white border border-gray-100 hover:border-gray-200'
      )}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleToggle}
            className="peer w-6 h-6 opacity-0 absolute cursor-pointer z-10"
            id={`product-${producto.id}`}
          />
          <div className={clsx(
            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
            selected ? "bg-brand-900 border-brand-900" : "bg-white border-gray-200 peer-hover:border-brand-500"
          )}>
            {selected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
          </div>
        </div>
        
        <label
          htmlFor={`product-${producto.id}`}
          className={clsx(
            "flex-1 text-base font-bold cursor-pointer transition-colors",
            selected ? "text-brand-900" : "text-ink"
          )}
        >
          {producto.nombre}
        </label>
        
        {selected && (
          <span className="text-[10px] font-black text-brand-900 bg-brand-100 px-3 py-1 rounded-full uppercase tracking-widest">
            {t('seleccionadoBadge', idioma)}
          </span>
        )}
        
        {selected && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 text-gray-400 hover:text-ink hover:bg-white transition-all shadow-sm"
            aria-label={expanded ? 'Colapsar' : 'Expandir'}
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div 
        className={clsx(
          "grid transition-all duration-500 ease-in-out",
          selected && expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden bg-white/40 border-t border-brand-100/30">
          <div className="px-6 py-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* MOQ */}
            <div className="flex flex-col">
              <label className={labelClass}>{t('moqLabel', idioma)}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={selectedData?.moq.valor ?? producto.moqRef}
                  onChange={(e) =>
                    onUpdate({ moq: { valor: Number(e.target.value), unidad: selectedData?.moq.unidad ?? producto.unidad } })
                  }
                  className={clsx(inputClass, "w-28")}
                />
                <select
                  value={selectedData?.moq.unidad ?? producto.unidad}
                  onChange={(e) =>
                    onUpdate({ moq: { valor: selectedData?.moq.valor ?? producto.moqRef, unidad: e.target.value } })
                  }
                  className={inputClass}
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Precio */}
            <div className="flex flex-col">
              <label className={labelClass}>{t('precioLabel', idioma)}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Min"
                  value={selectedData?.precio.min ?? producto.precioRef.min}
                  onChange={(e) =>
                    onUpdate({
                      precio: {
                        min: Number(e.target.value),
                        max: selectedData?.precio.max ?? producto.precioRef.max,
                        moneda: 'USD',
                      },
                    })
                  }
                  className={inputClass}
                />
                <span className="text-gray-300 font-bold px-1">–</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max"
                  value={selectedData?.precio.max ?? producto.precioRef.max}
                  onChange={(e) =>
                    onUpdate({
                      precio: {
                        min: selectedData?.precio.min ?? producto.precioRef.min,
                        max: Number(e.target.value),
                        moneda: 'USD',
                      },
                    })
                  }
                  className={inputClass}
                />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">USD</span>
              </div>
            </div>

            {/* Editable description (EN) */}
            <div className="sm:col-span-2 flex flex-col">
              <label className={labelClass}>
                📋 {t('paso4DescripcionEnLabel', idioma)}
              </label>
              <textarea
                value={selectedData?.descripcion_en ?? producto.descripcion_en}
                onChange={(e) => onUpdate({ descripcion_en: e.target.value })}
                className={clsx(inputClass, "resize-none h-24")}
                placeholder={producto.descripcion_en}
              />
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2">
              <label className={labelClass}>{t('fotoProductoLabel', idioma)}</label>
              <div className="mt-1">
                <ImageUploadBox
                  hint={t('fotoProductoHint', idioma)}
                  value={selectedData?.imagen ? { dataUrl: selectedData.imagen.dataUrl, name: 'producto' } : null}
                  onChange={(val) =>
                    onUpdate({
                      imagen: val ? { dataUrl: val.dataUrl, fuente: 'upload' } : null,
                    })
                  }
                  previewVariant="square"
                />
              </div>
              {!selectedData?.imagen && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      imagen: { dataUrl: producto.imagenStock, fuente: 'stock' },
                    })
                  }
                  className="mt-3 text-[10px] font-black text-brand-900 uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1.5"
                >
                  <span className="text-base leading-none">✨</span>
                  {t('usarImagenStock', idioma)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
