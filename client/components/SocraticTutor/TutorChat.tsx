'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'tutor';
  content: string;
  timestamp: Date;
}

export default function SocraticTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'tutor',
      content: "Hi! I'm your Socratic tutor. Instead of giving you answers, I'll guide you to discover them yourself. What are you working on?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate tutor response (replace with actual AI call)
    setTimeout(() => {
      const tutorMessage: Message = {
        role: 'tutor',
        content: "That's interesting! What do you think would happen if you tried that approach? What are the potential challenges?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, tutorMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Minimized Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="
                relative w-16 h-16 rounded-full
                bg-gradient-to-br from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                shadow-lg shadow-blue-500/20
                group
              "
            >
              {/* Pulsing ring */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full border-2 border-blue-400"
              />

              <MessageCircle className="w-6 h-6 text-white" />

              {/* Notification dot */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="
              fixed bottom-6 right-6 z-50
              w-96 h-[600px]
              rounded-2xl overflow-hidden
              bg-white/95
              backdrop-blur-2xl
              border border-slate-200
              shadow-2xl shadow-slate-200/50
              flex flex-col
            "
          >
            {/* Header */}
            <div className="
              p-4 border-b border-slate-100
              bg-slate-50
              flex items-center justify-between
            ">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Socratic Tutor</h3>
                  <p className="text-xs text-slate-500">Always online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-[80%] p-3 rounded-2xl
                      ${message.role === 'user'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-900 shadow-sm'
                      }
                    `}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="
                    flex-1 bg-slate-50 border-slate-200
                    focus:border-blue-500 focus:ring-blue-500/20
                    text-slate-900 placeholder:text-slate-500
                  "
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
