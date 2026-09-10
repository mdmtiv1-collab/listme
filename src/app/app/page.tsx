'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mic,
  Camera,
  Plus,
  Minus,
  Trash2,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
  Share2,
  Sparkles,
  User,
  Search,
  Store,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  Tag,
  Home,
  CheckSquare,
  X,
  Keyboard,
  Settings,
  ExternalLink,
  ShieldCheck,
  Clock,
  ShoppingBag,
  Volume2,
  AlertCircle,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { ListItem, MarketComparison, ChatMessage, ExpenseRecord } from '@/types';
import { getMarketsForLocation } from '@/data/regionalMarkets';
import { extractGroceryItems } from '@/utils/groceryParser';
import { groupItemsByAisles, formatListByAisleForWhatsApp } from '@/utils/supermarketAisles';
import AudioRecorder from '@/components/AudioRecorder';
import PhotoUploadModal from '@/components/PhotoUploadModal';
import InstallTutorialModal from '@/components/InstallTutorialModal';
import MarketLogo from '@/components/MarketLogo';

export type AppTab = 'home' | 'lists' | 'prices' | 'profile';

const CATEGORY_IMAGES: Record<string, string> = {
  'Hortifrúti': '/categories/hortifruti.jpg',
  'Hortifruti': '/categories/hortifruti.jpg',
  'Mercearia': '/categories/mercearia.jpg',
  'Açougue': '/categories/carnes.jpg',
  'Carnes': '/categories/carnes.jpg',
  'Laticínios': '/categories/frios.jpg',
  'Laticínios & Frios': '/categories/frios.jpg',
  'Frios': '/categories/frios.jpg',
  'Bebidas': '/categories/bebidas.jpg',
  'Padaria': '/categories/padaria.jpg',
  'Limpeza': '/categories/limpeza.jpg',
  'Higiene': '/categories/higiene.jpg',
  'Outros': '/categories/mercearia.jpg',
};

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [items, setItems] = useState<ListItem[]>([]);
  const [markets, setMarkets] = useState<MarketComparison[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  
  // Location & User Profile
  const [city, setCity] = useState('Colombo');
  const [stateCode, setStateCode] = useState('PR');
  const [neighborhood, setNeighborhood] = useState('Maracanã');
  const [userName, setUserName] = useState('Filipe Nascimento');
  const [houseName, setHouseName] = useState('Casa');
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    city: string;
    state: string;
    neighborhood?: string;
    isGpsActive: boolean;
  }>({
    latitude: -25.2917,
    longitude: -49.2242,
    city: 'Colombo',
    state: 'PR',
    neighborhood: 'Maracanã',
    isGpsActive: true,
  });

  // UI States
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isRecordExpenseModalOpen, setIsRecordExpenseModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Assistant & Search States
  const [isSearchingOffers, setIsSearchingOffers] = useState(false);
  const [assistantFeedback, setAssistantFeedback] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [priceSortMode, setPriceSortMode] = useState<'cheapest' | 'closest'>('cheapest');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Input fields for modals
  const [manualText, setManualText] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Mercearia');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('un');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Expense modal fields
  const [expenseMarket, setExpenseMarket] = useState('Atacadão');
  const [expenseTotal, setExpenseTotal] = useState('');
  const [expenseSaved, setExpenseSaved] = useState('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Switch tab with instant scroll to top
  const switchTab = (tab: AppTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Load Initial State from localStorage or Defaults
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedItems = localStorage.getItem('listme_items');
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          loadDefaultItems();
        }
      } else {
        loadDefaultItems();
      }

      const savedExpenses = localStorage.getItem('listme_expenses');
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      } else {
        setExpenses([
          { id: '1', marketName: 'Atacadão', date: '12 de mai.', totalPaid: 284.90, itemsCount: 18, estimatedEconomy: 38.40 },
          { id: '2', marketName: 'Carrefour', date: '05 de mai.', totalPaid: 323.30, itemsCount: 14, estimatedEconomy: 24.50 },
          { id: '3', marketName: 'Assaí Atacadista', date: '28 de abr.', totalPaid: 295.10, itemsCount: 16, estimatedEconomy: 42.10 },
          { id: '4', marketName: 'Max Atacadista', date: '21 de abr.', totalPaid: 240.80, itemsCount: 12, estimatedEconomy: 31.20 }
        ]);
      }

      const savedProfile = localStorage.getItem('listme_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.userName) setUserName(p.userName);
        if (p.city) setCity(p.city);
        if (p.state) setStateCode(p.state);
        if (p.neighborhood) setNeighborhood(p.neighborhood);
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
      loadDefaultItems();
    }
  }, []);

  const loadDefaultItems = () => {
    const defaults: ListItem[] = [
      { id: '1', name: 'Arroz Branco 5kg', matchedItem: 'Arroz Branco Nobre Tipo 1 Tio João 5kg', basePrice: 25.90, quantity: 1, unit: 'pct', category: 'Mercearia', checked: false },
      { id: '2', name: 'Feijão Carioca 1kg', matchedItem: 'Feijão Carioca Tipo 1 Kicaldo 1kg', basePrice: 7.89, quantity: 2, unit: 'pct', category: 'Mercearia', checked: false },
      { id: '3', name: 'Café Tradicional 500g', matchedItem: 'Café Tradicional em Pó Pilão 500g', basePrice: 18.90, quantity: 1, unit: 'pct', category: 'Mercearia', checked: false },
      { id: '4', name: 'Óleo de Soja 900ml', matchedItem: 'Óleo de Soja Refinado Soya 900ml', basePrice: 6.89, quantity: 2, unit: 'un', category: 'Mercearia', checked: true },
      { id: '5', name: 'Azeite Extra Virgem 500ml', matchedItem: 'Azeite de Oliva Extra Virgem Gallo 500ml', basePrice: 34.90, quantity: 1, unit: 'un', category: 'Mercearia', checked: false },
      { id: '6', name: 'Ovos (Bandeja 30 un)', matchedItem: 'Ovos Brancos Grandes Bandeja 30 un', basePrice: 18.90, quantity: 1, unit: 'bandeja', category: 'Hortifrúti', checked: false },
      { id: '7', name: 'Banana Prata', matchedItem: 'Banana Prata Fresca 1kg', basePrice: 6.49, quantity: 2, unit: 'kg', category: 'Hortifrúti', checked: true },
      { id: '8', name: 'Maçã Nacional', matchedItem: 'Maçã Gala Nacional Selecionada 1kg', basePrice: 8.90, quantity: 1, unit: 'kg', category: 'Hortifrúti', checked: false },
      { id: '9', name: 'Batata Lavada', matchedItem: 'Batata Inglesa Lavada 1kg', basePrice: 5.99, quantity: 2, unit: 'kg', category: 'Hortifrúti', checked: false },
      { id: '10', name: 'Tomate Longa Vida', matchedItem: 'Tomate Longa Vida Selecionado 1kg', basePrice: 7.49, quantity: 1, unit: 'kg', category: 'Hortifrúti', checked: false },
      { id: '11', name: 'Patinho Bovino Moído', matchedItem: 'Patinho Bovino de Primeira Fresco 1kg', basePrice: 34.90, quantity: 1, unit: 'kg', category: 'Carnes', checked: false },
      { id: '12', name: 'Peito de Frango', matchedItem: 'Filé de Peito de Frango Congelado 1kg', basePrice: 17.90, quantity: 2, unit: 'kg', category: 'Carnes', checked: false },
      { id: '13', name: 'Sabão em Pó OMO 1.6kg', matchedItem: 'Sabão em Pó OMO Lavagem Perfeita 1.6kg', basePrice: 22.90, quantity: 1, unit: 'un', category: 'Limpeza', checked: false },
      { id: '14', name: 'Detergente Ypê 500ml', matchedItem: 'Detergente Líquido Neutro Ypê 500ml', basePrice: 2.39, quantity: 3, unit: 'un', category: 'Limpeza', checked: true },
      { id: '15', name: 'Amaciante Concentrado 1.5L', matchedItem: 'Amaciante Concentrado Comfort 1.5L', basePrice: 19.90, quantity: 1, unit: 'un', category: 'Limpeza', checked: false },
      { id: '16', name: 'Papel Higiênico Folha Dupla 12 rolos', matchedItem: 'Papel Higiênico Neve Folha Dupla 12 un', basePrice: 21.90, quantity: 1, unit: 'pct', category: 'Higiene', checked: false },
      { id: '17', name: 'Creme Dental Colgate 90g', matchedItem: 'Creme Dental Colgate Total 12 90g', basePrice: 5.49, quantity: 2, unit: 'un', category: 'Higiene', checked: false },
      { id: '18', name: 'Sabonete Dove 90g', matchedItem: 'Sabonete em Barra Original Dove 90g', basePrice: 4.29, quantity: 4, unit: 'un', category: 'Higiene', checked: true }
    ];
    setItems(defaults);
    localStorage.setItem('listme_items', JSON.stringify(defaults));
  };

  // 2. Dynamically Recalculate Markets whenever items or location change
  useEffect(() => {
    if (items.length === 0) return;

    const baseListTotal = items.reduce((acc, it) => acc + (it.basePrice || 10) * (it.quantity || 1), 0);
    const regional = getMarketsForLocation(stateCode);

    // Factors: Atacadistas are ~12% to 15% cheaper, Supermercados are full price or +10%
    const calculated: MarketComparison[] = regional.map((m, idx) => {
      const isWholesale = /atacad|assai|circuito|fort|kompr|max/i.test(m.marketName);
      const factor = m.priceFactor || (isWholesale ? 0.88 : 1.05);
      const storeTotal = Number((baseListTotal * factor).toFixed(2));
      return {
        marketId: m.marketId,
        marketName: m.marketName,
        logoColor: m.logoColor || '#84E000',
        coveredItems: items.length,
        totalItems: items.length,
        totalPrice: storeTotal,
        savings: 0,
        clubDiscounts: Number((storeTotal * 0.04).toFixed(2)),
        isBestValue: false,
        distance: m.distance || `${(2.2 + idx * 1.4).toFixed(1)} km`,
        marketType: (isWholesale ? 'atacadista' : 'supermercado') as 'atacadista' | 'supermercado',
      };
    });

    // Sort by price ascending to find real winner
    calculated.sort((a, b) => a.totalPrice - b.totalPrice);
    if (calculated.length > 0) {
      calculated[0].isBestValue = true;
      const highestPrice = Math.max(...calculated.map(c => c.totalPrice));
      calculated[0].savings = Number((highestPrice - calculated[0].totalPrice).toFixed(2));
    }

    setMarkets(calculated);
  }, [items, stateCode]);

  // Total Estimated Price for current list
  const totalListValue = useMemo(() => {
    return items.reduce((acc, it) => acc + (it.basePrice || 10) * (it.quantity || 1), 0);
  }, [items]);

  // Best market winner
  const bestMarket = useMemo(() => {
    return markets.find(m => m.isBestValue) || markets[0];
  }, [markets]);

  // Filtered & Sorted Markets for Screen 3
  const sortedMarkets = useMemo(() => {
    const list = [...markets];
    if (priceSortMode === 'cheapest') {
      return list.sort((a, b) => a.totalPrice - b.totalPrice);
    } else {
      return list.sort((a, b) => {
        const distA = parseFloat(a.distance?.replace(',', '.') || '99');
        const distB = parseFloat(b.distance?.replace(',', '.') || '99');
        return distA - distB;
      });
    }
  }, [markets, priceSortMode]);

  // Group items by category / aisle
  const groupedCategories = useMemo(() => {
    const map = new Map<string, ListItem[]>();
    items.forEach(it => {
      const cat = it.category || 'Mercearia';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(it);
    });
    return Array.from(map.entries()).map(([name, catItems]) => ({
      name,
      items: catItems,
      allChecked: catItems.length > 0 && catItems.every(i => i.checked),
      checkedCount: catItems.filter(i => i.checked).length,
      image: CATEGORY_IMAGES[name] || '/categories/mercearia.jpg',
    }));
  }, [items]);

  // Filtered items for Search in List Tab
  const filteredGroupedCategories = useMemo(() => {
    if (!listSearchQuery.trim()) return groupedCategories;
    const query = listSearchQuery.toLowerCase();
    return groupedCategories
      .map(group => ({
        ...group,
        items: group.items.filter(it => it.name.toLowerCase().includes(query)),
      }))
      .filter(group => group.items.length > 0);
  }, [groupedCategories, listSearchQuery]);

  // 3. CORE PROCESSING: Voice / Text / Photo with Backend AI + Local Fallback
  const handleProcessUserText = async (text: string) => {
    if (!text.trim()) return;

    const userText = text.trim();
    setIsSearchingOffers(true);
    setAssistantFeedback(null);

    const curCity = gpsLocation?.city || city || 'Colombo';
    const curState = gpsLocation?.state || stateCode || 'PR';
    const curNeighborhood = gpsLocation?.neighborhood || neighborhood || '';

    try {
      const res = await fetch('/api/quote/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: curCity,
          state: curState,
          neighborhood: curNeighborhood,
          latitude: gpsLocation?.latitude || null,
          longitude: gpsLocation?.longitude || null,
          rawInput: userText,
          radiusKm: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.replyText || Array.isArray(data.items))) {
          if (Array.isArray(data.items) && data.items.length > 0) {
            const newItems: ListItem[] = data.items.map((it: any, idx: number) => ({
              id: `item-${Date.now()}-${idx}`,
              name: it.name,
              matchedItem: it.matchedProduct || it.name,
              basePrice: Number(it.basePrice || it.price || 12.9),
              quantity: Number(it.quantity || 1),
              unit: it.unit || 'un',
              category: it.category || 'Mercearia',
              checked: false,
            }));

            setItems(prev => {
              const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
              const filteredNew = newItems.filter(ni => !existingNames.has(ni.name.toLowerCase()));
              const updated = [...prev, ...filteredNew];
              localStorage.setItem('listme_items', JSON.stringify(updated));
              return updated;
            });
          }

          if (Array.isArray(data.rankedMarkets) && data.rankedMarkets.length > 0) {
            const ranked: MarketComparison[] = data.rankedMarkets.map((rm: any, idx: number) => ({
              marketId: rm.marketId || `m-${idx}`,
              marketName: rm.marketName || rm.name,
              logoColor: idx === 0 ? '#84E000' : '#14181D',
              coveredItems: rm.coveredItems || data.items?.length || items.length,
              totalItems: rm.totalItems || data.items?.length || items.length,
              totalPrice: Number(rm.totalPrice) || 0,
              savings: Number(rm.savings) || 0,
              isBestValue: idx === 0,
              clubDiscounts: 0,
              distance: rm.distance || (idx === 0 ? '2,4 km' : `${(2.4 + idx * 1.2).toFixed(1)} km`),
              marketType: /atacad|assai|circuito|fort|kompr/i.test(rm.marketName || '') ? 'atacadista' : 'supermercado',
            }));
            setMarkets(ranked);
          }

          setAssistantFeedback(data.replyText || `Adicionados ${data.items?.length || 0} produtos à sua lista com sucesso!`);
          showToast(`${data.items?.length || 0} produtos adicionados à sua lista!`);
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
          return;
        }
      }
      throw new Error('Falha na resposta da API');
    } catch (err) {
      console.warn('Utilizando extração local sem ruídos:', err);
      const parsed = extractGroceryItems(userText);
      if (parsed.length > 0) {
        const newItems: ListItem[] = parsed.map((it, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          name: it.name,
          matchedItem: it.matchedProduct,
          basePrice: it.basePrice,
          quantity: it.quantity,
          unit: it.unit,
          category: it.category,
          checked: false,
        }));

        setItems(prev => {
          const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
          const filteredNew = newItems.filter(ni => !existingNames.has(ni.name.toLowerCase()));
          const updated = [...prev, ...filteredNew];
          localStorage.setItem('listme_items', JSON.stringify(updated));
          return updated;
        });

        const namesList = parsed.map(p => p.name).join(', ');
        setAssistantFeedback(`Identificamos: ${namesList}. Atualizamos sua lista e recalculamos os mercados!`);
        showToast(`${parsed.length} itens adicionados com sucesso!`);
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
      } else {
        showToast('Nenhum produto identificado. Fale ou digite novamente.');
      }
    } finally {
      setIsSearchingOffers(false);
    }
  };

  // Item Manipulations
  const handleToggleItem = (id: string) => {
    setItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      localStorage.setItem('listme_items', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems(prev => {
      const updated = prev
        .map(item => {
          if (item.id === id) {
            const nextQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        });
      localStorage.setItem('listme_items', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('listme_items', JSON.stringify(updated));
      return updated;
    });
    showToast('Item removido da lista');
  };

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const parsedPrice = parseFloat(newItemPrice.replace(',', '.')) || 10.90;
    const newItem: ListItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      matchedItem: `${newItemName.trim()} ${newItemUnit}`,
      basePrice: parsedPrice,
      quantity: newItemQty,
      unit: newItemUnit,
      category: newItemCategory,
      checked: false,
    };

    setItems(prev => {
      const updated = [...prev, newItem];
      localStorage.setItem('listme_items', JSON.stringify(updated));
      return updated;
    });

    setNewItemName('');
    setNewItemPrice('');
    setNewItemQty(1);
    setIsAddItemModalOpen(false);
    showToast('Item adicionado à lista!');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const paid = parseFloat(expenseTotal.replace(',', '.')) || 0;
    const saved = parseFloat(expenseSaved.replace(',', '.')) || 0;
    if (paid <= 0) return;

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      marketName: expenseMarket,
      date: 'Hoje',
      totalPaid: paid,
      itemsCount: items.length,
      estimatedEconomy: saved || Number((paid * 0.12).toFixed(2)),
    };

    setExpenses(prev => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('listme_expenses', JSON.stringify(updated));
      return updated;
    });

    setExpenseTotal('');
    setExpenseSaved('');
    setIsRecordExpenseModalOpen(false);
    showToast('Compra registrada com sucesso!');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const totalEconomizedMonth = useMemo(() => {
    return expenses.reduce((acc, ex) => acc + ex.estimatedEconomy, 0);
  }, [expenses]);

  const averageEconomyPerPurchase = useMemo(() => {
    if (expenses.length === 0) return 0;
    return totalEconomizedMonth / expenses.length;
  }, [expenses, totalEconomizedMonth]);

  // Quick chips handler
  const handleQuickAdd = (text: string) => {
    handleProcessUserText(text);
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white flex justify-center selection:bg-[#84E000] selection:text-black">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-md bg-[#0B0E11] flex flex-col min-h-screen relative pb-24 shadow-2xl overflow-x-hidden">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#14181D] text-white text-xs font-semibold rounded-2xl border border-[#84E000]/40 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <span className="w-2 h-2 rounded-full bg-[#84E000] animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TELA 1: INÍCIO — CRIAÇÃO INTELIGENTE DE LISTA
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'home' && (
          <div className="flex-1 flex flex-col px-5 pt-5 pb-6 animate-in fade-in duration-200">
            
            {/* 1. Header com Hamburger, Logo e Notificação */}
            <div className="flex items-center justify-between py-2 mb-6">
              <button
                onClick={() => setIsMenuOpen(true)}
                type="button"
                className="w-10 h-10 rounded-full bg-[#14181D] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#84E000]/50 transition"
              >
                <SlidersHorizontal size={18} />
              </button>

              <div className="flex items-center gap-1">
                <span className="font-extrabold tracking-wider text-lg text-white">LIST</span>
                <span className="font-extrabold text-lg text-[#84E000]">.ME</span>
              </div>

              <button
                onClick={() => switchTab('profile')}
                type="button"
                className="w-10 h-10 rounded-full bg-[#14181D] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#84E000]/50 transition relative"
              >
                <User size={18} />
                <span className="w-2 h-2 rounded-full bg-[#84E000] absolute top-2.5 right-2.5" />
              </button>
            </div>

            {/* 2. Título e Subtítulo Principal */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
                Criar nova lista
              </h1>
              <p className="text-xs text-neutral-400 font-medium">
                Fale o que você precisa comprar
              </p>
            </div>

            {/* 3. Card Central de Voz com Ondas Sonoras */}
            <div className="bg-[#14181D] border border-white/10 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#84E000]/5 rounded-full blur-2xl pointer-events-none" />

              {isRecordingAudio ? (
                <div className="py-2">
                  <AudioRecorder
                    onAudioCaptured={(transcript) => {
                      setIsRecordingAudio(false);
                      handleProcessUserText(transcript);
                    }}
                    onCancel={() => setIsRecordingAudio(false)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-2 h-2 rounded-full bg-[#84E000] animate-pulse" />
                    <span className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
                      Estou ouvindo...
                    </span>
                  </div>

                  {/* 21 Neon Sound Bars with Soundwave Animation */}
                  <div className="flex items-center justify-center gap-1.5 h-16 w-full px-2 mb-6">
                    {[6, 12, 18, 26, 38, 48, 56, 42, 30, 20, 36, 52, 60, 46, 32, 22, 14, 28, 40, 22, 10].map((h, idx) => (
                      <span
                        key={idx}
                        style={{
                          height: `${h}px`,
                          animationDelay: `${(idx * 0.08).toFixed(2)}s`,
                        }}
                        className="w-1 bg-[#84E000] rounded-full animate-soundwave-pulse shadow-[0_0_8px_#84e00066]"
                      />
                    ))}
                  </div>

                  {/* Exemplo / Preview de Fala */}
                  <p className="text-xs text-neutral-300 italic mb-6 max-w-xs leading-relaxed">
                    &ldquo;Arroz, feijão, café, leite e produtos de limpeza&rdquo;
                  </p>

                  {/* Botão Primário: Criar Minha Lista / Gravar */}
                  <button
                    onClick={() => setIsRecordingAudio(true)}
                    type="button"
                    className="w-full py-3.5 px-6 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-2xl font-bold text-sm shadow-lg shadow-[#84e000]/25 flex items-center justify-center gap-2.5 transition transform active:scale-95 duration-150"
                  >
                    <Mic size={18} />
                    <span>Gravar com a voz</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Linha de Ações Secundárias: Foto & Digitar */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                type="button"
                className="py-3 px-4 bg-[#14181D] hover:bg-[#1A2026] border border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-neutral-200 transition"
              >
                <Camera size={16} className="text-[#84E000]" />
                <span>Foto da lista</span>
              </button>

              <button
                onClick={() => setIsTextModalOpen(true)}
                type="button"
                className="py-3 px-4 bg-[#14181D] hover:bg-[#1A2026] border border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-neutral-200 transition"
              >
                <Keyboard size={16} className="text-[#84E000]" />
                <span>Digitar itens</span>
              </button>
            </div>

            {/* 5. Feedback da IA / Resposta de Cotação */}
            {isSearchingOffers && (
              <div className="bg-[#14181D] border border-[#84E000]/30 rounded-2xl p-4 mb-5 flex items-center gap-3 animate-pulse">
                <Sparkles size={20} className="text-[#84E000] shrink-0 animate-spin" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Pesquisando mercados mais próximos...</p>
                  <p className="text-neutral-400 text-[11px]">Comparando Atacadão, Assaí e mercados de {city}.</p>
                </div>
              </div>
            )}

            {assistantFeedback && !isSearchingOffers && (
              <div className="bg-[#14181D] border border-white/10 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#84E000]/15 border border-[#84E000]/30 flex items-center justify-center text-[#84E000] shrink-0 mt-0.5">
                    <Sparkles size={14} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#84E000]">Assistente LIST.ME</span>
                    <p className="text-xs text-neutral-200 mt-1 leading-relaxed whitespace-pre-line">{assistantFeedback}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => switchTab('lists')}
                    type="button"
                    className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckSquare size={13} className="text-[#84E000]" />
                    <span>Ver Minha Lista ({items.length})</span>
                  </button>
                  <button
                    onClick={() => switchTab('prices')}
                    type="button"
                    className="flex-1 py-2 px-3 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Tag size={13} />
                    <span>Ver Menor Preço</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. Sugestões Rápidas de Adição */}
            <div className="mb-6">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2.5">
                Adicionar rápido
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Arroz 5kg',
                  'Feijão 1kg',
                  'Bandeja com 20 ovos',
                  'Café 500g',
                  'Azeite de Oliva',
                  '1kg Batata',
                  'Leite Integral'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAdd(chip)}
                    type="button"
                    className="px-3 py-1.5 bg-[#14181D] hover:bg-[#84E000] hover:text-neutral-950 border border-white/10 rounded-full text-xs font-medium text-neutral-300 transition duration-150"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Card Resumo da Lista Atual */}
            {items.length > 0 && (
              <div className="mt-auto bg-[#14181D] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Sua lista ativa</span>
                  <span className="text-[11px] text-neutral-400">
                    {items.length} itens organizados · ~R$ {totalListValue.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button
                  onClick={() => switchTab('lists')}
                  type="button"
                  className="px-3.5 py-2 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <span>Abrir</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TELA 2: LISTAS — ORGANIZAÇÃO POR CORREDORES
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'lists' && (
          <div className="flex-1 flex flex-col px-5 pt-5 pb-6 animate-in fade-in duration-200">
            
            {/* Header com Título e Total de Itens */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white mb-0.5">
                  Minha lista
                </h1>
                <p className="text-xs text-neutral-400 font-medium">
                  {items.length} itens organizados · Estimado ~R$ {totalListValue.toFixed(2).replace('.', ',')}
                </p>
              </div>

              <button
                onClick={() => setIsAddItemModalOpen(true)}
                type="button"
                className="w-9 h-9 rounded-full bg-[#84E000] hover:bg-[#92F200] text-neutral-950 flex items-center justify-center font-bold shadow-lg shadow-[#84e000]/20 transition"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Barra de Pesquisa */}
            <div className="relative mb-5">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={listSearchQuery}
                onChange={(e) => setListSearchQuery(e.target.value)}
                placeholder="Buscar itens na sua lista..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#14181D] border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#84E000] transition"
              />
              {listSearchQuery && (
                <button
                  onClick={() => setListSearchQuery('')}
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Lista de Categorias / Corredores */}
            <div className="space-y-3 mb-6">
              {filteredGroupedCategories.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <ShoppingBag size={32} className="mx-auto text-neutral-600 mb-2" />
                  <p className="text-xs font-semibold">Nenhum item encontrado</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Grave um áudio ou adicione produtos.</p>
                </div>
              ) : (
                filteredGroupedCategories.map((group) => {
                  const isCollapsed = collapsedCategories[group.name] ?? false;

                  return (
                    <div
                      key={group.name}
                      className="bg-[#14181D] border border-white/10 rounded-3xl overflow-hidden transition"
                    >
                      {/* Cabeçalho da Categoria com Imagem e Status */}
                      <button
                        onClick={() => setCollapsedCategories(prev => ({ ...prev, [group.name]: !isCollapsed }))}
                        type="button"
                        className="w-full p-3.5 flex items-center justify-between hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Thumbnail da categoria */}
                          <div className="w-12 h-12 rounded-2xl overflow-hidden relative shrink-0 border border-white/10 bg-neutral-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={group.image}
                              alt={group.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="text-left">
                            <span className="text-sm font-bold text-white block">
                              {group.name}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {group.items.length} {group.items.length === 1 ? 'item' : 'itens'}
                              {group.checkedCount > 0 && ` · ${group.checkedCount} no carrinho`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {group.allChecked ? (
                            <div className="w-6 h-6 rounded-full bg-[#84E000] text-neutral-950 flex items-center justify-center font-bold">
                              <Check size={14} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-neutral-500">
                              <span className="text-[10px]">{group.checkedCount}/{group.items.length}</span>
                            </div>
                          )}

                          {isCollapsed ? (
                            <ChevronDown size={18} className="text-neutral-400" />
                          ) : (
                            <ChevronUp size={18} className="text-neutral-400" />
                          )}
                        </div>
                      </button>

                      {/* Itens do Corredor */}
                      {!isCollapsed && (
                        <div className="border-t border-white/5 divide-y divide-white/5 px-3 py-1">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              className="py-2.5 flex items-center justify-between gap-2"
                            >
                              {/* Checkbox + Nome */}
                              <div
                                onClick={() => handleToggleItem(item.id)}
                                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer select-none"
                              >
                                <div
                                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                                    item.checked
                                      ? 'bg-[#84E000] border-[#84E000] text-neutral-950'
                                      : 'border-white/30 bg-white/5 text-transparent'
                                  }`}
                                >
                                  <Check size={12} strokeWidth={3} />
                                </div>
                                <div className="truncate">
                                  <span
                                    className={`text-xs font-semibold block truncate ${
                                      item.checked ? 'text-neutral-500 line-through' : 'text-neutral-200'
                                    }`}
                                  >
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 font-mono">
                                    R$ {(item.basePrice || 0).toFixed(2).replace('.', ',')} / {item.unit}
                                  </span>
                                </div>
                              </div>

                              {/* Stepper e Ações */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center bg-white/5 rounded-xl border border-white/10 px-1 py-0.5">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, -1)}
                                    type="button"
                                    className="p-1 text-neutral-400 hover:text-white"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-xs font-bold font-mono px-2 text-white">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, 1)}
                                    type="button"
                                    className="p-1 text-neutral-400 hover:text-white"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  type="button"
                                  className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Botão Fixo da Base: Comparar Mercados */}
            <div className="mt-auto pt-2">
              <button
                onClick={() => switchTab('prices')}
                type="button"
                className="w-full py-4 px-6 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-2xl font-bold text-sm shadow-xl shadow-[#84e000]/20 flex items-center justify-center gap-2 transition"
              >
                <Tag size={18} />
                <span>Comparar mercados</span>
              </button>
            </div>

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TELA 3: PREÇOS — COMPARATIVO DE MERCADOS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'prices' && (
          <div className="flex-1 flex flex-col px-5 pt-5 pb-6 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white mb-0.5">
                  Melhor custo-benefício
                </h1>
                <p className="text-xs text-neutral-400 font-medium">
                  Encontramos os menores preços para a sua lista
                </p>
              </div>
            </div>

            {/* Filtro: Mais Barato vs Mais Próximo */}
            <div className="flex items-center gap-2 p-1 bg-[#14181D] border border-white/10 rounded-2xl mb-5">
              <button
                onClick={() => setPriceSortMode('cheapest')}
                type="button"
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  priceSortMode === 'cheapest'
                    ? 'bg-[#84E000] text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Mais barato
              </button>
              <button
                onClick={() => setPriceSortMode('closest')}
                type="button"
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  priceSortMode === 'closest'
                    ? 'bg-[#84E000] text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Mais próximo
              </button>
            </div>

            {/* Card Vencedor Destaque: 👑 MELHOR ESCOLHA */}
            {bestMarket && (
              <div className="bg-[#14181D] border-2 border-[#84E000] rounded-3xl p-5 mb-4 shadow-xl shadow-[#84e000]/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#84E000] text-neutral-950 font-extrabold text-[11px] rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span>👑</span>
                    <span>MELHOR ESCOLHA</span>
                  </span>

                  <span className="text-[11px] font-mono text-[#84E000] font-bold">
                    {bestMarket.coveredItems}/{bestMarket.totalItems} itens
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <MarketLogo name={bestMarket.marketName} className="w-12 h-12" />
                    <div>
                      <h2 className="text-lg font-bold text-white leading-tight">
                        {bestMarket.marketName}
                      </h2>
                      <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[#84E000]" />
                        <span>{bestMarket.distance}</span>
                        <span>· 🚗 ~8 min</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white font-mono block">
                      R$ {bestMarket.totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-neutral-400">Total da lista</span>
                  </div>
                </div>

                {bestMarket.savings > 0 && (
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-neutral-300">
                      Economia frente ao mais caro:
                    </span>
                    <span className="px-2.5 py-1 bg-[#84E000]/15 border border-[#84E000]/30 text-[#84E000] font-bold text-xs rounded-xl">
                      Economize R$ {bestMarket.savings.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Outros Mercados Comparados */}
            <div className="space-y-3 mb-6">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Outros mercados comparados
              </span>

              {sortedMarkets
                .filter(m => m.marketName !== bestMarket?.marketName)
                .map((market) => {
                  const diff = market.totalPrice - (bestMarket?.totalPrice || 0);

                  return (
                    <div
                      key={market.marketId}
                      className="bg-[#14181D] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <MarketLogo name={market.marketName} className="w-10 h-10" />
                        <div>
                          <strong className="text-sm font-bold text-white block">
                            {market.marketName}
                          </strong>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{market.distance}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-neutral-200 font-mono block">
                          R$ {market.totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                        {diff > 0 && (
                          <span className="text-[11px] font-semibold text-red-400">
                            +R$ {diff.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Botões de Ação na Base */}
            <div className="mt-auto pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const q = encodeURIComponent(`${bestMarket?.marketName || 'Atacadão'} ${city}`);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                }}
                type="button"
                className="py-3.5 px-4 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-2xl font-bold text-xs shadow-xl shadow-[#84e000]/20 flex items-center justify-center gap-2 transition"
              >
                <Navigation size={16} />
                <span>Ver rota</span>
              </button>

              <button
                onClick={() => {
                  const text = formatListByAisleForWhatsApp(
                    items,
                    bestMarket?.marketName || 'Atacadão',
                    bestMarket?.totalPrice || totalListValue,
                    city
                  );
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                type="button"
                className="py-3.5 px-4 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Share2 size={16} className="text-[#84E000]" />
                <span>WhatsApp</span>
              </button>
            </div>

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TELA 4: PERFIL & ECONOMIA — DASHBOARD
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'profile' && (
          <div className="flex-1 flex flex-col px-5 pt-5 pb-6 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white mb-0.5">
                  Sua economia
                </h1>
                <p className="text-xs text-neutral-400 font-medium">
                  Compras mais inteligentes, mais vida para você.
                </p>
              </div>

              <button
                onClick={() => setIsMenuOpen(true)}
                type="button"
                className="w-9 h-9 rounded-full bg-[#14181D] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <Settings size={18} />
              </button>
            </div>

            {/* Card Destaque de Economia com Gráfico Semanal em SVG */}
            <div className="bg-[#14181D] border border-white/10 rounded-3xl p-5 mb-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#84E000]/15 border border-[#84E000]/30 flex items-center justify-center text-[#84E000]">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-[#84E000] font-mono block leading-none">
                      R$ {totalEconomizedMonth.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-0.5 block">
                      economizados este mês
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-neutral-300">
                  +24.8% vs mês passado
                </span>
              </div>

              {/* Gráfico Semanal SVG Dinâmico */}
              <div className="pt-2">
                <div className="h-32 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 320 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#84E000" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#84E000" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Linhas de grade horizontais sutis */}
                    <line x1="0" y1="25" x2="320" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="320" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                    {/* Área Preenchida com Gradiente */}
                    <path
                      d="M 10 85 Q 80 50, 130 65 T 230 35 T 310 15 L 310 100 L 10 100 Z"
                      fill="url(#neonGradient)"
                    />

                    {/* Linha Curva em Verde Neon */}
                    <path
                      d="M 10 85 Q 80 50, 130 65 T 230 35 T 310 15"
                      fill="none"
                      stroke="#84E000"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Pontos de Destaque nas Semanas */}
                    <circle cx="10" cy="85" r="4" fill="#0B0E11" stroke="#84E000" strokeWidth="2.5" />
                    <circle cx="110" cy="60" r="4" fill="#0B0E11" stroke="#84E000" strokeWidth="2.5" />
                    <circle cx="210" cy="40" r="4" fill="#0B0E11" stroke="#84E000" strokeWidth="2.5" />
                    <circle cx="310" cy="15" r="5" fill="#84E000" stroke="#0B0E11" strokeWidth="2" />
                  </svg>
                </div>

                {/* Eixo X: Semanas */}
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono pt-2 border-t border-white/5">
                  <span>Sem 1 (R$ 38)</span>
                  <span>Sem 2 (R$ 42)</span>
                  <span>Sem 3 (R$ 48)</span>
                  <span className="text-[#84E000] font-bold">Sem 4 (R$ 58)</span>
                </div>
              </div>
            </div>

            {/* Cards de Métricas Secundárias */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#14181D] border border-white/10 rounded-2xl p-4">
                <span className="text-[11px] text-neutral-400 block mb-1">Compras feitas</span>
                <span className="text-xl font-bold text-white font-mono">{expenses.length} compras</span>
                <span className="text-[10px] text-neutral-500 block mt-1">com comparativo ativo</span>
              </div>

              <div className="bg-[#14181D] border border-white/10 rounded-2xl p-4">
                <span className="text-[11px] text-neutral-400 block mb-1">Média economizada</span>
                <span className="text-xl font-bold text-[#84E000] font-mono">
                  R$ {averageEconomyPerPurchase.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">por compra registrada</span>
              </div>
            </div>

            {/* Histórico Recente de Compras */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Histórico recente
                </span>
                <button
                  onClick={() => setIsRecordExpenseModalOpen(true)}
                  type="button"
                  className="text-xs font-bold text-[#84E000] hover:underline"
                >
                  + Registrar compra
                </button>
              </div>

              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#14181D] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <MarketLogo name={exp.marketName} className="w-8 h-8" />
                    <div>
                      <strong className="text-xs font-bold text-white block">{exp.marketName}</strong>
                      <span className="text-[11px] text-neutral-400">{exp.date} · {exp.itemsCount} itens</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white font-mono block">
                      R$ {exp.totalPaid.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] font-semibold text-[#84E000]">
                      Economizou R$ {exp.estimatedEconomy.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão de Instalar no Celular */}
            <div className="mt-auto">
              <button
                onClick={() => setIsInstallModalOpen(true)}
                type="button"
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-semibold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📲</span>
                  <div className="text-left">
                    <span className="block font-bold">Instalar atalho no celular</span>
                    <span className="text-[10px] text-neutral-400">Abra como app nativo na tela inicial</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-400" />
              </button>
            </div>

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BARRA INFERIOR DE NAVEGAÇÃO (BOTTOM DOCK)
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <nav
          aria-label="Navegação do aplicativo"
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-[#0B0E11]/90 backdrop-blur-2xl border-t border-white/10 px-4 flex items-center justify-around z-40"
        >
          <button
            onClick={() => switchTab('home')}
            type="button"
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition ${
              activeTab === 'home'
                ? 'text-[#84E000]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 1.75} />
            <span className="text-[10px] font-semibold tracking-wide">Início</span>
            {activeTab === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_6px_#84e000]" />
            )}
          </button>

          <button
            onClick={() => switchTab('lists')}
            type="button"
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition ${
              activeTab === 'lists'
                ? 'text-[#84E000]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <CheckSquare size={20} strokeWidth={activeTab === 'lists' ? 2.5 : 1.75} />
            <span className="text-[10px] font-semibold tracking-wide">Listas</span>
            {activeTab === 'lists' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_6px_#84e000]" />
            )}
          </button>

          <button
            onClick={() => switchTab('prices')}
            type="button"
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition ${
              activeTab === 'prices'
                ? 'text-[#84E000]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Tag size={20} strokeWidth={activeTab === 'prices' ? 2.5 : 1.75} />
            <span className="text-[10px] font-semibold tracking-wide">Preços</span>
            {activeTab === 'prices' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_6px_#84e000]" />
            )}
          </button>

          <button
            onClick={() => switchTab('profile')}
            type="button"
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition ${
              activeTab === 'profile'
                ? 'text-[#84E000]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 1.75} />
            <span className="text-[10px] font-semibold tracking-wide">Perfil</span>
            {activeTab === 'profile' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_6px_#84e000]" />
            )}
          </button>
        </nav>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MODAIS AUXILIARES
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

        {/* Modal: Digitar Lista Manualmente */}
        {isTextModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) setIsTextModalOpen(false); }}
          >
            <div className="bg-[#14181D] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Keyboard size={18} className="text-[#84E000]" />
                  <h3 className="text-base font-bold text-white">Digitar produtos</h3>
                </div>
                <button
                  onClick={() => setIsTextModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Ex: 5kg arroz, feijão kicaldo, café melitta, 2 leites e sabão em pó..."
                rows={4}
                className="w-full p-3.5 bg-black/30 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#84E000] mb-4 resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setIsTextModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-neutral-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const text = manualText.trim();
                    if (text) {
                      setIsTextModalOpen(false);
                      setManualText('');
                      handleProcessUserText(text);
                    }
                  }}
                  className="flex-1 py-2.5 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Adicionar Item Específico na Lista */}
        {isAddItemModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) setIsAddItemModalOpen(false); }}
          >
            <form
              onSubmit={handleAddManualItem}
              className="bg-[#14181D] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Adicionar produto</h3>
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-medium block mb-1">Nome do produto</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ex: Azeite Extra Virgem"
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#84E000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 font-medium block mb-1">Categoria</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#84E000]"
                  >
                    <option value="Mercearia">Mercearia</option>
                    <option value="Hortifrúti">Hortifrúti</option>
                    <option value="Carnes">Carnes</option>
                    <option value="Laticínios & Frios">Frios & Leite</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Higiene">Higiene</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 font-medium block mb-1">Preço estimado (R$)</label>
                  <input
                    type="text"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="12,90"
                    className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#84E000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 font-medium block mb-1">Quantidade</label>
                  <div className="flex items-center bg-black/30 rounded-xl border border-white/10 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setNewItemQty(Math.max(1, newItemQty - 1))}
                      className="p-1 text-neutral-400 hover:text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center text-xs font-bold font-mono">{newItemQty}</span>
                    <button
                      type="button"
                      onClick={() => setNewItemQty(newItemQty + 1)}
                      className="p-1 text-neutral-400 hover:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 font-medium block mb-1">Unidade</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#84E000]"
                  >
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="pct">pct</option>
                    <option value="dz">dz</option>
                    <option value="bandeja">bandeja</option>
                    <option value="cx">cx</option>
                    <option value="L">L</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 font-bold text-xs rounded-xl transition"
              >
                Salvar Produto
              </button>
            </form>
          </div>
        )}

        {/* Modal: Registrar Compra */}
        {isRecordExpenseModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) setIsRecordExpenseModalOpen(false); }}
          >
            <form
              onSubmit={handleAddExpense}
              className="bg-[#14181D] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Registrar compra realizada</h3>
                <button
                  type="button"
                  onClick={() => setIsRecordExpenseModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-medium block mb-1">Mercado onde comprou</label>
                <select
                  value={expenseMarket}
                  onChange={(e) => setExpenseMarket(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#84E000]"
                >
                  <option value="Atacadão">Atacadão</option>
                  <option value="Assaí Atacadista">Assaí Atacadista</option>
                  <option value="Carrefour">Carrefour</option>
                  <option value="Max Atacadista">Max Atacadista</option>
                  <option value="Super Muffato">Super Muffato</option>
                  <option value="Condor">Condor</option>
                  <option value="Supermercados Rio Verde">Supermercados Rio Verde</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-medium block mb-1">Valor total pago (R$)</label>
                <input
                  type="text"
                  required
                  value={expenseTotal}
                  onChange={(e) => setExpenseTotal(e.target.value)}
                  placeholder="284,90"
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#84E000]"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-medium block mb-1">Economia estimada (R$)</label>
                <input
                  type="text"
                  value={expenseSaved}
                  onChange={(e) => setExpenseSaved(e.target.value)}
                  placeholder="38,40"
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#84E000]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 font-bold text-xs rounded-xl transition"
              >
                Salvar Histórico
              </button>
            </form>
          </div>
        )}

        {/* Modal: Upload de Foto / OCR */}
        <PhotoUploadModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onItemsExtracted={(extractedText) => {
            handleProcessUserText(extractedText);
          }}
        />

        {/* Modal: Tutorial PWA */}
        <InstallTutorialModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />

        {/* Drawer Lateral / Menu de Configurações */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) setIsMenuOpen(false); }}
          >
            <div className="w-72 bg-[#14181D] border-r border-white/10 h-full p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-lg text-white">LIST</span>
                    <span className="font-extrabold text-lg text-[#84E000]">.ME</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="text-neutral-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#84E000] font-bold">
                    Localização & GPS
                  </span>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-1">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#84E000]" />
                      <span>{city}, {stateCode}</span>
                    </p>
                    <p className="text-neutral-400 text-[11px]">Bairro: {neighborhood}</p>
                    <p className="text-[10px] text-[#84E000]">● GPS Ativo (Raio 5km)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => { setIsMenuOpen(false); setIsInstallModalOpen(true); }}
                    className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-left text-neutral-200 flex items-center justify-between transition"
                  >
                    <span>Instalar Atalho no Celular</span>
                    <ChevronRight size={14} className="text-neutral-500" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      loadDefaultItems();
                      showToast('Lista restaurada com itens padrão!');
                    }}
                    className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-left text-neutral-200 flex items-center justify-between transition"
                  >
                    <span>Carregar Itens de Exemplo</span>
                    <RefreshCw size={14} className="text-neutral-500" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center text-[10px] text-neutral-500">
                LIST.ME · Economia Inteligente em Supermercados
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
