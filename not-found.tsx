import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] flex flex-col items-center justify-center px-5 text-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
        </svg>
      </div>
      <h1 className="font-display font-bold text-navy text-3xl mb-2">Page not found</h1>
      <p className="text-[var(--text-muted)] text-sm mb-8 max-w-xs">
        This page doesn&apos;t exist. Return to the screening home to start a new session.
      </p>
      <Link href="/" className="btn-primary text-sm py-3 px-6 inline-flex items-center gap-2">
        ← Back to ScolioCheck AI
      </Link>
    </div>
  );
}
