
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Mwanakombo Financial Services | Financial Expert',
  description:
    'Expert financial guidance from Mwanakombo. Specializing in audit, tax, consultancy, and personal finance for SMEs, startups, and individuals in Zambia.',
  keywords: [
    'Mwanakombo Financial Services',
    'Financial Expert Zambia',
    'Audit Services Lusaka',
    'Tax Services Zambia',
    'ZRA Compliance',
    'Financial Consultancy',
    'SME Financial Advisor',
    'Startup Financial Services',
    'Personal Finance Zambia',
    'Accounting Services Lusaka',
    'Moses Mwanakombo',
    'Financial Discipline',
    'Business Advisory Zambia',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=TASA+Explorer:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <FirebaseClientProvider>
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
