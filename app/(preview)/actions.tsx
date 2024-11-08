import { Message, TextStreamMessage } from "@/components/message";
import { openai } from "@ai-sdk/openai";
import { anthropic } from '@ai-sdk/anthropic';
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";

type ProviderOptions = {
  provider: 'openai' | 'anthropic';
};

const getAIConfig = (provider: 'openai' | 'anthropic') => {
  switch (provider) {
    case 'openai':
      return {
        model: openai("gpt-4o"),
        system: `\
          - you are a friendly and helpful AI assistant
          - you help users with their questions and tasks
          - you communicate in a clear and natural way
        `,
      };
    case 'anthropic':
      return {
        model: anthropic("claude-3-5-sonnet-latest"),
        system: `\
          - you are Claude, a friendly and helpful AI assistant
          - you help users with their questions and tasks
          - you communicate in a clear and natural way
        `,
      };
  }
};

const sendMessage = async (message: string, options: ProviderOptions) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");
  const aiConfig = getAIConfig(options.provider);

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    ...aiConfig,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);
        contentStream.done();
      } else {
        contentStream.update(content);
      }
      return textComponent;
    }
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});

// Definiamo tutti i modelli disponibili
export const AI_MODELS = {
  openai: [
    'gpt-4o',
  
    'gpt-3.5-turbo',
  ],
  anthropic: [
    'claude-3-opus',
    'claude-3-sonnet',
 
  ]
} as const;

// Tipo per i modelli
export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS][number];
