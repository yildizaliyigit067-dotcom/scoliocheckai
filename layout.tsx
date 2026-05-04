import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ScreeningProvider } from '@/context/ScreeningContext';

export const metadata: Metadata = {
  title:       'ScolioCheck AI — AI-Assisted Posture Screening',
  description:
    'A non-diagnostic tool that helps teenagers and parents understand whether visible posture asymmetry may need medical evaluation.',
  keywords:    'scoliosis screening, posture check, spine health, teenager posture, AI health screening',
  openGraph: {
    title:       'ScolioCheck AI',
    description: 'AI-assisted scoliosis screening from smartphone images.',
    type:        'website',
  },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor:   '#0A1628',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScreeningProvider>
          {children}
        </ScreeningProvider>
      </body>
    </html>
  );
}
