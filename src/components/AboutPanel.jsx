export default function AboutPanel({ open }) {
  return (
    <div id="aboutPanel" className={`about-panel${open ? ' show' : ''}`}>
      <strong>ClaimClear AI</strong> helps policyholders get fast, plain-language answers during
      the claims process without waiting on hold. Ask about your coverage, what documents you
      need, or the status of an existing claim, and get instant guidance. ClaimClear handles the
      repetitive questions so human adjusters can focus on the decisions that matter — and it
      always knows when to hand things off to a real person. This is a demo prototype using
      simulated data; no real policies or claims are connected.
    </div>
  );
}
