import { useState, useEffect } from "react";
import { analyzeSearchTerm } from "@/utils/aiUtils";
import { useToast } from "@/components/ui/use-toast";
import { BERLIN_CAFES } from "@/data/mockCafes";

export const useAIRecommendations = (searchTerm: string) => {
  const { toast } = useToast();
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAiRecommendations = async () => {
      if (searchTerm.length < 2) {
        setAiRecommendations([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const analysis = await analyzeSearchTerm(searchTerm);
        console.log("Search term analysis:", analysis);
        setAiRecommendations(
          BERLIN_CAFES
            .filter(cafe => analysis.confidence > 0.5)
            .map(cafe => cafe.id)
        );
      } catch (error) {
        console.error("AI recommendation error:", error);
        toast({
          title: "AI Enhancement",
          description: "Using standard search while AI features are loading...",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      getAiRecommendations();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, toast]);

  return { aiRecommendations, isLoading };
};