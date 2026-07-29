import { useState } from 'react';
import { claimData } from '../data/claims';
import ActionMessage from './ActionMessage';

export default function StatusView() {
  const [claimNumber, setClaimNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [claim, setClaim] = useState(null);

  function lookupClaim(evt) {
    try {
      evt.preventDefault();
      const rawClaim = claimNumber.trim().toUpperCase();
      const rawName = lastName.trim().toLowerCase();

      if (!rawClaim && !rawName) {
        setClaim(null);
        setError('Enter both a claim number and a last name to look up a claim.');
        return;
      }

      if (!rawClaim) {
        setClaim(null);
        setError('Enter a claim number (for example, CLM-10234).');
        return;
      }

      if (!rawName) {
        setClaim(null);
        setError('Enter the policyholder last name that matches the claim.');
        return;
      }

      if (rawClaim.length > 40 || rawName.length > 80) {
        setClaim(null);
        setError('That claim number or last name looks too long. Double-check and try again.');
        return;
      }

      const records = Array.isArray(claimData) ? claimData : [];
      if (records.length === 0) {
        setClaim(null);
        setError(
          "Claim lookup isn't available right now. Please escalate to an agent for help finding your claim.",
        );
        return;
      }

      const found = records.find(
        (c) =>
          c &&
          c.claimNumber === rawClaim &&
          typeof c.lastName === 'string' &&
          c.lastName.toLowerCase() === rawName,
      );

      if (!found) {
        setClaim(null);
        setError(
          'Claim not found. Double-check the claim number and last name, or escalate to an agent for help finding your claim.',
        );
        return;
      }

      setError('');
      setClaim(found);
    } catch (err) {
      console.error('lookupClaim failed:', err);
      setClaim(null);
      setError(
        "Something went wrong during lookup. Please try again, or escalate to an agent if it keeps failing.",
      );
    }
  }

  return (
    <section className="view active" id="view-status">
      <div className="view-header">
        <div>
          <h2>Claim Status Lookup</h2>
          <p>Enter your claim number and last name to see where things stand.</p>
        </div>
      </div>
      <div className="status-body">
        <form id="statusForm" onSubmit={lookupClaim}>
          <div className="lookup-row">
            <div className="lookup-field">
              <label className="field-label" htmlFor="claimInput">
                Claim number
              </label>
              <input
                type="text"
                id="claimInput"
                className="claim-input"
                placeholder="e.g. CLM-10234"
                autoComplete="off"
                value={claimNumber}
                maxLength={40}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? 'status-error' : undefined}
                onChange={(e) => {
                  setClaimNumber(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
            <div className="lookup-field">
              <label className="field-label" htmlFor="lastNameInput">
                Last name
              </label>
              <input
                type="text"
                id="lastNameInput"
                placeholder="e.g. Vance"
                autoComplete="off"
                value={lastName}
                maxLength={80}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? 'status-error' : undefined}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
          </div>
          <div className="lookup-row">
            <button type="submit">Look up claim</button>
          </div>
        </form>

        <p className="hint">
          Try a sample: <code>CLM-10234</code> / Vance · <code>CLM-58821</code> / Alvarez ·{' '}
          <code>CLM-77410</code> / Chen · <code>CLM-90045</code> / Boateng
        </p>

        <ActionMessage id="status-error">{error}</ActionMessage>

        <div className={`status-card${claim ? ' show' : ''}`} id="statusCard">
          {claim ? (
            <>
              <span className={`stamp ${claim.status || 'info'}`}>{claim.label || 'Status'}</span>
              <div className="status-meta">
                <div>
                  <b>Claim number:</b> {claim.claimNumber}
                </div>
                <div>
                  <b>Policyholder:</b> {claim.lastName}
                </div>
                <div>
                  <b>Claim type:</b> {claim.type || '—'}
                </div>
                <div>
                  <b>Last updated:</b> {claim.updated || '—'}
                </div>
              </div>
              <div className="status-next">
                <b>Next step:</b> {claim.next || 'Contact an adjuster for details.'}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
