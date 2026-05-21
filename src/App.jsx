import { useState, useEffect } from 'react';
import { generateAIResponse, initGemini, getStoredApiKey, isGeminiReady } from './utils/aiEngine';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import UploadArea from './components/UploadArea';
import ChatView from './components/ChatView';
import FlashcardView from './components/FlashcardView';
import MCQView from './components/MCQView';
import NotesView from './components/NotesView';
import QuestionsView from './components/QuestionsView';
import KeywordsView from './components/KeywordsView';
import WelcomeSplash from './components/WelcomeSplash';
import ApiKeySetup from './components/ApiKeySetup';

export default function App() {
  const [apiReady, setApiReady] = useState(false);
  const [docName, setDocName] = useState('');
  const [docContent, setDocContent] = useState('');
  const [activeMode, setActiveMode] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [specialData, setSpecialData] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-initialize from env variable or saved localStorage key
  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const saved = getStoredApiKey();
    const key = envKey || saved;
    if (key) {
      initGemini(key);
      setApiReady(true);
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleKeySet = (key) => {
    initGemini(key);
    setApiReady(true);
    showToast('✅ Gemini connected!');
  };

  const handleUpload = (name, content) => {
    setDocName(name);
    setDocContent(content);
    setMessages([{
      role: 'assistant',
      content: `✅ **Document loaded successfully!**\n\nI've read **"${name}"** and I'm ready to help you understand it deeply.\n\nYou can ask me anything, or use the quick actions below to get started. Try:\n- **"Make notes"** for organized study notes\n- **"Important Questions"** for exam-prep questions\n- **"MCQs"** for a quiz\n- **"Flashcards"** for visual review\n- **"Keywords"** for a glossary\n\n---\n💡 *What would you like to explore first?*`
    }]);
    setActiveMode('chat');
    setSpecialData(null);
    showToast('📄 Document ready!');
  };

  const handleSend = async (userText) => {
    if (!userText.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);
    setSpecialData(null);

    const lowerText = userText.toLowerCase();
    let targetMode = 'chat';
    if (lowerText.includes('flashcard')) targetMode = 'flashcard';
    else if (lowerText.includes('mcq') || lowerText.includes('quiz')) targetMode = 'mcq';
    else if (lowerText.includes('short note') || (lowerText.includes('note') && !lowerText.includes('important'))) targetMode = 'notes';
    else if (lowerText.includes('keyword') || lowerText.includes('glossary')) targetMode = 'keywords';
    else if (lowerText.includes('question')) targetMode = 'questions';

    try {
      const result = await generateAIResponse(userText, docName, docContent, targetMode);

      if (targetMode === 'flashcard') {
        setActiveMode('flashcard');
        setSpecialData(result.data);
        setMessages(prev => [...prev, { role: 'assistant', content: `🃏 **Here are your flashcards for "${docName}"!** Click any card to flip it.\n\n*Generated ${result.data.length} flashcards from the document.*` }]);
      } else if (targetMode === 'mcq') {
        setActiveMode('mcq');
        setSpecialData(result.data);
        setMessages(prev => [...prev, { role: 'assistant', content: `🧠 **Quiz time! Here are your MCQs for "${docName}".**\n\nClick an option to answer. Correct answers revealed instantly!` }]);
      } else if (targetMode === 'notes') {
        setActiveMode('notes');
        setSpecialData(result.data);
        setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
      } else if (targetMode === 'keywords') {
        setActiveMode('keywords');
        setSpecialData(result.data);
        setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
      } else if (targetMode === 'questions') {
        setActiveMode('questions');
        setSpecialData(result.data);
        setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
      }
    } catch (e) {
      console.error(e);
      const errMsg = e.message?.includes('API_KEY') || e.message?.includes('403')
        ? '🔑 **Invalid API Key.** Please check your Gemini API key and try again.'
        : e.message?.includes('429')
        ? '⏳ **Rate limit reached.** Please wait a moment and try again.'
        : `⚠️ **Error:** ${e.message || 'Something went wrong. Please try again.'}`;
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    }
    setIsLoading(false);
  };

  const handleModeClick = (mode) => {
    if (!docContent) { showToast('⚠️ Please upload a document first.'); return; }
    setActiveMode(mode);
    if (mode === 'flashcard') handleSend('Generate flashcards');
    else if (mode === 'mcq') handleSend('Generate MCQs quiz me');
    else if (mode === 'notes') handleSend('Make notes');
    else if (mode === 'keywords') handleSend('Keywords glossary');
    else if (mode === 'questions') handleSend('Important questions');
    else if (mode === 'chat') setActiveMode('chat');
  };

  const renderMainContent = () => {
    if (!apiReady) {
      return <ApiKeySetup onKeySet={handleKeySet} />;
    }
    if (!docContent) {
      if (activeMode === 'upload') return <div className="upload-container"><UploadArea onUpload={handleUpload} /></div>;
      return <WelcomeSplash onUpload={() => setActiveMode('upload')} />;
    }
    if (activeMode === 'upload') return <div className="upload-container"><UploadArea onUpload={handleUpload} /></div>;
    if (activeMode === 'flashcard' && specialData) return <FlashcardView cards={specialData} />;
    if (activeMode === 'mcq' && specialData) return <MCQView questions={specialData} />;
    if (activeMode === 'notes' && specialData) return <NotesView data={specialData} />;
    if (activeMode === 'keywords' && specialData) return <KeywordsView data={specialData} />;
    if (activeMode === 'questions' && specialData) return <QuestionsView data={specialData} />;
    return <ChatView messages={messages} isLoading={isLoading} onSend={handleSend} docLoaded={!!docContent} />;
  };

  return (
    <div className="app">
      <Sidebar
        activeMode={activeMode}
        onModeChange={handleModeClick}
        docName={docName}
        onUploadClick={() => setActiveMode('upload')}
        apiReady={apiReady}
        onResetKey={() => { localStorage.removeItem('askmydocs_api_key'); setApiReady(false); }}
      />
      <div className="main-area">
        <TopBar activeMode={activeMode} docName={docName} />
        {renderMainContent()}
      </div>
      {toast && <div className="toast"><span>✨</span>{toast}</div>}
    </div>
  );
}
