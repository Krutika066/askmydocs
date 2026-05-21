export default function WelcomeSplash({ onUpload }) {
  const features = [
    { icon: '📝', label: 'Notes' },
    { icon: '❓', label: 'Questions' },
    { icon: '🧠', label: 'MCQ Quiz' },
    { icon: '🃏', label: 'Flashcards' },
    { icon: '🔑', label: 'Keywords' },
    { icon: '💬', label: 'Q&A Chat' },
  ];

  return (
    <div className="welcome-splash">
      <div className="welcome-inner">
        <span className="welcome-emoji">📚</span>
        <h1 className="welcome-title">Welcome to AskMyDocs Pro</h1>
        <p className="welcome-sub">
          Upload any document and instantly unlock AI-powered study tools.
          Get notes, quizzes, flashcards, and answers — all from your own content.
        </p>

        <div className="feature-pills" style={{ marginBottom: 28 }}>
          {features.map(f => (
            <div key={f.label} className="feature-pill">
              <span>{f.icon}</span> {f.label}
            </div>
          ))}
        </div>

        <button
          id="welcome-upload-btn"
          className="upload-btn"
          onClick={onUpload}
          style={{ margin: '0 auto', display: 'inline-flex' }}
        >
          📤 Upload a Document to Begin
        </button>

        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          Supports TXT, PDF text, CSV, Markdown, and more
        </p>
      </div>
    </div>
  );
}
