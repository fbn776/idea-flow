import React, { useState } from 'react';
import { Idea, FilterState, Category } from './types';
import { useIdeas } from './hooks/useIdeas';
import { useAuth } from './hooks/useAuth';
import { filterIdeas } from './utils/search';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { IdeaList } from './components/IdeaList';
import { QuickCapture } from './components/QuickCapture';
import { FloatingActionButton } from './components/FloatingActionButton';
import { EditIdeaModal } from './components/EditIdeaModal';
import { AuthModal } from './components/AuthModal';
import { Icon } from './components/Icon';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { ideas, loading, addIdea, updateIdea, deleteIdea } = useIdeas();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  const handleQuickCapture = async (ideaData: Parameters<typeof addIdea>[0]) => {
    await addIdea(ideaData);
  };

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea);
  };

  const handleSaveEdit = async (id: string, updates: Partial<Idea>) => {
    await updateIdea(id, updates);
    setEditingIdea(null);
  };

  const handleDeleteIdea = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      await deleteIdea(id);
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Icon name="Lightbulb" size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IdeaFlow</h1>
            <p className="text-gray-600">
              Capture, organize, and manage your ideas with ease
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in to start capturing your brilliant ideas and keep them organized across all your devices.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

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