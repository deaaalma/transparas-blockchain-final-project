import React, { useState, useRef, useEffect } from 'react';
import { useChatGroq } from './useChatGroq';
import './ChatWidget.css';

// Komponen animasi typing dots
function TypingDots() {
  return (
    <div className="cw-message cw-message--assistant">
      <div className="cw-bubble cw-bubble--assistant">
        <span className="cw-typing-dots">
          <span /><span /><span />
        </span>
      </div>
    </div>
  );
}

// Komponen satu baris pesan
function MessageBubble({ role, content }: { role: string; content: string }) {
  return (
    <div className={`cw-message cw-message--${role} cw-message--enter`}>
      {role === 'assistant' && (
        <div className="cw-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      <div className={`cw-bubble cw-bubble--${role}`}>
        {content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < content.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
    </div>
  );
}

interface ChatWidgetProps {
  systemPrompt: string;
  initialMessage: string;
}

export default function ChatWidget({ systemPrompt, initialMessage }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [hasOpened, setHasOpened] = useState(false);
  const [isTypingInitial, setIsTypingInitial] = useState(false);
  const [showInitial, setShowInitial] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, loading, sendMessage, resetChat } = useChatGroq(systemPrompt);

  // Auto-scroll saat pesan baru masuk
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input saat panel dibuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      
      // Animasi ngetik untuk pesan awal saat pertama buka
      if (!hasOpened) {
        setHasOpened(true);
        setIsTypingInitial(true);
        setTimeout(() => {
          setIsTypingInitial(false);
          setShowInitial(true);
        }, 1500); // 1.5 detik pura-pura ngetik
      }
    }
  }, [isOpen, hasOpened]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="cw-container">
      {/* Panel chat */}
      <div className={`cw-panel ${isOpen ? 'cw-panel--open' : ''}`} aria-hidden={!isOpen}>
        {/* Header */}
        <div className="cw-header">
          <div className="cw-header-info">
            <div className="cw-status-dot" />
            <div>
              <div className="cw-header-title">TransParas AI</div>
              <div className="cw-header-sub">Asisten Laporan Keuangan</div>
            </div>
          </div>
          <div className="cw-header-actions">
            <button
              className="cw-icon-btn"
              onClick={resetChat}
              title="Reset chat"
              aria-label="Reset chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="cw-icon-btn"
              onClick={() => setIsOpen(false)}
              title="Tutup"
              aria-label="Tutup chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Pesan */}
        <div className="cw-messages" role="log" aria-live="polite">
          {/* Efek mengetik pesan awal */}
          {isTypingInitial && <TypingDots />}

          {/* Pesan pembuka otomatis */}
          {showInitial && initialMessage && (
            <MessageBubble role="assistant" content={initialMessage} />
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}

          {loading && <TypingDots />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="cw-input-area">
          <textarea
            ref={inputRef}
            className="cw-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya tentang laporan ini..."
            rows={1}
            disabled={loading}
            aria-label="Pesan"
          />
          <button
            className="cw-send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            aria-label="Kirim pesan"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="cw-footer">Powered by Groq · llama-3.3-70b</div>
      </div>

      {/* Toggle button */}
      <button
        className={`cw-toggle ${isOpen ? 'cw-toggle--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Tutup asisten AI' : 'Buka asisten AI'}
      >
        {/* Icon chat */}
        <span className={`cw-toggle-icon ${isOpen ? 'cw-toggle-icon--hide' : 'cw-toggle-icon--show'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {/* Icon close */}
        <span className={`cw-toggle-icon ${isOpen ? 'cw-toggle-icon--show' : 'cw-toggle-icon--hide'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        {/* Pulse indicator (hanya saat chat belum pernah dibuka) */}
        {!hasOpened && <span className="cw-pulse" />}
      </button>
    </div>
  );
}
