import { pipeline } from "@huggingface/transformers";

export interface AIAnalysisResult {
  confidence: number;
  label: string;
}

interface TextClassificationSingle {
  label: string;
  score: number;
}

export const analyzeSearchTerm = async (searchTerm: string): Promise<AIAnalysisResult> => {
  console.log("Starting AI analysis for:", searchTerm);
  
  try {
    const classifier = await pipeline(
      "text-classification",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
    );
    
    const result = await classifier(searchTerm);
    console.log("AI analysis result:", result);

    // Ensure we're working with a single result
    const output = Array.isArray(result) ? result[0] : result as TextClassificationSingle;
    
    return {
      confidence: output.label === "POSITIVE" ? output.score : 1 - output.score,
      label: output.label
    };
  } catch (error) {
    console.error("AI analysis error:", error);
    // Return a neutral result on error
    return {
      confidence: 0.5,
      label: "NEUTRAL"
    };
  }
};