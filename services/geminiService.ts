
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ScoringResult {
  score: number;
  reasoning: string;
}

export const scoreArgument = async (
  topic: string,
  role: string,
  argument: string
): Promise<ScoringResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Topic: ${topic}\nDebater Position: ${role}\nArgument: ${argument}`,
      config: {
        systemInstruction: "You are an expert debate judge. Score the given argument from 1 to 10. Be strict. Deduct points for logical fallacies, lack of evidence, or being off-topic. Reward logic, clarity, and impactful points. Provide a very short reasoning (max 15 words). Return JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "Score from 1 to 10",
            },
            reasoning: {
              type: Type.STRING,
              description: "Short explanation for the score",
            },
          },
          required: ["score", "reasoning"],
        },
      },
    });

    const result = JSON.parse(response.text || '{"score": 0, "reasoning": "Error processing"}');
    return {
      score: Math.min(10, Math.max(1, result.score || 1)),
      reasoning: result.reasoning || "Good point made."
    };
  } catch (error) {
    console.error("Scoring error:", error);
    return { score: 1, reasoning: "Evaluation system temporary failure." };
  }
};

export const suggestTopic = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Suggest one engaging and controversial debate topic that is suitable for a 1v1 debate. Return only the topic string.",
    });
    return response.text.trim() || "Is AI a threat or a tool for human progress?";
  } catch (error) {
    return "Should universal basic income be implemented globally?";
  }
};
