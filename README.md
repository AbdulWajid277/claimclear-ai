# ClaimClear AI

Simulated claims assistant demo for Northfield Mutual. Policyholders can ask coverage questions, check required documents, look up claim status, and escalate to a human adjuster.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Demo data

- Claim lookups: `CLM-10234` / Vance, `CLM-58821` / Alvarez, `CLM-77410` / Chen, `CLM-90045` / Boateng
- Chat answers are keyword-matched against sample policy snippets in `src/data/policies.js`
