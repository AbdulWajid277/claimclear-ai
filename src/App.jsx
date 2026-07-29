import { useCallback, useState } from 'react';
import Header from './components/Header';
import AboutPanel from './components/AboutPanel';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import DocumentsView from './components/DocumentsView';
import StatusView from './components/StatusView';
import EscalateView from './components/EscalateView';
import ErrorBoundary from './components/ErrorBoundary';
import ActionMessage from './components/ActionMessage';
import { buildBotResponse } from './utils/chat';
import { MAX_CHAT_LENGTH, clampText, safeString } from './utils/limits';

const TABS = new Set(['chat', 'docs', 'status', 'escalate']);

const INITIAL_MESSAGE = {
  sender: 'bot',
  text: "Hi, I'm ClaimClear. I can help with coverage questions, required documents, or your claim status. What do you need?",
  meta: 'ClaimClear assistant',
  low: false,
};

const FALLBACK_BOT = {
  sender: 'bot',
  text: "Something went wrong while answering that. Please try again, or escalate to a human adjuster.",
  meta: 'Temporary problem — try again or escalate',
  low: true,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([INITIAL_MESSAGE]);
  const [activeDocType, setActiveDocType] = useState('Auto Collision');
  const [checkedDocs, setCheckedDocs] = useState({});
  const [escalatePrefill, setEscalatePrefill] = useState('');
  const [appError, setAppError] = useState('');

  const clearAppError = useCallback(() => setAppError(''), []);

  function switchTab(tab) {
    try {
      if (!TABS.has(tab)) {
        setAppError("That section isn't available. Try Chat, Documents, Claim Status, or Escalate.");
        return;
      }
      setAppError('');
      setActiveTab(tab);
    } catch (err) {
      console.error('switchTab failed:', err);
      setAppError("Couldn't switch screens. Please try again.");
    }
  }

  function openEscalation(prefill = '') {
    try {
      setEscalatePrefill(safeString(prefill));
      setAppError('');
      setActiveTab('escalate');
    } catch (err) {
      console.error('openEscalation failed:', err);
      setAppError("Couldn't open escalation. Please use the Escalate tab in the sidebar.");
    }
  }

  function handleSend(rawText) {
    try {
      const trimmed = safeString(rawText).trim();
      if (!trimmed) {
        setAppError('Type a question before sending, or pick one of the suggested prompts.');
        return;
      }

      const { text, truncated } = clampText(trimmed, MAX_CHAT_LENGTH);
      setAppError(
        truncated
          ? `Your message was trimmed to ${MAX_CHAT_LENGTH} characters so ClaimClear can process it.`
          : '',
      );

      setChatHistory((prev) => [...prev, { sender: 'user', text, meta: '', low: false }]);

      window.setTimeout(() => {
        try {
          const response = buildBotResponse(text);
          setChatHistory((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: response?.text || FALLBACK_BOT.text,
              meta: response?.meta || FALLBACK_BOT.meta,
              low: Boolean(response?.low ?? true),
            },
          ]);
        } catch (err) {
          console.error('chat reply failed:', err);
          setChatHistory((prev) => [...prev, FALLBACK_BOT]);
          setAppError("We couldn't finish that reply. Try again or escalate to an agent.");
        }
      }, 250);
    } catch (err) {
      console.error('handleSend failed:', err);
      setAppError("We couldn't send that message. Please try again.");
    }
  }

  function toggleDoc(key, checked) {
    try {
      if (!key) {
        setAppError("Couldn't update that checklist item. Switch claim type and try again.");
        return;
      }
      setCheckedDocs((prev) => ({ ...prev, [key]: Boolean(checked) }));
      setAppError('');
    } catch (err) {
      console.error('toggleDoc failed:', err);
      setAppError("Couldn't update the checklist. Please try again.");
    }
  }

  function selectDocType(type) {
    try {
      if (!type) {
        setAppError('Choose a claim type to see its document checklist.');
        return;
      }
      setActiveDocType(type);
      setAppError('');
    } catch (err) {
      console.error('selectDocType failed:', err);
      setAppError("Couldn't switch document type. Please try again.");
    }
  }

  function resetAppState() {
    setActiveTab('chat');
    setAboutOpen(false);
    setChatHistory([INITIAL_MESSAGE]);
    setActiveDocType('Auto Collision');
    setCheckedDocs({});
    setEscalatePrefill('');
    setAppError('');
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-panel">
        Skip to main content
      </a>
      <Header
        onToggleAbout={() => {
          try {
            setAboutOpen((open) => !open);
            clearAppError();
          } catch (err) {
            console.error('toggleAbout failed:', err);
            setAppError("Couldn't open About. Refresh if this keeps happening.");
          }
        }}
      />
      <AboutPanel open={aboutOpen} />

      {appError ? (
        <div className="app-banner">
          <ActionMessage tone="error">{appError}</ActionMessage>
        </div>
      ) : null}

      <div className="body-grid">
        <Sidebar activeTab={activeTab} onSwitchTab={switchTab} />

        <main className="panel" id="main-panel" tabIndex={-1}>
          <ErrorBoundary onReset={resetAppState} key={activeTab}>
            {activeTab === 'chat' && (
              <ChatView messages={chatHistory} onSend={handleSend} onEscalate={openEscalation} />
            )}
            {activeTab === 'docs' && (
              <DocumentsView
                activeDocType={activeDocType}
                checkedDocs={checkedDocs}
                onSelectType={selectDocType}
                onToggleDoc={toggleDoc}
              />
            )}
            {activeTab === 'status' && <StatusView />}
            {activeTab === 'escalate' && (
              <EscalateView chatHistory={chatHistory} reasonPrefill={escalatePrefill} />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
