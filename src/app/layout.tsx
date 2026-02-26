import type { Metadata } from 'next';
import { Fraunces, Sora } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

export const metadata: Metadata = {
  title: 'NxinMall | Exportadores',
  description: 'NxinMall conecta exportadores agrícolas con compradores internacionales. Plataforma B2B global para agroindustria.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
