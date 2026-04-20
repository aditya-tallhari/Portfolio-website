import type { Metadata } from 'next';
import { Playfair_Display, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import { ColorModeProvider } from '@/providers/ColorModeProvider';
import { CustomCursor } from '@/components/layout/CustomCursor';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Portfolio | Aditya Tallhari',
  description: 'Interactive 3D Portfolio Experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`} suppressHydrationWarning>
       <head>
         <script
           dangerouslySetInnerHTML={{
             __html: `
               (function() {
                 try {
                   var savedMode = localStorage.getItem("portfolio-color-mode");
                   var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                   var mode = savedMode || (systemPrefersDark ? "dark" : "light");
                   document.documentElement.setAttribute("data-color-mode", mode);
                 } catch (e) {}
               })();
             `,
           }}
         />
       </head>
       <body className="font-jetbrains min-h-screen flex flex-col antialiased">
        <ColorModeProvider>
          <CustomCursor />
          <main id="main-app-content" className="flex-grow relative">
            {children}
          </main>
        </ColorModeProvider>
      </body>
     </html>
  );
}
