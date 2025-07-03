import { Idea, FilterState } from '../types';

export const filterIdeas = (ideas: Idea[], filters: FilterState): Idea[] => {
  return ideas.filter(idea => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        idea.title.toLowerCase().includes(searchTerm) ||
        idea.description.toLowerCase().includes(searchTerm) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && idea.category !== filters.category) {
      return false;
    }

    // Priority filter
    if (filters.priority && idea.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status && idea.status !== filters.status) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag => 
        idea.tags.includes(filterTag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
};

export const getAllTags = (ideas: Idea[]): string[] => {
  const tagSet = new Set<string>();
  ideas.forEach(idea => {
    idea.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};