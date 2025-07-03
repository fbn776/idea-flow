import React from 'react';
import { Category, FilterState } from '../types';
import { CATEGORIES } from '../utils/constants';
import { Icon } from './Icon';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  ideasCount: Record<Category, number>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  ideasCount
}) => {
  const handleCategorySelect = (category: Category) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category
    });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:shadow-none lg:border-r lg:border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">IdeaFlow</h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      filters.category === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${category.color}`}>
                        <Icon name={category.icon} size={16} />
                      </div>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {ideasCount[category.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Quick Filters
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => onFiltersChange({ ...filters, status: 'new' })}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    filters.status === 'new'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="Zap" size={16} className="mr-3" />
                    <span className="font-medium">New Ideas</span>
                  </div>
                </button>
                <button
                  onClick={() => onFiltersChange({ ...filters, priority: 'high' })}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    filters.priority === 'high'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="AlertTriangle" size={16} className="mr-3" />
                    <span className="font-medium">High Priority</span>
                  </div>
                </button>
                <button
                  onClick={() => onFiltersChange({ ...filters, status: 'in-progress' })}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    filters.status === 'in-progress'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="Clock" size={16} className="mr-3" />
                    <span className="font-medium">In Progress</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};