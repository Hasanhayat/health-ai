import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ChevronDown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { aiAPI } from '../services/api';
import { ChatMessage } from '../types';
import { toast } from 'sonner@2.0.3';

interface ExpandedMessages {
  [key: number]: boolean;
}

export function AIHealthChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<ExpandedMessages>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMessageExpansion = (index: number) => {
    setExpandedMessages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      message: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await aiAPI.healthQuery(question);
      const aiMessage: ChatMessage = {
        role: 'ai',
        message: response.response,
        timestamp: response.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get AI response');
      // Remove the user message if the request failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestedQuestions = [
    "What are the symptoms of diabetes?",
    "How can I improve my sleep quality?",
    "What's a healthy balanced diet?",
    "Tips for reducing stress"
  ];

  const handleSuggestedQuestion = (q: string) => {
    setQuestion(q);
    inputRef.current?.focus();
  };

  const shouldTruncate = (text: string) => text.length > 300;

  return (
    <Card className="flex flex-col border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-teal-700">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Bot className="h-5 w-5" />
          </motion.div>
          AI Health Assistant
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <p className="text-gray-600">Ask me anything about health, symptoms, or wellness tips</p>
      </CardHeader>

      <CardContent className="flex flex-col p-0">
        <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full text-center p-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Bot className="h-16 w-16 text-teal-300 mb-4" />
              </motion.div>
              <h3 className="text-gray-700 mb-2">Start a conversation</h3>
              <p className="text-gray-500 mb-4">
                Ask me about symptoms, health tips, or general wellness questions
              </p>
              
              <div className="grid grid-cols-1 gap-2 w-full mt-4">
                {suggestedQuestions.map((q, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-left px-3 py-2 bg-white border border-teal-200 rounded-lg text-gray-700 hover:bg-teal-50 hover:border-teal-400 transition-all duration-200"
                  >
                    <span className="text-teal-600 mr-2">💡</span>
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isExpanded = expandedMessages[index];
                  const messageTruncated = !isExpanded && shouldTruncate(msg.message);
                  const displayMessage = messageTruncated 
                    ? msg.message.substring(0, 300) + '...' 
                    : msg.message;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'ai' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-teal-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0"
                        >
                          <Bot className="h-4 w-4 text-teal-600" />
                        </motion.div>
                      )}
                      <div className="max-w-[80%]">
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className={`px-4 py-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-900 shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{displayMessage}</p>
                        </motion.div>
                        
                        {msg.role === 'ai' && shouldTruncate(msg.message) && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => toggleMessageExpansion(index)}
                            className="mt-2 text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
                          >
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : ''
                              }`} 
                            />
                            <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                          </motion.button>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0"
                        >
                          <User className="h-4 w-4 text-blue-600" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="bg-teal-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-teal-600 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-teal-600 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-teal-600 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-teal-50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a health question..."
                disabled={isLoading}
                className="h-11 pr-4 shadow-sm border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all bg-white"
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isLoading || !question.trim()}
                size="lg"
                className="h-11 px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
