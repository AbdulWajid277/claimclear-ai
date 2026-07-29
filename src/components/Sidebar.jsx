const TABS = [
  {
    id: 'chat',
    label: 'Chat',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M2 3.5C2 2.67 2.67 2 3.5 2h9c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5H8l-3 2.5v-2.5H3.5C2.67 11 2 10.33 2 9.5v-6z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'docs',
    label: 'Documents',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4 2h6l3 3v8.5A.5.5 0 0112.5 14h-9a.5.5 0 01-.5-.5v-11A.5.5 0 013.5 2H4z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 7h5M5.5 9.3h5M5.5 11.6h3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'status',
    label: 'Claim Status',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="4.3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10.2 10.2L13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'escalate',
    label: 'Escalate',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="5.3" r="2.3" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M3 13.5c0-2.5 2.2-4 5-4s5 1.5 5 4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Sidebar({ activeTab, onSwitchTab }) {
  return (
    <nav className="sidebar" aria-label="Main">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => onSwitchTab(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
