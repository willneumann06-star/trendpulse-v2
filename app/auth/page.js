'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (params.get('mode') === 'signup') setTab('signup');
  }, [params]);

  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setTab('login');
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-glow" />

      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <div className="navbar-logo-icon">⚡</div>
          <span className="navbar-logo-text">Trend<span>Pulse</span></span>
        </Link>

        <h2>{tab === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p>
          {tab === 'login'
            ? 'Sign in to access your AI content generator and bookmarks.'
            : 'Get 10 free AI idea generations per month. No credit card required.'}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}>
            Sign Up
          </button>
        </div>

        {error   && <div className="auth-error">⚠️ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" className="input" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="input"
              placeholder={tab === 'signup' ? 'At least 6 characters' : 'Your password'}
              value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
          </div>
          <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer-note">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-footer-link"
            onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}>
            {tab === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
