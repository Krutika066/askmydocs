import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient = null;
let currentApiKey = null;

export function initGemini(apiKey) {
  currentApiKey = apiKey;
  geminiClient = new GoogleGenerativeAI(apiKey);
  localStorage.setItem('askmydocs_api_key', apiKey);
}

export function getStoredApiKey() {
  return localStorage.getItem('askmydocs_api_key') || '';
}

export function isGeminiReady() {
  return !!geminiClient;
}

export async function listAvailableModels() {
  if (!geminiClient) return ['Gemini not initialized'];
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${currentApiKey}`);
    const data = await response.json();
    console.log('Available Models:', data);
    return data.models ? data.models.map(m => m.name.replace('models/', '')) : ['No models found'];
  } catch (e) {
    console.error('List models failed:', e);
    return ['Error listing models'];
  }
}

async function callGemini(prompt) {
  if (!geminiClient) throw new Error('Gemini not initialized. Please enter your API key.');
  
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-pro'
  ];

  let lastError = null;
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  for (const modelName of modelsToTry) {
    let retries = 3;
    while (retries > 0) {
      try {
        console.log(`Trying Gemini model: ${modelName} (Retries left: ${retries})...`);
        const model = geminiClient.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) return text;
      } catch (error) {
        lastError = error;
        const msg = error.message.toLowerCase();
        
        // Handle Rate Limit (429) or Overloaded (503)
        if (msg.includes('429') || msg.includes('quota') || msg.includes('503') || msg.includes('overloaded')) {
          console.warn(`Rate limit/Overload on ${modelName}. Retrying in 3s...`);
          await delay(3000);
          retries--;
          continue;
        }

        // If it's a 404/not found, we move to the NEXT model immediately
        if (msg.includes('404') || msg.includes('not found')) {
          console.warn(`${modelName} not found, skipping.`);
          break; // Break while, move to next modelName
        }

        // Other errors (invalid key, etc.) should throw immediately
        throw error;
      }
    }
  }

  throw lastError || new Error('Gemini is currently busy or unavailable. Please wait 30 seconds and try again.');
}

function cleanAndParseJSON(raw) {
  try {
    // 1. Remove markdown code blocks if present (```json ... ```)
    let cleaned = raw.replace(/```json\s?|```/g, '').trim();
    
    // 2. Find the first [ or { and last ] or }
    const firstBracket = cleaned.indexOf('[');
    const firstBrace = cleaned.indexOf('{');
    const startIdx = (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) ? firstBracket : firstBrace;
    
    const lastBracket = cleaned.lastIndexOf(']');
    const lastBrace = cleaned.lastIndexOf('}');
    const endIdx = Math.max(lastBracket, lastBrace);

    if (startIdx === -1 || endIdx === -1) throw new Error('No JSON structure found');
    
    cleaned = cleaned.substring(startIdx, endIdx + 1);

    // 3. Remove trailing commas in arrays/objects (common LLM error)
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON Clean/Parse Failed:', e, '\nRaw was:', raw);
    throw new Error('The AI returned an invalid format. Please try again.');
  }
}

export async function generateAIResponse(userText, docName, docContent, mode) {
  const docPreview = docContent.substring(0, 15000);

  if (mode === 'flashcard') {
    const prompt = `You are AskMyDocs Pro. Based ONLY on the document below, generate exactly 10 flashcard pairs in valid JSON format.

DOCUMENT NAME: ${docName}
DOCUMENT CONTENT:
---
${docPreview}
---

Output ONLY a valid JSON array with this exact format:
[
  {"id": 1, "front": "Short question?", "back": "Concise answer."}
]`;

    const raw = await callGemini(prompt);
    const cards = cleanAndParseJSON(raw);
    return { data: cards, text: '' };
  }

  if (mode === 'mcq') {
    const prompt = `You are AskMyDocs Pro. Generate 8 MCQs from the document in JSON format.

DOCUMENT NAME: ${docName}
DOCUMENT CONTENT:
---
${docPreview}
---

Output ONLY a valid JSON array:
[
  {
    "id": 1,
    "question": "text?",
    "options": [{"label": "A", "text": "opt1"}, {"label": "B", "text": "opt2"}, {"label": "C", "text": "opt3"}, {"label": "D", "text": "opt4"}],
    "correct": "A"
  }
]`;

    const raw = await callGemini(prompt);
    const questions = cleanAndParseJSON(raw);
    return { data: questions, text: '' };
  }

  if (mode === 'notes') {
    const prompt = `You are AskMyDocs Pro. Create organized study notes from this document.

DOCUMENT NAME: ${docName}
DOCUMENT CONTENT:
---
${docPreview}
---

Format your response as JSON:
{
  "docName": "${docName}",
  "sections": [{"title": "Title", "points": ["point1", "point2"]}]
}`;

    const raw = await callGemini(prompt);
    const notes = cleanAndParseJSON(raw);
    return { data: notes, text: `📝 **Notes generated for "${docName}"!**` };
  }

  if (mode === 'keywords') {
    const prompt = `You are AskMyDocs Pro. Extract 12-15 keywords with definitions in JSON.

DOCUMENT NAME: ${docName}
DOCUMENT CONTENT:
---
${docPreview}
---

Output ONLY JSON array:
[{"term": "Keyword", "definition": "Def"}]`;

    const raw = await callGemini(prompt);
    const keywords = cleanAndParseJSON(raw);
    return { data: keywords, text: `🔑 **Keywords & Glossary for "${docName}"** are ready!` };
  }

  if (mode === 'questions') {
    const prompt = `You are AskMyDocs Pro. Generate 10 high-value exam questions in JSON.

DOCUMENT NAME: ${docName}
DOCUMENT CONTENT:
---
${docPreview}
---

Output ONLY JSON array:
[{"id": 1, "question": "Q?", "difficulty": "Easy"}]`;

    const raw = await callGemini(prompt);
    const questions = cleanAndParseJSON(raw);
    return { data: questions, text: `❓ **Important questions from "${docName}"** are ready!` };
  }

  // General Q&A
  const prompt = `You are AskMyDocs Pro, a warm and precise AI document assistant.

DOCUMENT NAME: ${docName}
DOCUMENT CONTENT:
---
${docPreview}
---

RULES:
- Answer ONLY based on the document content above
- Never fabricate or assume anything not in the document
- If not found, say: "This information is not available in the document."
- Use **bold** for key terms, names, numbers, and dates
- Start with a bold one-line direct answer
- Use bullet points for lists
- Add dividers (---) between sections
- Keep paragraphs short (2-3 lines max)
- End with: "Would you like me to elaborate or explore another aspect?"

USER QUESTION: ${userText}`;

  const text = await callGemini(prompt);
  return { text };
}
