/**
 * AI Provider abstraction layer.
 * Priority: Gemini > Anthropic > OpenAI
 * At least one API key must be set or the process will exit.
 */

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AIProvider = {
  name: string;
  streamChat(systemPrompt: string, history: ChatMessage[], userMessage: string): AsyncGenerator<string>;
};

function buildGeminiProvider(apiKey: string): AIProvider {
  return {
    name: "Gemini",
    async *streamChat(systemPrompt, history, userMessage) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      // Convert history to Gemini format (exclude the current user message)
      const geminiHistory = history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessageStream(userMessage);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
    },
  };
}

function buildAnthropicProvider(apiKey: string): AIProvider {
  return {
    name: "Anthropic",
    async *streamChat(systemPrompt, history, userMessage) {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey });

      const messages: { role: "user" | "assistant"; content: string }[] = [
        ...history,
        { role: "user", content: userMessage },
      ];

      const stream = await client.messages.stream({
        model: "claude-3-5-haiku-latest",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          yield event.delta.text;
        }
      }
    },
  };
}

function buildOpenAIProvider(apiKey: string): AIProvider {
  return {
    name: "OpenAI",
    async *streamChat(systemPrompt, history, userMessage) {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey });

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: userMessage },
      ];

      const stream = await client.chat.completions.create({
        model: "gpt-4o",
        messages,
        stream: true,
        max_tokens: 1024,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) yield text;
      }
    },
  };
}

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  if (process.env.GEMINI_API_KEY) {
    _provider = buildGeminiProvider(process.env.GEMINI_API_KEY);
  } else if (process.env.ANTHROPIC_API_KEY) {
    _provider = buildAnthropicProvider(process.env.ANTHROPIC_API_KEY);
  } else if (process.env.OPENAI_API_KEY) {
    _provider = buildOpenAIProvider(process.env.OPENAI_API_KEY);
  } else {
    console.error(
      "No AI provider API key found. Set GEMINI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY."
    );
    process.exit(1);
  }

  console.log(`[AI] Active provider: ${_provider.name}`);
  return _provider;
}
