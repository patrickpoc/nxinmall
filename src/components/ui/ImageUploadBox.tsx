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
    'object-cover',
    previewVariant === 'circle' && 'w-20 h-20 rounded-full',
    previewVariant === 'banner' && 'w-full h-20 rounded-lg',
    previewVariant === 'square' && 'w-20 h-20 rounded-lg'
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}

      {value ? (
        <div className="relative inline-flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.dataUrl} alt="preview" className={previewClass} />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-0.5 shadow-sm hover:bg-red-50"
            aria-label="Eliminar imagen"
          >
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={clsx(
            'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors',
            isDragActive ? 'border-brand-700 bg-brand-50' : 'border-gray-200 hover:border-brand-500 hover:bg-brand-50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-5 h-5 text-gray-400" />
          <p className="text-xs text-gray-500 text-center">
            {isDragActive ? 'Suelta aquí...' : 'Arrastra o haz clic para subir'}
          </p>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
