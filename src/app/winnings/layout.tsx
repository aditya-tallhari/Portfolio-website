import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hackathons & Winnings',
  description: 'A chronological archive of technical excellence, global participations, and competitive triumphs of Aditya Tallhari.',
  openGraph: {
    title: 'Hackathons & Winnings | Aditya Tallhari',
    description: 'A chronological archive of technical excellence, global participations, and competitive triumphs of Aditya Tallhari.',
  }
};

export default function WinningsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
