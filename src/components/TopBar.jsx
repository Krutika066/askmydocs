const modeLabels = {
  chat: { label: 'Chat', icon: '💬' },
  notes: { label: 'Study Notes', icon: '📝' },
  questions: { label: 'Important Questions', icon: '❓' },
  mcq: { label: 'Quiz (MCQs)', icon: '🧠' },
  flashcard: { label: 'Flashcards', icon: '🃏' },
  keywords: { label: 'Keywords & Glossary', icon: '🔑' },
  upload: { label: 'Upload Document', icon: '📤' },
};

export default function TopBar({ activeMode, docName }) {
  const { label, icon } = modeLabels[activeMode] || modeLabels.chat;
  return (
    <div className="topbar">
      <div className="topbar-title">{icon} {label}</div>
      {docName
        ? <span className="topbar-badge">📄 {docName.length > 24 ? docName.substring(0, 24) + '…' : docName}</span>
        : <span className="topbar-badge">✨ AskMyDocs Pro</span>
      }
    </div>
  );
}
