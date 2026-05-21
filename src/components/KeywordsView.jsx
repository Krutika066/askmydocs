export default function KeywordsView({ data }) {
  if (!data || !data.length) return null;

  return (
    <div className="notes-container">
      <div className="notes-content">
        <h1>🔑 Keywords & Glossary</h1>
        {data.map((kw, i) => (
          <div key={i} className="keyword-item" id={`keyword-${i}`}>
            <span className="keyword-icon">🔑</span>
            <div>
              <div className="keyword-term">{kw.term}</div>
              <div
                className="keyword-def"
                dangerouslySetInnerHTML={{
                  __html: kw.definition.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
