import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m InsureBot 🤖 Your AI-powered insurance assistant. I can answer questions about your policy coverage, claims process, premiums, and more. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, session_id: 'demo' })
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I could not connect to the server. Please make sure the API is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">InsureBot</span>
        </div>
        <div className="sidebar-subtitle">AI Insurance Assistant</div>
        <div className="divider" />
        <div className="sidebar-section">Quick Questions</div>
        {[
          'What is my dental coverage?',
          'How do I file a claim?',
          'What is my monthly premium?',
          'What does travel insurance cover?',
          'What are my life insurance benefits?'
        ].map((q, i) => (
          <button key={i} className="quick-btn" onClick={() => setInput(q)}>
            {q}
          </button>
        ))}
        <div className="divider" />
        <div className="sidebar-footer">
          <div className="policy-badge">📄 ACME Insurance</div>
          <div className="policy-badge">👤 John Doe</div>
          <div className="policy-badge">📍 Ontario, Canada</div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <span className="header-title">Policy Assistant</span>
            <span className="header-status">● Online</span>
          </div>
          <div className="header-right">
            <span className="header-policy">Policy #ACME-ON-2024-48291</span>
          </div>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="avatar">🤖</div>
              )}
              <div className="bubble">
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="avatar user-avatar">👤</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="avatar">🤖</div>
              <div className="bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your insurance policy..."
            rows={1}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;