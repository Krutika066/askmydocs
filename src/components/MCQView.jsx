import { useState } from 'react';

export default function MCQView({ questions }) {
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(null);

  const handleSelect = (qId, optLabel) => {
    if (revealed[qId]) return;
    setSelected(prev => ({ ...prev, [qId]: optLabel }));
    setRevealed(prev => ({ ...prev, [qId]: true }));
  };

  const calcScore = () => {
    const correct = questions.filter(q => selected[q.id] === q.correct).length;
    setScore(correct);
  };

  const reset = () => {
    setSelected({});
    setRevealed({});
    setScore(null);
  };

  const allAnswered = questions.length > 0 && Object.keys(revealed).length === questions.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 10, padding: '12px 28px 0', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          🧠 {questions.length} questions — select an option to answer
        </span>
        {allAnswered && score === null && (
          <button
            id="mcq-submit-btn"
            onClick={calcScore}
            style={{
              marginLeft: 'auto', padding: '7px 18px', borderRadius: 99,
              border: 'none', background: 'var(--gradient-main)',
              color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 15px rgba(168,85,247,0.3)'
            }}
          >
            📊 See Score
          </button>
        )}
        {score !== null && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              padding: '6px 16px', borderRadius: 99,
              background: score >= questions.length * 0.7 ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
              border: `1px solid ${score >= questions.length * 0.7 ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
              color: score >= questions.length * 0.7 ? 'var(--green-400)' : 'var(--red-400)',
              fontWeight: 700, fontSize: 13
            }}>
              🏆 {score}/{questions.length} — {Math.round(score / questions.length * 100)}%
            </span>
            <button id="mcq-retry-btn" onClick={reset} style={{
              padding: '6px 14px', borderRadius: 99, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: 12, fontFamily: 'Outfit, sans-serif'
            }}>↩ Retry</button>
          </div>
        )}
      </div>

      <div className="mcq-container">
        {questions.map(q => (
          <div key={q.id} id={`mcq-${q.id}`} className="mcq-card">
            <div className="mcq-question">
              <span className="mcq-number">Q{q.id}.</span>{q.question}
            </div>
            <div className="mcq-options">
              {q.options.map(opt => {
                let cls = 'mcq-option';
                if (revealed[q.id]) {
                  if (opt.label === q.correct) cls += ' correct';
                  else if (opt.label === selected[q.id]) cls += ' wrong';
                } else if (selected[q.id] === opt.label) {
                  cls += ' selected';
                }
                return (
                  <div
                    key={opt.label}
                    id={`mcq-${q.id}-opt-${opt.label}`}
                    className={cls}
                    onClick={() => handleSelect(q.id, opt.label)}
                  >
                    <span className="mcq-letter">{opt.label}</span>
                    {opt.text}
                  </div>
                );
              })}
            </div>
            {revealed[q.id] && (
              <div className="mcq-answer-reveal">
                ✅ Correct Answer: {q.correct} — {q.options.find(o => o.label === q.correct)?.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
