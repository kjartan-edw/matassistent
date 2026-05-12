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

  return (
    <div className="border-t border-gray-100 bg-white p-4">
      {preview && (
        <div className="relative mb-3 inline-block">
          <img src={preview} alt="Forhåndsvisning" className="h-24 w-24 rounded-xl object-cover" />
          <button
            onClick={fjernBilde}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs text-white"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Kamera-knapp (mobil: åpner kamera direkte) */}
        <button
          onClick={() => cameraRef.current?.click()}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl transition hover:bg-gray-200"
          title="Ta bilde"
        >
          📷
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && velgBilde(e.target.files[0])}
        />

        {/* Galleri-knapp */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl transition hover:bg-gray-200"
          title="Velg bilde fra galleri"
        >
          🖼️
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && velgBilde(e.target.files[0])}
        />

        {/* Tekstfelt */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv hva du spiser, eller ta bilde…"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-green-400 focus:outline-none focus:ring-0"
          style={{ maxHeight: "120px" }}
        />

        {/* Send-knapp */}
        <button
          onClick={send}
          disabled={loading || (!text.trim() && !image)}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-green-500 text-white transition hover:bg-green-600 disabled:opacity-40"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
