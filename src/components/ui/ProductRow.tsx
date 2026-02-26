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

  return (
    <div
      className={clsx(
        'border rounded-xl overflow-hidden transition-all',
        selected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleToggle}
          className="w-4 h-4 rounded accent-brand-900 cursor-pointer flex-shrink-0"
          id={`product-${producto.id}`}
        />
        <label
          htmlFor={`product-${producto.id}`}
          className="flex-1 text-sm font-medium cursor-pointer"
        >
          {producto.nombre}
        </label>
        {selected && (
          <span className="text-xs text-brand-900 font-medium bg-brand-100 px-2 py-0.5 rounded-full">
            {t('seleccionadoBadge', idioma)}
          </span>
        )}
        {selected && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label={expanded ? 'Colapsar' : 'Expandir'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {selected && expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* MOQ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">{t('moqLabel', idioma)}</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={selectedData?.moq.valor ?? producto.moqRef}
                onChange={(e) =>
                  onUpdate({ moq: { valor: Number(e.target.value), unidad: selectedData?.moq.unidad ?? producto.unidad } })
                }
                className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-900"
              />
              <select
                value={selectedData?.moq.unidad ?? producto.unidad}
                onChange={(e) =>
                  onUpdate({ moq: { valor: selectedData?.moq.valor ?? producto.moqRef, unidad: e.target.value } })
                }
                className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-900 bg-white"
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">{t('precioLabel', idioma)}</label>
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
                className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-900"
              />
              <span className="text-gray-400 text-sm">–</span>
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
                className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-900"
              />
              <span className="text-xs text-gray-500">USD</span>
            </div>
          </div>

          {/* Descripción EN editable */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              📋 {t('paso4DescripcionEnLabel', idioma)}
            </label>
            <textarea
              value={selectedData?.descripcion_en ?? producto.descripcion_en}
              onChange={(e) => onUpdate({ descripcion_en: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-900 resize-none"
              rows={3}
              placeholder={producto.descripcion_en}
            />
          </div>

          {/* Imagen */}
          <div className="sm:col-span-2">
            <ImageUploadBox
              label={t('fotoProductoLabel', idioma)}
              hint={t('fotoProductoHint', idioma)}
              value={selectedData?.imagen ? { dataUrl: selectedData.imagen.dataUrl, name: 'producto' } : null}
              onChange={(val) =>
                onUpdate({
                  imagen: val ? { dataUrl: val.dataUrl, fuente: 'upload' } : null,
                })
              }
              previewVariant="square"
            />
            {!selectedData?.imagen && (
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    imagen: { dataUrl: producto.imagenStock, fuente: 'stock' },
                  })
                }
                className="mt-2 text-xs text-brand-900 underline hover:no-underline"
              >
                {t('usarImagenStock', idioma)}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
