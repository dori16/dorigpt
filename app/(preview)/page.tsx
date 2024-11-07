"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { AttachmentIcon, SendIcon } from "@/components/icons";
import Link from "next/link";
import Image from 'next/image';
import Markdown from "react-markdown";

export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);  
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>([messages]);

  const suggestedActions = [
    { title: "Non funziona", label: "un cazzo", action: "Non funziona" },
    { title: "Show me", label: "my smart home hub", action: "Show me my smart home hub" },
    {
      title: "How much",
      label: "electricity have I used this month?",
      action: "Show electricity usage",
    },
    {
      title: "How much",
      label: "water have I used this month?",
      action: "Show water usage",
    },
  ];

  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900">
    <div className="h-screen flex flex-col bg-white/30 dark:bg-zinc-900/50 backdrop-blur-md backdrop-saturate-150 relative">
      {/* Blobs decorativi */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-950 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-950 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Area messaggi con scroll */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar relative z-10 flex flex-col items-center"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#888888 transparent' }}
      >
        <div className="w-[900px]">
          {messages.map((message) => message)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Area fissa in basso */}
      <div className="flex justify-center">
      <div className="sticky bottom-0 w-[900px] bg-white/30 dark:bg-zinc-900/50 backdrop-blur-md border-t border-white/20 dark:border-zinc-800/30  z-20">
        {/* Suggerimenti sempre visibili */}
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/50 rounded-md backdrop-blur-sm border border-white/20 dark:border-zinc-800/30 transition-all duration-200"
                onClick={() => {
                  setInput(action.action);
                }}
              >
                <span className="font-medium">{action.title}</span>{" "}
                <span className="text-zinc-600 dark:text-zinc-400">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form input */}
        <form
          className="p-4 w-[900px]"
          onSubmit={async (event) => {
            event.preventDefault();
            setMessages((messages) => [
              ...messages,
              <Message key={messages.length} role="user" content={input} />,
            ]);
            setInput("");
            const response: ReactNode = await sendMessage(input);
            setMessages((messages) => [...messages, response]);
          }}
        >
          <div className="flex items-center bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm border border-white/20 dark:border-zinc-800/30 rounded-md px-4  shadow-lg">
          <div className="w-full">
            <textarea
              ref={inputRef}
              className=" w-full < bg-transparent outline-none text-zinc-800 dark:text-zinc-300 overflow-y-scroll scrollbar resize-none min-h-[20px] max-h-[160px]"
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#888888 transparent',
                textAlign: 'left',
           
              }}
              placeholder="Scrivi un messaggio a DoriGPT"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                event.target.style.height = 'inherit';
                const scrollHeight = event.target.scrollHeight;
                event.target.style.height = `${Math.min(scrollHeight, 160)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() || attachments.length > 0) {
                    const form = e.currentTarget.form;
                    form?.requestSubmit();
                  }
                }
                if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault();
                  setInput(prev => prev + '\n');
                }
              }}
            />
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">
                <AttachmentIcon />
              </label>
              <button 
                type="submit"
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
                disabled={!input.trim() && attachments.length === 0}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </form>
      </div>
      </div>
    </div>
    </div>
  );
}