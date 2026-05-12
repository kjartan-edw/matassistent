"use client";

import { useRef, useState } from "react";

interface Props {
  onSend: (text: string, image?: File, imagePreview?: string) => void;
  loading: boolean;
}

export default function MåltidInput({ onSend, loading }: Props) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function velgBilde(file: File) {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function fjernBilde() {
    setImage(null);
    setPreview(null);
  }

  function send() {
    if (!text.trim() && !image) return;
    onSend(text, image ?? undefined, preview ?? undefined);
    setText("");
    setImage(null);
    setPreview(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const kanSende = !loading && (!!text.trim() || !!image);

  return (
    <div
      className="px-4 pt-3 pb-8"
      style={{
        background: "rgba(245,245,247,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {preview && (
        <div className="relative mb-2 inline-block">
          <img src={preview} alt="Forhåndsvisning" className="h-20 w-20 rounded-2xl object-cover" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
          <button
            onClick={fjernBilde}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
            style={{ background: "#1d1d1f" }}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Kamera */}
        <button
          onClick={() => cameraRef.current?.click()}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-lg transition-opacity active:opacity-60"
          style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          title="Ta bilde"
        >
          📷
        </button>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => e.target.files?.[0] && velgBilde(e.target.files[0])} />

        {/* Galleri */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-lg transition-opacity active:opacity-60"
          style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          title="Velg fra galleri"
        >
          🖼️
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && velgBilde(e.target.files[0])} />

        {/* Tekstfelt */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hva spiser du?"
          rows={1}
          className="flex-1 resize-none rounded-2xl border-0 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{
            background: "#fff",
            color: "#1d1d1f",
            maxHeight: "120px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        />

        {/* Send */}
        <button
          onClick={send}
          disabled={!kanSende}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-white transition-all active:scale-95 disabled:opacity-30"
          style={{ background: kanSende ? "#34C759" : "#86868b" }}
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
