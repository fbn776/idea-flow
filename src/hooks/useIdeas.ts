import { useState, useEffect } from 'react';
import { Idea, Category, Priority, Status } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadIdeas();
    } else {
      setIdeas([]);
      setLoading(false);
    }
  }, [user]);

  const loadIdeas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select(`
          *,
          idea_resources (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ideasError) throw ideasError;

      const formattedIdeas: Idea[] = ideasData.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        category: idea.category as Category,
        priority: idea.priority as Priority,
        status: idea.status as Status,
        tags: idea.tags || [],
        resources: idea.idea_resources.map(resource => ({
          id: resource.id,
          type: resource.type as 'link' | 'file' | 'note',
          title: resource.title,
          url: resource.url || undefined,
          content: resource.content || undefined,
          createdAt: new Date(resource.created_at)
        })),
        createdAt: new Date(idea.created_at),
        updatedAt: new Date(idea.updated_at),
        reminderDate: idea.reminder_date ? new Date(idea.reminder_date) : undefined
      }));

      setIdeas(formattedIdeas);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIdea = async (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;

    try {
      const { data: ideaResult, error: ideaError } = await supabase
        .from('ideas')
        .insert({
          user_id: user.id,
          title: ideaData.title,
          description: ideaData.description,
          category: ideaData.category,
          priority: ideaData.priority,
          status: ideaData.status,
          tags: ideaData.tags,
          reminder_date: ideaData.reminderDate?.toISOString()
        })
        .select()
        .single();

      if (ideaError) throw ideaError;

      // Add resources if any
      if (ideaData.resources.length > 0) {
        const { error: resourcesError } = await supabase
          .from('idea_resources')
          .insert(
            ideaData.resources.map(resource => ({
              idea_id: ideaResult.id,
              type: resource.type,
              title: resource.title,
              url: resource.url,
              content: resource.content
            }))
          );

        if (resourcesError) throw resourcesError;
      }

      await loadIdeas();
      return ideaResult;
    } catch (error) {
      console.error('Error adding idea:', error);
      return null;
    }
  };

  const updateIdea = async (id: string, updates: Partial<Idea>) => {
    if (!user) return;

    try {
      const { error: ideaError } = await supabase
        .from('ideas')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          priority: updates.priority,
          status: updates.status,
          tags: updates.tags,
          reminder_date: updates.reminderDate?.toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (ideaError) throw ideaError;

      // Handle resources update if provided
      if (updates.resources) {
        // Delete existing resources
        await supabase
          .from('idea_resources')
          .delete()
          .eq('idea_id', id);

        // Add new resources
        if (updates.resources.length > 0) {
          const { error: resourcesError } = await supabase
            .from('idea_resources')
            .insert(
              updates.resources.map(resource => ({
                idea_id: id,
                type: resource.type,
                title: resource.title,
                url: resource.url,
                content: resource.content
              }))
            );

          if (resourcesError) throw resourcesError;
        }
      }

      await loadIdeas();
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const deleteIdea = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const updateIdeaStatus = async (id: string, status: Status) => {
    await updateIdea(id, { status });
  };

  const updateIdeaPriority = async (id: string, priority: Priority) => {
    await updateIdea(id, { priority });
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
    getIdeasByStatus,
    refreshIdeas: loadIdeas
  };
};