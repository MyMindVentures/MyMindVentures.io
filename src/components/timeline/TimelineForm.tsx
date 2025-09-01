import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash, Save, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { iconMap } from '../../constants/icons';

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

interface TimelineFormProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: TimelineFormData;
  onFormDataChange: (data: TimelineFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddAchievement: () => void;
  onRemoveAchievement: (index: number) => void;
  onUpdateAchievement: (index: number, value: string) => void;
}

export const TimelineForm: React.FC<TimelineFormProps> = ({
  isOpen,
  isEditing,
  formData,
  onFormDataChange,
  onSave,
  onCancel,
  onAddAchievement,
  onRemoveAchievement,
  onUpdateAchievement
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? 'Bewerk Timeline Event' : 'Voeg Timeline Event Toe'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Datum/Periode</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => onFormDataChange({ ...formData, date: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                placeholder="bijv. Januari 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categorie</label>
              <select
                value={formData.category}
                onChange={(e) => onFormDataChange({ ...formData, category: e.target.value as any })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="past">Verleden</option>
                <option value="present">Heden</option>
                <option value="future">Toekomst</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Titel</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="bijv. 🚀 JointVenture Launch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Korte Beschrijving</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="Korte beschrijving van het event"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => onFormDataChange({ ...formData, icon: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                {Object.keys(iconMap).map(iconName => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kleur</label>
              <select
                value={formData.color}
                onChange={(e) => onFormDataChange({ ...formData, color: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="from-purple-600 to-blue-600">Purple to Blue</option>
                <option value="from-blue-600 to-cyan-600">Blue to Cyan</option>
                <option value="from-green-600 to-emerald-600">Green to Emerald</option>
                <option value="from-pink-600 to-rose-600">Pink to Rose</option>
                <option value="from-yellow-600 to-orange-600">Yellow to Orange</option>
                <option value="from-red-600 to-pink-600">Red to Pink</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => onFormDataChange({ ...formData, details: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              rows={3}
              placeholder="Uitgebreide details over het event"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Achievements</label>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => onUpdateAchievement(index, e.target.value)}
                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    placeholder={`Achievement ${index + 1}`}
                  />
                  {formData.achievements.length > 1 && (
                    <Button
                      onClick={() => onRemoveAchievement(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={onAddAchievement}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Voeg Achievement Toe
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Impact</label>
            <textarea
              value={formData.impact}
              onChange={(e) => onFormDataChange({ ...formData, impact: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              rows={2}
              placeholder="Impact van dit event"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={onSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Bijwerken' : 'Toevoegen'}
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Annuleren
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
