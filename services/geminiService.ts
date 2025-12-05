import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using the 'nano banana' model as requested (mapped to gemini-2.5-flash-image)
const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates or modifies an image based on a text prompt and an optional input image.
 */
export const generatePfp = async (prompt: string, base64Image?: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  try {
    const parts: any[] = [];

    // If an image is provided, add it to the parts (Image Editing/Variation)
    if (base64Image) {
      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      const cleanBase64 = base64Image.split(',')[1] || base64Image;
      
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      });
    }

    // Add the text prompt
    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
    });

    // Extract the generated image from the response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");

  } catch (error) {
    console.error("Error generating PFP:", error);
    throw error;
  }
};
