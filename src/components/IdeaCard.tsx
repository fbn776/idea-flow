import React, { useState } from 'react';
import { Idea, Priority, Status } from '../types';
import { CATEGORIES, PRIORITY_COLORS, STATUS_COLORS } from '../utils/constants';
import { Icon } from './Icon';

interface IdeaCardProps {
  idea: Idea;
  onUpdate: (id: string, updates: Partial<Idea>) => void;
  onDelete: (id: string) => void;
  onEdit: (idea: Idea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onUpdate,
  onDelete,
  onEdit
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = CATEGORIES.find(cat => cat.id === idea.category);

  const handleStatusChange = (status: Status) => {
    onUpdate(idea.id, { status });
  };

  const handlePriorityChange = (priority: Priority) => {
    onUpdate(idea.id, { priority });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {idea.title}
            </h3>
            <div className="flex items-center space-x-2 mb-3">
              {category && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color}`}>
                  <Icon name={category.icon} size={12} className="mr-1" />
                  {category.label}
                </span>
              )}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${PRIORITY_COLORS[idea.priority]}`}>
                {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[idea.status]}`}>
                {idea.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(idea)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Icon name="Edit2" size={16} />
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Icon name="Trash2" size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className={`text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {idea.description}
        </p>

        {idea.description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Tags */}
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
              >
                <Icon name="Tag" size={10} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Resources */}
        {idea.resources.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Resources:</h4>
            <div className="space-y-2">
              {idea.resources.map(resource => (
                <div key={resource.id} className="flex items-center space-x-2">
                  <Icon 
                    name={resource.type === 'link' ? 'ExternalLink' : resource.type === 'file' ? 'File' : 'FileText'} 
                    size={14} 
                    className="text-gray-400" 
                  />
                  <span className="text-sm text-gray-600">{resource.title}</span>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Icon name="ExternalLink" size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Status Selector */}
            <select
              value={idea.status}
              onChange={(e) => handleStatusChange(e.target.value as Status)}
              className="text-sm border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>

            {/* Priority Selector */}
            <select
              value={idea.priority}
              onChange={(e) => handlePriorityChange(e.target.value as Priority)}
              className="text-sm border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <span className="text-xs text-gray-500">
            {formatDate(idea.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};