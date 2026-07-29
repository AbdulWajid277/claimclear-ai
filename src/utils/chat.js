import { policyData, ESCALATION_TRIGGER_WORDS } from '../data/policies';
import { MAX_CHAT_LENGTH, clampText, safeString } from './limits';

export function containsTriggerWord(lower) {
  if (!lower) return false;
  const triggers = Array.isArray(ESCALATION_TRIGGER_WORDS) ? ESCALATION_TRIGGER_WORDS : [];
  return triggers.some((w) => typeof w === 'string' && lower.includes(w));
}

export function matchAnswer(text) {
  const lower = safeString(text).toLowerCase();
  if (!lower) return null;

  let best = null;
  let bestScore = 0;
  const entries = Array.isArray(policyData) ? policyData : [];

  entries.forEach((entry) => {
    if (!entry || !Array.isArray(entry.keywords)) return;
    let score = 0;
    entry.keywords.forEach((k) => {
      if (typeof k === 'string' && lower.includes(k)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });

  return best;
}

export function buildBotResponse(rawText) {
  try {
    const { text } = clampText(rawText, MAX_CHAT_LENGTH);
    const lower = text.toLowerCase().trim();

    if (!lower) {
      return {
        text: "I didn't catch a question there. Try asking about coverage, documents, or claim status — or escalate if you'd rather talk to a person.",
        meta: 'Need a bit more detail',
        low: true,
      };
    }

    if (containsTriggerWord(lower)) {
      return {
        text: "This sounds like it may need a closer look than I can give from sample policy data. I'd rather connect you with a human adjuster who can review the specifics.",
        meta: 'Low confidence — escalation suggested',
        low: true,
      };
    }

    const match = matchAnswer(text);
    if (match?.answer) {
      return {
        text: match.answer,
        meta: match.source || 'ClaimClear assistant',
        low: false,
      };
    }

    return {
      text: "I'm not confident I can answer that accurately from the sample policy data I have. Rather than guess, I'd rather connect you with a human adjuster who can help.",
      meta: 'Low confidence — no match found',
      low: true,
    };
  } catch (err) {
    console.error('buildBotResponse failed:', err);
    return {
      text: "Something went wrong while answering that. Please try again, or escalate to a human adjuster so they can help directly.",
      meta: 'Temporary problem — try again or escalate',
      low: true,
    };
  }
}
