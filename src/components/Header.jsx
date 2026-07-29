export default function Header({ onToggleAbout }) {
  return (
    <header className="top">
      <div className="brand">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="32" height="32" rx="8" stroke="#1B2A4A" strokeWidth="1.5" />
          <path
            d="M9 17.5L14.2 22.5L25 11"
            stroke="#146B5D"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <h1>ClaimClear AI</h1>
          <p>Northfield Mutual · Claims Assistant</p>
        </div>
      </div>
      <div className="top-right">
        <span className="demo-badge">Simulated demo · no real data</span>
        <button type="button" className="about-link" onClick={onToggleAbout}>
          About this tool
        </button>
      </div>
    </header>
  );
}
