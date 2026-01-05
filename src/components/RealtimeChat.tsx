"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { RealtimeChat } from '@/lib/realtime';
import { ChatMessage } from '@/lib/chat-service';

interface RealtimeChatProps {
  initialMessages: ChatMessage[];
  userId: string;
  username: string;
}

export default function RealtimeChatComponent({ initialMessages, userId, username }: RealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realtimeRef = useRef<RealtimeChat | null>(null);

  useEffect(() => {
    const realtime = new RealtimeChat();
    realtimeRef.current = realtime;

    const unsubscribe = realtime.subscribe((newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const uploadFileToServer = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.file;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!inputMessage.trim() && !uploadFile) || isLoading) return;

    setIsLoading(true);

    try {
      let fileData = null;
      if (uploadFile) {
        fileData = await uploadFileToServer(uploadFile);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username,
          message: inputMessage.trim() || '(file attachment)',
          fileUrl: fileData?.url,
          fileName: fileData?.name,
          fileType: fileData?.type,
          fileSize: fileData?.size,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
        return;
      }

      setInputMessage('');
      setUploadFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.userId === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <div className="font-semibold text-sm mb-1">{msg.username}</div>
              <div className="text-sm">{msg.message}</div>
              {msg.fileUrl && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  {msg.fileType?.startsWith('image/') ? (
                    <img
                      src={msg.fileUrl}
                      alt={msg.fileName}
                      className="max-w-full rounded"
                    />
                  ) : (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm underline"
                    >
                      <span>📎 {msg.fileName}</span>
                      {msg.fileSize && <span>({formatFileSize(msg.fileSize)})</span>}
                    </a>
                  )}
                </div>
              )}
              <div className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        {uploadFile && (
          <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
            <span className="text-sm">📎 {uploadFile.name}</span>
            <button
              type="button"
              onClick={() => setUploadFile(null)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <label className="cursor-pointer px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
            📎
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx"
            />
          </label>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!inputMessage.trim() && !uploadFile)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
