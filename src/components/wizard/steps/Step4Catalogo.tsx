'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { CATEGORIAS } from '@/data/catalog';
import { ProductoSeleccionado, Categoria } from '@/types/onboarding';
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
  const { perfil, catalogo, addProducto, removeProducto, updateProducto } = useOnboardingStore();
  const [showCustomModal, setShowCustomModal] = useState(false);
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
  const productos = catData?.productos ?? [];
  const selected = catalogo.productosSeleccionados;

  const isSelected = (id: string) => selected.some((p) => p.id === id);
  const getSelectedData = (id: string) => selected.find((p) => p.id === id);

  const handleToggle = (productoId: string) => {
    if (isSelected(productoId)) {
      removeProducto(productoId);
    } else {
      const prod = productos.find((p) => p.id === productoId);
      if (!prod) return;
      addProducto({
        id: prod.id,
        nombre: prod.nombre,
        categoria,
        esPersonalizado: false,
        moq: { valor: prod.moqRef, unidad: prod.unidad },
        precio: { min: prod.precioRef.min, max: prod.precioRef.max, moneda: 'USD' },
        imagen: null,
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
      categoria,
      esPersonalizado: true,
      moq: { valor: Number(customForm.moqValor) || 100, unidad: customForm.moqUnidad },
      precio: { min: Number(customForm.precioMin) || 1, max: Number(customForm.precioMax) || 5, moneda: 'USD' },
      imagen: null,
    };
    addProducto(nuevo);
    setCustomForm({ nombre: '', moqValor: '100', moqUnidad: 'kg', precioMin: '1', precioMax: '5' });
    setShowCustomModal(false);
  };

  const handleNext = () => {
    if (selected.length === 0) {
      setError('Selecciona al menos un producto');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      {catData && (
        <div className="flex items-center gap-3">
          <span className="text-3xl">{catData.emoji}</span>
          <div>
            <h3 className="font-semibold text-ink">{catData.nombre}</h3>
            <p className="text-sm text-gray-500">Marca los productos que ofreces</p>
          </div>
          {selected.length > 0 && (
            <span className="ml-auto bg-brand-900 text-white text-xs font-bold px-3 py-1 rounded-full">
              {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Product list */}
      <div className="flex flex-col gap-2">
        {productos.map((prod) => (
          <ProductRow
            key={prod.id}
            producto={prod}
            categoria={categoria}
            selected={isSelected(prod.id)}
            selectedData={getSelectedData(prod.id)}
            onToggle={() => handleToggle(prod.id)}
            onUpdate={(data) => handleUpdate(prod.id, data)}
          />
        ))}

        {/* Custom products */}
        {selected.filter((p) => p.esPersonalizado).map((prod) => (
          <div key={prod.id} className="flex items-center gap-3 border border-brand-500 bg-brand-50 rounded-xl px-4 py-3">
            <span className="flex-1 text-sm font-medium">{prod.nombre}</span>
            <span className="text-xs text-brand-900 bg-brand-100 px-2 py-0.5 rounded-full">Personalizado</span>
            <button
              type="button"
              onClick={() => removeProducto(prod.id)}
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add custom */}
      <button
        type="button"
        onClick={() => setShowCustomModal(true)}
        className="flex items-center gap-2 text-sm text-brand-900 font-medium hover:underline"
      >
        <Plus className="w-4 h-4" />
        Agregar producto que no está en la lista
      </button>

      {/* Custom product modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink">Agregar producto personalizado</h3>
              <button type="button" onClick={() => setShowCustomModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nombre del producto *</label>
                <input
                  type="text"
                  value={customForm.nombre}
                  onChange={(e) => setCustomForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
                  placeholder="Ej: Quinua tricolor"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-medium text-gray-600">MOQ</label>
                  <input
                    type="number"
                    value={customForm.moqValor}
                    onChange={(e) => setCustomForm((f) => ({ ...f, moqValor: e.target.value }))}
                    className="px-2 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
                  />
                </div>
                <div className="flex flex-col gap-1 w-24">
                  <label className="text-xs font-medium text-gray-600">Unidad</label>
                  <input
                    type="text"
                    value={customForm.moqUnidad}
                    onChange={(e) => setCustomForm((f) => ({ ...f, moqUnidad: e.target.value }))}
                    className="px-2 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
                    placeholder="kg"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-medium text-gray-600">Precio min (USD)</label>
                  <input
                    type="number"
                    value={customForm.precioMin}
                    onChange={(e) => setCustomForm((f) => ({ ...f, precioMin: e.target.value }))}
                    className="px-2 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-medium text-gray-600">Precio max (USD)</label>
                  <input
                    type="number"
                    value={customForm.precioMax}
                    onChange={(e) => setCustomForm((f) => ({ ...f, precioMax: e.target.value }))}
                    className="px-2 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCustom}
                className="mt-2 py-2.5 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
              >
                Agregar producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
