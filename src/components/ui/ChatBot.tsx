import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { supabaseService as db } from '../../lib/supabase';
import { debugLogger } from '../../lib/debug-log';

interface ChatBotProps {
  currentPage: string;
}

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  context?: {
    page: string;
    workflow?: string;
    suggestions?: string[];
  };
}

export const ChatBot: React.FC<ChatBotProps> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // AI-powered response system
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Workflow-specific responses
    if (lowerMessage.includes('test') || lowerMessage.includes('testing')) {
      return `🧪 **Testing Workflow**: Your app has a complete testing stack with Jest (unit), Cypress (E2E), and Playwright (cross-browser). Coverage target: 80%. Run \`npm run test:all\` to execute all tests. Need help with test coverage?`;
    }

    if (
      lowerMessage.includes('ci/cd') ||
      lowerMessage.includes('pipeline') ||
      lowerMessage.includes('deploy')
    ) {
      return `🚀 **CI/CD Pipeline**: Your GitHub Actions pipeline includes 8 stages: quality checks, testing, E2E, cross-browser, build, Docker, deployment, and monitoring. Deployments are automated to Vercel/Netlify. Want to see pipeline status?`;
    }

    if (
      lowerMessage.includes('monitor') ||
      lowerMessage.includes('sentry') ||
      lowerMessage.includes('performance')
    ) {
      return `📊 **Monitoring**: Real-time monitoring with Sentry (errors), Prometheus (metrics), Grafana (dashboards), and health checks. Performance tracking with Lighthouse CI. Need help setting up alerts?`;
    }

    if (
      lowerMessage.includes('security') ||
      lowerMessage.includes('vulnerability') ||
      lowerMessage.includes('audit')
    ) {
      return `🔒 **Security**: Automated security scanning with Trivy, npm audit, and SonarQube. Security gates in CI/CD pipeline. Want to run a security scan?`;
    }

    if (lowerMessage.includes('docker') || lowerMessage.includes('container')) {
      return `🐳 **Docker**: Multi-stage Docker builds with Nginx, health checks, and Docker Compose for local development. Production-ready containerization. Need help with Docker setup?`;
    }

    if (
      lowerMessage.includes('quality') ||
      lowerMessage.includes('eslint') ||
      lowerMessage.includes('prettier')
    ) {
      return `✨ **Code Quality**: ESLint, Prettier, Husky, lint-staged, and SonarQube ensure code quality. Pre-commit hooks run automatically. Quality gates in CI/CD. Want to check code quality?`;
    }

    if (
      lowerMessage.includes('ai') ||
      lowerMessage.includes('intelligence') ||
      lowerMessage.includes('toolkit')
    ) {
      return `🤖 **AI Toolkit**: Your State of Art Toolkit has AI-powered modules for code analysis, test intelligence, CI/CD optimization, monitoring, and security. AI can analyze test results, optimize pipelines, and predict issues. Want to explore AI features?`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return `💡 **How can I help?** I can assist with:
• Testing strategies and coverage
• CI/CD pipeline optimization
• Performance monitoring setup
• Security scanning and compliance
• Docker and deployment
• Code quality improvements
• AI-powered development tools
What would you like to know more about?`;
    }

    // Default response
    return `Thanks for your message! I'm here to help with your MyMindVentures.io development workflow. You can ask me about testing, CI/CD, monitoring, security, Docker, code quality, or AI-powered development tools. What would you like to know?`;
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      type: 'user',
      timestamp: new Date(),
      context: { page: currentPage },
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Log user interaction
      await debugLogger.logInfo(
        'user-interaction',
        'ChatBot User Message',
        `User sent message: "${message}" on page: ${currentPage}`,
        ['ChatBot interaction logged', 'AI response generated']
      );

      // Generate AI response
      const aiResponse = await generateAIResponse(message);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        type: 'ai',
        timestamp: new Date(),
        context: {
          page: currentPage,
          workflow: 'ultra-complete-pwa-workflow',
          suggestions: ['Run tests', 'Check pipeline', 'Monitor performance'],
        },
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to feedback system
      await db.createFeedback({
        content: `User: ${message}\nAI: ${aiResponse}`,
        type: 'chat-interaction',
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        page_context: currentPage,
      });
    } catch (error) {
      console.error('Error in chat interaction:', error);

      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content:
          "I'm having trouble processing your request right now. Please try again or check the console for more details.",
        type: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center z-50'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className='w-6 h-6 text-white' />
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className='fixed bottom-24 right-6 w-96 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl z-50'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-700/50'>
              <div className='flex items-center space-x-2'>
                <Bot className='w-5 h-5 text-cyan-400' />
                <span className='text-white font-medium'>
                  AI Workflow Assistant
                </span>
                <Sparkles className='w-4 h-4 text-purple-400' />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* Messages */}
            <div className='h-96 overflow-y-auto p-4 space-y-4'>
              {messages.length === 0 ? (
                <div className='text-sm text-gray-300 space-y-2'>
                  <p>
                    🤖 Hi! I'm your AI Workflow Assistant for MyMindVentures.io
                  </p>
                  <p>I can help you with:</p>
                  <ul className='list-disc list-inside space-y-1 text-xs'>
                    <li>Testing strategies & coverage</li>
                    <li>CI/CD pipeline optimization</li>
                    <li>Performance monitoring</li>
                    <li>Security scanning</li>
                    <li>Docker & deployment</li>
                    <li>Code quality improvements</li>
                    <li>AI-powered development tools</li>
                  </ul>
                  <p className='text-cyan-400'>
                    Ask me anything about your ultra-complete workflow! 🚀
                  </p>
                </div>
              ) : (
                messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <div className='text-sm whitespace-pre-wrap'>
                        {msg.content}
                      </div>
                      {msg.context?.suggestions && (
                        <div className='mt-2 pt-2 border-t border-gray-600'>
                          <p className='text-xs text-gray-400 mb-1'>
                            Quick actions:
                          </p>
                          <div className='flex flex-wrap gap-1'>
                            {msg.context.suggestions.map(
                              (suggestion, index) => (
                                <span
                                  key={index}
                                  className='text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-600'
                                >
                                  {suggestion}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex justify-start'
                >
                  <div className='bg-gray-800 text-gray-100 p-3 rounded-lg'>
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className='p-4 border-t border-gray-700/50'>
              <div className='flex space-x-2'>
                <Input
                  value={message}
                  onChange={setMessage}
                  onKeyPress={handleKeyPress}
                  placeholder='Ask about testing, CI/CD, monitoring, security...'
                  className='flex-1'
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim() || isTyping}
                  className='bg-cyan-600 hover:bg-cyan-700 text-white'
                >
                  <Send className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
