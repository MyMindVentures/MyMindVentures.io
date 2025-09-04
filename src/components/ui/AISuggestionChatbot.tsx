import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    suggestion?: {
      title: string;
      description: string;
      theme: string;
      category: string;
      priority: string;
    };
  };
}

interface AISuggestionChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuggestion: (suggestion: {
    title: string;
    description: string;
    theme: string;
    category: string;
    priority: string;
    source: 'user' | 'founder' | 'ai';
    userName: string;
  }) => void;
  userName?: string;
  userRole?: 'user' | 'founder' | 'ai';
}

export const AISuggestionChatbot: React.FC<AISuggestionChatbotProps> = ({
  isOpen,
  onClose,
  onSubmitSuggestion,
  userName = 'User',
  userRole = 'user',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<{
    stage:
      | 'greeting'
      | 'collecting'
      | 'clarifying'
      | 'summarizing'
      | 'complete';
    collectedInfo: {
      title?: string;
      description?: string;
      theme?: string;
      category?: string;
      priority?: string;
    };
  }>({
    stage: 'greeting',
    collectedInfo: {},
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Start conversation with greeting
      setTimeout(() => {
        addAIMessage(getGreetingMessage());
      }, 500);

      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type: 'user' | 'ai', content: string, metadata?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    addMessage('user', content);
  };

  const addAIMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        addMessage('ai', content);
      },
      1000 + Math.random() * 1000
    ); // Random typing delay for realism
  };

  const getGreetingMessage = () => {
    const roleText =
      userRole === 'founder'
        ? 'Founder'
        : userRole === 'ai'
          ? 'AI Developer'
          : 'User';
    return `👋 Hi ${userName}! I'm your AI Content Writer & App Developer assistant. 

I'm here to help you create detailed suggestions for improving the app. Whether it's a new feature, UI improvement, performance optimization, or anything else - just tell me what's on your mind!

What would you like to suggest or improve?`;
  };

  const processUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase();

    // Add user message
    addUserMessage(input);

    // Process based on conversation stage
    switch (conversationContext.stage) {
      case 'greeting':
        handleInitialInput(input);
        break;
      case 'collecting':
        handleInformationCollection(input);
        break;
      case 'clarifying':
        handleClarification(input);
        break;
      case 'summarizing':
        handleConfirmation(input);
        break;
      default:
        break;
    }
  };

  const handleInitialInput = (input: string) => {
    // Analyze user input to extract initial information
    const analysis = analyzeUserInput(input);

    setConversationContext(prev => ({
      ...prev,
      stage: 'collecting',
      collectedInfo: {
        ...prev.collectedInfo,
        ...analysis,
      },
    }));

    // Ask follow-up questions based on what we have
    const followUpQuestions = generateFollowUpQuestions(analysis);
    addAIMessage(followUpQuestions);
  };

  const handleInformationCollection = (input: string) => {
    const currentInfo = conversationContext.collectedInfo;
    const analysis = analyzeUserInput(input);

    const updatedInfo = { ...currentInfo, ...analysis };
    setConversationContext(prev => ({
      ...prev,
      collectedInfo: updatedInfo,
    }));

    // Check if we have enough information
    if (isInformationComplete(updatedInfo)) {
      // Move to clarification stage
      setConversationContext(prev => ({ ...prev, stage: 'clarifying' }));
      addAIMessage(generateClarificationQuestions(updatedInfo));
    } else {
      // Ask for more specific information
      const nextQuestion = getNextQuestion(updatedInfo);
      addAIMessage(nextQuestion);
    }
  };

  const handleClarification = (input: string) => {
    const currentInfo = conversationContext.collectedInfo;
    const analysis = analyzeUserInput(input);

    const updatedInfo = { ...currentInfo, ...analysis };
    setConversationContext(prev => ({
      ...prev,
      collectedInfo: updatedInfo,
      stage: 'summarizing',
    }));

    // Show summary and ask for confirmation
    addAIMessage(generateSummary(updatedInfo));
  };

  const handleConfirmation = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes('yes') ||
      lowerInput.includes('correct') ||
      lowerInput.includes('good') ||
      lowerInput.includes('perfect')
    ) {
      // Submit the suggestion
      const suggestion = {
        title: conversationContext.collectedInfo.title || 'User Suggestion',
        description: conversationContext.collectedInfo.description || '',
        theme: conversationContext.collectedInfo.theme || 'General',
        category: conversationContext.collectedInfo.category || 'feature',
        priority: conversationContext.collectedInfo.priority || 'medium',
        source:
          userRole === 'founder'
            ? 'founder'
            : userRole === 'ai'
              ? 'ai'
              : 'user',
        userName: userName,
      };

      onSubmitSuggestion(suggestion);

      // Show success message
      addAIMessage(`🎉 Perfect! Your suggestion has been submitted successfully. 

Here's what we captured:
• **Title**: ${suggestion.title}
• **Theme**: ${suggestion.theme}
• **Category**: ${suggestion.category}
• **Priority**: ${suggestion.priority}

You can view it in the Suggestions & Feedback section. Thank you for helping improve the app! 🚀`);

      setConversationContext(prev => ({ ...prev, stage: 'complete' }));
    } else {
      // Go back to collecting stage
      setConversationContext(prev => ({ ...prev, stage: 'collecting' }));
      addAIMessage(`No problem! Let me ask you some questions to better understand your suggestion. 

What would you like to suggest or improve?`);
    }
  };

  const analyzeUserInput = (input: string) => {
    const analysis: any = {};
    const lowerInput = input.toLowerCase();

    // Extract theme
    if (
      lowerInput.includes('ui') ||
      lowerInput.includes('design') ||
      lowerInput.includes('look') ||
      lowerInput.includes('appearance')
    ) {
      analysis.theme = 'UI/UX Design';
    } else if (
      lowerInput.includes('performance') ||
      lowerInput.includes('speed') ||
      lowerInput.includes('fast') ||
      lowerInput.includes('slow')
    ) {
      analysis.theme = 'Performance';
    } else if (
      lowerInput.includes('feature') ||
      lowerInput.includes('functionality') ||
      lowerInput.includes('tool')
    ) {
      analysis.theme = 'New Features';
    } else if (
      lowerInput.includes('mobile') ||
      lowerInput.includes('responsive') ||
      lowerInput.includes('phone')
    ) {
      analysis.theme = 'Mobile Experience';
    } else if (
      lowerInput.includes('security') ||
      lowerInput.includes('privacy') ||
      lowerInput.includes('safe')
    ) {
      analysis.theme = 'Security & Privacy';
    }

    // Extract priority
    if (
      lowerInput.includes('urgent') ||
      lowerInput.includes('critical') ||
      lowerInput.includes('important') ||
      lowerInput.includes('asap')
    ) {
      analysis.priority = 'high';
    } else if (
      lowerInput.includes('low') ||
      lowerInput.includes('nice to have') ||
      lowerInput.includes('optional')
    ) {
      analysis.priority = 'low';
    } else {
      analysis.priority = 'medium';
    }

    // Extract category
    if (
      lowerInput.includes('bug') ||
      lowerInput.includes('fix') ||
      lowerInput.includes('error')
    ) {
      analysis.category = 'bug-fix';
    } else if (
      lowerInput.includes('improvement') ||
      lowerInput.includes('enhancement')
    ) {
      analysis.category = 'improvement';
    } else {
      analysis.category = 'feature';
    }

    // Extract title and description
    if (input.length > 10) {
      analysis.title =
        input.substring(0, 60) + (input.length > 60 ? '...' : '');
      analysis.description = input;
    }

    return analysis;
  };

  const generateFollowUpQuestions = (analysis: any) => {
    let questions = '';

    if (!analysis.title || analysis.title.length < 10) {
      questions += `📝 **What would you like to call this suggestion?** (Give it a clear, descriptive title)\n\n`;
    }

    if (!analysis.description || analysis.description.length < 20) {
      questions += `💡 **Can you tell me more about this?** (Describe what you want to achieve, why it's important, and how it should work)\n\n`;
    }

    if (!analysis.theme) {
      questions += `🎨 **What area does this relate to?** (UI/UX, Performance, New Features, Mobile Experience, Security, etc.)\n\n`;
    }

    if (!analysis.priority) {
      questions += `⚡ **How urgent is this?** (High priority for critical issues, Medium for important improvements, Low for nice-to-have features)\n\n`;
    }

    return (
      questions ||
      'Great! I have a good understanding of your suggestion. Let me ask a few clarifying questions...'
    );
  };

  const isInformationComplete = (info: any) => {
    return info.title && info.description && info.theme && info.priority;
  };

  const getNextQuestion = (info: any) => {
    if (!info.title) {
      return '📝 **What would you like to call this suggestion?** (Give it a clear, descriptive title)';
    }
    if (!info.description) {
      return "💡 **Can you tell me more about this?** (Describe what you want to achieve, why it's important, and how it should work)";
    }
    if (!info.theme) {
      return '🎨 **What area does this relate to?** (UI/UX, Performance, New Features, Mobile Experience, Security, etc.)';
    }
    if (!info.priority) {
      return '⚡ **How urgent is this?** (High priority for critical issues, Medium for important improvements, Low for nice-to-have features)';
    }
    return 'Perfect! I have all the information I need. Let me ask a few clarifying questions...';
  };

  const generateClarificationQuestions = (info: any) => {
    return `🔍 **Let me clarify a few things about your suggestion:**

**Title**: ${info.title}
**Theme**: ${info.theme}
**Priority**: ${info.priority}

**A few questions to make sure I understand correctly:**

1. **Is this for users or developers?** (End-user feature, developer tool, admin function, etc.)
2. **What's the main benefit?** (Faster workflow, better user experience, improved security, etc.)
3. **Any specific requirements?** (Must work on mobile, needs to integrate with existing features, etc.)

Please answer these questions so I can create the perfect suggestion for you! ✨`;
  };

  const generateSummary = (info: any) => {
    return `📋 **Perfect! Here's a summary of your suggestion:**

**Title**: ${info.title}
**Theme**: ${info.theme}
**Category**: ${info.category}
**Priority**: ${info.priority}
**Description**: ${info.description}

**Does this look correct?** 

If yes, just say "yes" or "correct" and I'll submit it. If you want to change anything, just tell me what to adjust! 🚀`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      processUserInput(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationContext({
      stage: 'greeting',
      collectedInfo: {},
    });
    setTimeout(() => {
      addAIMessage(getGreetingMessage());
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
              <Bot className='w-6 h-6 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                AI Suggestion Assistant
              </h2>
              <p className='text-sm text-gray-600'>
                Content Writer & App Developer
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              onClick={resetConversation}
              variant='ghost'
              size='sm'
              className='text-gray-600 hover:text-gray-900'
            >
              <Sparkles className='w-4 h-4 mr-1' />
              New Chat
            </Button>
            <Button
              onClick={onClose}
              variant='ghost'
              size='sm'
              className='text-gray-600 hover:text-gray-900'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-6 space-y-4'>
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user'
                        ? 'bg-blue-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className='w-4 h-4 text-white' />
                    ) : (
                      <Bot className='w-4 h-4 text-white' />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className='whitespace-pre-wrap text-sm'>
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.type === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex justify-start'
            >
              <div className='flex items-start space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                  <Bot className='w-4 h-4 text-white' />
                </div>
                <div className='bg-gray-100 rounded-2xl px-4 py-3'>
                  <div className='flex items-center space-x-2'>
                    <Loader2 className='w-4 h-4 animate-spin text-purple-500' />
                    <span className='text-sm text-gray-600'>
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className='p-6 border-t border-gray-200'>
          <form onSubmit={handleSubmit} className='flex space-x-3'>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Type your suggestion or answer my questions...'
              className='flex-1'
              disabled={isTyping}
            />
            <Button
              type='submit'
              disabled={!inputValue.trim() || isTyping}
              className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            >
              <Send className='w-4 h-4' />
            </Button>
          </form>

          <div className='mt-3 text-xs text-gray-500 text-center'>
            💡 Tip: Be as detailed as possible! The more context you provide,
            the better I can help.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
