import { useEffect, useRef, useState } from 'react';
import ActionMessage from './ActionMessage';
import { MAX_ESCALATE_FIELD, MAX_ESCALATE_NOTE, clampText, safeString } from '../utils/limits';

export default function EscalateView({ chatHistory, reasonPrefill }) {
  const [name, setName] = useState('');
  const [claim, setClaim] = useState('');
  const [reason, setReason] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [error, setError] = useState('');
  const transcriptRef = useRef(null);

  useEffect(() => {
    try {
      if (reasonPrefill) {
        setReason(safeString(reasonPrefill).slice(0, MAX_ESCALATE_NOTE));
      }
    } catch (err) {
      console.error('escalate prefill failed:', err);
      setError("Couldn't apply the suggested note. You can still type one below.");
    }
  }, [reasonPrefill]);

  useEffect(() => {
    try {
      if (transcriptRef.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
      }
    } catch (err) {
      console.error('transcript scroll failed:', err);
    }
  }, [chatHistory]);

  function submitEscalation() {
    try {
      const trimmedName = clampText(name.trim(), MAX_ESCALATE_FIELD).text;
      const trimmedClaim = clampText(claim.trim(), MAX_ESCALATE_FIELD).text;
      const trimmedReason = clampText(reason.trim(), MAX_ESCALATE_NOTE).text;

      if (
        name.trim().length > MAX_ESCALATE_FIELD ||
        claim.trim().length > MAX_ESCALATE_FIELD
      ) {
        setError(`Name and claim number must be ${MAX_ESCALATE_FIELD} characters or fewer.`);
        setConfirmMsg('');
        return;
      }

      if (reason.trim().length > MAX_ESCALATE_NOTE) {
        setError(`Please keep your note under ${MAX_ESCALATE_NOTE} characters.`);
        setConfirmMsg('');
        return;
      }

      const waitTimes = [4, 6, 9, 11];
      const wait = waitTimes[Math.floor(Math.random() * waitTimes.length)] || 6;

      let msg = `You've been added to the queue for a human adjuster. Estimated wait time: ${wait} minutes.`;
      if (trimmedName) msg += ` We'll have your name (${trimmedName})`;
      if (trimmedClaim) {
        msg += trimmedName ? ' and' : " We'll have your";
        msg += ` claim number (${trimmedClaim})`;
      }
      if (trimmedName || trimmedClaim) msg += ' ready for the agent.';
      if (trimmedReason) msg += ' Your note has been attached to the ticket.';
      msg += ' The conversation summary above will also be shared.';

      setError('');
      setConfirmMsg(msg);
    } catch (err) {
      console.error('submitEscalation failed:', err);
      setConfirmMsg('');
      setError(
        "We couldn't submit that escalation. Please try again, or call Northfield Mutual if this continues.",
      );
    }
  }

  const history = Array.isArray(chatHistory) ? chatHistory : [];

  return (
    <section className="view active" id="view-escalate">
      <div className="view-header">
        <div>
          <h2>Talk to a Human Adjuster</h2>
          <p>ClaimClear keeps final decisions with your claims team.</p>
        </div>
      </div>
      <div className="escalate-body">
        <div className="escalate-intro">
          <b>We&apos;ll connect you to a human agent.</b> Below is a summary of this conversation
          so far — it will be shared with the adjuster who picks up your case.
        </div>

        <div className="transcript" id="transcript" ref={transcriptRef}>
          {history.length === 0 ? (
            <div className="transcript-empty">No chat messages yet this session.</div>
          ) : (
            history.map((entry, i) => (
              <div key={i} className={`transcript-row ${entry?.sender || 'bot'}`}>
                <div className="who">
                  {entry?.sender === 'user' ? 'You asked' : 'ClaimClear answered'}
                </div>
                <div>{entry?.text || '(No message text)'}</div>
              </div>
            ))
          )}
        </div>

        <div className="form-group">
          <label htmlFor="escName">Your name (optional)</label>
          <input
            type="text"
            id="escName"
            placeholder="Jordan Vance"
            value={name}
            maxLength={MAX_ESCALATE_FIELD}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'escalate-error' : undefined}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="escClaim">Claim number (optional)</label>
          <input
            type="text"
            id="escClaim"
            placeholder="CLM-10234"
            value={claim}
            maxLength={MAX_ESCALATE_FIELD}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'escalate-error' : undefined}
            onChange={(e) => {
              setClaim(e.target.value);
              if (error) setError('');
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="escReason">Anything else to add?</label>
          <textarea
            id="escReason"
            rows={3}
            placeholder="Optional additional detail…"
            value={reason}
            maxLength={MAX_ESCALATE_NOTE}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'escalate-error' : undefined}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <ActionMessage id="escalate-error">{error}</ActionMessage>

        <button type="button" className="escalate-submit" onClick={submitEscalation}>
          Connect me to an agent
        </button>

        <div className={`escalate-confirm${confirmMsg ? ' show' : ''}`} id="escalateConfirm">
          <span className="stamp review">Escalated</span>
          <p id="escalateConfirmText">{confirmMsg}</p>
        </div>
      </div>
    </section>
  );
}
