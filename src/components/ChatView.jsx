import { useEffect, useRef, useState } from 'react';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

const CHIPS = [
  { label: '📝 Notes', text: 'Make notes' },
  { label: '❓ Questions', text: 'Important questions' },
  { label: '🧠 MCQs', text: 'Quiz me with MCQs' },
  { label: '🃏 Flashcards', text: 'Generate flashcards' },
  { label: '🔑 Keywords', text: 'Keywords glossary' },
  { label: '📋 Short Notes', text: 'Short notes summary' },
];

export default function ChatView({ messages, isLoading, onSend, docLoaded }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-messages">
        {messages.length === 0 && docLoaded && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: 14 }}>
            Start chatting below or pick a feature chip ✨
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="msg-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
            <div
              className="msg-bubble"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
            />
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble" style={{ padding: '14px 20px' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        {docLoaded && (
          <div className="feature-chips">
            {CHIPS.map(c => (
              <button key={c.label} className="chip" onClick={() => onSend(c.text)}>{c.label}</button>
            ))}
          </div>
        )}
        <div className="input-row">
          <textarea
            ref={textareaRef}
            id="chat-input-field"
            className="chat-input"
            placeholder={docLoaded ? 'Ask anything about your document...' : 'Upload a document to start chatting...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={!docLoaded || isLoading}
          />
          <button
            id="chat-send-btn"
            className="send-btn"
            onClick={handleSend}
            disabled={!docLoaded || isLoading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
