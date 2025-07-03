export interface Idea {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  tags: string[];
  resources: Resource[];
  createdAt: Date;
  updatedAt: Date;
  reminderDate?: Date;
}

export interface Resource {
  id: string;
  type: 'link' | 'file' | 'note';
  title: string;
  url?: string;
  content?: string;
  preview?: LinkPreview;
  createdAt: Date;
}

export interface LinkPreview {
  title: string;
  description: string;
  image?: string;
  domain: string;
}

export type Category = 
  | 'project-ideas'
  | 'blog-topics'
  | 'technical-concepts'
  | 'business-ideas'
  | 'creative-projects'
  | 'learning-goals'
  | 'personal'
  | 'other';

export type Priority = 'high' | 'medium' | 'low';

export type Status = 'new' | 'in-progress' | 'completed' | 'archived';

export interface CategoryConfig {
  id: Category;
  label: string;
  icon: string;
  color: string;
}

export interface FilterState {
  category?: Category;
  priority?: Priority;
  status?: Status;
  search: string;
  tags: string[];
}