import { useState } from 'react';

export default function ApiKeySetup({ onKeySet }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!key.trim()) { setError('Please enter your API key.'); return; }
    if (!key.startsWith('AIza')) { setError('Invalid key format. Gemini keys start with "AIza".'); return; }
    setLoading(true);
    setError('');
    // Small validation delay
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onKeySet(key.trim());
  };

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40
    }}>
      <div style={{
        maxWidth: 460, width: '100%', textAlign: 'center',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '40px 36px',
        backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Connect Gemini AI
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          AskMyDocs Pro uses Google Gemini to truly understand your documents.
          Enter your free API key to unlock all features.
        </p>

        <div style={{ textAlign: 'left', marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="AIzaSy..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? 'var(--red-400)' : 'var(--border)'}`,
              borderRadius: 12, padding: '12px 16px',
              color: 'var(--text-primary)', fontFamily: 'Inter, monospace',
              fontSize: 14, outline: 'none', transition: 'border-color 0.2s'
            }}
          />
          {error && <p style={{ fontSize: 12, color: 'var(--red-400)', marginTop: 6 }}>⚠️ {error}</p>}
        </div>

        <button
          id="api-key-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 12, border: 'none',
            background: 'var(--gradient-main)', color: 'white',
            fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
            transition: 'all 0.25s', opacity: loading ? 0.8 : 1
          }}
        >
          {loading ? '⏳ Connecting...' : '🚀 Activate AskMyDocs Pro'}
        </button>

        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Get a free key at{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
            style={{ color: 'var(--purple-400)', textDecoration: 'none', fontWeight: 600 }}>
            aistudio.google.com
          </a>
          {' '}· Your key is stored locally only.
        </p>
      </div>
    </div>
  );
}
