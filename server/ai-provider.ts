/**
 * AI Provider abstraction for Hair Artistry salon concierge.
 *
 * Priority order: Gemini > Anthropic > OpenAI
 * At least one provider key must be set or the process will exit with a clear error.
 */

export type ProviderName = "gemini" | "anthropic" | "openai";

export interface AIProvider {
  name: ProviderName;
  /** Stream a chat completion and yield text chunks. */
  streamChat(
    systemPrompt: string,
    messages: Array<{ role: "user" | "assistant"; content: string }>,
  ): AsyncIterable<string>;
}

// ---------------------------------------------------------------------------
// Gemini provider
// ---------------------------------------------------------------------------
function createGeminiProvider(apiKey: string): AIProvider {
  return {
    name: "gemini",
    async *streamChat(systemPrompt, messages) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      // Build Gemini history (all messages except the last user turn)
      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(lastMessage?.content ?? "");

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Anthropic provider
// ---------------------------------------------------------------------------
function createAnthropicProvider(apiKey: string): AIProvider {
  return {
    name: "anthropic",
    async *streamChat(systemPrompt, messages) {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey });
      const stream = await client.messages.stream({
        model: "claude-3-5-haiku-latest",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
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

// ---------------------------------------------------------------------------
// OpenAI provider
// ---------------------------------------------------------------------------
function createOpenAIProvider(apiKey: string): AIProvider {
  return {
    name: "openai",
    async *streamChat(systemPrompt, messages) {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey });
      const stream = await client.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 1024,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) yield text;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Provider selection & startup validation
// ---------------------------------------------------------------------------
function initProvider(): AIProvider {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    console.log("AI Provider: Gemini (active)");
    return createGeminiProvider(geminiKey);
  }

  if (anthropicKey) {
    console.log("AI Provider: Anthropic (active)");
    return createAnthropicProvider(anthropicKey);
  }

  if (openaiKey) {
    console.log("AI Provider: OpenAI (active)");
    return createOpenAIProvider(openaiKey);
  }

  console.error(
    "ERROR: No AI provider key found. " +
      "Set at least one of: GEMINI_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY",
  );
  process.exit(1);
}

// Initialise once at module load time so the startup check runs immediately.
const activeProvider: AIProvider = initProvider();

export function getAIProvider(): AIProvider {
  return activeProvider;
}
