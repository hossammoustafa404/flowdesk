import './global.css';
import { Cairo, Open_Sans, Poppins } from 'next/font/google';

import { ThemeProvider } from '@/providers';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata = {
  title: 'Flowdesk — Field-service dispatch for HVAC & plumbing',
  description:
    'Multi-tenant dispatch for residential HVAC and plumbing teams: intake, assign, field status, customer notifications, and owner visibility — without spreadsheet chaos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        poppins.variable,
        openSans.variable,
        cairo.variable,
        'font-sans',
      )}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
