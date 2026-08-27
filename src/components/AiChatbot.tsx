import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const AiChatbot: React.FC = () => {
  const { 
    geminiApiKey, 
    saveGeminiApiKey, 
    chatMessages, 
    sendChatMessage, 
    clearChat, 
    isAiGenerating 
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [showApiKeySetting, setShowApiKeySetting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isAiGenerating) return;
    const txt = inputMsg;
    setInputMsg('');
    await sendChatMessage(txt);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveGeminiApiKey(apiKeyInput.trim());
    setShowApiKeySetting(false);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiGenerating]);

  return (
    <section id="chatView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>NutriMe AI Assistant</h1>
          <p>Ask nutrition questions, plan custom local meals, or get instant recipe details.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowApiKeySetting(!showApiKeySetting)}
          >
            <i className="fas fa-key"></i> {geminiApiKey ? 'Change API Key' : 'Configure Gemini API'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={clearChat}>
            <i className="fas fa-trash-alt"></i> Clear Logs
          </button>
        </div>
      </div>

      {/* API Key Modal/Card settings toggles */}
      {showApiKeySetting && (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>
            <i className="fas fa-key" style={{ color: 'var(--color-secondary)' }}></i> Configure Gemini Pro/Flash API Key
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Get a free API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Google AI Studio</a>. Once entered, the chatbot queries Gemini directly from your browser (key is saved only in local storage).
          </p>
          <form onSubmit={handleSaveKey} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Paste AI Studio Key here..."
              style={{ flex: 1 }}
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Save Key</button>
          </form>
        </div>
      )}

      {/* Main chat window container */}
      <div className="card" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '62vh', 
        maxHeight: '650px',
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* Messages Body */}
        <div style={{ 
          flex: 1, 
          padding: '1.5rem', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {chatMessages.map(msg => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id}
                style={{
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                <div style={{
                  background: isAi ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, var(--color-primary), #059669)',
                  border: isAi ? '1px solid var(--surface-border)' : 'none',
                  borderRadius: isAi ? '0 var(--radius-md) var(--radius-md) var(--radius-md)' : 'var(--radius-md) 0 var(--radius-md) var(--radius-md)',
                  padding: '1rem 1.25rem',
                  color: 'white',
                  fontSize: '0.92rem',
                  whiteSpace: 'pre-wrap',
                  boxShadow: isAi ? 'none' : '0 4px 10px rgba(16, 185, 129, 0.15)',
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--text-muted)', 
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  padding: '0 0.25rem'
                }}>
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* AI Generating typing loader */}
          {isAiGenerating && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.35rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)' }}>
              <span style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0s', width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%' }}></span>
              <span style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.2s', width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%' }}></span>
              <span style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.4s', width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%' }}></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer Area */}
        <form onSubmit={handleSend} style={{ 
          padding: '1.25rem', 
          borderTop: '1px solid var(--surface-border)', 
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder={isAiGenerating ? "AI assistant is generating response..." : "Ask: 'Suggest a local Kigali dinner split'..."}
            style={{ flex: 1 }}
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            disabled={isAiGenerating}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isAiGenerating || !inputMsg.trim()}
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>

      {/* CSS bouncing dots definition */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </section>
  );
};
export default AiChatbot;
