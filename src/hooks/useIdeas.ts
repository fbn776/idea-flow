import { useState, useEffect } from 'react';
import { Idea, Category, Priority, Status } from '../types';
import { loadIdeas, saveIdeas, generateId } from '../utils/storage';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedIdeas = loadIdeas();
    setIdeas(loadedIdeas);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveIdeas(ideas);
    }
  }, [ideas, loading]);

  const addIdea = (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIdea: Idea = {
      ...ideaData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setIdeas(prev => [newIdea, ...prev]);
    return newIdea;
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === id 
          ? { ...idea, ...updates, updatedAt: new Date() }
          : idea
      )
    );
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const updateIdeaStatus = (id: string, status: Status) => {
    updateIdea(id, { status });
  };

  const updateIdeaPriority = (id: string, priority: Priority) => {
    updateIdea(id, { priority });
  };

  const getIdeasByCategory = (category: Category) => {
    return ideas.filter(idea => idea.category === category);
  };

  const getIdeasByStatus = (status: Status) => {
    return ideas.filter(idea => idea.status === status);
  };

  return {
    ideas,
    loading,
    addIdea,
    updateIdea,
    deleteIdea,
    updateIdeaStatus,
    updateIdeaPriority,
    getIdeasByCategory,
    getIdeasByStatus
  };
};