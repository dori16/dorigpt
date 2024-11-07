"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode, useState } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";
import React from "react";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [copied, setCopied] = useState(false);
  const streamedContent = useStreamableValue(content);

  const handleCopy = async () => {
    try {
      const textToCopy = typeof streamedContent === 'string' 
        ? streamedContent 
        : streamedContent.toString()
          .replace(/,\s*(false|true)/g, '')
          .replace(/,\s*$/, '');
        
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Errore durante la copia:', error);
    }
  };

  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full max-w-[900px] mx-auto md:px-0 first-of-type:pt-20"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <button
          onClick={handleCopy}
          className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 mb-2 self-start"
        >
          {copied ? "✓ Copiato!" : "📋 Copia"}
        </button>
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          <Markdown>
            {streamedContent.toString()
              .replace(/,\s*(false|true)/g, '')
              .replace(/,\s*$/, '')}
          </Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  const [copied, setCopied] = useState(false);
  


  return (
    <motion.div
      className={`flex flex-row gap-2 sm:gap-4 px-2 sm:px-4 w-full max-w-[900px] mx-auto md:px-0 first-of-type:pt-10 sm:first-of-type:pt-20 py-2 sm:py-4 ${
        role === "user" ? "flex-row-reverse" : ""
      }`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[20px] sm:size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className={`flex flex-col gap-1 w-full ${
        role === "user" ? "items-end" : ""
      }`}>
    
        <div className={`text-sm sm:text-base text-zinc-800 dark:text-zinc-300 flex flex-col gap-2 sm:gap-4 ${
          role === "user" ? "text-right max-w-[90%] sm:max-w-[80%]" : ""
        }`}>
          {content}
        </div>
      </div>
    </motion.div>
  );
};
