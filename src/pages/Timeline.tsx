import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Calendar, Clock, Plus, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TimelineEventComponent } from '../components/timeline/TimelineEvent';
import { TimelineForm } from '../components/timeline/TimelineForm';
import { useTimeline } from '../hooks/useTimeline';

export const Timeline: React.FC = () => {
  const {
    events,
    isLoading,
    isAddingEvent,
    editingEvent,
    showAdmin,
    formData,
    setIsAddingEvent,
    setEditingEvent,
    setShowAdmin,
    setFormData,
    addEvent,
    updateEvent,
    removeEvent,
    toggleEvent,
    resetForm,
    startEditing,
    addAchievement,
    removeAchievement,
    updateAchievement
  } = useTimeline();

  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Update current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    if (editingEvent) {
      updateEvent();
    } else {
      addEvent();
    }
  };

  const handleCancel = () => {
    setIsAddingEvent(false);
    setEditingEvent(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Calendar className="w-24 h-24 mx-auto text-purple-400 mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              🗓️ Mijn Levensverhaal Timeline
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Van ADHD diagnose tot revolutionaire JointVenture - 2025 wordt mijn jaar!
            </p>
          </motion.div>

          {/* Current Date Marker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-900 to-blue-900 rounded-full border border-purple-500">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">
                {currentDate.toLocaleDateString('nl-NL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </motion.div>

          {/* Admin Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {showAdmin ? 'Verberg Admin' : 'Toon Admin'}
            </Button>
            
            {showAdmin && (
              <Button
                onClick={() => setIsAddingEvent(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Voeg Timeline Event Toe
              </Button>
            )}
          </div>
        </div>

        {/* Timeline Form Modal */}
        <TimelineForm
          isOpen={isAddingEvent || !!editingEvent}
          isEditing={!!editingEvent}
          formData={formData}
          onFormDataChange={setFormData}
          onSave={handleSave}
          onCancel={handleCancel}
          onAddAchievement={addAchievement}
          onRemoveAchievement={removeAchievement}
          onUpdateAchievement={updateAchievement}
        />

        {/* Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-blue-600 to-pink-600" />
          
          {/* Timeline Events */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Timeline laden...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Nog geen timeline events. Voeg je eerste event toe!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {events.map((event, index) => (
                <TimelineEventComponent
                  key={event.id}
                  event={event}
                  index={index}
                  showAdmin={showAdmin}
                  onToggle={toggleEvent}
                  onEdit={startEditing}
                  onDelete={removeEvent}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg"
          >
            <h3 className="text-xl font-bold mb-2">🎯 2025 - Het Jaar van de Doorbraak</h3>
            <p className="text-gray-300">
              Van ADHD diagnose tot revolutionaire JointVenture - dit wordt het jaar dat alles verandert!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
