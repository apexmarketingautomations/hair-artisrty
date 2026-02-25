import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function ChatMessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  const parts = content.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s)]+)/g);

  return (
    <span>
      {parts.map((part, i) => {
        const mdMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (mdMatch) {
          return (
            <a
              key={i}
              href={mdMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline font-medium ${isUser ? "text-primary-foreground" : "text-primary"}`}
              data-testid={`link-chat-${i}`}
            >
              {mdMatch[1]}
            </a>
          );
        }

        if (/^https?:\/\/[^\s)]+$/.test(part)) {
          const label = part.length > 40 ? part.slice(0, 37) + "..." : part;
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline font-medium break-all ${isUser ? "text-primary-foreground" : "text-primary"}`}
              data-testid={`link-chat-${i}`}
            >
              {label}
            </a>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const createConversation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/conversations", { title: "Salon Chat" });
      return res.json();
    },
  });

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsStreaming(true);

    try {
      let convId = conversationId;
      if (!convId) {
        const conv = await createConversation.mutateAsync();
        convId = conv.id;
        setConversationId(convId);
      }

      const response = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.content) {
              assistantContent += event.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""),
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again or call us at (239) 677-9902." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          data-testid="button-open-chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-48px)] bg-background border border-border rounded-md shadow-xl flex flex-col" data-testid="container-chat">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-primary/5 rounded-t-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Hair Artistry AI</h3>
                <p className="text-xs text-muted-foreground">Your salon assistant</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1 text-sm">Welcome to Hair Artistry!</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Ask me about services, pricing, hours, or get personalized recommendations.
                </p>
                <div className="space-y-2">
                  {[
                    "What services do you offer?",
                    "I need a curly hair specialist",
                    "Do you do bridal hair?",
                    "What are your hours?",
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(suggestion);
                      }}
                      className="block w-full text-left text-xs px-3 py-2 rounded-md border border-border bg-card hover-elevate"
                      data-testid={`button-suggestion-${i}`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.role}-${i}`}
              >
                {msg.role === "assistant" && (
                  <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-md text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  {msg.content ? (
                    <ChatMessageContent content={msg.content} isUser={msg.role === "user"} />
                  ) : (
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center mt-0.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our services..."
                disabled={isStreaming}
                className="text-sm"
                data-testid="input-chat"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                data-testid="button-send-chat"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
