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

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 flex flex-col selection:bg-[#84E000] selection:text-black font-sans overflow-x-hidden">
      
      {/* Top Header & Navigation */}
      <header className="px-5 sm:px-8 py-4 max-w-6xl w-full mx-auto flex items-center justify-between sticky top-0 bg-[#F8F7F4]/90 backdrop-blur-md z-40 border-b border-black/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-black/10 bg-white shrink-0">
            <Image
              src="/logo.png"
              alt="LIST.ME Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-neutral-950">
            list<span className="text-[#84E000]">.me</span>
          </span>
        </div>

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
          O <strong>list<span className="text-[#497D00]">.me</span></strong> monta sua lista de compras, por voz, foto ou texto e calcula em segundos em qual mercado da sua região a sua compra completa fica mais barata.
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
          <div className="relative flex flex-col items-center">

            {/* Card Flutuante 1: Áudio & Reconhecimento de Voz (Superior Esquerdo) */}
            <div className="flex absolute -top-8 sm:top-14 -left-4 sm:-left-48 md:-left-60 lg:-left-64 z-30 animate-float-slow items-start gap-2 sm:gap-3 bg-neutral-950/95 backdrop-blur-xl border border-white/15 p-2.5 sm:p-3.5 rounded-2xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] w-[190px] sm:w-[225px] md:w-[245px] text-left hover:scale-105 hover:border-[#84E000]/50 transition-all duration-300 group cursor-default">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#84E000]/15 text-[#84E000] border border-[#84E000]/30 flex items-center justify-center shrink-0 group-hover:bg-[#84E000] group-hover:text-neutral-950 transition">
                <Mic size={14} className="animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
                  <span className="text-[8px] sm:text-[9px] font-mono uppercase font-bold text-[#84E000] tracking-wider">
                    ÁUDIO RECONHECIDO
                  </span>
                  <div className="flex items-end gap-0.5 h-2.5 sm:h-3">
                    <span className="w-0.5 bg-[#84E000] rounded-full soundwave-bar-1" />
                    <span className="w-0.5 bg-[#84E000] rounded-full soundwave-bar-2" />
                    <span className="w-0.5 bg-[#84E000] rounded-full soundwave-bar-3" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-200 font-medium leading-tight">
                  “2 leites, pão de alho, alcatra e sabão em pó...”
                </p>
                <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-mono text-neutral-400 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />
                  IA separou 4 itens na lista
                </span>
              </div>
            </div>

            {/* Card Flutuante 2: Comparação de Mercado & Economia (Inferior Direito) */}
            <div className="flex absolute -bottom-8 sm:bottom-16 md:bottom-20 -right-4 sm:-right-48 md:-right-60 lg:-right-64 z-30 animate-float-reverse flex-col gap-1 sm:gap-2 bg-neutral-950/95 backdrop-blur-xl border border-[#84E000]/40 p-2.5 sm:p-3.5 rounded-2xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] w-[190px] sm:w-[230px] md:w-[255px] text-left hover:scale-105 hover:border-[#84E000] transition-all duration-300 ring-1 ring-[#84E000]/20 cursor-default">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 sm:pb-1.5">
                <span className="text-[8px] sm:text-[9px] font-mono uppercase text-neutral-400 font-bold">
                  COMPRA MAIS BARATA
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#84E000] text-neutral-950">
                  MENOR PREÇO
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#84E000]" />
                    Atacadão
                  </span>
                  <span className="font-bold text-[#84E000] font-mono text-[11px] sm:text-xs">
                    R$ 94,80
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400">
                  <span>Carrefour</span>
                  <span className="line-through font-mono">R$ 138,20</span>
                </div>
              </div>

              <div className="pt-1 sm:pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#84E000]">
                <span className="flex items-center gap-1">
                  <TrendingDown size={11} />
                  Economia:
                </span>
                <span className="font-bold">R$ 43,40 (31% OFF)</span>
              </div>
            </div>

            {/* Card Flutuante 3: Redes Locais da Região (Superior Direito - Desktop) */}
            <div className="hidden md:flex absolute md:-right-36 lg:-right-44 top-6 z-20 animate-float-slow items-center gap-2.5 bg-white/95 text-neutral-900 backdrop-blur-md hairline-border py-1.5 px-3 rounded-full shadow-elevated hover:scale-105 transition-all cursor-default">
              <div className="w-5 h-5 rounded-full bg-[#84E000]/20 text-[#386000] flex items-center justify-center shrink-0">
                <MapPin size={12} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold block leading-none text-neutral-900">
                  Mercados da Região
                </span>
                <span className="text-[9px] font-mono text-neutral-500 block mt-0.5">
                  Atacadão · Assaí · Carrefour
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#62A800] animate-pulse shrink-0 ml-0.5" />
            </div>

            {/* Chassi do Celular (Hardware de Luxo) */}
            <div className="relative z-10 w-full max-w-[275px] sm:max-w-[315px] bg-neutral-950 p-2.5 sm:p-3 rounded-[46px] sm:rounded-[52px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] border-4 sm:border-[6px] border-neutral-800 ring-1 ring-white/20">
              
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

          {/* Micro-Detalhe Mobile (Mercados da Região abaixo do mockup) */}
          <div className="sm:hidden mt-12 inline-flex items-center gap-2 bg-white text-neutral-900 text-xs px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm">
            <MapPin size={12} className="text-[#497D00]" />
            <span className="text-[11px] font-medium">Mercados da sua Região: <strong>Atacadão · Assaí · Carrefour</strong></span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white hairline-border p-6 rounded-[24px] shadow-card">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-[#84E000] flex items-center justify-center mb-4 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">
              Dite ou envie foto
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Fale pelo microfone enquanto olha a geladeira, envie foto da lista de papel ou digite o que precisa. A IA organiza tudo em segundos.
            </p>
          </div>

          <div className="bg-white hairline-border p-6 rounded-[24px] shadow-card">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-[#84E000] flex items-center justify-center mb-4 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">
              Cálculo da Compra Completa
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              O motor compara os preços de todas as redes locais e indica o mercado onde a sua lista completa sairá mais barata, poupando tempo e combustível.
            </p>
          </div>

          <div className="bg-white hairline-border p-6 rounded-[24px] shadow-card">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-[#84E000] flex items-center justify-center mb-4 font-mono font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">
              Sincronia com a Família
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              No Plano Família, compartilhe com o parceiro(a) via WhatsApp. Os dois visualizam e atualizam os itens da mesma casa em tempo real.
            </p>
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
              <div className="w-9 h-9 rounded-full bg-neutral-950 text-[#84E000] font-bold text-xs flex items-center justify-center font-mono shrink-0">
                CV
              </div>
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
              <div className="w-9 h-9 rounded-full bg-[#84E000] text-neutral-950 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                RM
              </div>
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
              <div className="w-9 h-9 rounded-full bg-neutral-950 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0">
                TG
              </div>
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
                Você não corre risco algum. Assine o plano ideal para você e use o <strong>list.me</strong> em todas as compras da sua semana. Se por qualquer motivo você não economizar muito mais do que o valor investido ou achar que o aplicativo não é para você, basta solicitar o reembolso em até 7 dias e <strong>nós devolvemos 100% do seu dinheiro</strong>. Sem perguntas, sem burocracia e sem letras miúdas.
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
            Tudo o que você precisa saber sobre como o <strong>list.me</strong> organiza sua rotina e economiza seu dinheiro.
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
              Acesse o list.me agora e descubra em segundos o mercado mais barato da sua cidade.
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
      <footer className="px-5 sm:px-8 py-8 border-t border-black/[0.06] max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 mt-auto">
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
          <span className="font-semibold text-neutral-900">
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

    </div>
  );
}
