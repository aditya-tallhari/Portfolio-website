import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Work & Projects',
  description: 'Dive into the interactive portfolio of Aditya Tallhari. Explore full-stack applications, hackathon winnings, and competitive programming achievements.',
  openGraph: {
    title: 'My Work & Projects | Aditya Tallhari',
    description: 'Dive into the interactive portfolio of Aditya Tallhari. Explore full-stack applications, hackathon winnings, and competitive programming achievements.',
  }
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
