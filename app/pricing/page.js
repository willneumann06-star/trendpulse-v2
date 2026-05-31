'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    annual: 0,
    desc: 'Everything you need to get started.',
    cta: 'Start for free',
    ctaHref: '/auth?mode=signup',
    popular: false,
    features: [
      { label: '10 AI generations / month',    included: true  },
      { label: 'Browse all 16 trends',          included: true  },
      { label: '9 trend categories',            included: true  },
      { label: 'Bookmarks',                     included: true  },
      { label: 'Search & sort',                 included: true  },
      { label: 'Export ideas to PDF',           included: false },
      { label: 'Priority AI response',          included: false },
      { label: 'Team seats',                    included: false },
      { label: 'API access',                    included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 19,
    annual: 15,
    desc: 'For creators who post consistently.',
    cta: 'Get Pro',
    ctaHref: '/auth?mode=signup',
    popular: true,
    features: [
      { label: 'Unlimited AI generations',      included: true  },
      { label: 'Browse all 16 trends',          included: true  },
      { label: '9 trend categories',            included: true  },
      { label: 'Bookmarks',                     included: true  },
      { label: 'Search & sort',                 included: true  },
      { label: 'Export ideas to PDF',           included: true  },
      { label: 'Priority AI response',          included: true  },
      { label: 'Team seats',                    included: false },
      { label: 'API access',                    included: false },
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    monthly: 49,
    annual: 39,
    desc: 'For teams managing multiple creators.',
    cta: 'Get Agency',
    ctaHref: '/auth?mode=signup',
    popular: false,
    features: [
      { label: 'Unlimited AI generations',      included: true  },
      { label: 'Browse all 16 trends',          included: true  },
      { label: '9 trend categories',            included: true  },
      { label: 'Bookmarks',                     included: true  },
      { label: 'Search & sort',                 included: true  },
      { label: 'Export ideas to PDF',           included: true  },
      { label: 'Priority AI response',          included: true  },
      { label: '5 team seats',                  included: true  },
      { label: 'API access',                    included: true  },
    ],
  },
];

const TABLE_ROWS = [
  { label: 'AI idea generations',   free: '10 / month',  pro: 'Unlimited',  agency: 'Unlimited'  },
  { label: 'Trend browsing',        free: '✓',           pro: '✓',          agency: '✓'          },
  { label: 'Category filters',      free: '✓',           pro: '✓',          agency: '✓'          },
  { label: 'Bookmarks',             free: '✓',           pro: '✓',          agency: '✓'          },
  { label: 'Export to PDF',         free: '✗',           pro: '✓',          agency: '✓'          },
  { label: 'Priority AI',           free: '✗',           pro: '✓',          agency: '✓'          },
  { label: 'Team seats',            free: '✗',           pro: '✗',          agency: '5 seats'    },
  { label: 'API access',            free: '✗',           pro: '✗',          agency: '✓'          },
  { label: 'Dedicated support',     free: 'Email',       pro: 'Priority',   agency: 'Dedicated'  },
];

function CheckIcon({ included }) {
  if (included) return <span className="plan-feature-check included">✓</span>;
  return <span className="plan-feature-x">✗</span>;
}

function TableCell({ val }) {
  if (val === '✓') return <span className="compare-check">✓</span>;
  if (val === '✗') return <span className="compare-x">✗</span>;
  return <span style={{ color: 'var(--text-2)', fontSize: 13 }}>{val}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="page-enter" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar activePage="pricing" />

      {/* ── Hero ── */}
      <div className="pricing-hero">
        <div style={{ marginBottom: 16 }}>
          <span className="label label-accent">✦ Simple, transparent pricing</span>
        </div>
        <h1>Plans that grow with you</h1>
        <p>Start for free. Upgrade when you're ready to go all-in.</p>

        {/* Billing toggle */}
        <div className="billing-toggle">
          <button
            className={`billing-toggle-btn${!annual ? ' active' : ''}`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            className={`billing-toggle-btn${annual ? ' active' : ''}`}
            onClick={() => setAnnual(true)}
          >
            Annual <span className="save-badge">Save 20%</span>
          </button>
        </div>
      </div>

      {/* ── Pricing cards ── */}
      <div className="pricing-grid">
        {PLANS.map(plan => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <div key={plan.id} className={`plan-card${plan.popular ? ' popular' : ''}`}>
              {plan.popular && <div className="plan-popular-badge">Most Popular</div>}

              <div className="plan-name">{plan.name}</div>

              <div className="plan-price">
                <span className="plan-price-currency">$</span>
                <span className="plan-price-amount">{price}</span>
                {price > 0 && <span className="plan-price-period">/mo</span>}
              </div>

              {annual && price > 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>
                  Billed ${price * 12}/year
                </div>
              )}

              <div className="plan-desc">{plan.desc}</div>
              <div className="plan-divider" />

              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f.label} className={`plan-feature${!f.included ? ' muted' : ''}`}>
                    <CheckIcon included={f.included} />
                    {f.label}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`btn btn-md${plan.popular ? ' btn-primary' : ' btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {plan.cta} →
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── Feature comparison ── */}
      <div className="compare-section">
        <h2>Full feature comparison</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th className="popular-col">Pro</th>
              <th>Agency</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(row => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td><TableCell val={row.free} /></td>
                <td><TableCell val={row.pro} /></td>
                <td><TableCell val={row.agency} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer note ── */}
      <div style={{ textAlign: 'center', padding: '0 24px 64px', color: 'var(--text-3)', fontSize: 13 }}>
        All paid features are coming soon. Start free today — no credit card required.
        <br />
        Questions? <a href="mailto:hello@trendpulse.app" style={{ color: 'var(--accent-2)' }}>hello@trendpulse.app</a>
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
            <Link href="/pricing"   className="footer-link">Pricing</Link>
            <Link href="/auth"      className="footer-link">Login</Link>
          </div>
          <span className="footer-copy">© 2025 TrendPulse</span>
        </div>
      </footer>
    </div>
  );
}
