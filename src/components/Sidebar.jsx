import { listAvailableModels } from '../utils/aiEngine';

export default function Sidebar({ activeMode, onModeChange, docName, onUploadClick, apiReady, onResetKey }) {
  const handleDebugModels = async () => {
    const models = await listAvailableModels();
    alert('Available Models:\n' + models.join('\n') + '\n\nCheck console for full details.');
  };

  const navItems = [
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'notes', icon: '📝', label: 'Notes' },
    { id: 'questions', icon: '❓', label: 'Questions' },
    { id: 'mcq', icon: '🧠', label: 'Quiz (MCQs)' },
    { id: 'flashcard', icon: '🃏', label: 'Flashcards' },
    { id: 'keywords', icon: '🔑', label: 'Keywords' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📚</div>
        <div className="logo-text">Ask<span>MyDocs</span> Pro</div>
      </div>

      {/* API Status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 10, marginBottom: 12,
        background: apiReady ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
        border: `1px solid ${apiReady ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
      }}>
        <span style={{ fontSize: 10 }}>{apiReady ? '🟢' : '🔴'}</span>
        <span style={{ fontSize: 11, color: apiReady ? 'var(--green-400)' : 'var(--red-400)', fontWeight: 600 }}>
          {apiReady ? 'Gemini Connected' : 'API Key Required'}
        </span>
        {apiReady && (
          <button
            id="sidebar-reset-key-btn"
            onClick={onResetKey}
            title="Change API Key"
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)',
              padding: '2px 4px', borderRadius: 4
            }}
          >🔑</button>
        )}
      </div>

      <div className="sidebar-section-title">Document</div>
      <div
        className={`nav-item ${activeMode === 'upload' ? 'active' : ''}`}
        id="sidebar-upload-btn"
        onClick={onUploadClick}
      >
        <span className="nav-icon">📤</span>
        Upload Document
      </div>

      <div className="sidebar-divider" />
      <div className="sidebar-section-title">Features</div>

      {navItems.map(item => (
        <div
          key={item.id}
          id={`sidebar-${item.id}`}
          className={`nav-item ${activeMode === item.id ? 'active' : ''}`}
          onClick={() => onModeChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}

      {docName && (
        <div className="doc-info-card">
          <div className="doc-name">📄 {docName}</div>
          <div className="doc-meta">Document loaded & ready</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {/* Debug Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
        <button
          onClick={handleDebugModels}
          style={{
            width: '100%', padding: '6px', fontSize: '10px',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer'
          }}
        >
          🐞 Debug: List Models
        </button>
      </div>
    </aside>
  );
}

