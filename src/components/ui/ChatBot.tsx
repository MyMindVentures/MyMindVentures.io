import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { supabaseService as db } from '../../lib/supabase';

interface ChatBotProps {
  currentPage: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await db.createFeedback({
        content: message,
        type: 'feedback',
        timestamp: new Date().toISOString(),
        user_id: 'demo-user', // Replace with actual user ID when auth is implemented
        page_context: currentPage,
      });
      
      setMessage('');
      setIsOpen(false);
      // Show success notification
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="text-sm text-gray-300">
                Hi! I'm here to help you improve MyMindVentures.io. Share your feedback, suggestions, or report any issues.
              </div>
              
              <Input
                value={message}
                onChange={setMessage}
                placeholder="Type your feedback or question..."
                className="w-full"
              />

              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim() || isSubmitting}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};