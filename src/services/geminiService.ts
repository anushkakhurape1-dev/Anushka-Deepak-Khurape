import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface EstimationResult {
  category: string;
  brand: string;
  model: string;
  condition: string;
  estimatedPayoutRange: {
    min: number;
    max: number;
  };
  reasoning: string;
}

export async function estimateEWasteValue(
  imageUri: string,
  category: string,
  condition: string
): Promise<EstimationResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this e-waste item.
    Category: ${category}
    User-reported condition: ${condition}
    
    Identify the brand and model if possible. 
    Estimate a fair payout range in INR (₹) based on:
    1. Material recovery value (copper, gold, aluminum, plastic).
    2. Potential for refurbishment if condition is good.
    3. Market scrap rates.
    
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageUri.split(',')[1] // Remove data:image/jpeg;base64,
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          brand: { type: Type.STRING },
          model: { type: Type.STRING },
          condition: { type: Type.STRING },
          estimatedPayoutRange: {
            type: Type.OBJECT,
            properties: {
              min: { type: Type.NUMBER },
              max: { type: Type.NUMBER }
            },
            required: ["min", "max"]
          },
          reasoning: { type: Type.STRING }
        },
        required: ["category", "brand", "model", "condition", "estimatedPayoutRange", "reasoning"]
      }
    }
  });

  return JSON.parse(response.text);
}
