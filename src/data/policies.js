export const policyData = [
  {
    id: 'auto-comprehensive',
    source: 'Based on sample auto policy section, Comprehensive Coverage',
    keywords: ['comprehensive', 'deductible', 'theft', 'glass', 'windshield', 'vandalism'],
    answer:
      'Comprehensive coverage handles non-collision events like theft, vandalism, and glass damage. It carries a $250 deductible, separate from your $500 collision deductible.',
  },
  {
    id: 'auto-collision',
    source: 'Based on sample auto policy section, Collision Coverage',
    keywords: ['collision', 'accident', 'crash', 'hit', 'car accident'],
    answer:
      'Collision coverage pays for damage to your vehicle from an accident, regardless of fault, after your $500 deductible. Liability for the other party is handled separately.',
  },
  {
    id: 'windshield',
    source: 'Based on sample auto policy section, Glass Coverage',
    keywords: ['windshield', 'crack', 'chip', 'glass claim'],
    answer:
      'Windshield and glass claims fall under comprehensive coverage with a $250 deductible, and many are approved same-day once photos and a repair estimate are on file.',
  },
  {
    id: 'home-storm',
    source: 'Based on sample homeowners policy section, Storm and Weather Damage',
    keywords: ['storm', 'wind', 'hail', 'roof', 'flood', 'weather'],
    answer:
      'Storm damage to your home is covered under Peril: Windstorm and Hail, with a $1,000 deductible. Claims typically take 7–10 business days due to an onsite inspection.',
  },
  {
    id: 'theft',
    source: 'Based on sample homeowners policy section, Theft and Burglary',
    keywords: ['theft', 'stolen', 'burglary', 'break in', 'robbed'],
    answer:
      'Theft claims are covered under your personal property section up to your policy limit. A police report and a list of stolen items with value are required to file.',
  },
  {
    id: 'documents-general',
    source: 'Based on sample claims handbook, Filing Requirements',
    keywords: ['document', 'documents', 'paperwork', 'need to file', 'what do i need', 'required'],
    answer:
      'Required documents depend on the claim type. Open the Documents tab and select Auto Collision, Windshield, Home Storm Damage, or Theft for the full checklist.',
  },
  {
    id: 'status-general',
    source: 'Based on sample claims handbook, Timelines',
    keywords: ['status', 'how long', 'when will', 'update on my claim', 'progress', 'timeline'],
    answer:
      'You can check real-time status in the Claim Status tab using your claim number and last name. Most claims move from In Review to a decision within 5–7 business days.',
  },
  {
    id: 'renewal',
    source: 'Based on sample policy administration guide',
    keywords: ['renew', 'renewal', 'cancel', 'non-renew', 'premium'],
    answer:
      "Renewal and premium questions are handled by underwriting, not claims. I'd recommend escalating this to an agent so they can pull up your account directly.",
  },
  {
    id: 'greeting',
    source: 'ClaimClear assistant',
    keywords: ['hello', 'hi', 'hey'],
    answer:
      "Hi, I'm ClaimClear. I can help with coverage questions, required documents, or your claim status. What do you need?",
  },
  {
    id: 'thanks',
    source: 'ClaimClear assistant',
    keywords: ['thank', 'thanks'],
    answer: "You're welcome. Anything else I can help with?",
  },
];

export const ESCALATION_TRIGGER_WORDS = [
  'complex',
  'not sure',
  'complicated',
  'confusing',
  'frustrated',
  'speak to someone',
  'speak to a person',
  'speak to a human',
  'talk to someone',
  'talk to a person',
  'talk to a human',
  'talk to an agent',
  'human agent',
  'human adjuster',
  'real person',
  'real human',
];
