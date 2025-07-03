import React from 'react';
import { FilterState } from '../types';
import { Icon } from './Icon';

interface SearchBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSidebarToggle: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFiltersChange,
  onSidebarToggle
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: undefined,
      priority: undefined,
      status: undefined,
      search: '',
      tags: []
    });
  };

  const hasActiveFilters = filters.category || filters.priority || filters.status || filters.search || filters.tags.length > 0;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Icon name="Menu" size={20} />
        </button>
        
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search ideas, tags, or descriptions..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Icon name="X" size={16} className="mr-1" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};