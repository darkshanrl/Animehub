
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateContentInfo = async (title: string, category: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed description, relevant tags, and a community safety rating for this ${category}: "${title}". 
    The safety rating should be 'Safe', 'Caution', or 'Unknown' based on typical content of this title. 
    Keep the description under 300 characters.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          tags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedThumbnail: { type: Type.STRING, description: "A keyword for a relevant image search" },
          safetyRating: { type: Type.STRING, enum: ['Safe', 'Caution', 'Unknown'] }
        },
        required: ["description", "tags", "suggestedThumbnail", "safetyRating"]
      }
    }
  });

  return JSON.parse(response.text);
};
