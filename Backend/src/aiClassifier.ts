type Classification = {
  severityScore: number;
  recommendedRouting: string;
  matchedSignals: string[];
};

const criticalPhrases = [
  'total loss',
  'totaled',
  'rollover',
  'rolled over',
  'fire',
  'airbag deployed',
  'trapped',
  'unresponsive',
  'fatality',
  'multiple vehicles',
];

const severePhrases = [
  'undrivable',
  'won\'t start',
  'wont start',
  'cannot drive',
  'can\'t drive',
  'engine damage',
  'frame damage',
  'fuel leak',
  'smoke',
  'axle',
];

const moderatePhrases = [
  'broken windshield',
  'bumper damage',
  'collision',
  'side-swipe',
  'sideswipe',
  'radiator',
  'headlight smashed',
  'door damage',
];

const minorPhrases = [
  'scratch',
  'small dent',
  'minor scrape',
  'cosmetic',
  'chip',
  'scuff',
];

function countMatches(text: string, phrases: string[]): string[] {
  return phrases.filter((phrase) => text.includes(phrase));
}

export function classifyIncident(description: string, towingRequired: boolean): Classification {
  const text = description.toLowerCase();

  const criticalHits = countMatches(text, criticalPhrases);
  const severeHits = countMatches(text, severePhrases);
  const moderateHits = countMatches(text, moderatePhrases);
  const minorHits = countMatches(text, minorPhrases);

  let score = 1;
  score += criticalHits.length * 4;
  score += severeHits.length * 3;
  score += moderateHits.length * 2;
  score += minorHits.length * 1;

  const severityScore = Math.min(5, score);

  let recommendedRouting: string;
  const needsTowingSignal = criticalHits.length > 0 || severeHits.length > 0 || towingRequired;

  if (needsTowingSignal || severityScore >= 4) {
    recommendedRouting = 'Immediate Towing';
  } else if (severityScore === 3) {
    recommendedRouting = 'Desktop Assessment';
  } else {
    recommendedRouting = 'Standard Panel-Beater Repair';
  }

  return {
    severityScore,
    recommendedRouting,
    matchedSignals: [...criticalHits, ...severeHits, ...moderateHits, ...minorHits],
  };
}