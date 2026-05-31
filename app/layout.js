import './globals.css';

export const metadata = {
  title: 'TrendPulse — Stay ahead. Create what\'s hot.',
  description: 'AI-powered trend intelligence for content creators. Spot trends early, generate ideas instantly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
