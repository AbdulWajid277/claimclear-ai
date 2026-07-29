/**
 * ClaimClear AI — 3–5 minute product demo screen recording.
 * Covers every tab, button, form path, validation, and keyboard navigation.
 *
 * Usage: node scripts/record-demo.mjs
 * Output: demo/ClaimClear-AI-Demo.webm
 */
import { chromium } from 'playwright';
import { mkdirSync, renameSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'demo');
const BASE = process.env.DEMO_URL || 'http://localhost:5173';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** Stretch timing so the finished recording lands in the 3–5 minute window. */
const SCALE = 1.75;

async function pause(page, ms = 900) {
  await sleep(Math.round(ms * SCALE));
}

async function narrate(page, text, holdMs = 2200) {
  holdMs = Math.round(holdMs * SCALE);
  await page.evaluate((t) => {
    let el = document.getElementById('demo-narration');
    if (!el) {
      el = document.createElement('div');
      el.id = 'demo-narration';
      el.setAttribute('aria-live', 'polite');
      Object.assign(el.style, {
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '16px',
        zIndex: '99999',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(18, 28, 38, 0.92)',
        color: '#f4f7fb',
        fontFamily: 'IBM Plex Mono, Consolas, monospace',
        fontSize: '14px',
        lineHeight: '1.4',
        boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
        pointerEvents: 'none',
        border: '1px solid rgba(255,255,255,0.12)',
      });
      document.body.appendChild(el);
    }
    el.textContent = t;
  }, text);
  await sleep(holdMs);
}

async function clearNarration(page) {
  await page.evaluate(() => {
    const el = document.getElementById('demo-narration');
    if (el) el.remove();
  });
}

async function highlight(page, selector, ms = 700) {
  await page.evaluate(
    ({ selector, ms }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const prev = el.style.outline;
      const prevOff = el.style.outlineOffset;
      el.style.outline = '3px solid #e8a54b';
      el.style.outlineOffset = '3px';
      setTimeout(() => {
        el.style.outline = prev;
        el.style.outlineOffset = prevOff;
      }, ms);
    },
    { selector, ms },
  );
  await pause(page, ms);
}

async function typeSlow(page, selector, text, delay = 35) {
  await page.click(selector);
  await page.fill(selector, '');
  await page.type(selector, text, { delay });
}

function findNewestWebm(dir) {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => ({ f, t: statSync(join(dir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  return files[0] ? join(dir, files[0].f) : null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const videoDir = join(OUT_DIR, '_raw');
  mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  console.log(`Opening ${BASE}…`);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await pause(page, 1200);

  // —— Title / intro ——
  await narrate(
    page,
    'ClaimClear AI demo — proving stability, validation, security limits, and keyboard access (simulated demo · no real data).',
    3200,
  );

  // —— Keyboard: skip link + tab nav ——
  await narrate(page, 'Keyboard navigation: Tab reveals Skip to main content, then Enter jumps to the main panel.', 1800);
  await page.keyboard.press('Tab');
  await pause(page, 700);
  await highlight(page, '.skip-link', 900);
  await page.keyboard.press('Enter');
  await pause(page, 900);

  await narrate(page, 'Continuing Tab order through About and the main sidebar tabs.', 1600);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    await pause(page, 280);
  }

  // —— About ——
  await narrate(page, 'Header: About this tool explains the simulated Northfield Mutual assistant.', 1800);
  await page.getByRole('button', { name: 'About this tool' }).click();
  await pause(page, 2000);
  await page.getByRole('button', { name: 'About this tool' }).click();
  await pause(page, 700);

  // —— Chat valid ——
  await narrate(page, 'Chat — valid inputs via quick prompts and typed questions.', 2000);
  await page.getByRole('button', { name: "What's my deductible?" }).click();
  await pause(page, 1800);

  await page.getByRole('button', { name: 'What documents do I need?' }).click();
  await pause(page, 1800);

  await narrate(page, 'Typing a coverage question and sending with Enter (keyboard).', 1600);
  await typeSlow(page, '#chatInput', 'What about windshield crack coverage?');
  await page.keyboard.press('Enter');
  await pause(page, 1800);

  await typeSlow(page, '#chatInput', 'hello');
  await page.getByRole('button', { name: 'Send' }).click();
  await pause(page, 1400);

  await narrate(page, 'Storm and theft keywords also return policy-matched answers.', 1600);
  await typeSlow(page, '#chatInput', 'storm roof hail damage');
  await page.keyboard.press('Enter');
  await pause(page, 1800);
  await typeSlow(page, '#chatInput', 'thanks');
  await page.getByRole('button', { name: 'Send' }).click();
  await pause(page, 1400);

  await narrate(page, 'Top “Escalate to human agent” button is always available from Chat.', 1600);
  await page.locator('.escalate-btn-top').click();
  await pause(page, 1600);
  await page.getByRole('button', { name: 'Chat', exact: true }).click();
  await pause(page, 800);

  // —— Chat invalid ——
  await narrate(page, 'Chat — invalid: empty Send shows an inline validation error.', 1800);
  await page.fill('#chatInput', '');
  await page.getByRole('button', { name: 'Send' }).click();
  await pause(page, 2000);

  await narrate(page, 'Chat — length security: messages over 2000 characters are rejected.', 1800);
  // maxLength is 2001 so one char over the 2000 processing limit still reaches React validation
  await page.locator('#chatInput').fill('x'.repeat(2001));
  await page.getByRole('button', { name: 'Send' }).click();
  await pause(page, 2200);
  await page.locator('#chatInput').fill('');
  await pause(page, 400);

  // —— Low confidence / escalate CTA ——
  await narrate(page, 'Chat — unmatched / complex queries trigger low-confidence escalation guidance.', 2000);
  await page.getByRole('button', { name: 'A complex situation' }).click();
  await pause(page, 2000);

  await typeSlow(page, '#chatInput', 'asdf qwerty xyzzz unknown topic');
  await page.getByRole('button', { name: 'Send' }).click();
  await pause(page, 1800);

  await narrate(page, 'Inline “Connect me to an agent” opens Escalate with the chat transcript.', 1800);
  await page.getByRole('button', { name: 'Connect me to an agent' }).first().click();
  await pause(page, 2200);

  // Back to chat via sidebar for footer escalate
  await page.getByRole('button', { name: 'Chat', exact: true }).click();
  await pause(page, 800);
  await narrate(page, 'Footer escalate link also routes to human handoff.', 1600);
  await page.locator('.escalate-footer button').click();
  await pause(page, 1600);

  // —— Documents ——
  await narrate(page, 'Documents — claim-type pills and checklist progress with completion state.', 2200);
  await page.getByRole('button', { name: 'Documents' }).click();
  await pause(page, 1200);

  const types = ['Auto Collision', 'Windshield', 'Home Storm Damage', 'Theft'];
  for (const type of types) {
    await page.getByRole('button', { name: type, exact: true }).click();
    await pause(page, 700);
  }

  await page.getByRole('button', { name: 'Auto Collision', exact: true }).click();
  await pause(page, 600);
  await narrate(page, 'Checking every required document until the checklist completes.', 1600);
  const boxes = page.locator('#docList input[type="checkbox"]');
  const count = await boxes.count();
  for (let i = 0; i < count; i++) {
    await boxes.nth(i).check();
    await pause(page, 350);
  }
  await pause(page, 1600);

  await page.getByRole('button', { name: 'Windshield', exact: true }).click();
  await pause(page, 500);
  const wBoxes = page.locator('#docList input[type="checkbox"]');
  const wCount = await wBoxes.count();
  for (let i = 0; i < wCount; i++) {
    await wBoxes.nth(i).check();
    await pause(page, 300);
  }
  await pause(page, 1000);

  // —— Claim Status invalid ——
  await narrate(page, 'Claim Status — form validation for empty, partial, and not-found lookups.', 2200);
  await page.getByRole('button', { name: 'Claim Status' }).click();
  await pause(page, 1000);

  await page.getByRole('button', { name: 'Look up claim' }).click();
  await pause(page, 1600);

  await typeSlow(page, '#claimInput', 'CLM-10234', 40);
  await page.getByRole('button', { name: 'Look up claim' }).click();
  await pause(page, 1500);

  await page.fill('#claimInput', '');
  await typeSlow(page, '#lastNameInput', 'Vance', 40);
  await page.getByRole('button', { name: 'Look up claim' }).click();
  await pause(page, 1500);

  await typeSlow(page, '#claimInput', 'CLM-99999', 40);
  await page.fill('#lastNameInput', 'Vance');
  await page.getByRole('button', { name: 'Look up claim' }).click();
  await pause(page, 1600);

  await typeSlow(page, '#claimInput', 'CLM-10234', 40);
  await page.fill('#lastNameInput', 'Smith');
  await page.getByRole('button', { name: 'Look up claim' }).click();
  await pause(page, 1600);

  // —— Claim Status valid (all samples) ——
  await narrate(page, 'Valid lookups — sample claims across review, approved, info-needed, and denied.', 2200);
  const samples = [
    ['CLM-10234', 'Vance'],
    ['clm-58821', 'alvarez'], // case-insensitive
    ['CLM-77410', 'Chen'],
    ['CLM-90045', 'Boateng'],
  ];
  for (const [num, name] of samples) {
    await page.fill('#claimInput', '');
    await page.fill('#lastNameInput', '');
    await typeSlow(page, '#claimInput', num, 30);
    await typeSlow(page, '#lastNameInput', name, 30);
    await page.keyboard.press('Enter');
    await pause(page, 1700);
  }

  // —— Escalate ——
  await narrate(page, 'Escalate — optional fields, transcript sharing, and simulated agent queue.', 2200);
  await page.getByRole('button', { name: 'Escalate' }).click();
  await pause(page, 1600);

  await narrate(page, 'Submitting with empty optional fields still queues a human adjuster.', 1800);
  await page.getByRole('button', { name: 'Connect me to an agent' }).click();
  await pause(page, 2200);

  // Reset form fields and submit with details
  await page.fill('#escName', '');
  await page.fill('#escClaim', '');
  await page.fill('#escReason', '');
  await narrate(page, 'Submitting with name, claim number, and a note attached to the ticket.', 1800);
  await typeSlow(page, '#escName', 'Jordan Vance', 35);
  await typeSlow(page, '#escClaim', 'CLM-10234', 35);
  await typeSlow(page, '#escReason', 'Need help reviewing a denial and next steps.', 25);
  await page.getByRole('button', { name: 'Connect me to an agent' }).click();
  await pause(page, 2800);

  // —— Security / demo badge ——
  await narrate(
    page,
    'Security posture: client-side length caps, sanitized strings, ErrorBoundaries, and no real PII/backend — demo badge always visible.',
    3200,
  );
  await highlight(page, '.demo-badge', 1200);

  // —— Final tour of tabs ——
  await narrate(page, 'Final pass: every section remains responsive after the full workout.', 1800);
  for (const label of ['Chat', 'Documents', 'Claim Status', 'Escalate']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await pause(page, 700);
  }

  await narrate(
    page,
    'Demo complete — ClaimClear AI is stable, validated, and ready for review.',
    3500,
  );
  await clearNarration(page);
  await pause(page, 800);

  await page.close();
  await context.close();
  await browser.close();

  const raw = findNewestWebm(videoDir);
  if (!raw) {
    throw new Error('No webm video was produced.');
  }
  const dest = join(OUT_DIR, 'ClaimClear-AI-Demo.webm');
  if (existsSync(dest)) {
    try {
      renameSync(dest, join(OUT_DIR, `ClaimClear-AI-Demo-prev-${Date.now()}.webm`));
    } catch {
      /* ignore */
    }
  }
  renameSync(raw, dest);
  const sizeMb = (statSync(dest).size / (1024 * 1024)).toFixed(2);
  console.log(`\nSaved: ${dest} (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
