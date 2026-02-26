export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatProductosStr(productos: Array<{ nombre: string; moq: { valor: number; unidad: string }; precio: { min: number; max: number; moneda: string } }>): string {
  return productos
    .map(p => `${p.nombre} (MOQ: ${p.moq.valor} ${p.moq.unidad}, USD ${p.precio.min}–${p.precio.max})`)
    .join('\n');
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
