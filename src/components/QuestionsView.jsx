export default function QuestionsView({ data }) {
  if (!data || !data.length) return null;

  const tagClass = {
    Easy: 'tag-easy',
    Medium: 'tag-medium',
    Hard: 'tag-hard',
  };

  return (
    <div className="questions-container">
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', paddingBottom: 4 }}>
        ❓ {data.length} questions — great for exam prep!
      </div>
      {data.map(q => (
        <div key={q.id} id={`question-${q.id}`} className="question-card">
          <div className="question-num">{String(q.id).padStart(2, '0')}</div>
          <div className="question-body">
            <div className="question-text">{q.question}</div>
            <span className={`question-tag ${tagClass[q.difficulty]}`}>
              {q.difficulty === 'Easy' ? '🟢' : q.difficulty === 'Medium' ? '🟡' : '🔴'} {q.difficulty}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
