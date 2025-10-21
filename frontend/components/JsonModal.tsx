'use client';

import React from 'react';

export default function JsonModal({
  open,
  title,
  data,
  onClose,
  onCopy,
}: {
  open: boolean;
  title?: string;
  data: any;
  onClose: () => void;
  onCopy?: () => void;
}) {
  if (!open) return null;

  const json = (() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Failed to stringify JSON';
    }
  })();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      onCopy?.();
    } catch (e) {
      // swallow
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center mt-10">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded shadow-lg w-11/12 max-w-3xl text-[var(--foreground)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
            <h3 className="text-sm font-semibold">{title || 'JSON'}</h3>
            <div className="flex gap-2">
              <button onClick={copy} className="text-xs rounded bg-[#119611] text-white px-2 py-1 hover:brightness-110">Copy</button>
              <button onClick={onClose} className="text-xs rounded border border-[var(--border)] px-2 py-1 hover:bg-[#1f1f1f]">Close</button>
            </div>
          </div>
          <div className="p-4">
            <pre className="text-xs text-gray-300 overflow-auto max-h-[60vh] whitespace-pre-wrap break-words">
              {json}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}