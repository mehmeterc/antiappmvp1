import Fuse from 'fuse.js';
import { Cafe } from '@/types/cafe';

const fuseOptions = {
  keys: ['title', 'description', 'address', 'tags', 'amenities'],
  threshold: 0.3, // More strict matching
  distance: 100, // Allow for more distance between matches
  includeScore: true,
  useExtendedSearch: true,
  ignoreLocation: true,
  shouldSort: true,
};

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
  
  // First, filter by price range
  let filteredCafes = cafes.filter(cafe => {
    const price = parseInt(cafe.price);
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Then apply amenity filters
  if (selectedFilters.length > 0) {
    filteredCafes = filteredCafes.filter(cafe =>
      selectedFilters.every(filter => cafe.amenities.includes(filter))
    );
  }

  // If no search term, return filtered results
  if (!searchTerm.trim()) {
    console.log('No search term, returning filtered cafes:', filteredCafes.length);
    return filteredCafes;
  }

  const normalizedSearchTerm = normalizeText(searchTerm);
  
  // Try exact matches first
  let results = filteredCafes.filter(cafe => 
    normalizeText(cafe.title).includes(normalizedSearchTerm) ||
    normalizeText(cafe.description).includes(normalizedSearchTerm) ||
    cafe.tags.some(tag => normalizeText(tag).includes(normalizedSearchTerm)) ||
    cafe.amenities.some(amenity => normalizeText(amenity).includes(normalizedSearchTerm))
  );

  // If no exact matches, use fuzzy search
  if (results.length === 0) {
    console.log('No exact matches, using fuzzy search');
    const fuse = new Fuse(filteredCafes, fuseOptions);
    const fuseResults = fuse.search(normalizedSearchTerm);
    
    // Only include results with a good match score
    results = fuseResults
      .filter(result => result.score && result.score < 0.6)
      .map(result => result.item);
  }

  // Include AI recommendations if they exist
  const recommendedCafes = filteredCafes.filter(cafe => 
    aiRecommendations.includes(cafe.id) && 
    !results.find(r => r.id === cafe.id)
  );

  const finalResults = [...results, ...recommendedCafes];
  console.log('Final search results:', finalResults.length);

  return finalResults;
};