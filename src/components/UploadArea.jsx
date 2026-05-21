import { useRef, useState } from 'react';

export default function UploadArea({ onUpload }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractPdfText = async (arrayBuffer) => {
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) throw new Error('PDF library failed to load. Please refresh the page.');

    try {
      console.log('PDF: Initializing...');
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      console.log(`PDF: ${pdf.numPages} pages detected`);
      
      let fullText = '';
      const maxPages = Math.min(pdf.numPages, 40);
      
      for (let i = 1; i <= maxPages; i++) {
        console.log(`PDF: Reading page ${i}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
        setProgress(Math.round((i / maxPages) * 100));
      }
      
      console.log('PDF: Finished. Total chars:', fullText.length);
      return fullText;
    } catch (e) {
      console.error('PDF Parse Error:', e);
      throw new Error(`Failed to parse PDF: ${e.message}`);
    }
  };

  const readFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setProgress(0);

    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        console.log('App: Processing PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const text = await extractPdfText(arrayBuffer);
        if (text.trim().length < 5) {
          throw new Error('Could not find any text in this PDF. Is it a scanned image?');
        }
        onUpload(file.name, text);
      } else {
        console.log('App: Processing Text file...');
        const reader = new FileReader();
        reader.onload = (e) => {
          onUpload(file.name, e.target.result);
          setLoading(false);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('App: Upload error:', err);
      alert('⚠️ ' + err.message);
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      id="upload-drop-zone"
      className={`upload-area ${dragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !loading && fileRef.current.click()}
    >
      <span className="upload-icon">{loading ? '⏳' : dragOver ? '📂' : '📁'}</span>
      <h2 className="upload-title">
        {loading ? 'Reading Document...' : dragOver ? 'Drop it here!' : 'Upload Your Document'}
      </h2>
      <p className="upload-subtitle">
        {loading
          ? 'Please wait while we process your file.'
          : 'Drag & drop your file here, or click to browse.\nWe\'ll instantly make it interactive.'}
      </p>

      {loading ? (
        <div style={{ width: '100%', maxWidth: 280 }}>
          <div className="progress-bar-wrap" style={{ height: 6 }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%`, transition: 'width 0.15s ease' }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{progress}% complete</p>
        </div>
      ) : (
        <button id="upload-browse-btn" className="upload-btn" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
          📎 Browse Files
        </button>
      )}

      <p className="upload-formats">Supports: TXT, PDF text, CSV, Markdown, and more</p>
      <input
        ref={fileRef}
        type="file"
        accept=".txt,.md,.csv,.json,.pdf,.xlsx,.xls"
        style={{ display: 'none' }}
        onChange={e => readFile(e.target.files[0])}
      />
    </div>
  );
}
