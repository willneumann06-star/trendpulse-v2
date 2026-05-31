'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ activePage = '' }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">⚡</div>
          <span className="navbar-logo-text">Trend<span>Pulse</span></span>
        </Link>

        <div className="navbar-links">
          <Link href="/#features" className={`navbar-link${activePage === 'features' ? ' active' : ''}`}>
            Features
          </Link>
          <Link href="/pricing" className={`navbar-link${activePage === 'pricing' ? ' active' : ''}`}>
            Pricing
          </Link>
        </div>

        <div className="navbar-actions">
          <Link href="/auth" className="btn btn-ghost btn-sm">
            Log in
          </Link>
          <Link href="/auth?mode=signup" className="btn btn-primary btn-sm">
            Start Free →
          </Link>
        </div>
      </div>
    </nav>
  );
}
