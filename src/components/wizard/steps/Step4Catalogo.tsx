'use client';

import { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { CATEGORIAS } from '@/data/catalog';
import { ProductoSeleccionado, Categoria } from '@/types/onboarding';
import { t, TKey } from '@/lib/i18n';
import { generateId } from '@/lib/utils';
import ProductRow from '@/components/ui/ProductRow';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

interface CustomProductForm {
  nombre: string;
  moqValor: string;
  moqUnidad: string;
  precioMin: string;
  precioMax: string;
}

export default function Step4Catalogo({ onNext, onBack }: Step4Props) {
  const { perfil, catalogo, idioma, addProducto, removeProducto, updateProducto } = useOnboardingStore();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customForm, setCustomForm] = useState<CustomProductForm>({
    nombre: '',
    moqValor: '100',
    moqUnidad: 'kg',
    precioMin: '1',
    precioMax: '5',
  });
  const [error, setError] = useState('');

  const categoria = perfil.categoria as Categoria;
  const catData = categoria ? CATEGORIAS[categoria] : null;
  const allProductos = catData?.productos ?? [];
  const selected = catalogo.productosSeleccionados;

  // Filter by search query (name or English name)
  const productos = searchQuery.trim()
    ? allProductos.filter((p) => {
        const q = searchQuery.toLowerCase();
        return p.nombre.toLowerCase().includes(q) || p.nombre_en.toLowerCase().includes(q);
      })
    : allProductos;

  const isSelected = (id: string) => selected.some((p) => p.id === id);
  const getSelectedData = (id: string) => selected.find((p) => p.id === id);

  const handleToggle = (productoId: string) => {
    if (isSelected(productoId)) {
      removeProducto(productoId);
    } else {
      const prod = allProductos.find((p) => p.id === productoId);
      if (!prod) return;
      addProducto({
        id: prod.id,
        nombre: prod.nombre,
        nombre_en: prod.nombre_en,
        categoria,
        esPersonalizado: false,
        moq: { valor: prod.moqRef, unidad: prod.unidad },
        precio: { min: prod.precioRef.min, max: prod.precioRef.max, moneda: 'USD' },
        imagen: null,
        descripcion_en: prod.descripcion_en,
        nxin: prod.nxin,
      });
    }
  };

  const handleUpdate = (id: string, data: Partial<ProductoSeleccionado>) => {
    updateProducto(id, data);
  };

  const handleAddCustom = () => {
    if (!customForm.nombre.trim()) return;
    const nuevo: ProductoSeleccionado = {
      id: `custom_${generateId()}`,
      nombre: customForm.nombre,
      nombre_en: customForm.nombre,
      categoria,
      esPersonalizado: true,
      moq: { valor: Number(customForm.moqValor) || 100, unidad: customForm.moqUnidad },
      precio: { min: Number(customForm.precioMin) || 1, max: Number(customForm.precioMax) || 5, moneda: 'USD' },
      imagen: null,
      descripcion_en: '',
    };
    addProducto(nuevo);
    setCustomForm({ nombre: '', moqValor: '100', moqUnidad: 'kg', precioMin: '1', precioMax: '5' });
    setShowCustomModal(false);
  };

  const handleNext = () => {
    if (selected.length === 0) {
      setError(t('errProductos', idioma));
      return;
    }
    setError('');
    onNext();
  };

  const labelClass = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";
  const inputClass = "w-full px-4 py-3 text-sm rounded-2xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300";

  const catNombreTraducido = catData ? t(`cat_${catData.id}` as TKey, idioma) : '';

  return (
    <div className="flex flex-col gap-6">
      {catData && (
        <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
          <span className="text-4xl filter drop-shadow-sm">{catData.emoji}</span>
          <div className="flex-1">
            <h3 className="font-black text-ink text-lg uppercase tracking-tight">{catNombreTraducido}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('paso4Subtitulo', idioma)}</p>
          </div>
          {selected.length > 0 && (
            <span className="bg-brand-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-brand-900/20">
              {selected.length} {selected.length !== 1
                ? t('paso4SeleccionadosBadge', idioma)
                : t('paso4SeleccionadoBadge', idioma)}
            </span>
          )}
        </div>
      )}

      {/* Search bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-500 transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('paso4Buscar', idioma)}
          className="w-full pl-11 pr-4 py-3.5 text-sm bg-gray-50 rounded-2xl border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300"
        />
      </div>

      {error && (
        <p className="text-[11px] font-bold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100/50 uppercase tracking-wider text-center">{error}</p>
      )}

      {/* Product list */}
      <div className="flex flex-col gap-3">
        {productos.length === 0 && searchQuery.trim() ? (
          <p className="text-sm font-bold text-gray-400 py-10 text-center uppercase tracking-widest">{t('paso4SinResultados', idioma)}</p>
        ) : (
          productos.map((prod) => (
            <ProductRow
              key={prod.id}
              producto={prod}
              categoria={categoria}
              selected={isSelected(prod.id)}
              selectedData={getSelectedData(prod.id)}
              idioma={idioma}
              onToggle={() => handleToggle(prod.id)}
              onUpdate={(data) => handleUpdate(prod.id, data)}
            />
          ))
        )}

        {/* Custom products */}
        {selected.filter((p) => p.esPersonalizado).map((prod) => (
          <div key={prod.id} className="flex items-center gap-3 border border-brand-500/30 bg-brand-50/50 rounded-2xl px-5 py-4 transition-all hover:bg-brand-50">
            <span className="flex-1 text-sm font-bold text-ink">{prod.nombre}</span>
            <span className="text-[10px] font-black text-brand-900 bg-brand-100 px-3 py-1 rounded-full uppercase tracking-widest">
              {t('paso4PersonalizadoBadge', idioma)}
            </span>
            <button
              type="button"
              onClick={() => removeProducto(prod.id)}
              className="text-gray-300 hover:text-red-500 hover:scale-110 transition-all p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add custom */}
      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-2 text-xs font-black text-brand-900 uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          {t('paso4AgregarPersonalizado', idioma)}
        </button>
      </div>

      {/* Custom product modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-float-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-ink text-xl uppercase tracking-tight">{t('paso4ModalTitulo', idioma)}</h3>
              <button 
                type="button" 
                onClick={() => setShowCustomModal(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-ink hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label className={labelClass}>{t('paso4NombreLabel', idioma)}</label>
                <input
                  type="text"
                  value={customForm.nombre}
                  onChange={(e) => setCustomForm((f) => ({ ...f, nombre: e.target.value }))}
                  className={inputClass}
                  placeholder={t('paso4NombrePlaceholder', idioma)}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                  <label className={labelClass}>{t('paso4MoqLabel', idioma)}</label>
                  <input
                    type="number"
                    value={customForm.moqValor}
                    onChange={(e) => setCustomForm((f) => ({ ...f, moqValor: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col w-32">
                  <label className={labelClass}>{t('paso4UnidadLabel', idioma)}</label>
                  <input
                    type="text"
                    value={customForm.moqUnidad}
                    onChange={(e) => setCustomForm((f) => ({ ...f, moqUnidad: e.target.value }))}
                    className={inputClass}
                    placeholder="kg"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                  <label className={labelClass}>{t('paso4PrecioMinLabel', idioma)}</label>
                  <input
                    type="number"
                    value={customForm.precioMin}
                    onChange={(e) => setCustomForm((f) => ({ ...f, precioMin: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className={labelClass}>{t('paso4PrecioMaxLabel', idioma)}</label>
                  <input
                    type="number"
                    value={customForm.precioMax}
                    onChange={(e) => setCustomForm((f) => ({ ...f, precioMax: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCustom}
                className="mt-4 py-4 rounded-full bg-brand-900 text-white text-base font-bold hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-brand-900/20"
              >
                {t('paso4AgregarBtn', idioma)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-ink transition-all duration-300"
        >
          {t('btnAtras', idioma)}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-brand-900 text-white text-sm font-bold hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-brand-900/20"
        >
          {t('btnSiguiente', idioma)}
        </button>
      </div>
    </div>
  );
}
