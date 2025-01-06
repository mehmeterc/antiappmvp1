import Fuse from 'fuse.js';
import { Cafe } from '@/types/cafe';

const fuseOptions = {
  keys: ['title', 'description', 'address', 'tags', 'amenities'],
  threshold: 0.3,
  distance: 100,
  includeScore: true,
  useExtendedSearch: true,
  ignoreLocation: true,
  shouldSort: true,
};

const fuse = new Fuse([], fuseOptions);

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
};

export const searchCafes = (
  cafes: Cafe[],
  searchTerm: string,
  selectedFilters: string[],
  priceRange: number[],
  aiRecommendations: string[]
): Cafe[] => {
  console.log('Searching cafes with:', {
    searchTerm,
    selectedFilters,
    priceRange,
    aiRecommendationsCount: aiRecommendations.length
  });
  
  // First, filter by price range and amenities
  let filteredCafes = cafes.filter(cafe => {
    const price = parseInt(cafe.price);
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.every(filter => cafe.amenities.includes(filter));
    
    return matchesPrice && matchesFilters;
  });

  // If no search term, return filtered results
  if (!searchTerm.trim()) {
    console.log('No search term, returning filtered cafes:', filteredCafes.length);
    return filteredCafes;
  }

  // Update Fuse instance with filtered cafes
  fuse.setCollection(filteredCafes);

  // Perform fuzzy search
  const searchResults = fuse.search(searchTerm);
  const results = searchResults
    .filter(result => result.score && result.score < 0.6)
    .map(result => result.item);

  // Include AI recommendations
  const recommendedCafes = filteredCafes.filter(cafe => 
    aiRecommendations.includes(cafe.id) && 
    !results.find(r => r.id === cafe.id)
  );

  const finalResults = [...results, ...recommendedCafes];
  console.log('Final search results:', finalResults.length);

  return finalResults;
};