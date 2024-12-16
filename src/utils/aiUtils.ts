import { pipeline, TextClassificationOutput } from "@huggingface/transformers";

export interface AIAnalysisResult {
  confidence: number;
  label: string;
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

    // Handle both array and single result cases
    const output = Array.isArray(result) ? result[0] : result;
    
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