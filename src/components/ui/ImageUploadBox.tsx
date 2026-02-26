'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import clsx from 'clsx';
import { fileToDataUrl } from '@/lib/utils';

interface ImageUploadBoxProps {
  label?: string;
  hint?: string;
  value: { dataUrl: string; name: string } | null;
  onChange: (value: { dataUrl: string; name: string } | null) => void;
  previewVariant?: 'square' | 'circle' | 'banner';
  maxSizeMB?: number;
}

export default function ImageUploadBox({
  label,
  hint,
  value,
  onChange,
  previewVariant = 'square',
  maxSizeMB = 5,
}: ImageUploadBoxProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`La imagen no debe superar ${maxSizeMB}MB`);
        return;
      }

      const dataUrl = await fileToDataUrl(file);
      onChange({ dataUrl, name: file.name });
    },
    [onChange, maxSizeMB]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const previewClass = clsx(
    'object-cover shadow-md',
    previewVariant === 'circle' && 'w-24 h-24 rounded-full border-4 border-white ring-1 ring-gray-100',
    previewVariant === 'banner' && 'w-full h-24 rounded-2xl border-4 border-white ring-1 ring-gray-100',
    previewVariant === 'square' && 'w-24 h-24 rounded-2xl border-4 border-white ring-1 ring-gray-100'
  );

  return (
    <div className="flex flex-col">
      {value ? (
        <div className="relative inline-flex self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.dataUrl} alt="preview" className={previewClass} />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-1 -right-1 bg-white border border-gray-100 rounded-full p-1 shadow-lg hover:bg-red-50 hover:text-red-500 transition-all"
            aria-label="Eliminar imagen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={clsx(
            'flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-[32px] p-8 cursor-pointer transition-all duration-300',
            isDragActive 
              ? 'border-brand-500 bg-brand-50/50 scale-[0.98]' 
              : 'border-gray-100 bg-gray-50/30 hover:border-brand-200 hover:bg-white hover:shadow-inner'
          )}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-brand-500 transition-colors">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-black text-ink uppercase tracking-widest">
              {isDragActive ? 'Suelta aquí' : 'Subir imagen'}
            </p>
            {hint && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{hint}</p>}
          </div>
        </div>
      )}

      {error && <p className="mt-2 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>}
    </div>
  );
}
