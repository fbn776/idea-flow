import { CategoryConfig } from '../types';

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'project-ideas',
    label: 'Project Ideas',
    icon: 'Lightbulb',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'blog-topics',
    label: 'Blog Topics',
    icon: 'PenTool',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'technical-concepts',
    label: 'Technical Concepts',
    icon: 'Code',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'business-ideas',
    label: 'Business Ideas',
    icon: 'Briefcase',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'creative-projects',
    label: 'Creative Projects',
    icon: 'Palette',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'learning-goals',
    label: 'Learning Goals',
    icon: 'BookOpen',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'personal',
    label: 'Personal',
    icon: 'User',
    color: 'bg-gray-100 text-gray-800'
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'MoreHorizontal',
    color: 'bg-orange-100 text-orange-800'
  }
];

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

export const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800'
};