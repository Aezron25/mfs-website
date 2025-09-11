import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

const fontRoboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['100', '300', '400', '500', '700', '900'],
});

const fontTasaExplorer = localFont({
  src: [
    {
      path: '../fonts/TASAExplorer-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/TASAExplorer-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/TASAExplorer-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/TASAExplorer-Black.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-tasa-explorer',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mwanakombo Financial Services | Financial Expert',
  description:
    'Expert financial guidance from Mwanakombo. Specializing in audit, tax, consultancy, and personal finance.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontRoboto.variable,
          fontTasaExplorer.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
