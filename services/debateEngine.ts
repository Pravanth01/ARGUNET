
export interface ScoringResult {
  score: number;
  reasoning: string;
}

/**
 * Deterministic local scoring engine.
 * No AI involved. Evaluates based on structural markers and content depth.
 */
export const calculateScore = async (
  argument: string
): Promise<ScoringResult> => {
  // Artificial wait for UX feedback
  await new Promise(resolve => setTimeout(resolve, 600));

  const content = argument.trim();
  const words = content.split(/\s+/).length;
  const chars = content.length;
  
  let score = 3; // Base minimum score

  // Length and depth scaling
  if (words > 15) score += 2;
  if (words > 40) score += 2;
  if (chars > 300) score += 1;

  // Structural markers (simulating logical rigor)
  const logicalMarkers = ['because', 'therefore', 'however', 'consequently', 'evidence', 'study', 'logic', 'fact', 'research'];
  const foundMarkers = logicalMarkers.filter(m => content.toLowerCase().includes(m)).length;
  score += Math.min(foundMarkers, 2); // Max 2 extra points for markers

  // Clamp score between 1 and 10
  score = Math.min(10, Math.max(1, score));

  const reasonings = [
    "High rhetorical impact detected.",
    "Strong structural cohesion.",
    "Well-articulated logical premise.",
    "Effective counter-point synthesis.",
    "Concise and efficient delivery.",
    "Significant topical depth achieved."
  ];

  return {
    score,
    reasoning: reasonings[Math.floor(Math.random() * reasonings.length)]
  };
};

export const getRandomTopic = (): string => {
  const topics = [
    "Is artificial intelligence a threat to human creativity?",
    "Should social media platforms be treated as public utilities?",
    "Is a universal basic income the future of global economy?",
    "Should human genetic engineering be strictly prohibited?",
    "Is the exploration of deep space worth the environmental cost?"
  ];
  return topics[Math.floor(Math.random() * topics.length)];
};
