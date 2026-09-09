'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mic,
  Camera,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  MapPin,
  Tag,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Share2,
  Zap,
  ShoppingBag,
  Users,
  User,
  Home,
  Check,
  ChevronRight,
  Star,
  ChevronDown,
  HelpCircle,
  Quote,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Como o list.me calcula qual mercado fica mais barato?',
    answer: 'O motor inteligente do list.me analisa as cotações de preços das principais redes e atacarejos da sua região. Ao invés de você ter que pesquisar produto por produto em vários folhetos, o app calcula onde a sua compra completa fica com o menor custo total, poupando seu dinheiro e seu tempo em uma única ida às compras.'
  },
  {
    question: 'Como funciona a garantia de 7 dias com devolução total?',
    answer: 'Você tem 7 dias de garantia incondicional com risco zero. Assine o plano escolhido e use o list.me em todas as suas compras da semana. Se por qualquer motivo você achar que o aplicativo não se pagou ou não atendeu suas expectativas, basta solicitar o reembolso em até 7 dias e devolvemos 100% do valor pago imediatamente, sem perguntas e sem burocracia.'
  },
  {
    question: 'O aplicativo funciona na minha cidade?',
    answer: 'Sim! O list.me monitora as principais redes nacionais e regionais (como Atacadão, Assaí, Carrefour, Pão de Açúcar, Muffato, Condor, Angeloni, Supermercados BH, entre outros). Além disso, você pode adicionar facilmente qualquer mercado ou mercearia do seu bairro para incluir nas comparações.'
  },
  {
    question: 'Como funciona o envio de itens por áudio ou foto?',
    answer: 'Basta abrir a despensa ou geladeira e falar naturalmente pelo microfone (ex: "preciso de 2 caixas de leite, 1kg de café e sabão líquido"), ou tirar uma foto da sua listinha escrita no papel. A inteligência artificial do list.me transcreve tudo, identifica os produtos e quantidades e monta sua lista organizada em segundos.'
  },
  {
    question: 'Qual é a vantagem do Plano Família compartilhado?',
    answer: 'No Plano Família, você pode conectar até 4 pessoas da sua casa. Todos podem acessar e atualizar a mesma lista em tempo real via WhatsApp ou no app. Assim, se alguém passar no mercado ou lembrar de um produto, a lista é atualizada instantaneamente para todos.'
  },
  {
    question: 'Como faço para cancelar minha assinatura se eu quiser?',
    answer: 'O cancelamento é 100% livre e descomplicado. Você pode cancelar a qualquer momento diretamente na sua conta, sem burocracia, sem letras miúdas e sem multas contratuais.'
  }
];

const CAKTO_CHECKOUT_LINKS = {
  individual: {
    monthly: 'https://pay.cakto.com.br/iqwu2ji_1085872',
    quarterly: 'https://pay.cakto.com.br/jyoi9jn',
    annual: 'https://pay.cakto.com.br/34awkof',
  },
  family: {
    monthly: 'https://pay.cakto.com.br/3bnhj8n',
    quarterly: 'https://pay.cakto.com.br/3bizqnz',
    annual: 'https://pay.cakto.com.br/78dqjap',
  },
};
const STRIPE_CHECKOUT_LINKS = CAKTO_CHECKOUT_LINKS;

export default function LandingPage() {
  const [pricingTier, setPricingTier] = useState<'individual' | 'family'>('individual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [monthlySpend, setMonthlySpend] = useState<number>(1500);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 flex flex-col selection:bg-[#84E000] selection:text-black font-sans overflow-x-hidden">
      
      {/* Top Header & Navigation */}
      <header className="px-5 sm:px-8 py-4 max-w-6xl w-full mx-auto flex items-center justify-between sticky top-0 bg-[#F8F7F4]/90 backdrop-blur-md z-40 border-b border-black/[0.04]">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-black/10 bg-white shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="LIST.ME Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-sans text-2xl font-black tracking-tight text-neutral-950 select-none">
            list<span className="text-[#84E000]">.me</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-xs font-medium text-neutral-500">
          <a href="#como-funciona" className="hover:text-neutral-950 transition hidden sm:inline-block">Como Funciona</a>
          <a href="#depoimentos" className="hover:text-neutral-950 transition hidden md:inline-block">Depoimentos</a>
          <a href="#precos" className="hover:text-neutral-950 transition hidden sm:inline-block">Planos</a>
          <a href="#faq" className="hover:text-neutral-950 transition hidden md:inline-block">Dúvidas</a>
          <a
            href="#precos"
            className="px-4 py-2 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-full text-xs font-semibold shadow-xs transition flex items-center gap-1.5 duration-200"
          >
            <span>Assinar Agora</span>
            <ArrowRight size={13} />
          </a>
        </nav>
      </header>

      {/* Hero Section (Apresentação Principal com a Identidade da Logo) */}
      <section className="px-5 sm:px-8 pt-10 sm:pt-16 pb-16 max-w-4xl mx-auto text-center flex flex-col items-center overflow-x-hidden">
        
        {/* Eyebrow badge com o Verde Neon da Logo */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-950 text-white border border-neutral-800 text-xs font-medium mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#84E000] animate-pulse" />
          <span>O jeito mais inteligente de fazer mercado</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sans text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-950 leading-[1.15] mb-5">
          Suas compras de mercado organizadas e pelo <span className="underline decoration-[#84E000] decoration-4 underline-offset-4">menor preço</span> da sua região
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed mb-8">
          O <strong>list<span className="text-[#84E000]">.me</span></strong> monta sua lista de compras, por voz, foto ou texto e calcula em segundos em qual mercado da sua região a sua compra completa fica mais barata.
        </p>

        {/* Action CTAs */}
        <div className="flex justify-center w-full sm:w-auto mb-4">
          <a
            href="#precos"
            className="w-full sm:w-auto px-8 py-3.5 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-full text-sm font-semibold shadow-md transition flex items-center justify-center gap-2 duration-200"
          >
            Começar a Economizar Agora <ArrowRight size={15} />
          </a>
        </div>

        <p className="text-[11px] text-neutral-500 font-medium">
          7 dias de garantia incondicional · Risco zero · 100% de satisfação ou seu dinheiro de volta
        </p>

        {/* Smartphone Mockup Realista com a Interface Oficial do LIST.ME & Detalhes Flutuantes Interativos */}
        <div className="mt-14 sm:mt-16 relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          {/* Brilho Ambiente Suave de Fundo */}
          <div className="absolute inset-0 max-w-md mx-auto bg-[#84E000]/15 blur-3xl rounded-full transform -translate-y-4 pointer-events-none" />

          {/* Wrapper Centralizado com Âncora Direta no Celular */}
          <div className="relative flex flex-col items-center pt-4 pb-8 sm:py-0">

            {/* Card Flutuante 1: Canto Superior Esquerdo */}
            <div className="flex absolute top-2 sm:top-14 -left-6 sm:-left-48 md:-left-60 lg:-left-64 z-30 animate-float-slow items-start gap-1.5 sm:gap-3 bg-neutral-950/95 backdrop-blur-xl border border-white/15 p-2 sm:p-3.5 rounded-2xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] w-[140px] sm:w-[225px] md:w-[245px] text-left hover:scale-105 hover:border-[#84E000]/50 transition-all duration-300 group cursor-default">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#84E000]/15 text-[#84E000] border border-[#84E000]/30 flex items-center justify-center shrink-0 group-hover:bg-[#84E000] group-hover:text-neutral-950 transition mt-0.5">
                <Mic size={12} className="animate-pulse sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
                  <span className="text-[7px] sm:text-[9px] font-mono uppercase font-bold text-[#84E000] tracking-wider truncate">
                    ÁUDIO RECONHECIDO
                  </span>
                  <div className="flex items-end gap-0.5 h-2 sm:h-3 shrink-0">
                    <span className="w-0.5 bg-[#84E000] rounded-full soundwave-bar-1" />
                    <span className="w-0.5 bg-[#84E000] rounded-full soundwave-bar-2" />
                    <span className="w-0.5 bg-[#84E000] rounded-full soundwave-bar-3" />
                  </div>
                </div>
                <p className="text-[8.5px] sm:text-xs text-neutral-200 font-medium leading-tight truncate">
                  “2 leites, alcatra e sabão...”
                </p>
                <span className="inline-flex items-center gap-1 text-[7px] sm:text-[9px] font-mono text-neutral-400 mt-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#84E000]" />
                  4 itens na lista
                </span>
              </div>
            </div>

            {/* Card Flutuante 2: Canto Inferior Direito */}
            <div className="flex absolute -bottom-7 sm:bottom-16 md:bottom-20 -right-6 sm:-right-48 md:-right-60 lg:-right-64 z-30 animate-float-reverse flex-col gap-0.5 sm:gap-2 bg-neutral-950/95 backdrop-blur-xl border border-[#84E000]/40 p-2 sm:p-3.5 rounded-2xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] w-[165px] sm:w-[230px] md:w-[255px] text-left hover:scale-105 hover:border-[#84E000] transition-all duration-300 ring-1 ring-[#84E000]/20 cursor-default">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 sm:pb-1.5">
                <span className="text-[7.5px] sm:text-[9px] font-mono uppercase text-neutral-400 font-bold">
                  COMPRA MAIS BARATA
                </span>
                <span className="text-[7.5px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#84E000] text-neutral-950">
                  MENOR PREÇO
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="font-bold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#84E000]" />
                    Atacadão
                  </span>
                  <span className="font-bold text-[#84E000] font-mono text-[10px] sm:text-xs">
                    R$ 94,80
                  </span>
                </div>
                <div className="flex items-center justify-between text-[8.5px] sm:text-[11px] text-neutral-400">
                  <span>Carrefour</span>
                  <span className="line-through font-mono">R$ 138,20</span>
                </div>
              </div>

              <div className="pt-0.5 sm:pt-1.5 border-t border-white/10 flex items-center justify-between text-[7.5px] sm:text-[10px] font-mono text-[#84E000]">
                <span className="flex items-center gap-1">
                  <TrendingDown size={10} />
                  Economia:
                </span>
                <span className="font-bold">R$ 43,40 (31% OFF)</span>
              </div>
            </div>

            {/* Card Flutuante 3: Meio Direito (Exatamente na caixa vermelha desenhada) */}
            <div className="flex absolute top-56 sm:top-6 -right-6 sm:-right-36 md:-right-40 lg:-right-44 z-20 animate-float-slow items-center gap-1.5 sm:gap-2.5 bg-white/95 text-neutral-900 backdrop-blur-md border border-black/10 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-full shadow-[0_15px_30px_-5px_rgba(0,0,0,0.25)] hover:scale-105 transition-all cursor-default">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#84E000]/20 text-[#386000] flex items-center justify-center shrink-0">
                <MapPin size={11} className="sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[8px] sm:text-[10px] font-bold block leading-none text-neutral-900">
                  Mercados da Região
                </span>
                <span className="text-[7px] sm:text-[9px] font-mono text-neutral-500 block mt-0.5 whitespace-nowrap">
                  Atacadão · Assaí · Carrefour
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#62A800] animate-pulse shrink-0 ml-0.5" />
            </div>

            {/* Chassi do Celular (Hardware de Luxo) */}
            <div className="relative z-10 w-full max-w-[240px] sm:max-w-[315px] bg-neutral-950 p-2 sm:p-3 rounded-[44px] sm:rounded-[52px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] border-4 sm:border-[6px] border-neutral-800 ring-1 ring-white/20">
              
              {/* Botões Laterais (Volume e Power) */}
              <div className="hidden sm:block absolute -left-[9px] top-28 w-[4px] h-9 bg-neutral-700 rounded-l-md" />
              <div className="hidden sm:block absolute -left-[9px] top-40 w-[4px] h-9 bg-neutral-700 rounded-l-md" />
              <div className="hidden sm:block absolute -right-[9px] top-32 w-[4px] h-12 bg-neutral-700 rounded-r-md" />

              {/* Tela do Celular com a Imagem do App */}
              <div className="relative overflow-hidden rounded-[38px] sm:rounded-[44px] bg-[#F4F3EE] shadow-inner border border-black/10">
                
                {/* iPhone Status Bar (9:41 · Dynamic Island · 5G & Bateria) */}
                <div className="absolute top-2 sm:top-2.5 left-0 right-0 z-20 px-5 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight text-neutral-900 font-sans">9:41</span>
                  
                  {/* Dynamic Island */}
                  <div className="w-16 sm:w-20 h-3 sm:h-3.5 bg-neutral-950 rounded-full flex items-center justify-end px-1.5 sm:px-2 gap-1 border border-neutral-800 shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-800" />
                    <div className="w-1 h-1 rounded-full bg-neutral-800" />
                  </div>

                  <div className="flex items-center gap-1 text-neutral-900">
                    {/* Sinal de Rede */}
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
                      <rect x="1" y="10" width="2.5" height="5" rx="0.5" />
                      <rect x="5" y="7.5" width="2.5" height="7.5" rx="0.5" />
                      <rect x="9" y="5" width="2.5" height="10" rx="0.5" />
                      <rect x="13" y="2" width="2.5" height="13" rx="0.5" />
                    </svg>
                    {/* WiFi */}
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
                      <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3.8-3a5.5 5.5 0 0 1 7.6 0 .75.75 0 0 0 1.05-1.07 7 7 0 0 0-9.7 0 .75.75 0 1 0 1.05 1.07zm-2.8-3a9.5 9.5 0 0 1 13.2 0 .75.75 0 0 0 1.05-1.07 11 11 0 0 0-15.3 0 .75.75 0 0 0 1.05 1.07z"/>
                    </svg>
                    {/* Bateria */}
                    <div className="w-3.5 h-2 border border-neutral-900 rounded-[2px] p-[1px] flex items-center">
                      <div className="w-full h-full bg-neutral-900 rounded-[0.5px]" />
                    </div>
                  </div>
                </div>

                <Image
                  src="/hero-mockup-v3.png"
                  alt="Aplicativo LIST.ME no Celular"
                  width={472}
                  height={1024}
                  className="w-full h-auto object-cover block select-none pointer-events-none"
                  priority
                />

                {/* Reflexo Sutil de Vidro */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none rounded-[38px] sm:rounded-[44px]" />
              </div>

              {/* Barra Inferior (Home Indicator) */}
              <div className="w-24 sm:w-28 h-1 bg-white/30 rounded-full mx-auto mt-2" />
            </div>

          </div>
        </div>

      </section>

      {/* Feature Section: Como Funciona */}
      <section id="como-funciona" className="px-5 sm:px-8 py-16 max-w-5xl mx-auto border-t border-black/[0.06]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#62A800] font-bold">
            COMO FUNCIONA
          </p>
          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-neutral-950 mt-1">
            Simples, rápido e feito para o seu dia a dia.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white hairline-border p-6 rounded-[24px] shadow-card">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-[#84E000] flex items-center justify-center mb-4 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">
              Dite ou envie foto
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Fale pelo microfone enquanto olha a despensa, envie foto da lista de papel ou digite o que precisa. A IA organiza tudo em segundos.
            </p>
          </div>

          <div className="bg-white hairline-border p-6 rounded-[24px] shadow-card">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-[#84E000] flex items-center justify-center mb-4 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">
              Cálculo da Cesta Completa
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              O motor compara os preços de todas as redes locais e indica onde a compra inteira sai mais barata em uma só ida ao mercado.
            </p>
          </div>

          <div className="bg-white hairline-border p-6 rounded-[24px] shadow-card border-t-2 border-t-[#84E000]">
            <div className="w-10 h-10 rounded-2xl bg-[#84E000] text-neutral-950 flex items-center justify-center mb-4 font-mono font-bold shadow-xs">
              03
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2 flex items-center gap-1.5">
              <span>Rota por Corredores</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#84E000]/20 text-[#386000] uppercase font-bold">Novo</span>
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Itens organizados na sequência física de compras (Bebidas, Hortifrúti, Mercearia/Trigo, Carnes e Limpeza). Sem andar pra trás no mercado!
            </p>
          </div>

          <div className="bg-white hairline-border p-6 rounded-[24px] shadow-card">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-[#84E000] flex items-center justify-center mb-4 font-mono font-bold">
              04
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">
              Sincronia com a Família
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Compartilhe a lista organizada por corredores no WhatsApp. Os dois acompanham e marcam itens da mesma casa em tempo real.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO INSPIRADA NO BENCHMARK: INTERFACE CONVERSACIONAL */}
      {/* ======================================================== */}
      <section className="px-5 sm:px-8 py-16 max-w-5xl mx-auto border-t border-black/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84E000]/15 text-[#386000] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} className="text-[#497D00]" />
            EXPERIÊNCIA SEM ESFORÇO
          </div>
          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-neutral-950 tracking-tight leading-tight">
            Se você sabe mandar um áudio no WhatsApp, já sabe economizar com o list<span className="text-[#84E000]">.me</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 leading-relaxed">
            Nada de abrir dezenas de panfletos de papel, digitar tudo na mão ou comparar mercado por mercado. Você fala naturalmente e a IA faz a cotação em segundos.
          </p>
        </div>

        {/* Visual Mockup da Conversa Real */}
        <div className="max-w-2xl mx-auto bg-white hairline-border rounded-[32px] p-4 sm:p-7 shadow-card">
          
          {/* Header da Simulação */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-950 flex items-center justify-center text-[#84E000] font-bold text-sm shadow-xs">
                lm
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-neutral-900 block leading-tight">
                  Assistente list<span className="text-[#84E000]">.me</span>
                </span>
                <span className="text-[10px] text-[#497D00] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] animate-pulse" />
                  Online · Cotações ativas na sua região
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Tempo real</span>
          </div>

          <div className="space-y-4">
            {/* Mensagem 1: Áudio do Usuário */}
            <div className="flex justify-end">
              <div className="bg-[#84E000]/20 border border-[#84E000]/40 rounded-2xl rounded-tr-xs p-3.5 max-w-sm sm:max-w-md shadow-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-950 text-[#84E000] flex items-center justify-center shrink-0">
                    <Mic size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-neutral-600 mb-1">
                      <span className="font-mono font-bold">Mensagem de Voz</span>
                      <span className="font-mono">0:14</span>
                    </div>
                    <div className="flex items-center gap-1 h-3">
                      <span className="w-1 h-2 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-3 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-1.5 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-3 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-2 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-3 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-1 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-2.5 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-3 bg-neutral-900 rounded-full" />
                      <span className="w-1 h-1.5 bg-neutral-900 rounded-full" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-800 italic bg-white/70 px-2.5 py-1.5 rounded-lg border border-black/5">
                  &ldquo;Vou no mercado hoje: 5kg arroz Tio João, 5kg açúcar Alto Alegre, 2kg carne moída, café Pilão e 2 leites integral.&rdquo;
                </p>
              </div>
            </div>

            {/* Mensagem 2: Resposta Instantânea da IA com Comparativo Real */}
            <div className="flex justify-start">
              <div className="bg-neutral-950 text-white rounded-2xl rounded-tl-xs p-4 sm:p-5 max-w-sm sm:max-w-md shadow-floating border border-neutral-800">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#84E000] font-bold">
                    <Zap size={12} className="fill-[#84E000]" />
                    <span>COTAÇÃO CONCLUÍDA EM 3 SEGUNDOS</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400">5 itens</span>
                </div>

                <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                  Analisei os encartes e preços atualizados hoje nos atacarejos da sua região:
                </p>

                {/* Lista de Mercados Comparados */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#84E000]/15 border border-[#84E000]/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#84E000]">🏆 Atacadão</span>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#84E000] text-neutral-950">
                        Mais Barato
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#84E000]">R$ 104,80</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60 border border-white/5 text-neutral-400 text-xs">
                    <span>Assaí Atacadista</span>
                    <span className="font-mono">R$ 116,90 (+R$ 12,10)</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60 border border-white/5 text-neutral-400 text-xs">
                    <span>Supermercado Regional</span>
                    <span className="font-mono">R$ 128,40 (+R$ 23,60)</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60 border border-white/5 text-neutral-400 text-xs">
                    <span>Carrefour Hiper</span>
                    <span className="font-mono">R$ 143,20 (+R$ 38,40)</span>
                  </div>
                </div>

                {/* Veredito de Economia */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-300 font-medium">Economia nesta compra:</span>
                  <span className="text-xs font-mono font-bold text-[#84E000]">R$ 38,40 (27% OFF)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SIMULADOR INTERATIVO DE ECONOMIA (INSPIRADO EM MODELOS SAAS) */}
      {/* ======================================================== */}
      <section className="px-5 sm:px-8 py-16 max-w-5xl mx-auto border-t border-black/[0.06]">
        <div className="bg-gradient-to-b from-white to-[#F3F2EC] hairline-border rounded-[32px] p-6 sm:p-10 shadow-card">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 text-white text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <TrendingDown size={12} className="text-[#84E000]" />
              SIMULADOR DE ECONOMIA REAL
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-950">
              Quanto a sua casa pode economizar todos os meses?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Selecione o quanto você gasta em compras por mês e veja a economia estimada:
            </p>
          </div>

          {/* Botões Seletores de Gasto Mensal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto mb-8">
            {[800, 1500, 2500, 3500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMonthlySpend(val)}
                className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                  monthlySpend === val
                    ? 'bg-neutral-950 text-white shadow-md border-2 border-[#84E000]'
                    : 'bg-white text-neutral-700 hairline-border hover:border-black/20'
                }`}
              >
                <span className="text-[10px] font-mono text-neutral-400 font-normal">Gasto mensal</span>
                <span className="font-mono">R$ {val.toLocaleString('pt-BR')}</span>
              </button>
            ))}
          </div>

          {/* Painel com o Resultado da Simulação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
            <div className="bg-white hairline-border p-4 sm:p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block mb-1">
                ECONOMIA NO MÊS
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#386000] block">
                R$ {Math.round(monthlySpend * 0.20)} a R$ {Math.round(monthlySpend * 0.32)}
              </span>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Em média 20% a 32% menos na sua fatura
              </span>
            </div>

            <div className="bg-white hairline-border p-4 sm:p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block mb-1">
                ECONOMIA NO ANO
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#386000] block">
                R$ {(Math.round(monthlySpend * 0.20) * 12).toLocaleString('pt-BR')} a R$ {(Math.round(monthlySpend * 0.32) * 12).toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Dinheiro que volta para o seu bolso
              </span>
            </div>

            <div className="bg-neutral-950 text-white p-4 sm:p-5 rounded-2xl shadow-floating border border-[#84E000]/40 flex flex-col justify-center">
              <span className="text-[10px] font-mono uppercase text-[#84E000] font-bold block mb-1">
                CUSTO DO LIST<span className="text-[#84E000]">.ME</span>
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-white block">
                R$ 10,82<span className="text-xs font-normal text-neutral-400">/mês</span>
              </span>
              <span className="text-[10px] text-[#84E000] mt-1 font-mono font-bold block">
                Se paga na 1ª compra!
              </span>
            </div>
          </div>

          <div className="mt-7 text-center">
            <a
              href="#precos"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-full text-xs font-bold shadow-md transition"
            >
              Garantir Minha Economia Agora <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO DE PROVA SOCIAL: DEPOIMENTOS DE CLIENTES */}
      {/* ======================================================== */}
      <section id="depoimentos" className="px-5 sm:px-8 py-16 max-w-5xl mx-auto border-t border-black/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#497D00] font-bold">
            DEPOIMENTOS REAIS
          </p>
          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-neutral-950 mt-1 mb-3">
            Quem usa, não faz mais mercado no escuro.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Veja como famílias e pessoas em todo o Brasil estão economizando centenas de reais e ganhando tempo todas as semanas.
          </p>
        </div>

        {/* Linha de Indicadores de Sucesso */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto mb-10 text-center">
          <div className="bg-white hairline-border p-3 sm:p-4 rounded-2xl shadow-xs">
            <span className="font-serif text-xl sm:text-3xl font-bold text-neutral-900 block">Até 35%</span>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase text-[#497D00] font-bold mt-0.5 block">Economia nas Compras</span>
          </div>
          <div className="bg-white hairline-border p-3 sm:p-4 rounded-2xl shadow-xs">
            <span className="font-serif text-xl sm:text-3xl font-bold text-neutral-900 block">15 seg</span>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase text-[#497D00] font-bold mt-0.5 block">Comparação da Lista</span>
          </div>
          <div className="bg-white hairline-border p-3 sm:p-4 rounded-2xl shadow-xs">
            <span className="font-serif text-xl sm:text-3xl font-bold text-neutral-900 flex items-center justify-center gap-1">
              4,8 <Star size={16} className="text-[#84E000] fill-[#84E000]" />
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase text-[#497D00] font-bold mt-0.5 block">Satisfação dos Usuários</span>
          </div>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Depoimento 1 */}
          <div className="bg-white hairline-border p-6 rounded-[26px] shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-3 text-[#84E000]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#84E000]" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic mb-5">
                &ldquo;Economizei R$ 312 na nossa compra do mês. Eu sempre ia no mesmo mercado por costume, mas o app me mostrou que a compra completa no atacarejo perto de casa estava muito mais barata. O recurso de falar no microfone olhando a despensa é sensacional!&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-black/[0.04]">
              <Image
                src="/testimonials/camila.jpg"
                alt="Camila Vasconcelos"
                width={48}
                height={48}
                className="w-10 h-10 rounded-full object-cover border border-black/10 shadow-xs shrink-0"
              />
              <div>
                <strong className="text-xs font-bold text-neutral-900 block">Camila Vasconcelos</strong>
                <span className="text-[10px] text-neutral-400">Mãe de 2 filhos · São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Depoimento 2 */}
          <div className="bg-white hairline-border p-6 rounded-[26px] shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-3 text-[#84E000]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#84E000]" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic mb-5">
                &ldquo;Assinamos o Plano Família e virou essencial aqui em casa. Eu e minha esposa compartilhamos a lista no WhatsApp em tempo real. Nunca mais compramos nada duplicado e não esquecemos nenhum produto do mês.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-black/[0.04]">
              <Image
                src="/testimonials/rodrigo-leticia.jpg"
                alt="Rodrigo & Letícia"
                width={48}
                height={48}
                className="w-10 h-10 rounded-full object-cover border border-black/10 shadow-xs shrink-0"
              />
              <div>
                <strong className="text-xs font-bold text-neutral-900 block">Rodrigo & Letícia</strong>
                <span className="text-[10px] text-neutral-400">Plano Família · Curitiba, PR</span>
              </div>
            </div>
          </div>

          {/* Depoimento 3 */}
          <div className="bg-white hairline-border p-6 rounded-[26px] shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-3 text-[#84E000]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#84E000]" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic mb-5">
                &ldquo;Moro sozinho e não tenho tempo nem paciência de pesquisar encartes. Mando um áudio rápido no aplicativo e ele já me mostra onde fica mais barato. A assinatura anual já se pagou nas duas primeiras compras.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-black/[0.04]">
              <Image
                src="/testimonials/thiago.jpg"
                alt="Thiago Guimarães"
                width={48}
                height={48}
                className="w-10 h-10 rounded-full object-cover border border-black/10 shadow-xs shrink-0"
              />
              <div>
                <strong className="text-xs font-bold text-neutral-900 block">Thiago Guimarães</strong>
                <span className="text-[10px] text-neutral-400">Arquiteto · Belo Horizonte, MG</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO PRINCIPAL DE VENDAS: PLANOS & PREÇOS (OFERTA) */}
      {/* ======================================================== */}
      <section id="precos" className="px-5 sm:px-8 py-16 max-w-5xl mx-auto border-t border-black/[0.06]">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#62A800] font-bold">
            PLANOS & ASSINATURAS
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-neutral-950 mt-1 mb-3">
            Escolha o plano ideal para a sua casa.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            Economize centenas de reais todos os meses no supermercado com a inteligência do <strong>list<span className="text-[#84E000]">.me</span></strong>.
          </p>

          {/* Badge de Garantia 7 Dias */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#84E000]/15 text-[#386000] border border-[#84E000]/40 text-xs font-bold shadow-xs">
            <ShieldCheck size={14} className="text-[#497D00]" />
            <span>7 dias de garantia incondicional · Satisfação ou 100% do dinheiro de volta</span>
          </div>

          {/* Toggle Seletor: Plano Individual vs. Plano Família */}
          <div className="mt-7 inline-flex p-1 bg-neutral-200/80 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setPricingTier('individual')}
              className={`px-4 sm:px-6 py-2 rounded-xl transition flex items-center gap-1.5 ${
                pricingTier === 'individual'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <User size={14} />
              <span>Plano Individual</span>
              <span className={`text-[9px] font-mono ${pricingTier === 'individual' ? 'bg-[#84E000] text-neutral-950 px-1.5 py-0.5 rounded font-bold' : 'text-neutral-400'}`}>
                1 Pessoa
              </span>
            </button>
            <button
              onClick={() => setPricingTier('family')}
              className={`px-4 sm:px-6 py-2 rounded-xl transition flex items-center gap-1.5 ${
                pricingTier === 'family'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Home size={14} />
              <span>Plano Família</span>
              <span className={`text-[9px] font-mono uppercase ${pricingTier === 'family' ? 'bg-[#84E000] text-neutral-950 px-1.5 py-0.5 rounded font-bold' : 'text-neutral-400'}`}>
                Até 4 Pessoas
              </span>
            </button>
          </div>
        </div>

        {/* 1. CARDS DO PLANO INDIVIDUAL (1 Usuário) — PADRÃO ATIVO */}
        {pricingTier === 'individual' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-200">
            
            {/* Individual Mensal */}
            <div className="bg-white hairline-border rounded-[28px] p-6 shadow-card flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block mb-1">
                  MENSAL · ENTRADA
                </span>
                <h3 className="text-xl font-bold text-neutral-900">Individual Mensal</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5">
                  Acesso individual para você economizar nas suas compras do mês.
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-neutral-900">R$ 29,90</span>
                  <span className="text-xs text-neutral-400 font-mono">/mês</span>
                </div>
                <span className="text-[11px] font-mono text-[#497D00] font-bold block mb-6">
                  Apenas R$ 0,99 por dia
                </span>

                <ul className="space-y-2.5 text-xs text-neutral-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    1 acesso individual exclusivo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Cotação entre todas as redes da sua cidade
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Entrada por áudio, foto e digitação
                  </li>
                </ul>
              </div>

              <a
                href={STRIPE_CHECKOUT_LINKS.individual.monthly}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-semibold text-center shadow-xs transition duration-200 block"
              >
                Assinar Plano Mensal
              </a>
            </div>

            {/* Individual Trimestral */}
            <div className="bg-white hairline-border rounded-[28px] p-6 shadow-card flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#62A800] font-bold block mb-1">
                  TRIMESTRAL · 33% OFF
                </span>
                <h3 className="text-xl font-bold text-neutral-900">Individual Trimestral</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5">
                  Economize na assinatura com o ciclo de 3 meses.
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-neutral-900">R$ 59,90</span>
                  <span className="text-xs text-neutral-400 font-mono">/tri</span>
                </div>
                <span className="text-[11px] font-mono text-[#62A800] font-bold block mb-6">
                  Equivale a R$ 19,96/mês
                </span>

                <ul className="space-y-2.5 text-xs text-neutral-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    1 acesso individual exclusivo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Cotações ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Cobrança trimestral mais econômica
                  </li>
                </ul>
              </div>

              <a
                href={STRIPE_CHECKOUT_LINKS.individual.quarterly}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-semibold text-center shadow-xs transition duration-200 block"
              >
                Assinar Plano Trimestral
              </a>
            </div>

            {/* Individual Anual (Destaque Campeão com Estética da Logo) */}
            <div className="bg-neutral-950 text-white rounded-[28px] p-6 shadow-floating flex flex-col justify-between relative overflow-hidden border-2 border-[#84E000]">
              <div className="absolute top-0 right-0 bg-[#84E000] text-neutral-950 text-[9px] font-mono font-bold uppercase px-3 py-1 rounded-bl-xl">
                MAIS VANTAJOSO
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#84E000] font-bold block mb-1">
                  ANUAL · MÁXIMA ECONOMIA
                </span>
                <h3 className="text-xl font-bold text-white">Individual Anual</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-5">
                  12 meses de economia garantida com a menor parcela mensal.
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-white">R$ 129,90</span>
                  <span className="text-xs text-neutral-400 font-mono">/ano</span>
                </div>
                <span className="text-[11px] font-mono text-[#84E000] font-bold block mb-6">
                  Apenas R$ 10,82/mês · Menos de 11 reais
                </span>

                <ul className="space-y-2.5 text-xs text-neutral-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    1 acesso individual por 12 meses
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    Sem mensalidades ou cobranças surpresa
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    Atualizações automáticas de preços locais
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    Economia garantida em todas as compras
                  </li>
                </ul>
              </div>

              <a
                href={STRIPE_CHECKOUT_LINKS.individual.annual}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold text-center shadow-md transition duration-200 block"
              >
                Assinar Plano Anual (7 Dias de Garantia)
              </a>
            </div>

          </div>
        )}

        {/* 2. CARDS DO PLANO FAMÍLIA (Até 4 Pessoas Conectadas) */}
        {pricingTier === 'family' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-200">
            
            {/* Família Mensal */}
            <div className="bg-white hairline-border rounded-[28px] p-6 shadow-card flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block mb-1">
                  MENSAL · FLEXÍVEL
                </span>
                <h3 className="text-xl font-bold text-neutral-900">Família Mensal</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5">
                  Acesso para até 4 membros da casa com renovação mês a mês.
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-neutral-900">R$ 49,90</span>
                  <span className="text-xs text-neutral-400 font-mono">/mês</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Até 4 pessoas conectadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Lista compartilhada em tempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Comparador de mercados e atacarejos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Entrada por áudio, foto e digitação
                  </li>
                </ul>
              </div>

              <a
                href={STRIPE_CHECKOUT_LINKS.family.monthly}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-semibold text-center shadow-xs transition duration-200 block"
              >
                Assinar Família Mensal
              </a>
            </div>

            {/* Família Trimestral */}
            <div className="bg-white hairline-border rounded-[28px] p-6 shadow-card flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#62A800] font-bold block mb-1">
                  TRIMESTRAL · 33% OFF
                </span>
                <h3 className="text-xl font-bold text-neutral-900">Família Trimestral</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5">
                  Plano para 3 meses com desconto especial por trimestre.
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-neutral-900">R$ 99,90</span>
                  <span className="text-xs text-neutral-400 font-mono">/tri</span>
                </div>
                <span className="text-[11px] font-mono text-[#62A800] font-bold block mb-6">
                  Equivale a R$ 33,30/mês
                </span>

                <ul className="space-y-2.5 text-xs text-neutral-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Até 4 pessoas conectadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Lista compartilhada em tempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Cobrança a cada 3 meses
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#62A800] shrink-0" />
                    Economia garantida no supermercado
                  </li>
                </ul>
              </div>

              <a
                href={STRIPE_CHECKOUT_LINKS.family.quarterly}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-semibold text-center shadow-xs transition duration-200 block"
              >
                Assinar Família Trimestral
              </a>
            </div>

            {/* Família Anual (Destaque Campeão com Estética da Logo) */}
            <div className="bg-neutral-950 text-white rounded-[28px] p-6 shadow-floating flex flex-col justify-between relative overflow-hidden border-2 border-[#84E000]">
              <div className="absolute top-0 right-0 bg-[#84E000] text-neutral-950 text-[9px] font-mono font-bold uppercase px-3 py-1 rounded-bl-xl">
                MAIS VANTAJOSO
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#84E000] font-bold block mb-1">
                  ANUAL · MÁXIMA ECONOMIA
                </span>
                <h3 className="text-xl font-bold text-white">Família Anual</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-5">
                  12 meses de tranquilidade para toda a família economizar o ano inteiro.
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-white">R$ 179,90</span>
                  <span className="text-xs text-neutral-400 font-mono">/ano</span>
                </div>
                <span className="text-[11px] font-mono text-[#84E000] font-bold block mb-6">
                  Apenas R$ 14,99/mês por família (R$ 3,74/pessoa)
                </span>

                <ul className="space-y-2.5 text-xs text-neutral-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    Até 4 pessoas da casa conectadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    Lista compartilhada em tempo real no WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    Atualizações automáticas de preços
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#84E000] shrink-0" />
                    Acesso ilimitado o ano todo sem mensalidades
                  </li>
                </ul>
              </div>

              <a
                href={STRIPE_CHECKOUT_LINKS.family.annual}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold text-center shadow-md transition duration-200 block"
              >
                Assinar Família Anual (7 Dias de Garantia)
              </a>
            </div>

          </div>
        )}

        <div className="mt-8 text-center text-xs text-neutral-500 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-[#62A800]" /> Pagamento 100% Seguro
          </span>
          <span>·</span>
          <span className="font-medium">7 Dias de Garantia Incondicional</span>
          <span>·</span>
          <span className="font-medium">Acesso Imediato</span>
        </div>

      </section>

      {/* ======================================================== */}
      {/* SEÇÃO DE GARANTIA INCONDICIONAL (7 DIAS - RISCO ZERO) */}
      {/* ======================================================== */}
      <section id="garantia" className="px-5 sm:px-8 py-14 max-w-4xl mx-auto w-full border-t border-black/[0.06]">
        <div className="bg-white hairline-border rounded-[32px] p-6 sm:p-10 shadow-card relative overflow-hidden">
          {/* Brilho decorativo verde neon */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#84E000]/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />

          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
            {/* Selo Visual de Garantia */}
            <div className="shrink-0 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-neutral-950 text-[#84E000] border-2 border-[#84E000] shadow-floating flex flex-col items-center justify-center p-3 relative">
                <ShieldCheck size={36} className="text-[#84E000] mb-0.5" />
                <span className="font-mono text-2xl sm:text-3xl font-black leading-none text-white">7</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#84E000]">DIAS</span>
              </div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold mt-2 tracking-wider">
                RISCO ZERO
              </span>
            </div>

            {/* Conteúdo Explicativo da Garantia */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84E000]/15 text-[#386000] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={12} className="text-[#497D00]" />
                SATISFAÇÃO GARANTIDA OU SEU DINHEIRO DE VOLTA
              </div>

              <h3 className="font-sans text-xl sm:text-2xl font-bold text-neutral-950 mb-2">
                Garantia Incondicional de 7 Dias
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5">
                Você não corre risco algum. Assine o plano ideal para você e use o <strong>list<span className="text-[#84E000]">.me</span></strong> em todas as compras da sua semana. Se por qualquer motivo você não economizar muito mais do que o valor investido ou achar que o aplicativo não é para você, basta solicitar o reembolso em até 7 dias e <strong>nós devolvemos 100% do seu dinheiro</strong>. Sem perguntas, sem burocracia e sem letras miúdas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-black/[0.05]">
                <div className="flex items-center gap-2 text-xs text-neutral-700 justify-center md:justify-start">
                  <Check size={14} className="text-[#62A800] shrink-0" />
                  <span className="font-medium">100% Reembolsável</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-700 justify-center md:justify-start">
                  <Check size={14} className="text-[#62A800] shrink-0" />
                  <span className="font-medium">Sem burocracia</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-700 justify-center md:justify-start">
                  <Check size={14} className="text-[#62A800] shrink-0" />
                  <span className="font-medium">Economia garantida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO DE PERGUNTAS FREQUENTES (FAQ) */}
      {/* ======================================================== */}
      <section id="faq" className="px-5 sm:px-8 py-16 max-w-4xl mx-auto border-t border-black/[0.06] w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#497D00] font-bold">
            TIRE SUAS DÚVIDAS
          </p>
          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-neutral-950 mt-1 mb-3">
            Perguntas Frequentes
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Tudo o que você precisa saber sobre como o <strong>list<span className="text-[#84E000]">.me</span></strong> organiza sua rotina e economiza seu dinheiro.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white hairline-border rounded-[22px] overflow-hidden shadow-card transition duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-neutral-900 text-xs sm:text-sm hover:text-black transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#84E000]/20 text-[#386000] text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                      ?
                    </span>
                    {item.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-black/[0.04] mt-1 pt-3 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Banner de Suporte Humano no WhatsApp (Inspirado no Meu Assessor) */}
        <div className="mt-8 p-4 sm:p-5 bg-white hairline-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#84E000]/15 text-[#386000] flex items-center justify-center shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <strong className="text-xs sm:text-sm font-bold text-neutral-900 block">
                Não achou sua dúvida aqui?
              </strong>
              <span className="text-[11px] text-neutral-500">
                Nosso suporte humano responde você no WhatsApp em poucos minutos.
              </span>
            </div>
          </div>
          <a
            href="https://wa.me/5541999999999?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20list.me"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-full text-xs font-semibold shadow-xs transition flex items-center gap-1.5 duration-200 shrink-0"
          >
            <span>Falar no WhatsApp</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Banner CTA Final de Dúvidas */}
        <div className="mt-12 p-6 sm:p-8 bg-neutral-950 text-white rounded-[32px] border-2 border-[#84E000]/50 shadow-floating flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase text-[#84E000] font-bold block mb-1">
              EXPERIMENTE HOJE MESMO
            </span>
            <h4 className="font-sans text-lg sm:text-xl font-bold text-white">
              Pronto para parar de gastar a mais no mercado?
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-md">
              Acesse o <strong>list<span className="text-[#84E000]">.me</span></strong> agora e descubra em segundos o mercado mais barato da sua cidade.
            </p>
          </div>
          <a
            href="#precos"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-full text-xs font-bold text-center shadow-md transition whitespace-nowrap"
          >
            Começar Agora com 7 Dias de Garantia
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-8 pt-8 pb-20 sm:pb-8 border-t border-black/[0.06] max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 mt-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg overflow-hidden border border-black/10 shrink-0 bg-white">
            <Image
              src="/logo.png"
              alt="Logo"
              width={24}
              height={24}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-sans text-base font-black tracking-tight text-neutral-950 select-none">
            list<span className="text-[#84E000]">.me</span>
          </span>
          <span>— Inteligência de compras para sua casa.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-500">
          <a href="#como-funciona" className="hover:text-neutral-950 transition">Como Funciona</a>
          <a href="#depoimentos" className="hover:text-neutral-950 transition">Depoimentos</a>
          <a href="#precos" className="hover:text-neutral-950 transition">Planos</a>
          <a href="#garantia" className="hover:text-neutral-950 transition">Garantia</a>
          <a href="#faq" className="hover:text-neutral-950 transition">Dúvidas Frequentes</a>
        </div>
      </footer>

      {/* Sticky Bottom Bar Flutuante para Mobile (Garante Conversão Máxima no Smartphone) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-neutral-950/95 backdrop-blur-xl border-t border-white/10 z-40 flex items-center justify-between gap-3 shadow-[0_-10px_25px_rgba(0,0,0,0.4)]">
        <a href="#precos" className="min-w-0 block">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-white leading-tight">
            <span>Plano Mensal:</span>
            <span className="text-[#84E000] font-mono">R$ 0,99 por dia</span>
          </div>
          <span className="text-[9px] text-neutral-400 block font-mono truncate">
            7 dias de garantia incondicional
          </span>
        </a>
        <a
          href="#precos"
          className="px-4 py-2 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 font-bold rounded-full text-xs shadow-md transition shrink-0 flex items-center gap-1"
        >
          <span>Assinar Agora</span>
          <ArrowRight size={13} />
        </a>
      </div>

    </div>
  );
}
