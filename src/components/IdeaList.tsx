import React from 'react';
import { Idea } from '../types';
import { IdeaCard } from './IdeaCard';
import { Icon } from './Icon';

interface IdeaListProps {
  ideas: Idea[];
  onUpdate: (id: string, updates: Partial<Idea>) => void;
  onDelete: (id: string) => void;
  onEdit: (idea: Idea) => void;
  loading?: boolean;
}

export const IdeaList: React.FC<IdeaListProps> = ({
  ideas,
  onUpdate,
  onDelete,
  onEdit,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Lightbulb" size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
        <p className="text-gray-600 mb-4">
          Start capturing your brilliant ideas with the + button below
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ideas.map(idea => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};