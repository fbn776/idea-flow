import React, { useState } from 'react';
import { Idea, FilterState, Category } from './types';
import { useIdeas } from './hooks/useIdeas';
import { filterIdeas } from './utils/search';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { IdeaList } from './components/IdeaList';
import { QuickCapture } from './components/QuickCapture';
import { FloatingActionButton } from './components/FloatingActionButton';
import { EditIdeaModal } from './components/EditIdeaModal';

function App() {
  const { ideas, loading, addIdea, updateIdea, deleteIdea } = useIdeas();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: undefined,
    priority: undefined,
    status: undefined,
    search: '',
    tags: []
  });

  const filteredIdeas = filterIdeas(ideas, filters);

  // Count ideas by category for sidebar
  const ideasByCategory = ideas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const handleQuickCapture = (ideaData: Parameters<typeof addIdea>[0]) => {
    addIdea(ideaData);
  };

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea);
  };

  const handleSaveEdit = (id: string, updates: Partial<Idea>) => {
    updateIdea(id, updates);
    setEditingIdea(null);
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      deleteIdea(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          filters={filters}
          onFiltersChange={setFilters}
          ideasCount={ideasByCategory}
        />

        <div className="flex-1 flex flex-col min-h-screen">
          <SearchBar
            filters={filters}
            onFiltersChange={setFilters}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {filters.category ? 
                    `${filters.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Ideas` : 
                    'All Ideas'
                  }
                </h2>
                <p className="text-gray-600">
                  {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'} found
                </p>
              </div>

              {/* Ideas List */}
              <IdeaList
                ideas={filteredIdeas}
                onUpdate={updateIdea}
                onDelete={handleDeleteIdea}
                onEdit={handleEditIdea}
                loading={loading}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Quick Capture Modal */}
      <QuickCapture
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onSave={handleQuickCapture}
      />

      {/* Edit Idea Modal */}
      <EditIdeaModal
        idea={editingIdea}
        isOpen={!!editingIdea}
        onClose={() => setEditingIdea(null)}
        onSave={handleSaveEdit}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsQuickCaptureOpen(true)}
      />
    </div>
  );
}

export default App;