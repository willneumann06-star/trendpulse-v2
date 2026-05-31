'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';
import {
  CATEGORIES, CAT_COLORS, CAT_EMOJI,
  TRENDS, heatColor, heatLabel,
} from '../../lib/trends';

const MAX_MONTHLY = 10;
const PLATFORM_EMOJI = {
  'Instagram': '📸', 'TikTok': '🎵', 'YouTube': '▶️',
  'Twitter/X': '𝕏', 'LinkedIn': '💼',
};

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser]                     = useState(null);
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [bookmarkedIds, setBookmarkedIds]   = useState(new Set());
  const [loaded, setLoaded]                 = useState(false);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [sortBy, setSortBy]                 = useState('heat');
  const [showSavedOnly, setShowSavedOnly]   = useState(false);

  const [modalOpen, setModalOpen]           = useState(false);
  const [activeTrend, setActiveTrend]       = useState(null);
  const [niche, setNiche]                   = useState('');
  const [ideas, setIdeas]                   = useState([]);
  const [generating, setGenerating]         = useState(false);
  const [modalError, setModalError]         = useState('');
  const [limitReached, setLimitReached]     = useState(false);

  const [toast, setToast]                   = useState({ show: false, text: '', icon: '' });
  const toastTimer                          = useRef(null);

  /* ── Auth + profile load ── */
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth'); return; }
      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('generations_used, usage_reset_at')
        .eq('id', user.id)
        .single();

      if (profile) {
        const now = new Date();
        setGenerationsUsed(now >= new Date(profile.usage_reset_at) ? 0 : profile.generations_used);
      }

      const { data: bms } = await supabase
        .from('bookmarks').select('trend_id').eq('user_id', user.id);

      if (bms) setBookmarkedIds(new Set(bms.map(b => b.trend_id)));
      setLoaded(true);
    });
  }, []);

  /* ── Filter + sort ── */
  const filteredTrends = useCallback(() => {
    let list = [...TRENDS];
    if (showSavedOnly) list = list.filter(t => bookmarkedIds.has(t.id));
    if (activeCategory !== 'all') list = list.filter(t => t.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some(g => g.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'heat')   list.sort((a, b) => b.heat - a.heat);
    else if (sortBy === 'name')   list.sort((a, b) => a.title.localeCompare(b.title));
    else                          list.sort((a, b) => new Date(b.added) - new Date(a.added));
    return list;
  }, [showSavedOnly, activeCategory, searchQuery, sortBy, bookmarkedIds]);

  /* ── Toast ── */
  function showToast(icon, text) {
    clearTimeout(toastTimer.current);
    setToast({ show: true, icon, text });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2400);
  }

  /* ── Bookmarks ── */
  async function toggleBookmark(trendId) {
    if (!user) return;
    const isSaved = bookmarkedIds.has(trendId);
    if (isSaved) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('trend_id', trendId);
      setBookmarkedIds(prev => { const s = new Set(prev); s.delete(trendId); return s; });
      showToast('🏷️', 'Bookmark removed');
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, trend_id: trendId });
      setBookmarkedIds(prev => new Set([...prev, trendId]));
      showToast('🔖', 'Trend saved!');
    }
  }

  /* ── Modal ── */
  function openModal(trend) {
    setActiveTrend(trend);
    setIdeas([]);
    setModalError('');
    setLimitReached(generationsUsed >= MAX_MONTHLY);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    setModalOpen(false);
    document.body.style.overflow = '';
  }

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Generate ── */
  async function generateIdeas() {
    if (!niche.trim() || generationsUsed >= MAX_MONTHLY) return;
    setGenerating(true);
    setIdeas([]);
    setModalError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche.trim(), trend: activeTrend }),
      });
      const data = await res.json();
      if (res.status === 429) { setLimitReached(true); setGenerationsUsed(MAX_MONTHLY); return; }
      if (!res.ok) { setModalError(data.error || 'Something went wrong.'); return; }
      setIdeas(data.ideas);
      setGenerationsUsed(data.used);
      if (data.used >= MAX_MONTHLY) setLimitReached(true);
    } catch {
      setModalError('Network error. Check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  }

  /* ── Sign out ── */
  async function signOut() {
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  }

  if (!loaded) {
    return (
      <div className="page-spinner">
        <div className="spinner" />
      </div>
    );
  }

  const trends    = filteredTrends();
  const usagePct  = Math.min((generationsUsed / MAX_MONTHLY) * 100, 100);
  const fillClass = usagePct >= 100 ? 'full' : usagePct >= 70 ? 'warn' : '';

  return (
    <div className="page-enter">

      {/* ── Dashboard header ── */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link href="/" className="navbar-logo" style={{ flexShrink: 0 }}>
            <div className="navbar-logo-icon">⚡</div>
            <span className="navbar-logo-text" style={{ display: 'none', ['@media(min-width:640px)']: { display: 'block' } }}>
              Trend<span>Pulse</span>
            </span>
          </Link>

          {/* Search */}
          <div className="input-wrap" style={{ flex: 1, maxWidth: 440 }}>
            <span className="input-icon">🔍</span>
            <input
              type="text"
              className="input input-search"
              placeholder="Search trends, niches, topics…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Usage pill */}
            <div className="usage-pill">
              <div className="usage-track">
                <div className={`usage-fill ${fillClass}`} style={{ width: `${usagePct}%` }} />
              </div>
              <span className="usage-text">
                <strong>{generationsUsed}</strong>/{MAX_MONTHLY}
              </span>
            </div>

            {/* Bookmarks */}
            <button
              className={`btn btn-surface btn-sm${showSavedOnly ? ' active' : ''}`}
              onClick={() => { setShowSavedOnly(s => !s); setActiveCategory('all'); }}
              style={showSavedOnly ? { borderColor: 'var(--border-accent)', color: 'var(--accent-2)' } : {}}
            >
              🔖
              <span style={{
                background: 'var(--accent)',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 20,
                padding: '1px 7px',
                minWidth: 20,
                textAlign: 'center',
              }}>
                {bookmarkedIds.size}
              </span>
            </button>

            {/* Sign out */}
            <button className="btn btn-surface btn-sm btn-danger" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="dash-hero">
        <div className="dash-hero-label">
          <span className="label label-accent">✦ Updated weekly</span>
        </div>
        <h1>What's trending <span>right now</span></h1>
        <p>Spot trends early, generate ideas instantly, and post before everyone else.</p>
        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat-value">{TRENDS.length}</span>
            <span className="dash-stat-label">Active trends</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-value">{CATEGORIES.length - 1}</span>
            <span className="dash-stat-label">Categories</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-value">{Math.max(0, MAX_MONTHLY - generationsUsed)}</span>
            <span className="dash-stat-label">Ideas left this month</span>
          </div>
        </div>
      </section>

      {/* ── Category chips ── */}
      <div className="chips-wrap">
        <div className="chips-scroll">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`chip${activeCategory === c.id && !showSavedOnly ? ' active' : ''}`}
              onClick={() => { setActiveCategory(c.id); setShowSavedOnly(false); }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid-wrap">
        <div className="results-meta">
          <span className="results-count"><strong>{trends.length}</strong> trends shown</span>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="heat">Heat score</option>
            <option value="name">A–Z</option>
            <option value="recent">Newest</option>
          </select>
        </div>

        <div className="trend-grid">
          {trends.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{showSavedOnly ? '🔖' : '🔍'}</div>
              <h3>{showSavedOnly ? 'No bookmarks yet' : 'No trends found'}</h3>
              <p>{showSavedOnly ? 'Bookmark trends to see them here.' : 'Try a different search or category.'}</p>
            </div>
          ) : trends.map((t, idx) => {
            const color  = heatColor(t.heat);
            const cs     = CAT_COLORS[t.category] || { color: '#666', bg: 'rgba(100,100,100,0.1)', border: 'rgba(100,100,100,0.2)' };
            const isSaved = bookmarkedIds.has(t.id);
            return (
              <div
                key={t.id}
                className="trend-card"
                style={{ '--heat-color': color, animationDelay: `${Math.min(idx, 8) * 0.05}s` }}
              >
                <div className="card-top">
                  <div className="card-meta">
                    <span className="cat-badge" style={{ color: cs.color, background: cs.bg, borderColor: cs.border }}>
                      {CAT_EMOJI[t.category]} {t.category}
                    </span>
                    <span className="heat-badge" style={{ color, background: `${color}18`, borderColor: `${color}40` }}>
                      {heatLabel(t.heat)} {t.heat}
                    </span>
                  </div>
                  <button
                    className={`bookmark-btn${isSaved ? ' saved' : ''}`}
                    onClick={() => toggleBookmark(t.id)}
                    title={isSaved ? 'Remove bookmark' : 'Save trend'}
                  >
                    {isSaved ? '🔖' : '🏷️'}
                  </button>
                </div>

                <div className="card-title">{t.title}</div>
                <div className="card-desc">{t.desc}</div>

                <div className="heat-bar-wrap">
                  <div className="heat-bar-track">
                    <div className="heat-bar-fill" style={{ width: `${t.heat}%`, background: color }} />
                  </div>
                  <span className="heat-label">Heat {t.heat}/100</span>
                </div>

                <div className="tags-row">
                  {t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>

                <div className="card-actions">
                  <button
                    className="btn-generate"
                    onClick={() => openModal(t)}
                    disabled={generationsUsed >= MAX_MONTHLY}
                    title={generationsUsed >= MAX_MONTHLY ? 'Monthly limit reached' : 'Generate ideas with AI'}
                  >
                    ✦ Generate Ideas
                  </button>
                  <button
                    className="btn-card-icon"
                    onClick={() => {
                      navigator.clipboard.writeText(`${location.origin}/dashboard#trend-${t.id}`).catch(() => {});
                      showToast('🔗', `Link copied`);
                    }}
                    title="Copy link"
                  >
                    🔗
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal ── */}
      <div
        className={`modal-overlay${modalOpen ? ' open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal">
          <div className="modal-header">
            <div>
              <div className="modal-eyebrow">✦ AI Idea Generator</div>
              <div className="modal-title">Generate Content Ideas</div>
            </div>
            <button className="modal-close" onClick={closeModal}>✕</button>
          </div>

          {activeTrend && (() => {
            const color = heatColor(activeTrend.heat);
            return (
              <div className="modal-trend-info">
                <div className="heat-circle" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>
                  <span className="heat-circle-num">{activeTrend.heat}</span>
                  <span className="heat-circle-unit">HEAT</span>
                </div>
                <div className="modal-trend-text">
                  <h4>{activeTrend.title}</h4>
                  <p>{activeTrend.category} · {heatLabel(activeTrend.heat)}</p>
                </div>
              </div>
            );
          })()}

          <div className="modal-body">
            {limitReached ? (
              <div className="limit-banner">
                <span className="limit-icon">🌟</span>
                <div className="limit-text">
                  <h4>You've used all {MAX_MONTHLY} free generations this month</h4>
                  <p>
                    Paid plans with unlimited generations are coming soon.
                    Your free counter resets next month — or{' '}
                    <Link href="/pricing" style={{ color: 'var(--accent-2)' }}>check out pricing</Link> to get early access.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="field-group">
                  <label className="field-label" htmlFor="nicheInput">
                    Your niche <span>— what kind of creator are you?</span>
                  </label>
                  <input
                    type="text"
                    id="nicheInput"
                    className="input"
                    placeholder="e.g. sustainable fashion, home cooking, fitness coaching…"
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') generateIdeas(); }}
                  />
                  <div className="niche-pills">
                    {['Lifestyle', 'Fitness & Wellness', 'Beauty & Skincare', 'Tech & Gaming',
                      'Food & Cooking', 'Travel & Adventure', 'Finance & Investing', 'Fashion & Style',
                    ].map(n => (
                      <button key={n} className="niche-pill" onClick={() => setNiche(n)}>{n}</button>
                    ))}
                  </div>
                </div>

                {modalError && <div className="error-msg visible">⚠️ {modalError}</div>}

                <button
                  className="btn-generate-modal"
                  onClick={generateIdeas}
                  disabled={generating || !niche.trim()}
                >
                  {generating ? 'Generating…' : '✦ Generate 4 Post Ideas'}
                </button>
              </>
            )}

            <div className={`loading-state${generating ? ' visible' : ''}`}>
              <div className="loading-dots">
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
              </div>
              <span className="loading-text">Claude is crafting your ideas…</span>
            </div>

            {ideas.length > 0 && (
              <div className="ideas-grid">
                {ideas.map((idea, i) => (
                  <div key={i} className="idea-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="idea-top">
                      <span className="idea-platform">
                        {PLATFORM_EMOJI[idea.platform] || '📱'} {idea.platform || 'Social'}
                      </span>
                      <span className="idea-format">{idea.format || 'Post'}</span>
                    </div>
                    <div className="idea-hook">"{idea.hook}"</div>
                    <div className="idea-concept">{idea.concept}</div>
                    <div className="idea-tags">
                      {(idea.hashtags || []).map(h => <span key={h} className="idea-tag">{h}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-footer-note">
              Powered by Claude AI · {generationsUsed}/{MAX_MONTHLY} generations used this month
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <div className={`toast${toast.show ? ' show' : ''}`}>
        <span>{toast.icon}</span>
        <span>{toast.text}</span>
      </div>
    </div>
  );
}
