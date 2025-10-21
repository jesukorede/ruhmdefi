'use client';

import React from 'react';

export type ToastMsg = { id: string; type?: 'success' | 'error' | 'info'; text: string };

export default function Toast({ messages, onDismiss }: { messages: ToastMsg[]; onDismiss: (id: string) => void }) {
  if (!messages?.length) return null;
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded px-4 py-2 shadow text-[var(--foreground)] ${
            m.type === 'error' ? 'bg-red-600' : m.type === 'success' ? 'bg-[#119611]' : 'bg-[#222] border border-[var(--border)]'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-sm">{m.text}</span>
            <button
              className="text-xs opacity-80 hover:opacity-100 underline"
              onClick={() => onDismiss(m.id)}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}