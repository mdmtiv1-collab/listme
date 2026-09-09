'use client';

import React, { useState } from 'react';
import { Camera, X, Upload, Sparkles, Check } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemsExtracted: (text: string) => void;
}

export default function PhotoUploadModal({
  isOpen,
  onClose,
  onItemsExtracted,
}: PhotoUploadModalProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onItemsExtracted("Comprar azeite de oliva extra virgem, 1kg de café em pó, 2 caixas de sabão líquido e aveia em flocos");
      onClose();
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-paper-50 rounded-3xl p-6 max-w-sm w-full shadow-elevated hairline-border max-h-[88dvh] overflow-y-auto overscroll-contain my-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F4FCE3] flex items-center justify-center text-[#497D00]">
              <Camera size={18} />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Escanear com IA</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed mb-4">
          Tire uma foto da sua lista de papel na geladeira, de um recibo ou dos produtos acabando na despensa. A IA do LIST.ME identifica e adiciona tudo à sua lista.
        </p>

        {previewImage ? (
          <div className="relative mb-4 rounded-2xl overflow-hidden border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt="Foto da lista" className="w-full h-44 object-cover" />
            {analyzing && (
              <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                <Sparkles size={24} className="text-[#84E000] animate-spin mb-2" />
                <span className="text-xs font-semibold text-neutral-100">Identificando itens manuscritos...</span>
              </div>
            )}
          </div>
        ) : (
          <label className="border-2 border-dashed border-neutral-200 hover:border-[#84E000] bg-neutral-50 rounded-2xl p-6 mb-4 flex flex-col items-center justify-center cursor-pointer transition">
            <Upload size={24} className="text-neutral-400 mb-2" />
            <span className="text-xs font-medium text-neutral-900">Toque para tirar foto ou escolher arquivo</span>
            <span className="text-[11px] text-neutral-400 mt-1">Formatos: JPG, PNG, HEIC</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        <div className="flex flex-col gap-2">
          {previewImage ? (
            <button
              onClick={handleSimulatedScan}
              disabled={analyzing}
              className="w-full py-2.5 px-4 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition duration-200"
            >
              {analyzing ? 'Analisando imagem...' : 'Processar lista com IA'}
            </button>
          ) : (
            <button
              onClick={handleSimulatedScan}
              disabled={analyzing}
              className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition duration-200"
            >
              <Sparkles size={14} className="text-[#84E000]" />
              {analyzing ? 'Lendo lista de exemplo...' : 'Simular foto de lista na geladeira'}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-ink-muted hover:text-ink text-xs transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
