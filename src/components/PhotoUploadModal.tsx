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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#14181D] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-[88dvh] overflow-y-auto overscroll-contain my-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#84E000]/15 border border-[#84E000]/30 flex items-center justify-center text-[#84E000]">
              <Camera size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Escanear com IA</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed mb-4">
          Tire uma foto da sua lista de papel na geladeira, de um recibo ou dos produtos na despensa. O assistente identifica e adiciona tudo à sua lista.
        </p>

        {previewImage ? (
          <div className="relative mb-4 rounded-2xl overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt="Foto da lista" className="w-full h-44 object-cover" />
            {analyzing && (
              <div className="absolute inset-0 bg-[#0B0E11]/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                <Sparkles size={24} className="text-[#84E000] animate-spin mb-2" />
                <span className="text-xs font-semibold text-white">Identificando itens...</span>
              </div>
            )}
          </div>
        ) : (
          <label className="border-2 border-dashed border-white/10 hover:border-[#84E000]/60 bg-white/5 rounded-2xl p-6 mb-4 flex flex-col items-center justify-center cursor-pointer transition">
            <Upload size={24} className="text-[#84E000] mb-2" />
            <span className="text-xs font-medium text-white">Toque para tirar foto ou escolher arquivo</span>
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
              className="w-full py-2.5 px-4 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl font-bold text-xs shadow-lg shadow-[#84e000]/20 flex items-center justify-center gap-2 transition duration-200"
            >
              {analyzing ? 'Analisando imagem...' : 'Processar lista com IA'}
            </button>
          ) : (
            <button
              onClick={handleSimulatedScan}
              disabled={analyzing}
              className="w-full py-2.5 px-4 bg-white/10 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition duration-200 border border-white/5"
            >
              <Sparkles size={14} className="text-[#84E000]" />
              {analyzing ? 'Lendo lista de exemplo...' : 'Simular foto de lista na geladeira'}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-neutral-400 hover:text-white text-xs transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
