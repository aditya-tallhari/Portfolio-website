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
  display: 'block',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://adityatallhari.dev'),
  title: {
    default: 'Aditya Tallhari | Full Stack Developer & Competitive Programmer',
    template: '%s | Aditya Tallhari',
  },
  description: 'Explore the professional portfolio of Aditya Tallhari. Full Stack Developer specializing in MERN Stack, Next.js, and complex problem-solving.',
  keywords: ['Aditya Tallhari', 'Full Stack Developer', 'Competitive Programmer', 'Software Engineer', 'MERN Stack', 'React', 'Next.js', 'Portfolio'],
  authors: [{ name: 'Aditya Tallhari' }],
  creator: 'Aditya Tallhari',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Aditya Tallhari | Full Stack Developer',
    description: 'Explore the professional portfolio of Aditya Tallhari. Full Stack Developer specializing in MERN Stack, Next.js, and complex problem-solving.',
    siteName: 'Aditya Tallhari Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Tallhari | Full Stack Developer',
    description: 'Interactive 3D Portfolio Experience of Aditya Tallhari',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`} suppressHydrationWarning>
       <head>
        <meta name="google-site-verification" content="Kqj-tbfCG6Jy6MhzlWotz0VDL77UUyS1BNx3gMm-DuY" />
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
         <script
           type="application/ld+json"
           dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'Person',
               name: 'Aditya Tallhari',
               jobTitle: 'Full Stack Developer',
               url: 'https://adityatallhari.dev',
               sameAs: [
                 'https://github.com/aditya_tallhari_', 
                 'https://leetcode.com/u/aditya_tallhari_/',
                 'https://www.codechef.com/users/basic_spark_55'
               ]
             })
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
