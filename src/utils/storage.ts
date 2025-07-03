import { Idea } from '../types';

const STORAGE_KEY = 'ideaflow-ideas';

export const loadIdeas = (): Idea[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const ideas = JSON.parse(stored);
    return ideas.map((idea: any) => ({
      ...idea,
      createdAt: new Date(idea.createdAt),
      updatedAt: new Date(idea.updatedAt),
      reminderDate: idea.reminderDate ? new Date(idea.reminderDate) : undefined
    }));
  } catch (error) {
    console.error('Failed to load ideas:', error);
    return [];
  }
};

export const saveIdeas = (ideas: Idea[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  } catch (error) {
    console.error('Failed to save ideas:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};