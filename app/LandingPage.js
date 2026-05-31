'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const FEATURES = [
  {
    icon: '🔥',
    title: 'Trend Intelligence',
    desc: 'Browse 16+ curated trends updated weekly across 9 categories — spot what\'s rising before it peaks.',
  },
  {
    icon: '✦',
    title: 'AI Idea Generator',
    desc: 'Claude generates 4 tailored post ideas per trend, customised to your niche — in under 10 seconds.',
  },
  {
    icon: '🔖',
    title: 'Bookmark & Search',
    desc: 'Save the trends that matter, search across all of them, and filter by category, heat, or recency.',
  },
];

const STATS = [
  { number: '10,000+', label: 'Ideas generated' },
  { number: '500+',    label: 'Creators using it' },
  { number: '16',      label: 'Active trends' },
  { number: '9',       label: 'Categories' },
];

export default function LandingPage() {
  const [annDismissed, setAnnDismissed] = useState(true); // avoid flash; set false after mount

  useEffect(() => {
    setAnnDismissed(localStorage.getItem('tp_ann') === '1');
  }, []);

  function dismissAnn() {
    localStorage.setItem('tp_ann', '1');
    setAnnDismissed(true);
  }

  return (
    <div className="page-enter">
      {/* ── Announcement bar ── */}
      {!annDismissed && (
        <div className="ann-bar">
          ✦&nbsp; Now powered by <strong>Claude AI</strong> — 10 free idea generations per month,{' '}
          <Link href="/auth?mode=signup">no card required</Link>
          <button className="ann-close" onClick={dismissAnn} aria-label="Dismiss">✕</button>
        </div>
      )}

      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-label">
            <span className="label label-accent">✦ AI-Powered Trend Intelligence</span>
          </div>

          <h1 className="hero-heading">
            Create viral content,<br />before the trend peaks.
          </h1>

          <p className="hero-sub">
            TrendPulse spots what's rising across 9 categories, then Claude AI generates ideas
            tailored to your niche — so you post first, every time.
          </p>

          <div className="hero-actions">
            <Link href="/auth?mode=signup" className="btn btn-primary btn-xl">
              Start for free →
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-xl">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-number">{s.number}</div>
              <div className="stat-desc">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="features-section" id="features">
        <div className="section-label">
          <span className="label label-accent">Why TrendPulse</span>
        </div>
        <h2 className="section-heading">Everything you need to stay ahead</h2>
        <p className="section-sub">
          Stop guessing what to post. TrendPulse gives you the data and the ideas — all in one place.
        </p>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA band ── */}
      <div className="cta-band">
        <div className="cta-band-inner">
          <div className="cta-band-glow" />
          <h2>Ready to go viral?</h2>
          <p>Join 500+ creators who use TrendPulse to stay one step ahead.</p>
          <div className="cta-band-actions">
            <Link href="/auth?mode=signup" className="btn btn-primary btn-lg">
              Start for free →
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">
              View pricing
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <Link href="/" className="footer-logo">
            <div className="navbar-logo-icon" style={{ width: 28, height: 28, fontSize: 14, borderRadius: 7 }}>⚡</div>
            <span className="navbar-logo-text" style={{ fontSize: 15 }}>Trend<span>Pulse</span></span>
          </Link>
          <div className="footer-links">
            <Link href="/#features" className="footer-link">Features</Link>
            <Link href="/pricing" className="footer-link">Pricing</Link>
            <Link href="/auth" className="footer-link">Login</Link>
          </div>
          <span className="footer-copy">© 2025 TrendPulse. Powered by Claude AI.</span>
        </div>
      </footer>
    </div>
  );
}
