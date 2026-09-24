import './global.css';
import { Cairo, Open_Sans, Poppins } from 'next/font/google';
import { Suspense } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LocaleProvider, ThemeProvider } from '@/providers';

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
  variable: '--font-cairo',
  display: 'swap',
});

const localeBootScript = `(function(){try{var m=location.search.match(/[?&]lang=([^&]+)/);var lang=m&&m[1]==='ar'?'ar':'en';document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';if(lang==='ar'){document.documentElement.classList.add('font-arabic');document.documentElement.classList.remove('font-sans');}else{document.documentElement.classList.add('font-sans');document.documentElement.classList.remove('font-arabic');}}catch(e){}})();`;

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
      dir="ltr"
      className={cn(
        poppins.variable,
        openSans.variable,
        cairo.variable,
        'font-sans',
      )}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootScript }} />
      </head>
      <body>
        <ThemeProvider>
          <Suspense fallback={null}>
            <LocaleProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </LocaleProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
