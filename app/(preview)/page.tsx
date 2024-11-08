"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { AttachmentIcon, SendIcon } from "@/components/icons";
import { useRouter } from "next/navigation";


  export default function Home() {
    const { sendMessage } = useActions();
  

  const router = useRouter();
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
  const [aiProvider, setAiProvider] = useState<'openai' | 'anthropic'>('openai');

  // Definisci i modelli disponibili
  const AI_MODELS = {
    openai: ['gpt-4o', 'gpt-3.5-turbo'] as const,
    anthropic: ['claude-3-5-sonnet-latest', 'claude-3-opus'] as const
  };

  // Modifica lo state per includere sia il provider che il modello specifico
  const [selectedModel, setSelectedModel] = useState<string>(AI_MODELS.openai[0]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Errore nel controllo dell'autenticazione:", error);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (text: string) => {
    console.log("Provider selezionato:", aiProvider);
    console.log("Modello selezionato:", selectedModel);
    
    try {
      const response: ReactNode = await sendMessage(text, { 
        provider: aiProvider, 
        model: selectedModel 
      });
      console.log("Risposta ricevuta:", response);
      
      setInput("");
      
      setMessages((messages) => [
        ...messages,
        <Message key={messages.length} role="user" content={text} />,
      ]);
      
      setMessages((messages) => [...messages, response]);
    } catch (error) {
      console.error("Errore dettagliato:", error);
    }
  };

  useEffect(() => {
    console.log("Valore corrente di input:", input);
  }, [input]);

  // Funzione per determinare il provider dal modello selezionato
  const getProviderFromModel = (model: string) => {
    if (AI_MODELS.openai.includes(model as any)) return 'openai';
    if (AI_MODELS.anthropic.includes(model as any)) return 'anthropic';
    return 'openai'; // default fallback
  };

  // Aggiorna il gestore del cambio modello
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setAiProvider(getProviderFromModel(model));
  };

  return (
    <div className="bg-white dark:bg-zinc-900">
    <div className="h-[100dvh] flex flex-col bg-white/30 dark:bg-zinc-900/50 backdrop-blur-md backdrop-saturate-150 relative">
      {/* Dropdown per la selezione del provider */}
      <div className="absolute top-4 right-4 z-20">
        <select
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value)}
          className="bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm border border-white/20 dark:border-zinc-800/30 rounded-md px-3 py-1 text-sm text-zinc-800 dark:text-zinc-300 outline-none"
        >
          <optgroup label="OpenAI">
            {AI_MODELS.openai.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </optgroup>
          <optgroup label="Anthropic">
            {AI_MODELS.anthropic.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Blobs decorativi */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-48 sm:w-72 h-48 sm:h-72 bg-purple-950 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-blue-950 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Area messaggi con scroll */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar relative z-10 flex flex-col items-center pb-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#888888 transparent' }}
      >
        <div className="w-full max-w-[900px] px-4">
          {messages.map((message) => message)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Area fissa in basso - modificata per centrare e limitare larghezza */}
      <div className="sticky bottom-0 left-0 right-0 flex justify-center w-full z-20">
        <div className="w-full max-w-[900px] bg-white/30 dark:bg-zinc-900/50 backdrop-blur-md border-t border-white/20 dark:border-zinc-800/30">
          {/* Suggerimenti */}
          <div className="p-2 sm:p-3">
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/50 rounded-md backdrop-blur-sm border border-white/20 dark:border-zinc-800/30 transition-all duration-200"
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
          <div className="p-2 sm:p-3 w-full">
            <div className="flex items-center bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm border border-white/20 dark:border-zinc-800/30 rounded-md px-2 sm:px-4 shadow-lg">
              <div className="w-full">
                <textarea
                  ref={inputRef}
                  className="w-full bg-transparent outline-none text-sm sm:text-base text-zinc-800 dark:text-zinc-300 overflow-y-scroll scrollbar resize-none min-h-[20px] max-h-[160px] py-2 sm:py-3"
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
                      handleSubmit(input);
                    }
                    if (e.key === 'Enter' && e.shiftKey) {
                      e.preventDefault();
                      setInput(prev => prev + '\n');
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors">
                  <AttachmentIcon  />
                </label>
                <button 
                  type="submit"
                  className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
                  disabled={!input.trim()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(input);
                  }}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
