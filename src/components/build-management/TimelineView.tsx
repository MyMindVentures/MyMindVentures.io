import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  GitCommit,
  Rocket,
  FileText,
  Database,
  Clock,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format } from 'date-fns';

interface TimelineItem {
  id: string;
  type: 'blueprint_snippet' | 'commit' | 'publication' | 'blueprint_file' | 'special_page';
  title: string;
  description: string;
  timestamp: string;
  branch?: string;
  version?: string;
  themes?: string[];
  content?: string;
  metadata?: any;
}

interface TimelineViewProps {
  items: TimelineItem[];
  isLoading: boolean;
  onUpdateItem: (id: string, type: string, updates: any) => Promise<void>;
  onDeleteItem: (id: string, type: string) => Promise<void>;
  onDeleteMultipleItems?: (items: { id: string; type: string }[]) => Promise<void>;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ 
  items, 
  isLoading, 
  onUpdateItem, 
  onDeleteItem,
  onDeleteMultipleItems
}) => {
  const [viewingItem, setViewingItem] = useState<TimelineItem | null>(null);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDeleteMultiple = async () => {
    if (selectedItems.length === 0 || !onDeleteMultipleItems) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
      return;
    }

    setIsDeletingMultiple(true);
    try {
      const itemsToDelete = items
        .filter(item => selectedItems.includes(item.id))
        .map(item => ({ id: item.id, type: item.type }));
      
      await onDeleteMultipleItems(itemsToDelete);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting multiple items:', error);
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'blueprint_snippet':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case 'commit':
        return <GitCommit className="w-4 h-4 text-purple-400" />;
      case 'publication':
        return <Rocket className="w-4 h-4 text-green-400" />;
      case 'blueprint_file':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'special_page':
        return <Database className="w-4 h-4 text-cyan-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'blueprint_snippet':
        return 'border-yellow-400/30 bg-yellow-500/10';
      case 'commit':
        return 'border-purple-400/30 bg-purple-500/10';
      case 'publication':
        return 'border-green-400/30 bg-green-500/10';
      case 'blueprint_file':
        return 'border-blue-400/30 bg-blue-500/10';
      case 'special_page':
        return 'border-cyan-400/30 bg-cyan-500/10';
      default:
        return 'border-gray-400/30 bg-gray-500/10';
    }
  };

  const handleView = (item: TimelineItem) => {
    setViewingItem(item);
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      content: item.content || '',
      themes: item.themes || [],
      version: item.version || '',
      branch: item.branch || 'main',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    setIsUpdating(true);
    try {
      const updates: any = {
        title: editForm.title,
        description: editForm.description,
        updated_at: new Date().toISOString(),
      };

      // Add type-specific fields
      if (editingItem.type === 'blueprint_snippet') {
        updates.snippet = editForm.content;
        updates.themes = editForm.themes;
        updates.branch = editForm.branch;
      } else if (editingItem.type === 'commit') {
        updates.full_summary = editForm.content;
        updates.branch = editForm.branch;
      } else if (editingItem.type === 'publication') {
        updates.version = editForm.version;
      } else if (editingItem.type === 'blueprint_file') {
        updates.content = editForm.content;
      } else if (editingItem.type === 'special_page') {
        updates.content = editForm.content;
      }

      await onUpdateItem(editingItem.id, editingItem.type, updates);
      setEditingItem(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (item: TimelineItem) => {
    if (!confirm(`Are you sure you want to delete this ${item.type.replace('_', ' ')}?`)) {
      return;
    }

    setIsDeleting(item.id);
    try {
      await onDeleteItem(item.id, item.type);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  const addTheme = () => {
    const newTheme = prompt('Enter new theme:');
    if (newTheme && newTheme.trim()) {
      setEditForm(prev => ({
        ...prev,
        themes: [...(prev.themes || []), newTheme.trim()]
      }));
    }
  };

  const removeTheme = (themeToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      themes: (prev.themes || []).filter(theme => theme !== themeToRemove)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No timeline items yet. Create your first blueprint snippet to get started.
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions Header */}
      {selectedItems.length > 0 && (
        <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>
              Clear Selection
            </Button>
          </div>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleDeleteMultiple}
            disabled={isDeletingMultiple}
          >
            {isDeletingMultiple ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3 mr-2" />
                Delete {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Select All Checkbox */}
      {items.length > 0 && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedItems.length === items.length && items.length > 0}
            onChange={() => {
              if (selectedItems.length === items.length) {
                setSelectedItems([]);
              } else {
                setSelectedItems(items.map(item => item.id));
              }
            }}
            className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
          />
          <label className="text-gray-300 text-sm">
            Select All ({items.length} items)
          </label>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative p-4 rounded-lg border ${getTimelineColor(item.type)}`}
          >
            {/* Timeline connector */}
            {index < items.length - 1 && (
              <div className="absolute left-6 top-16 w-px h-8 bg-gray-600/50" />
            )}
            
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItemSelection(item.id)}
                className="w-4 h-4 mt-1 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
              />
              
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-600/50">
                {getTimelineIcon(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300 capitalize">
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 ml-4">
                    <span className="text-xs text-gray-500">
                      {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                    </span>
                    {item.branch && (
                      <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                        {item.branch}
                      </span>
                    )}
                    {item.version && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        {item.version}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Themes for snippets */}
                {item.themes && item.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.themes.slice(0, 3).map((theme) => (
                      <span
                        key={theme}
                        className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs"
                      >
                        {theme}
                      </span>
                    ))}
                    {item.themes.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{item.themes.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(item)}
                    disabled={isDeleting === item.id}
                  >
                    {isDeleting === item.id ? (
                      <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 text-red-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setViewingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  {getTimelineIcon(viewingItem.type)}
                  <div>
                    <h3 className="text-white font-semibold">{viewingItem.title}</h3>
                    <p className="text-gray-400 text-sm capitalize">{viewingItem.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {viewingItem.content && (
                    <Button variant="ghost" size="sm" onClick={() => handleCopyContent(viewingItem.content!)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  )}
                  <button
                    onClick={() => setViewingItem(null)}
                    className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Description</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{viewingItem.description}</p>
                  </div>
                  
                  {viewingItem.themes && viewingItem.themes.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingItem.themes.map(theme => (
                          <span
                            key={theme}
                            className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {viewingItem.content && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Content</h4>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                          {viewingItem.content}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-white ml-2">{format(new Date(viewingItem.timestamp), 'PPpp')}</span>
                    </div>
                    {viewingItem.branch && (
                      <div>
                        <span className="text-gray-400">Branch:</span>
                        <span className="text-white ml-2">{viewingItem.branch}</span>
                      </div>
                    )}
                    {viewingItem.version && (
                      <div>
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white ml-2">{viewingItem.version}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <Edit className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-white font-semibold">Edit {editingItem.type.replace('_', ' ')}</h3>
                    <p className="text-gray-400 text-sm">Make changes to this timeline item</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={editForm.title || ''}
                    onChange={(value) => setEditForm(prev => ({ ...prev, title: value }))}
                    placeholder="Enter title..."
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-sm"
                    />
                  </div>

                  {editingItem.type === 'blueprint_snippet' && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Themes</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(editForm.themes || []).map((theme, index) => (
                            <span
                              key={index}
                              className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                            >
                              <span>{theme}</span>
                              <button
                                onClick={() => removeTheme(theme)}
                                className="text-cyan-300 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={addTheme}
                            className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-600/50 transition-colors"
                          >
                            + Add Theme
                          </button>
                        </div>
                      </div>
                      <Input
                        label="Branch"
                        value={editForm.branch || ''}
                        onChange={(value) => setEditForm(prev => ({ ...prev, branch: value }))}
                        placeholder="main"
                      />
                    </>
                  )}

                  {editingItem.type === 'commit' && (
                    <Input
                      label="Branch"
                      value={editForm.branch || ''}
                      onChange={(value) => setEditForm(prev => ({ ...prev, branch: value }))}
                      placeholder="main"
                    />
                  )}

                  {editingItem.type === 'publication' && (
                    <Input
                      label="Version"
                      value={editForm.version || ''}
                      onChange={(value) => setEditForm(prev => ({ ...prev, version: value }))}
                      placeholder="v1.0.0"
                    />
                  )}

                  {(editingItem.content || editingItem.type === 'blueprint_snippet' || editingItem.type === 'commit' || editingItem.type === 'blueprint_file' || editingItem.type === 'special_page') && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        {editingItem.type === 'blueprint_snippet' ? 'Snippet Content' :
                         editingItem.type === 'commit' ? 'Full Summary' :
                         editingItem.type === 'blueprint_file' ? 'Blueprint Content' :
                         editingItem.type === 'special_page' ? 'Page Content' : 'Content'}
                      </label>
                      <textarea
                        value={editForm.content || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter content..."
                        rows={8}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-sm font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 p-6 border-t border-gray-700/50">
                <Button variant="ghost" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSaveEdit}
                  disabled={isUpdating || !editForm.title?.trim()}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};