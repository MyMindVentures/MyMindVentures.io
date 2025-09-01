import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit, Trash, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { iconMap } from '../../constants/icons';

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

interface TimelineEventProps {
  event: TimelineEvent;
  index: number;
  showAdmin: boolean;
  onToggle: (id: string) => void;
  onEdit: (event: TimelineEvent) => void;
  onDelete: (id: string) => void;
}

export const TimelineEventComponent: React.FC<TimelineEventProps> = ({ 
  event, 
  index, 
  showAdmin, 
  onToggle, 
  onEdit, 
  onDelete 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const IconComponent = iconMap[event.icon] || iconMap.Brain;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`relative flex items-start gap-6 ${
        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Timeline Line */}
      <div className="relative flex-shrink-0">
        <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full border-4 border-gray-900 z-10 relative" />
        <div className="absolute top-4 left-2 w-0.5 h-full bg-gradient-to-b from-purple-600 to-blue-600" />
      </div>

      {/* Event Card */}
      <motion.div
        className={`flex-1 max-w-md ${index % 2 === 0 ? 'text-left' : 'text-right'}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="cursor-pointer hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${event.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-400">{event.date}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.category === 'past' ? 'bg-gray-600' :
                    event.category === 'present' ? 'bg-green-600' :
                    'bg-blue-600'
                  }`}>
                    {event.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-1">{event.title}</h3>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{event.description}</p>
            
            <div className="flex items-center justify-between">
              <Button
                onClick={() => onToggle(event.id)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {event.isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Verberg Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Toon Details
                  </>
                )}
              </Button>
              
              {showAdmin && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEdit(event)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(event.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            {event.isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-700"
              >
                {event.details && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-purple-400">Details</h4>
                    <p className="text-sm text-gray-300">{event.details}</p>
                  </div>
                )}
                
                {event.achievements && event.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-green-400">Achievements</h4>
                    <ul className="space-y-1">
                      {event.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {event.impact && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-400">Impact</h4>
                    <p className="text-sm text-gray-300">{event.impact}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
