import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NxinMall | Exportadores',
  description: 'NxinMall conecta exportadores agrícolas con compradores internacionales. Plataforma B2B global para agroindustria.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
