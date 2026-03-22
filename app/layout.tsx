import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'EcoTrack - Your Sustainability Journey',
  description: 'Traccia, condividi e ricevi incentivi per le tue azioni sostenibili.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <ThemeProvider>
          <div className="main-container">
            {children}
            <Navigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
