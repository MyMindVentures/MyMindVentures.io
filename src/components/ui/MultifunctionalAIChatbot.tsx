import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  X,
  Loader2,
  Lightbulb,
  HelpCircle,
  Search,
  Target,
  Brain,
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

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
    suggestedActions?: string[];
  };
}

interface MultifunctionalAIChatbotProps {
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

type ChatMode =
  | 'general'
  | 'suggestion'
  | 'brainstorming'
  | 'help'
  | 'documentation';

export const MultifunctionalAIChatbot: React.FC<
  MultifunctionalAIChatbotProps
> = ({
  isOpen,
  onClose,
  onSubmitSuggestion,
  userName = 'User',
  userRole = 'user',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('general');
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

  const addAIMessage = (content: string, metadata?: any) => {
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        addMessage('ai', content, metadata);
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
    return `👋 Hi ${userName}! I'm your AI Assistant for MyMindVentures.io.

I can help you with:
🤖 **Creating Suggestions & Feedback** - Tell me what you want to improve
💡 **Brainstorming New Features** - Let's explore ideas together
❓ **App Help & Questions** - Ask me anything about the app
📚 **Documentation Search** - I'll find relevant information for you

What would you like to do today?`;
  };

  const processUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase();

    // Add user message
    addUserMessage(input);

    // Determine chat mode based on input
    if (
      lowerInput.includes('suggestion') ||
      lowerInput.includes('feedback') ||
      lowerInput.includes('improve')
    ) {
      setChatMode('suggestion');
      handleSuggestionMode(input);
    } else if (
      lowerInput.includes('brainstorm') ||
      lowerInput.includes('idea') ||
      lowerInput.includes('feature')
    ) {
      setChatMode('brainstorming');
      handleBrainstormingMode(input);
    } else if (
      lowerInput.includes('help') ||
      lowerInput.includes('how') ||
      lowerInput.includes('what') ||
      lowerInput.includes('?')
    ) {
      setChatMode('help');
      handleHelpMode(input);
    } else if (
      lowerInput.includes('search') ||
      lowerInput.includes('find') ||
      lowerInput.includes('documentation')
    ) {
      setChatMode('documentation');
      handleDocumentationMode(input);
    } else {
      // General conversation or continue current mode
      handleCurrentMode(input);
    }
  };

  const handleSuggestionMode = async (input: string) => {
    if (conversationContext.stage === 'greeting') {
      // Start suggestion collection
      setConversationContext(prev => ({
        ...prev,
        stage: 'collecting',
      }));

      addAIMessage(`🎯 Great! Let's create a suggestion or feedback together.

Tell me what you'd like to suggest or what feedback you have. Be as detailed as possible - what's the problem, what would you like to see, why is it important?`);
    } else {
      // Continue with suggestion flow
      handleSuggestionFlow(input);
    }
  };

  const handleBrainstormingMode = async (input: string) => {
    addAIMessage(
      `💡 Excellent! Let's brainstorm together.

I can help you:
• Explore new feature ideas
• Analyze user needs
• Research best practices
• Create feature specifications
• Estimate complexity and effort

What area would you like to explore? (e.g., UI/UX, Performance, Security, New functionality, Mobile experience)`,
      {
        suggestedActions: [
          'Explore UI/UX improvements',
          'Brainstorm performance features',
          'Research security enhancements',
          'Design mobile-first features',
          'Create collaboration tools',
        ],
      }
    );
  };

  const handleHelpMode = async (input: string) => {
    addAIMessage(
      `❓ I'm here to help! 

I can answer questions about:
• How to use specific features
• App navigation and workflow
• Development tools and workflows
• Best practices and tips
• Troubleshooting issues

What specific question do you have?`,
      {
        suggestedActions: [
          'How to use the workflow?',
          'Where to find documentation?',
          'How to create suggestions?',
          'How to run AI analysis?',
          'App navigation help',
        ],
      }
    );
  };

  const handleDocumentationMode = async (input: string) => {
    addAIMessage(`📚 I can help you search through documentation and find relevant information.

What would you like to search for? I can help you find:
• Feature documentation
• API references
• User guides
• Best practices
• Troubleshooting info

Just tell me what you're looking for!`);
  };

  const handleCurrentMode = async (input: string) => {
    switch (chatMode) {
      case 'suggestion':
        handleSuggestionFlow(input);
        break;
      case 'brainstorming':
        handleBrainstormingFlow(input);
        break;
      case 'help':
        handleHelpFlow(input);
        break;
      case 'documentation':
        handleDocumentationFlow(input);
        break;
      default:
        // General conversation
        addAIMessage(`I'm here to help! You can:
• Ask me to create a suggestion/feedback
• Start brainstorming new features
• Ask for help with the app
• Search documentation
• Or just chat with me!

What would you like to do?`);
    }
  };

  const handleSuggestionFlow = async (input: string) => {
    const analysis = analyzeUserInput(input);

    setConversationContext(prev => ({
      ...prev,
      collectedInfo: {
        ...prev.collectedInfo,
        ...analysis,
      },
    }));

    if (isInformationComplete(analysis)) {
      // Move to confirmation
      setConversationContext(prev => ({ ...prev, stage: 'summarizing' }));
      addAIMessage(generateSuggestionSummary(analysis));
    } else {
      // Ask for more information
      const nextQuestion = getNextSuggestionQuestion(analysis);
      addAIMessage(nextQuestion);
    }
  };

  const handleBrainstormingFlow = async (input: string) => {
    // Analyze the brainstorming input
    const focus = analyzeBrainstormingFocus(input);

    addAIMessage(
      `💭 Great idea! Let me help you explore this further.

**Focus Area**: ${focus}

Let me ask some questions to develop this idea:
• What problem does this solve?
• Who would benefit most?
• What would success look like?
• Any technical considerations?

Tell me more about your vision!`,
      {
        suggestedActions: [
          'Define user stories',
          'Create mockup concept',
          'Research competitors',
          'Estimate effort',
          'Plan implementation',
        ],
      }
    );
  };

  const handleHelpFlow = async (input: string) => {
    // Provide helpful response based on the question
    const helpResponse = generateHelpResponse(input);
    addAIMessage(helpResponse);
  };

  const handleDocumentationFlow = async (input: string) => {
    // Continue documentation search or provide additional help
    addAIMessage(`I can help you further with the documentation. 

Would you like me to:
• Search for more specific information?
• Explain any concepts in detail?
• Help you apply this information?
• Create a summary or action plan?

Just let me know what you need!`);
  };

  const analyzeUserInput = (input: string) => {
    const analysis: any = {};
    const lowerInput = input.toLowerCase();

    // Extract theme
    if (
      lowerInput.includes('ui') ||
      lowerInput.includes('design') ||
      lowerInput.includes('look')
    ) {
      analysis.theme = 'UI/UX Design';
    } else if (
      lowerInput.includes('performance') ||
      lowerInput.includes('speed') ||
      lowerInput.includes('fast')
    ) {
      analysis.theme = 'Performance';
    } else if (
      lowerInput.includes('feature') ||
      lowerInput.includes('functionality')
    ) {
      analysis.theme = 'New Features';
    } else if (
      lowerInput.includes('mobile') ||
      lowerInput.includes('responsive')
    ) {
      analysis.theme = 'Mobile Experience';
    } else if (
      lowerInput.includes('security') ||
      lowerInput.includes('privacy')
    ) {
      analysis.theme = 'Security & Privacy';
    }

    // Extract priority
    if (
      lowerInput.includes('urgent') ||
      lowerInput.includes('critical') ||
      lowerInput.includes('important')
    ) {
      analysis.priority = 'high';
    } else if (
      lowerInput.includes('low') ||
      lowerInput.includes('nice to have')
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

  const analyzeBrainstormingFocus = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('ui') || lowerInput.includes('design'))
      return 'UI/UX Design';
    if (lowerInput.includes('performance') || lowerInput.includes('speed'))
      return 'Performance';
    if (lowerInput.includes('mobile') || lowerInput.includes('responsive'))
      return 'Mobile Experience';
    if (lowerInput.includes('collaboration') || lowerInput.includes('team'))
      return 'Team Collaboration';
    if (lowerInput.includes('ai') || lowerInput.includes('automation'))
      return 'AI & Automation';
    if (lowerInput.includes('security') || lowerInput.includes('privacy'))
      return 'Security & Privacy';

    return 'General Feature Development';
  };

  const generateHelpResponse = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('workflow') || lowerInput.includes('how to use')) {
      return `🔄 **How to use the Ultra Complete Workflow:**

1. **Start Workflow** - Click the big button to run the complete AI-powered analysis
2. **Monitor Progress** - Watch each step complete in real-time
3. **Review Results** - Check the Reports tab for detailed insights
4. **View AI Instructions** - See AI-generated suggestions for improvements
5. **Manage Roadmap** - Select and track suggestions you want to implement

The workflow will automatically:
• Analyze your codebase
• Generate AI insights
• Optimize performance
• Run security scans
• Update documentation
• Check Git status

Would you like me to explain any specific step in detail?`;
    } else if (
      lowerInput.includes('suggestion') ||
      lowerInput.includes('feedback')
    ) {
      return `💡 **How to create suggestions and feedback:**

You can:
1. **Use this chatbot** - Just tell me what you want to suggest
2. **Go to AI Instructions tab** - View existing AI-generated suggestions
3. **Add to Roadmap** - Select suggestions you want to implement
4. **Track Progress** - Monitor implementation status

I'll help you create detailed, actionable suggestions that get stored in the database and appear in the main suggestions list.

What would you like to suggest?`;
    } else if (lowerInput.includes('ai') || lowerInput.includes('analysis')) {
      return `🤖 **AI Analysis and Insights:**

The app uses multiple AI models to:
• **Analyze your codebase** - Find improvements and issues
• **Generate strategic insights** - Suggest new features and optimizations
• **Provide recommendations** - Prioritized action items
• **Monitor performance** - Track metrics and trends

All AI insights are stored and searchable, so you can always reference them later.

What specific aspect of AI analysis would you like to know more about?`;
    }

    return `I'm here to help! I can explain any part of the app, help you create suggestions, brainstorm new features, or search through documentation.

What would you like to know more about?`;
  };

  const isInformationComplete = (info: any) => {
    return info.title && info.description && info.theme && info.priority;
  };

  const getNextSuggestionQuestion = (info: any) => {
    if (!info.title) {
      return `📝 **What would you like to call this suggestion?** (Give it a clear, descriptive title)`;
    }
    if (!info.description) {
      return `💡 **Can you tell me more about this?** (Describe what you want to achieve, why it's important, and how it should work)`;
    }
    if (!info.theme) {
      return `🎨 **What area does this relate to?** (UI/UX, Performance, New Features, Mobile Experience, Security, etc.)`;
    }
    if (!info.priority) {
      return `⚡ **How urgent is this?** (High priority for critical issues, Medium for important improvements, Low for nice-to-have features)`;
    }
    return `Perfect! I have all the information I need. Let me ask a few clarifying questions...`;
  };

  const generateSuggestionSummary = (info: any) => {
    return `📋 **Perfect! Here's a summary of your suggestion:**

**Title**: ${info.title}
**Theme**: ${info.theme}
**Category**: ${info.category}
**Priority**: ${info.priority}
**Description**: ${info.description}

**Does this look correct?** 

If yes, just say "yes" or "correct" and I'll submit it as a suggestion. If you want to change anything, just tell me what to adjust! 🚀`;
  };

  const handleConfirmation = async (input: string) => {
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
        source: userRole,
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

      // Reset to general mode
      setTimeout(() => {
        setChatMode('general');
        setConversationContext({
          stage: 'greeting',
          collectedInfo: {},
        });
      }, 3000);
    } else {
      // Go back to collecting stage
      setConversationContext(prev => ({ ...prev, stage: 'collecting' }));
      addAIMessage(`No problem! Let me ask you some questions to better understand your suggestion. 

What would you like to suggest or improve?`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      if (conversationContext.stage === 'summarizing') {
        handleConfirmation(inputValue.trim());
      } else {
        processUserInput(inputValue.trim());
      }
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
    setChatMode('general');
    setConversationContext({
      stage: 'greeting',
      collectedInfo: {},
    });
    setTimeout(() => {
      addAIMessage(getGreetingMessage());
    }, 500);
  };

  const getModeIcon = () => {
    switch (chatMode) {
      case 'suggestion':
        return <Target className='w-4 h-4' />;
      case 'brainstorming':
        return <Brain className='w-4 h-4' />;
      case 'help':
        return <HelpCircle className='w-4 h-4' />;
      case 'documentation':
        return <Search className='w-4 h-4' />;
      default:
        return <MessageCircle className='w-4 h-4' />;
    }
  };

  const getModeColor = () => {
    switch (chatMode) {
      case 'suggestion':
        return 'from-green-500 to-blue-500';
      case 'brainstorming':
        return 'from-purple-500 to-pink-500';
      case 'help':
        return 'from-blue-500 to-cyan-500';
      case 'documentation':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
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
        className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div
              className={`w-10 h-10 bg-gradient-to-r ${getModeColor()} rounded-full flex items-center justify-center`}
            >
              {getModeIcon()}
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                AI Assistant
              </h2>
              <p className='text-sm text-gray-600'>
                {chatMode === 'suggestion' && 'Creating Suggestion/Feedback'}
                {chatMode === 'brainstorming' && 'Brainstorming New Features'}
                {chatMode === 'help' && 'App Help & Support'}
                {chatMode === 'documentation' && 'Documentation Search'}
                {chatMode === 'general' && 'General Assistant'}
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

        {/* Mode Selector */}
        <div className='flex space-x-1 p-4 bg-gray-50 border-b border-gray-200'>
          <button
            onClick={() => setChatMode('general')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chatMode === 'general'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className='w-4 h-4 inline mr-1' />
            General
          </button>
          <button
            onClick={() => setChatMode('suggestion')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chatMode === 'suggestion'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className='w-4 h-4 inline mr-1' />
            Suggestion
          </button>
          <button
            onClick={() => setChatMode('brainstorming')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chatMode === 'brainstorming'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className='w-4 h-4 inline mr-1' />
            Brainstorm
          </button>
          <button
            onClick={() => setChatMode('help')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chatMode === 'help'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HelpCircle className='w-4 h-4 inline mr-1' />
            Help
          </button>
          <button
            onClick={() => setChatMode('documentation')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chatMode === 'documentation'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className='w-4 h-4 inline mr-1' />
            Docs
          </button>
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
                        : `bg-gradient-to-r ${getModeColor()}`
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

                    {/* Show suggested actions if available */}
                    {message.metadata?.suggestedActions && (
                      <div className='mt-3 p-3 bg-green-50 rounded-lg'>
                        <h4 className='font-medium text-green-900 mb-2'>
                          💡 Suggested Actions:
                        </h4>
                        <div className='flex flex-wrap gap-2'>
                          {message.metadata.suggestedActions.map(
                            (action, index) => (
                              <button
                                key={index}
                                onClick={() => processUserInput(action)}
                                className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors'
                              >
                                {action}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}

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
                <div
                  className={`w-8 h-8 bg-gradient-to-r ${getModeColor()} rounded-full flex items-center justify-center`}
                >
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
              placeholder={
                chatMode === 'suggestion'
                  ? "Tell me what you'd like to suggest or improve..."
                  : chatMode === 'brainstorming'
                    ? "Share your idea or what you'd like to explore..."
                    : chatMode === 'help'
                      ? 'What would you like help with?'
                      : chatMode === 'documentation'
                        ? 'What would you like to search for?'
                        : 'How can I help you today?'
              }
              className='flex-1'
              disabled={isTyping}
            />
            <Button
              type='submit'
              disabled={!inputValue.trim() || isTyping}
              className={`bg-gradient-to-r ${getModeColor()} hover:from-opacity-80 hover:to-opacity-80`}
            >
              <Send className='w-4 h-4' />
            </Button>
          </form>

          <div className='mt-3 text-xs text-gray-500 text-center'>
            💡 Tip: You can switch between modes using the tabs above, or just
            start typing and I'll figure out what you need!
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
