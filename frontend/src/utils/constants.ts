// Debate timing constants (seconds) — match 01_Debate_Rule.md
export const TIMER = {
  PREP_INITIAL: 7 * 60, // 7 minutes
  SPEECH: 4 * 60, // 4 minutes
  CROSS_EXAM_PER_TEAM: 3 * 60, // 3 minutes per team
  JUDGE_FEEDBACK: 5 * 60, // 3-5 minutes (max 5)
  PREP_BETWEEN: 1 * 60, // 1 minute
} as const;

// Cross Examination limits
export const CE = {
  MAX_QUESTIONS_PER_TEAM: 2,
} as const;

// Scoring criteria (01_Debate_Rule §13)
export const SCORE_CRITERIA = [
  { key: 'logic', label: 'Logic & Reasoning', max: 30 },
  { key: 'rebuttal', label: 'Rebuttal Quality', max: 20 },
  { key: 'evidence', label: 'Evidence & Examples', max: 15 },
  { key: 'crossExam', label: 'Cross Examination', max: 15 },
  { key: 'strategy', label: 'Strategy & Consistency', max: 10 },
  { key: 'communication', label: 'Communication & Clarity', max: 10 },
] as const;

// Speaker turn order (3v3)
export const TURN_ORDER = [
  'PRO_S1',
  'OPP_S1',
  'PRO_S2',
  'OPP_S2',
  'PRO_S3',
  'OPP_S3',
] as const;
