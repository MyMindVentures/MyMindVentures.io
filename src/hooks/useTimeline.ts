import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'past' | 'present' | 'future';
  icon: string;
  color: string;
  isExpanded: boolean;
  details?: string;
  achievements?: string[];
  impact?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface TimelineFormData {
  date: string;
  title: string;
  description: string;
  category: 'past' | 'present' | 'future';
  icon: string;
  color: string;
  details: string;
  achievements: string[];
  impact: string;
}

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const [formData, setFormData] = useState<TimelineFormData>({
    date: '',
    title: '',
    description: '',
    category: 'present',
    icon: 'Brain',
    color: 'from-purple-600 to-blue-600',
    details: '',
    achievements: [''],
    impact: ''
  });

  // Load timeline events from database
  const loadTimelineEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data) {
        setEvents(data.map(event => ({
          ...event,
          isExpanded: false
        })));
      }
    } catch (error) {
      console.error('Error loading timeline events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save timeline event to database
  const saveTimelineEvent = async (eventData: Partial<TimelineEvent>) => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .insert([{
          ...eventData,
          sort_order: events.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving timeline event:', error);
      throw error;
    }
  };

  // Update timeline event in database
  const updateTimelineEvent = async (id: string, eventData: Partial<TimelineEvent>) => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating timeline event:', error);
      throw error;
    }
  };

  // Delete timeline event from database
  const deleteTimelineEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      throw error;
    }
  };

  // Add new event
  const addEvent = async () => {
    try {
      const newEvent = await saveTimelineEvent({
        date: formData.date,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        color: formData.color,
        details: formData.details,
        achievements: formData.achievements.filter(a => a.trim() !== ''),
        impact: formData.impact
      });

      if (newEvent) {
        setEvents([...events, { ...newEvent, isExpanded: false }]);
        resetForm();
        setIsAddingEvent(false);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Update existing event
  const updateEvent = async () => {
    if (!editingEvent) return;

    try {
      const updatedEvent = await updateTimelineEvent(editingEvent.id, {
        date: formData.date,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        color: formData.color,
        details: formData.details,
        achievements: formData.achievements.filter(a => a.trim() !== ''),
        impact: formData.impact
      });

      if (updatedEvent) {
        setEvents(events.map(event => 
          event.id === editingEvent.id 
            ? { ...updatedEvent, isExpanded: event.isExpanded }
            : event
        ));
        resetForm();
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Delete event
  const removeEvent = async (id: string) => {
    try {
      await deleteTimelineEvent(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Toggle event expansion
  const toggleEvent = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, isExpanded: !event.isExpanded } : event
    ));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      date: '',
      title: '',
      description: '',
      category: 'present',
      icon: 'Brain',
      color: 'from-purple-600 to-blue-600',
      details: '',
      achievements: [''],
      impact: ''
    });
  };

  // Start editing event
  const startEditing = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      category: event.category,
      icon: event.icon,
      color: event.color,
      details: event.details || '',
      achievements: event.achievements || [''],
      impact: event.impact || ''
    });
  };

  // Add achievement field
  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, '']
    });
  };

  // Remove achievement field
  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  // Update achievement
  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({
      ...formData,
      achievements: newAchievements
    });
  };

  // Load events on component mount
  useEffect(() => {
    loadTimelineEvents();
  }, []);

  return {
    events,
    isLoading,
    isAddingEvent,
    editingEvent,
    showAdmin,
    formData,
    setEvents,
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
  };
};
