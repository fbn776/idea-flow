import React, { useState } from 'react';
import { Category, Priority, Resource } from '../types';
import { CATEGORIES } from '../utils/constants';
import { Icon } from './Icon';
import { generateId } from '../utils/storage';

interface QuickCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: {
    title: string;
    description: string;
    category: Category;
    priority: Priority;
    status: 'new';
    tags: string[];
    resources: Resource[];
    reminderDate?: Date;
  }) => void;
}

export const QuickCapture: React.FC<QuickCaptureProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as Category,
    priority: 'medium' as Priority,
    tags: '',
    resourceUrl: '',
    resourceTitle: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const resources: Resource[] = [];
    if (formData.resourceUrl && formData.resourceTitle) {
      resources.push({
        id: generateId(),
        type: 'link',
        title: formData.resourceTitle,
        url: formData.resourceUrl,
        createdAt: new Date()
      });
    }

    onSave({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: 'new',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      resources
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      tags: '',
      resourceUrl: '',
      resourceTitle: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Capture</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your idea title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your idea in detail..."
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas..."
              />
            </div>

            {/* Resource */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Resource (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="resourceTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    id="resourceTitle"
                    value={formData.resourceTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, resourceTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter resource title..."
                  />
                </div>
                <div>
                  <label htmlFor="resourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    id="resourceUrl"
                    value={formData.resourceUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, resourceUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Idea
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};