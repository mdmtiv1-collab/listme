import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-center">
      <div className="max-w-sm w-full bg-paper-50 hairline-border p-8 rounded-3xl shadow-elevated">
        <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-serif text-lg font-bold mx-auto mb-4">
          L
        </div>
        <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-widest block mb-1">
          ERRO 404
        </span>
        <h1 className="font-serif text-2xl font-bold text-ink mb-2">
          Página não encontrada
        </h1>
        <p className="text-xs text-ink-muted mb-6 leading-relaxed">
          Essa rota não existe no LIST.ME. Volte para o painel principal para gerenciar suas compras.
        </p>
        <Link
          href="/app"
          className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
        >
          <ArrowLeft size={14} />
          Voltar para o App
        </Link>
      </div>
    </div>
  );
}
