'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  CreditCard,
  AlertTriangle,
  UserX,
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Zap,
  Home,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { Subscriber, SubscriptionStatus, PlanName, PlanTier, AdminMetrics } from '@/types/admin';
import { INITIAL_SUBSCRIBERS } from '@/data/mockSubscribers';

export default function AdminDashboardPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | SubscriptionStatus>('all');
  const [filterTier, setFilterTier] = useState<'all' | PlanTier>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopiedWebhook, setIsCopiedWebhook] = useState(false);

  // New subscriber form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Colombo');
  const [newState, setNewState] = useState('PR');
  const [newPlan, setNewPlan] = useState<PlanName>('Individual Mensal');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize clean empty database
  useEffect(() => {
    const saved = localStorage.getItem('listme_subscribers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Wipe old mock data if present
        if (Array.isArray(parsed) && parsed.some((s) => s.id && s.id.startsWith('sub-00'))) {
          localStorage.setItem('listme_subscribers', JSON.stringify([]));
          setSubscribers([]);
        } else {
          setSubscribers(parsed);
        }
      } catch {
        setSubscribers([]);
      }
    } else {
      setSubscribers([]);
    }
  }, []);

  // Save to localStorage when subscribers change
  useEffect(() => {
    localStorage.setItem('listme_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  // Compute live metrics
  const onlineCount = subscribers.filter((s) => s.isOnline).length;
  const activeSubscribers = subscribers.filter((s) => s.status === 'active');
  const pendingSubscribers = subscribers.filter((s) => s.status === 'pending');
  const cancelledSubscribers = subscribers.filter((s) => s.status === 'cancelled');

  const individualCount = subscribers.filter((s) => s.planTier === 'individual').length;
  const familyCount = subscribers.filter((s) => s.planTier === 'family').length;

  // Compute MRR (normalized to monthly value)
  const mrr = activeSubscribers.reduce((acc, s) => {
    if (s.billingCycle === 'annual') return acc + (s.planPrice / 12);
    if (s.billingCycle === 'quarterly') return acc + (s.planPrice / 3);
    return acc + s.planPrice;
  }, 0);

  const pendingRevenueAtRisk = pendingSubscribers.reduce((acc, s) => acc + s.planPrice, 0);

  const churnRate = subscribers.length > 0
    ? ((cancelledSubscribers.length / subscribers.length) * 100).toFixed(1)
    : '0.0';

  // Filtered list
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    const matchesTier = filterTier === 'all' || sub.planTier === filterTier;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sub.name.toLowerCase().includes(q) ||
      sub.city.toLowerCase().includes(q) ||
      sub.email.toLowerCase().includes(q) ||
      sub.planName.toLowerCase().includes(q);
    return matchesFilter && matchesTier && matchesSearch;
  });

  // Actions
  const handleToggleStatus = (id: string, newStatus: SubscriptionStatus) => {
    setSubscribers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    showToast(`Status atualizado!`);
  };

  const handleSendWhatsAppReminder = (sub: Subscriber) => {
    const text = `Olá ${sub.name}! Notamos que a sua renovação do LIST.ME (${sub.planName}) está pendente. Para continuar economizando no supermercado em ${sub.city}, acesse sua conta ou confirme seu pagamento.`;
    const url = `https://wa.me/55${sub.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyWebhookUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.com';
    const webhookUrl = `${origin}/api/webhooks/cakto`;
    navigator.clipboard.writeText(webhookUrl);
    setIsCopiedWebhook(true);
    showToast('URL do Webhook da Cakto copiada!');
    setTimeout(() => setIsCopiedWebhook(false), 3000);
  };

  const handleCreateSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let price = 29.90;
    let cycle: Subscriber['billingCycle'] = 'monthly';
    let tier: PlanTier = 'individual';
    let maxMembers = 1;

    switch (newPlan) {
      case 'Individual Mensal':
        price = 29.90;
        cycle = 'monthly';
        tier = 'individual';
        maxMembers = 1;
        break;
      case 'Individual Trimestral':
        price = 59.90;
        cycle = 'quarterly';
        tier = 'individual';
        maxMembers = 1;
        break;
      case 'Individual Anual':
        price = 129.90;
        cycle = 'annual';
        tier = 'individual';
        maxMembers = 1;
        break;
      case 'Família Mensal':
        price = 49.90;
        cycle = 'monthly';
        tier = 'family';
        maxMembers = 4;
        break;
      case 'Família Trimestral':
        price = 99.90;
        cycle = 'quarterly';
        tier = 'family';
        maxMembers = 4;
        break;
      case 'Família Anual':
        price = 179.90;
        cycle = 'annual';
        tier = 'family';
        maxMembers = 4;
        break;
    }

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@email.com`,
      phone: newPhone || '41999998888',
      city: newCity,
      state: newState,
      planTier: tier,
      planName: newPlan,
      planPrice: price,
      billingCycle: cycle,
      maxMembers,
      activeMembersCount: 1,
      startDate: new Date().toLocaleDateString('pt-BR'),
      nextBillingDate: cycle === 'annual' ? 'Em 1 ano' : cycle === 'quarterly' ? 'Em 3 meses' : 'Próximo mês',
      status: 'active',
      isOnline: true,
      gateway: 'manual',
    };

    setSubscribers((prev) => [newSub, ...prev]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    showToast(`Assinante (${tier === 'family' ? 'Família' : 'Individual'}) cadastrado!`);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 font-sans pb-16">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-elevated animate-in fade-in slide-in-from-top-4 duration-200 text-center max-w-[90vw]">
          {toastMessage}
        </div>
      )}

      {/* Top Founder Navigation Bar — Mobile Optimized */}
      <header className="bg-white hairline-border sticky top-0 z-40 px-3.5 sm:px-8 py-2.5 sm:py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-black/10 shadow-xs shrink-0 bg-white">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-sans text-sm sm:text-base font-bold text-neutral-950 leading-none">
                  list<span className="text-[#84E000]">.me</span>
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-neutral-950 text-[#84E000] border border-neutral-800 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] animate-pulse" />
                  FOUNDER
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-mono mt-0.5 truncate hidden xs:block">
                Painel do Fundador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={handleCopyWebhookUrl}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-[11px] font-mono font-medium transition flex items-center gap-1"
              title="Copiar URL para webhook da Cakto"
            >
              {isCopiedWebhook ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
              <span className="hidden md:inline">Webhook Cakto</span>
            </button>

            <button
              onClick={() => {
                setSubscribers([...subscribers]);
                showToast('Dados atualizados');
              }}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-medium transition"
              title="Atualizar dados"
            >
              <RefreshCw size={13} />
            </button>

            <Link
              href="/app"
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition flex items-center gap-1 shadow-xs"
            >
              <span>App</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        
        {/* Banner de Boas-Vindas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hairline-border p-4 sm:p-5 rounded-[22px] sm:rounded-[26px] shadow-card">
          <div>
            <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold tracking-widest block mb-0.5">
              ADMIN HUB · MONETIZAÇÃO
            </span>
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-neutral-900 leading-tight">
              Painel do Fundador
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Métricas em tempo real nos planos <strong>Individual</strong> e <strong>Família</strong>.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition duration-200"
          >
            <Plus size={14} />
            Novo Assinante
          </button>
        </div>

        {/* 4 KPIs BENTO CARDS (Mobile Grid 2x2, Desktop 4x1) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          
          {/* KPI 1: Usuários Online Agora */}
          <div className="bg-white hairline-border p-3.5 sm:p-5 rounded-[20px] sm:rounded-[24px] shadow-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold truncate">
                ONLINE
              </span>
              <span className="flex items-center gap-1 text-[9px] font-mono text-[#497D00] font-semibold bg-[#F4FCE3] border border-[#D9F99D] px-1.5 py-0.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] animate-ping" />
                AO VIVO
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 leading-none">
                {onlineCount}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-400">online</span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-2 truncate flex items-center gap-1">
              <Zap size={11} className="text-[#62A800] shrink-0" />
              No app agora
            </p>
          </div>

          {/* KPI 2: Assinantes Ativos & MRR (Estilo Obsidian + Lime da Logo) */}
          <div className="bg-neutral-950 text-white p-3.5 sm:p-5 rounded-[20px] sm:rounded-[24px] shadow-elevated relative overflow-hidden border border-neutral-800">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold truncate">
                ASSINANTES
              </span>
              <span className="text-[9px] font-mono text-neutral-950 font-bold bg-[#84E000] px-1.5 py-0.5 rounded-md shrink-0">
                MRR
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-white leading-none">
                {activeSubscribers.length}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-400">ativos</span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#84E000] mt-2 font-mono font-semibold truncate">
              R$ {mrr.toFixed(2).replace('.', ',')}/mês
            </p>
          </div>

          {/* KPI 3: Mensalidades Não Renovadas (Pendentes) */}
          <div className="bg-white hairline-border p-3.5 sm:p-5 rounded-[20px] sm:rounded-[24px] shadow-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold truncate">
                EM ABERTO
              </span>
              <span className="flex items-center gap-1 text-[9px] font-mono text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-full shrink-0">
                <AlertTriangle size={10} />
                PENDENTES
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 leading-none">
                {pendingSubscribers.length}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-400">cobranças</span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-amber-800 mt-2 font-medium truncate">
              R$ {pendingRevenueAtRisk.toFixed(2).replace('.', ',')} pendentes
            </p>
          </div>

          {/* KPI 4: Cancelados & Churn */}
          <div className="bg-white hairline-border p-3.5 sm:p-5 rounded-[20px] sm:rounded-[24px] shadow-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold truncate">
                CANCELADOS
              </span>
              <span className="text-[9px] font-mono text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded-full shrink-0">
                {churnRate}%
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 leading-none">
                {cancelledSubscribers.length}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-400">churn</span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-2 truncate">
              Retenção {(100 - parseFloat(churnRate)).toFixed(0)}%
            </p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* GRADE DE PLANOS: INDIVIDUAL (1P) VS FAMÍLIA (ATÉ 4P) */}
        {/* ======================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-1.5">
              <span>Grade Oficial de Preços</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">
              6 Planos Ativos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* Bloco 1: PLANO INDIVIDUAL (1 Usuário) */}
            <div className="bg-white hairline-border p-4 rounded-[22px] shadow-card space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Plano Individual</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">1 acesso exclusivo</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-800">
                  {individualCount} assinantes
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">Mensal</span>
                  <strong className="text-xs font-mono font-bold text-neutral-900 block mt-0.5">R$ 19,90</strong>
                  <span className="text-[9px] text-neutral-500 font-mono">/mês</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">Trimestral</span>
                  <strong className="text-xs font-mono font-bold text-neutral-900 block mt-0.5">R$ 49,90</strong>
                  <span className="text-[9px] text-emerald-700 font-mono">R$ 16,63/mês</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">Anual</span>
                  <strong className="text-xs font-mono font-bold text-emerald-800 block mt-0.5">R$ 119,90</strong>
                  <span className="text-[9px] text-emerald-700 font-mono">R$ 9,99/mês</span>
                </div>
              </div>
            </div>

            {/* Bloco 2: PLANO FAMÍLIA (Até 4 Pessoas Conectadas) */}
            <div className="bg-white hairline-border p-4 rounded-[22px] shadow-card space-y-3 relative overflow-hidden border-l-4 border-l-emerald-700">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Home size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-neutral-900">Plano Família</h4>
                      <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold uppercase">
                        Alta Conversão
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">Até 4 membros na mesma casa</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-800">
                  {familyCount} assinantes
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">Mensal</span>
                  <strong className="text-xs font-mono font-bold text-neutral-900 block mt-0.5">R$ 49,90</strong>
                  <span className="text-[9px] text-neutral-500 font-mono">/mês</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">Trimestral</span>
                  <strong className="text-xs font-mono font-bold text-neutral-900 block mt-0.5">R$ 99,90</strong>
                  <span className="text-[9px] text-emerald-700 font-mono">R$ 33,30/mês</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">Anual</span>
                  <strong className="text-xs font-mono font-bold text-emerald-800 block mt-0.5">R$ 179,90</strong>
                  <span className="text-[9px] text-emerald-700 font-mono">R$ 14,99/mês</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BASE DE ASSINANTES (CRM HÍBRIDO: CARDS NO MOBILE, TABELA NO DESKTOP) */}
        <div className="bg-white hairline-border rounded-[22px] sm:rounded-[26px] shadow-card overflow-hidden">
          
          {/* Toolbar da Tabela / Filtros */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">
                  Assinantes ({filteredSubscribers.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Controle de mensalidades e membros.
                </p>
              </div>

              {/* Filtro Tier: Individual vs Família */}
              <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl text-[10px] font-medium font-mono">
                <button
                  onClick={() => setFilterTier('all')}
                  className={`px-2 py-1 rounded-lg transition ${
                    filterTier === 'all' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-500'
                  }`}
                >
                  TODOS
                </button>
                <button
                  onClick={() => setFilterTier('individual')}
                  className={`px-2 py-1 rounded-lg transition ${
                    filterTier === 'individual' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-500'
                  }`}
                >
                  INDIVIDUAL
                </button>
                <button
                  onClick={() => setFilterTier('family')}
                  className={`px-2 py-1 rounded-lg transition ${
                    filterTier === 'family' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-neutral-500'
                  }`}
                >
                  FAMÍLIA
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Campo de Busca Full Width no Mobile */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar nome, cidade..."
                  className="w-full pl-8 pr-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <Search size={13} className="absolute left-2.5 top-3 text-neutral-400" />
              </div>

              {/* Filtros em Pílulas com Scroll Horizontal Suave no Mobile */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-[11px] font-medium overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                    filterStatus === 'all'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Todos ({subscribers.length})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                    filterStatus === 'active'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Ativos ({activeSubscribers.length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                    filterStatus === 'pending'
                      ? 'bg-white text-amber-800 shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Pendentes ({pendingSubscribers.length})
                </button>
                <button
                  onClick={() => setFilterStatus('cancelled')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                    filterStatus === 'cancelled'
                      ? 'bg-white text-red-700 shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Cancelados ({cancelledSubscribers.length})
                </button>
              </div>
            </div>
          </div>

          {/* 1. VISÃO MOBILE (Cards Dedicados para Celular) */}
          <div className="block md:hidden divide-y divide-neutral-100">
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <Users size={18} />
                </div>
                <h4 className="text-xs font-semibold text-neutral-800">
                  Nenhum assinante cadastrado
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed max-w-xs mx-auto">
                  Sua base está zerada. Vendas pela Cakto ou novos cadastros aparecerão aqui em tempo real.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium shadow-xs transition inline-flex items-center gap-1.5"
                  >
                    <Plus size={13} /> Cadastrar primeiro assinante
                  </button>
                </div>
              </div>
            ) : (
              filteredSubscribers.map((sub) => (
                <div key={sub.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs shrink-0 relative">
                        {sub.name[0]}
                        {sub.isOnline && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute -top-0.5 -right-0.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs font-semibold text-neutral-900 block truncate">
                          {sub.name}
                        </strong>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {sub.city}, {sub.state}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 flex items-center gap-1">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        sub.planTier === 'family' ? 'bg-emerald-100 text-emerald-900' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {sub.planTier === 'family' ? 'Família' : 'Indiv.'}
                      </span>

                      {sub.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-800 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          ATIVO
                        </span>
                      )}
                      {sub.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-800 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                          PENDENTE
                        </span>
                      )}
                      {sub.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-50 text-red-700 font-mono">
                          CANCELADO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-neutral-50 px-3 py-2 rounded-xl">
                    <div>
                      <span className="text-neutral-400 block text-[9px] font-mono uppercase">Plano</span>
                      <span className="font-semibold text-neutral-800 block truncate">{sub.planName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[9px] font-mono uppercase">Valor</span>
                      <span className="font-mono font-bold text-neutral-900 block">
                        R$ {sub.planPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[9px] font-mono uppercase">Renovação</span>
                      <span className="font-mono text-neutral-600 block truncate">{sub.nextBillingDate}</span>
                    </div>
                  </div>

                  {/* Ações Mobile */}
                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    {sub.status === 'pending' && (
                      <button
                        onClick={() => handleSendWhatsAppReminder(sub)}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                      >
                        <MessageCircle size={11} />
                        Cobrar WhatsApp
                      </button>
                    )}
                    {sub.status !== 'active' ? (
                      <button
                        onClick={() => handleToggleStatus(sub.id, 'active')}
                        className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-[10px] font-medium"
                      >
                        Ativar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(sub.id, 'pending')}
                        className="px-2.5 py-1 bg-neutral-50 text-neutral-400 hover:text-amber-700 rounded-lg text-[10px] font-medium"
                      >
                        Suspender
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 2. VISÃO DESKTOP (Tabela Completa para Telas Médias e Grandes) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-100 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Cliente</th>
                  <th className="py-3 px-4 font-semibold">Modalidade</th>
                  <th className="py-3 px-4 font-semibold">Plano</th>
                  <th className="py-3 px-4 font-semibold">Valor</th>
                  <th className="py-3 px-4 font-semibold">Início</th>
                  <th className="py-3 px-4 font-semibold">Próx. Renovação</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 px-4">
                      <div className="max-w-xs mx-auto text-center space-y-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                          <Users size={18} />
                        </div>
                        <h4 className="text-xs font-semibold text-neutral-800">
                          Nenhum assinante cadastrado
                        </h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          Sua base está zerada. Vendas pela Cakto ou novos cadastros aparecerão aqui em tempo real.
                        </p>
                        <div className="pt-1">
                          <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium shadow-xs transition inline-flex items-center gap-1.5"
                          >
                            <Plus size={12} /> Cadastrar primeiro assinante
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50/60 transition">
                      
                      {/* Cliente */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs shrink-0 relative">
                            {sub.name[0]}
                            {sub.isOnline && (
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -top-0.5 -right-0.5" title="Online no app" />
                            )}
                          </div>
                          <div>
                            <strong className="font-semibold text-neutral-900 block truncate max-w-[160px]">
                              {sub.name}
                            </strong>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {sub.city}, {sub.state}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Modalidade (Individual ou Família) */}
                      <td className="py-3.5 px-4 font-mono">
                        {sub.planTier === 'family' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                            <Home size={10} /> FAMÍLIA (4P)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-700">
                            <User size={10} /> INDIVIDUAL
                          </span>
                        )}
                      </td>

                      {/* Plano */}
                      <td className="py-3.5 px-4 font-medium text-neutral-800">
                        {sub.planName}
                      </td>

                      {/* Valor */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900">
                        R$ {sub.planPrice.toFixed(2).replace('.', ',')}
                      </td>

                      {/* Início */}
                      <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">
                        {sub.startDate}
                      </td>

                      {/* Próx. Renovação */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className={sub.status === 'pending' ? 'text-amber-700 font-bold' : 'text-neutral-600'}>
                          {sub.nextBillingDate}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {sub.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            ATIVO
                          </span>
                        )}
                        {sub.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                            PENDENTE
                          </span>
                        )}
                        {sub.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            CANCELADO
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {sub.status === 'pending' && (
                            <button
                              onClick={() => handleSendWhatsAppReminder(sub)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition"
                              title="Enviar cobrança via WhatsApp"
                            >
                              <MessageCircle size={11} />
                              Cobrar
                            </button>
                          )}

                          {sub.status !== 'active' ? (
                            <button
                              onClick={() => handleToggleStatus(sub.id, 'active')}
                              className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-medium transition"
                            >
                              Ativar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(sub.id, 'pending')}
                              className="px-2 py-1 bg-neutral-50 hover:bg-neutral-100 text-neutral-400 hover:text-amber-700 rounded-lg text-[10px] font-medium transition"
                            >
                              Suspender
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* Modal: Adicionar Assinante Manualmente — Com os 6 Planos Oficiais */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4">
          <div className="bg-white rounded-[24px] sm:rounded-[26px] p-5 sm:p-6 max-w-md w-full shadow-elevated hairline-border animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-widest block">
                  ADMIN ACTION
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">
                  Cadastrar Assinante
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscriber} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Ex: 41999998888"
                  className="w-full px-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Selecione o Plano
                </label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as PlanName)}
                  className="w-full px-3 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
                >
                  <optgroup label="Plano Individual (1 Usuário)">
                    <option value="Individual Mensal">Individual Mensal — R$ 29,90/mês</option>
                    <option value="Individual Trimestral">Individual Trimestral — R$ 59,90/tri</option>
                    <option value="Individual Anual">Individual Anual — R$ 129,90/ano</option>
                  </optgroup>
                  <optgroup label="Plano Família (Até 4 Pessoas)">
                    <option value="Família Mensal">Família Mensal — R$ 49,90/mês</option>
                    <option value="Família Trimestral">Família Trimestral — R$ 99,90/tri</option>
                    <option value="Família Anual">Família Anual — R$ 179,90/ano</option>
                  </optgroup>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Salvar e Ativar Assinante
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
