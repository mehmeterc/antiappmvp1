import Fuse from 'fuse.js';
import { Cafe } from '@/types/cafe';

const fuseOptions = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'address', weight: 1.5 },
    { name: 'description', weight: 0.7 },
    { name: 'tags', weight: 0.5 },
    { name: 'amenities', weight: 0.3 }
  ],
  threshold: 0.3,
  distance: 30,
  includeScore: true,
  useExtendedSearch: true,
  ignoreLocation: false,
  shouldSort: true,
  minMatchCharLength: 2
};

const fuse = new Fuse([], fuseOptions);

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
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
  
  // First, apply exact filters
  let filteredCafes = cafes.filter(cafe => {
    const price = parseFloat(cafe.price);
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

  // Check for direct title matches first (for best results)
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  const titleMatches = filteredCafes.filter(cafe => 
    cafe.title.toLowerCase().includes(normalizedSearchTerm)
  );
  
  // If we have good title matches, prioritize those
  if (titleMatches.length > 0) {
    console.log('Found direct title matches:', titleMatches.length);
    return titleMatches;
  }
  
  // Otherwise perform fuzzy search
  fuse.setCollection(filteredCafes);
  const searchResults = fuse.search(searchTerm);
  
  // Filter to only high-quality matches
  const results = searchResults
    .filter(result => result.score !== undefined && result.score < 0.5)
    .map(result => result.item as Cafe);

  // Post-filter to ensure strict normalized inclusion
  const normalizedFilter = normalizeText(searchTerm);
  const strictResults = results.filter(cafe => {
    const text = normalizeText([
      cafe.title,
      cafe.address,
      cafe.description,
      ...(cafe.tags || []),
      ...(cafe.amenities || [])
    ].join(' '));
    return text.includes(normalizedFilter);
  });

  // Include AI recommendations that weren't already found
  const recommendedCafes = filteredCafes.filter(cafe => 
    aiRecommendations.includes(cafe.id) && 
    !strictResults.find(r => r.id === cafe.id)
  );

  const finalResults = [...strictResults, ...recommendedCafes];
  console.log('Final search results:', finalResults.length);

  return finalResults;
};
