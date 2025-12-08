'use client';

import { DotPattern } from '@/components/ui/dot-pattern';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Chat, Message } from '@/types/chat';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  readonly chat: Chat | null;
  readonly messages: Message[];
  readonly onSendMessage: (content: string) => void;
  readonly isLoading?: boolean;
  readonly isTyping?: boolean;
  readonly onBack?: () => void;
  readonly onCopyMessage?: (content: string) => void;
  readonly onEditMessage?: (messageId: string, newContent: string) => void;
  readonly onDeleteMessage?: (messageId: string) => void;
  readonly connectionStatus?: 'connected' | 'disconnected' | 'reconnecting' | 'error';
  readonly onRetryConnection?: () => void;
}

export function ChatWindow({
  chat,
  messages,
  onSendMessage,
  isLoading = false,
  isTyping = false,
  onBack,
  onCopyMessage,
  onEditMessage,
  onDeleteMessage,
  connectionStatus = 'connected',
  onRetryConnection,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!chat) {
    return (
      <div className='flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0B141A] dark:to-[#111B21] relative overflow-hidden'>
        <DotPattern className='opacity-30' />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className='text-center p-8 relative z-10'
        >
          <motion.div
            className='w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#005cff] to-[#004bd6] flex items-center justify-center shadow-lg'
            animate={{
              boxShadow: [
                '0 10px 25px rgba(0, 92, 255, 0.3)',
                '0 15px 35px rgba(0, 92, 255, 0.5)',
                '0 10px 25px rgba(0, 92, 255, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              className='w-10 h-10 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
          </motion.div>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2'>
            Select a chat
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Choose a conversation to start messaging
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0B141A] dark:to-[#111B21] relative overflow-hidden'>
      <DotPattern className='opacity-20' />
      {/* Header */}
      <ChatHeader
        chat={chat}
        onBack={onBack}
        connectionStatus={connectionStatus}
        onRetryConnection={onRetryConnection}
      />

      {/* Messages Area */}
      <ScrollArea className='flex-1 px-4 py-6 premium-scrollbar relative z-10'>
        <div className='max-w-4xl mx-auto'>
          {isLoading && (
            <div className='space-y-4'>
              {['skeleton-a', 'skeleton-b', 'skeleton-c', 'skeleton-d', 'skeleton-e', 'skeleton-f'].map((skeletonId) => (
                <div key={skeletonId} className='flex justify-start'>
                  <div className='bg-white/80 dark:bg-[#202C33]/80 backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-200/50 dark:border-gray-700/50 w-2/3'>
                    <div className='h-4 w-3/4 bg-gray-100 dark:bg-gray-800 shimmer-effect rounded mb-2' />
                    <div className='h-4 w-1/2 bg-gray-100 dark:bg-gray-800 shimmer-effect rounded' />
                  </div>
                </div>
              ))}
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className='flex flex-col items-center justify-center h-full py-16'
            >
              <motion.div
                className='w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#005cff] to-[#004bd6] flex items-center justify-center shadow-xl'
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg
                  className='w-10 h-10 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </motion.div>
              <h3 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2'>
                Ready to chat
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Start a conversation with your AI assistant
              </p>
            </motion.div>
          )}

          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isConsecutive =
              prevMessage?.role === message.role &&
              new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() <
                60000;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <MessageBubble
                  message={message}
                  isConsecutive={isConsecutive}
                  onCopy={onCopyMessage}
                  onEdit={onEditMessage}
                  onDelete={onDeleteMessage}
                />
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='flex justify-start mb-3'
            >
              <div className='bg-white/80 dark:bg-[#202C33]/80 backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-200/50 dark:border-gray-700/50'>
                <div className='flex gap-1.5'>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className='w-2 h-2 bg-[#005cff] rounded-full'
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
}
