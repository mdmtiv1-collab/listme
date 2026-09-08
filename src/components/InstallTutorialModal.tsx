'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Share2,
  PlusSquare,
  MoreVertical,
  Download,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface InstallTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallTutorialModal({ isOpen, onClose }: InstallTutorialModalProps) {
  const [platform, setPlatform] = useState<'ios' | 'android'>('android');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      if (isIOS) {
        setPlatform('ios');
      } else {
        setPlatform('android');
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#F8F7F4] rounded-[32px] max-w-sm w-full shadow-2xl border border-black/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header com Logo e Fechar */}
        <div className="p-5 pb-3 border-b border-black/[0.06] flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-black/10 bg-white shadow-xs shrink-0">
              <Image
                src="/logo.png"
                alt="Logo LIST.ME"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#497D00] uppercase font-bold tracking-wider block">
                ATALHO NO CELULAR
              </span>
              <h3 className="font-sans text-sm font-bold text-neutral-900 leading-none">
                Instale o LIST.ME
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition"
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Introdução */}
          <div className="text-center">
            <p className="text-xs text-neutral-600 leading-relaxed">
              Adicione o atalho na <strong>Tela de Início</strong> do seu celular para abrir o LIST.ME em tela cheia como um <strong>aplicativo nativo</strong>!
            </p>
          </div>

          {/* Seletor de Plataforma (iOS vs Android) */}
          <div className="flex p-1 bg-neutral-200/80 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setPlatform('ios')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                platform === 'ios'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>iPhone (Safari)</span>
            </button>
            <button
              onClick={() => setPlatform('android')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                platform === 'android'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>Android (Chrome)</span>
            </button>
          </div>

          {/* Passo a Passo para iPhone */}
          {platform === 'ios' && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-neutral-950 text-[#84E000] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs">
                  <strong className="text-neutral-900 block">Toque em Compartilhar</strong>
                  <span className="text-neutral-500">
                    No Safari, toque no ícone de <strong>Compartilhar</strong> (o quadrado com uma seta para cima na barra inferior).
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-neutral-950 text-[#84E000] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs">
                  <strong className="text-neutral-900 block">Adicionar à Tela de Início</strong>
                  <span className="text-neutral-500">
                    Role a lista de opções para baixo e toque em <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong> (com o ícone ➕).
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#84E000] text-neutral-950 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs">
                  <strong className="text-neutral-900 block">Confirme em Adicionar</strong>
                  <span className="text-neutral-500">
                    Toque em <strong>&ldquo;Adicionar&rdquo;</strong> no canto superior direito. Pronto! O ícone do app aparecerá na tela do seu celular.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Passo a Passo para Android */}
          {platform === 'android' && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-neutral-950 text-[#84E000] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs">
                  <strong className="text-neutral-900 block">Abra as opções do Chrome</strong>
                  <span className="text-neutral-500">
                    Toque nos <strong>três pontinhos ⋮</strong> no canto superior direito do seu navegador.
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-neutral-950 text-[#84E000] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs">
                  <strong className="text-neutral-900 block">Instalar aplicativo / Tela Inicial</strong>
                  <span className="text-neutral-500">
                    Selecione a opção <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#84E000] text-neutral-950 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs">
                  <strong className="text-neutral-900 block">Confirme a Instalação</strong>
                  <span className="text-neutral-500">
                    Toque em <strong>&ldquo;Instalar&rdquo;</strong>. O LIST.ME será adicionado junto aos outros aplicativos do seu celular.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Conclusão */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md duration-200"
            >
              <Check size={16} className="text-[#84E000] group-hover:text-neutral-950" />
              <span>Entendi, Começar a Usar o App</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
