import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Jothish Gandham',
  description: 'The requested page could not be found.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-6xl font-bold tracking-tight text-accent">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>
        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
