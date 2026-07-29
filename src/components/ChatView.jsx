import { useEffect, useRef, useState } from 'react';
import ActionMessage from './ActionMessage';
import { MAX_CHAT_LENGTH } from '../utils/limits';

const QUICK_PROMPTS = [
  { label: "What's my deductible?", text: 'What is my deductible?' },
  { label: 'What documents do I need?', text: 'What documents do I need?' },
  { label: 'A complex situation', text: 'This is a complex situation' },
  { label: 'Talk to a human', text: 'I need to talk to a human agent' },
];

export default function ChatView({ messages, onSend, onEscalate }) {
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState('');
  const logRef = useRef(null);

  useEffect(() => {
    try {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    } catch (err) {
      console.error('chat scroll failed:', err);
    }
  }, [messages]);

  function handleSend() {
    try {
      const text = input.trim();
      if (!text) {
        setLocalError('Type a question before sending, or pick a suggestion below.');
        return;
      }
      if (text.length > MAX_CHAT_LENGTH) {
        setLocalError(
          `Please keep questions under ${MAX_CHAT_LENGTH} characters so ClaimClear can answer reliably.`,
        );
        return;
      }
      setLocalError('');
      setInput('');
      onSend(text);
    } catch (err) {
      console.error('ChatView handleSend failed:', err);
      setLocalError("Couldn't send that message. Please try again.");
    }
  }

  function handleChip(text) {
    try {
      setLocalError('');
      setInput('');
      onSend(text);
    } catch (err) {
      console.error('ChatView chip failed:', err);
      setLocalError("Couldn't use that suggestion. Try typing your question instead.");
    }
  }

  function handleEscalate() {
    try {
      setLocalError('');
      onEscalate();
    } catch (err) {
      console.error('ChatView escalate failed:', err);
      setLocalError("Couldn't open escalation. Use the Escalate tab in the sidebar.");
    }
  }

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <section className="view active" id="view-chat">
      <div className="view-header">
        <div>
          <h2>Ask ClaimClear</h2>
          <p>Coverage, documents, and claim questions — answered instantly.</p>
        </div>
        <button type="button" className="escalate-btn-top" onClick={handleEscalate}>
          Escalate to human agent
        </button>
      </div>

      <div className="chat-log" id="chatLog" ref={logRef}>
        {safeMessages.length === 0 ? (
          <ActionMessage tone="info">
            No messages yet. Ask a question to get started.
          </ActionMessage>
        ) : (
          safeMessages.map((msg, i) => (
            <div
              key={i}
              className={`msg ${msg?.sender === 'user' ? 'user' : 'bot'}${msg?.low ? ' low' : ''}`}
            >
              <div className="bubble">{msg?.text || '(Empty message)'}</div>
              {msg?.meta ? <div className="meta-tag">{msg.meta}</div> : null}
              {msg?.low ? (
                <button type="button" className="inline-escalate" onClick={handleEscalate}>
                  Connect me to an agent
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="chips">
        {QUICK_PROMPTS.map((chip) => (
          <button
            key={chip.text}
            type="button"
            className="chip"
            onClick={() => handleChip(chip.text)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {localError ? (
        <div className="view-inline-message">
          <ActionMessage id="chatInput-error">{localError}</ActionMessage>
        </div>
      ) : null}

      <div className="chat-input-row">
        <label className="field-label" htmlFor="chatInput">
          Your question
        </label>
        <div className="chat-input-controls">
          <input
            type="text"
            id="chatInput"
            placeholder="Type your question…"
            value={input}
            maxLength={MAX_CHAT_LENGTH + 1}
            aria-invalid={localError ? 'true' : undefined}
            aria-describedby={localError ? 'chatInput-error' : undefined}
            onChange={(e) => {
              setInput(e.target.value);
              if (localError) setLocalError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button type="button" className="send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>

      <div className="escalate-footer">
        <button type="button" onClick={handleEscalate}>
          Not finding what you need? Escalate to an agent →
        </button>
      </div>
    </section>
  );
}
