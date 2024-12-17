import Fuse from 'fuse.js';
import { Cafe } from '@/types/cafe';

const fuseOptions = {
  keys: ['title', 'description', 'address', 'tags'],
  threshold: 0.4, // More lenient matching
  includeScore: true,
  useExtendedSearch: true,
  ignoreLocation: true,
  shouldSort: true,
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, ''); // Remove special characters
};

export const searchCafes = (
  cafes: Cafe[],
  searchTerm: string,
  selectedFilters: string[],
  priceRange: number[],
  aiRecommendations: string[]
): Cafe[] => {
  console.log('Searching cafes with term:', searchTerm);
  
  const normalizedSearchTerm = normalizeText(searchTerm);
  
  // If no search term, return all cafes (filtered by other criteria)
  if (normalizedSearchTerm.length === 0) {
    return filterByOtherCriteria(cafes, selectedFilters, priceRange);
  }

  const fuse = new Fuse(cafes, fuseOptions);
  
  // First try exact matching
  let results = cafes.filter(cafe => 
    normalizeText(cafe.title).includes(normalizedSearchTerm) ||
    normalizeText(cafe.description).includes(normalizedSearchTerm) ||
    cafe.tags.some(tag => normalizeText(tag).includes(normalizedSearchTerm))
  );

  // If no exact matches, use fuzzy search
  if (results.length === 0) {
    console.log('No exact matches, trying fuzzy search');
    const fuseResults = fuse.search(normalizedSearchTerm);
    results = fuseResults.map(result => result.item);
  }

  console.log('Search results before filtering:', results.length);

  // Apply other filters
  results = filterByOtherCriteria(results, selectedFilters, priceRange);

  // Include AI recommendations if they exist and aren't already in results
  const recommendedCafes = cafes.filter(cafe => 
    aiRecommendations.includes(cafe.id) && 
    !results.find(r => r.id === cafe.id)
  );

  const finalResults = [...results, ...recommendedCafes];
  console.log('Final search results:', finalResults.length);

  return finalResults;
};

const filterByOtherCriteria = (
  cafes: Cafe[],
  selectedFilters: string[],
  priceRange: number[]
): Cafe[] => {
  return cafes.filter(cafe => {
    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.every(filter => cafe.amenities.includes(filter));

    const priceValue = parseInt(cafe.price.replace(/€/g, '').length.toString());
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];

    return matchesFilters && matchesPrice;
  });
};