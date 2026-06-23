import { useState, useCallback } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function useChatGroq(systemPrompt: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: userText.trim() };

    // Susun payload: system + history + pesan baru
    const payload: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
      userMsg,
    ];

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const assistantMsg: ChatMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);

    } catch (err) {
      console.error(err);
      setError('Gagal terhubung. Coba lagi.');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Maaf, terjadi kesalahan. Silakan coba lagi.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, systemPrompt]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, resetChat };
}
