import Fuse from 'fuse.js';
import { Cafe } from '@/types/cafe';

const fuseOptions = {
  keys: ['title', 'description', 'address'],
  threshold: 0.3,
  includeScore: true,
  useExtendedSearch: true,
  ignoreLocation: true,
  shouldSort: true,
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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
  
  if (normalizedSearchTerm.length === 0) {
    return cafes;
  }

  const fuse = new Fuse(cafes, fuseOptions);
  const searchResults = fuse.search(normalizedSearchTerm);
  console.log('Fuse search results:', searchResults);

  const filteredCafes = searchResults
    .map(result => result.item)
    .filter(cafe => {
      const matchesFilters = selectedFilters.length === 0 || 
        selectedFilters.every(filter => cafe.amenities.includes(filter));

      const priceValue = parseFloat(cafe.price.replace('€', ''));
      const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];

      return matchesFilters && matchesPrice;
    });

  // Include AI recommendations if they exist
  const recommendedCafes = cafes.filter(cafe => 
    aiRecommendations.includes(cafe.id) && 
    !filteredCafes.find(fc => fc.id === cafe.id)
  );

  return [...filteredCafes, ...recommendedCafes];
};