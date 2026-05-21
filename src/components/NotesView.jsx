export default function NotesView({ data }) {
  if (!data) return null;
  const { docName, sections } = data;

  return (
    <div className="notes-container">
      <div className="notes-content">
        <h1>📝 Notes — {docName}</h1>
        {sections.map((sec, i) => (
          <div key={i}>
            <h2>{sec.title}</h2>
            <ul>
              {sec.points.map((pt, j) => (
                <li key={j} dangerouslySetInnerHTML={{
                  __html: pt.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                }} />
              ))}
            </ul>
            {i < sections.length - 1 && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
}
