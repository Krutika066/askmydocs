import { useState } from 'react';

export default function FlashcardView({ cards }) {
  const [flipped, setFlipped] = useState({});
  const [allFlipped, setAllFlipped] = useState(false);

  const toggleCard = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    if (allFlipped) {
      setFlipped({});
    } else {
      const all = {};
      cards.forEach(c => { all[c.id] = true; });
      setFlipped(all);
    }
    setAllFlipped(!allFlipped);
  };

  const resetAll = () => {
    setFlipped({});
    setAllFlipped(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 10, padding: '12px 28px 0', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {cards.length} flashcards — click to flip
        </span>
        <button
          id="flashcard-flip-all-btn"
          onClick={toggleAll}
          style={{
            marginLeft: 'auto', padding: '6px 16px', borderRadius: 99,
            border: '1px solid var(--border-active)', background: 'rgba(168,85,247,0.1)',
            color: 'var(--purple-400)', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            fontFamily: 'Outfit, sans-serif'
          }}
        >
          {allFlipped ? '🔄 Show Questions' : '💡 Reveal All Answers'}
        </button>
        <button
          id="flashcard-reset-btn"
          onClick={resetAll}
          style={{
            padding: '6px 14px', borderRadius: 99,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12,
            fontFamily: 'Outfit, sans-serif'
          }}
        >
          ↩ Reset
        </button>
      </div>

      <div className="flashcard-grid">
        {cards.map(card => (
          <div
            key={card.id}
            id={`flashcard-${card.id}`}
            className={`flashcard ${flipped[card.id] ? 'flipped' : ''}`}
            onClick={() => toggleCard(card.id)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="flashcard-label">Question {card.id}</div>
                <div className="flashcard-text">{card.front}</div>
                <div className="flashcard-hint">👆 Click to flip</div>
              </div>
              <div className="flashcard-back">
                <div className="flashcard-label">✅ Answer</div>
                <div className="flashcard-text">{card.back}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
