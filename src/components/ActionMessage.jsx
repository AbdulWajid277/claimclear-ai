export default function ActionMessage({ tone = 'error', children, id }) {
  if (!children) return null;
  return (
    <p
      id={id}
      className={`action-message ${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}
