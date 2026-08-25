import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { useToast } from '../context/ToastContext';

export default function ChatPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am AURQO AI. How can I help you brainstorm, generate prompts, write scripts, or code today?'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputVal.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Here is a creative concept tailored to your request:\n\n✨ **AI Suggestion**: You can head over to our **Prompt to Video** or **Image to Video** studios to bring this vision to life with neural diffusion keyframes!`
      };
      setMessages((prev) => [...prev, aiReply]);
      showToast('New response from AURQO AI', 'Chat');
    }, 900);
  };

  return (
    <div className="view-container" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-heading">
        <div className="heading-row">
          <h1 className="main-title">AI Chat Assistant</h1>
          <span className="version-badge"><Icons.Sparkles /> Multi-Modal Pro</span>
        </div>
        <p className="main-subtitle">Brainstorm ideas, craft video prompts, write scripts, or ask any technical questions.</p>
      </div>

      {/* Chat Messages Box */}
      <div className="chat-window-card">
        <div className="chat-messages-container">
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble-row ${m.sender === 'user' ? 'user-row' : 'ai-row'}`}>
              <div className={`chat-avatar ${m.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                {m.sender === 'user' ? 'AR' : <Icons.Logo />}
              </div>
              <div className={`chat-bubble ${m.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-row ai-row">
              <div className="chat-avatar ai-avatar"><Icons.Logo /></div>
              <div className="chat-bubble ai-bubble" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="chat-input-bar">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message or prompt idea here..."
            className="chat-text-input"
          />
          <button type="submit" className="get-started-btn" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Send</span>
            <Icons.Send />
          </button>
        </form>
      </div>
    </div>
  );
}
