'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  Bell,
  Mic,
  Camera,
  Keyboard,
  Tag,
  MapPin,
  Check,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Share2,
  Sparkles,
  User,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  X,
  LogOut,
  RotateCcw,
  Navigation,
  Home,
  CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { ListItem, MarketComparison, ExpenseRecord, ActiveTab } from '@/types';
import { getMarketsForLocation } from '@/data/regionalMarkets';
import { extractGroceryItems } from '@/utils/groceryParser';
import { formatListByAisleForWhatsApp } from '@/utils/supermarketAisles';
import { getDailyQuote, DailyQuote } from '@/data/dailyQuotes';
import MarketLogo from '@/components/MarketLogo';
import AudioRecorder from '@/components/AudioRecorder';
import PhotoUploadModal from '@/components/PhotoUploadModal';
import OnboardingModal from '@/components/OnboardingModal';
import InstallTutorialModal from '@/components/InstallTutorialModal';
import AuthRegistrationScreen from '@/components/AuthRegistrationScreen';

export interface GpsLocation {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  neighborhood?: string;
  displayName?: string;
  isGpsActive: boolean;
  status: 'idle' | 'detecting' | 'active' | 'denied' | 'error';
  lastUpdated?: number;
}

// 18 Itens padrão organizados exatamente como no mockup fornecido
const DEFAULT_MOCKUP_ITEMS: ListItem[] = [
  // Hortifrúti (5 itens)
  { id: 'item-1', name: 'Tomate Italiano', category: 'Hortifrúti & Feira', quantity: 1, unit: 'kg', basePrice: 8.90, checked: true },
  { id: 'item-2', name: 'Cebola Branca', category: 'Hortifrúti & Feira', quantity: 1, unit: 'kg', basePrice: 5.40, checked: false },
  { id: 'item-3', name: 'Batata Inglesa', category: 'Hortifrúti & Feira', quantity: 2, unit: 'kg', basePrice: 6.90, checked: false },
  { id: 'item-4', name: 'Banana Prata', category: 'Hortifrúti & Feira', quantity: 1, unit: 'kg', basePrice: 7.50, checked: false },
  { id: 'item-5', name: 'Maçã Gala', category: 'Hortifrúti & Feira', quantity: 1, unit: 'kg', basePrice: 9.80, checked: false },

  // Mercearia (7 itens)
  { id: 'item-6', name: 'Arroz Branco 5kg', category: 'Mercearia Seca & Grãos', quantity: 1, unit: 'un', basePrice: 28.90, checked: false },
  { id: 'item-7', name: 'Feijão Carioca 1kg', category: 'Mercearia Seca & Grãos', quantity: 2, unit: 'un', basePrice: 7.90, checked: false },
  { id: 'item-8', name: 'Café Torrado e Moído 500g', category: 'Mercearia Seca & Grãos', quantity: 1, unit: 'un', basePrice: 22.90, checked: false },
  { id: 'item-9', name: 'Azeite de Oliva Extra Virgem 500ml', category: 'Mercearia Seca & Grãos', quantity: 1, unit: 'un', basePrice: 38.90, checked: false },
  { id: 'item-10', name: 'Óleo de Soja 900ml', category: 'Mercearia Seca & Grãos', quantity: 2, unit: 'un', basePrice: 6.80, checked: false },
  { id: 'item-11', name: 'Açúcar Refinado 1kg', category: 'Mercearia Seca & Grãos', quantity: 2, unit: 'un', basePrice: 4.80, checked: false },
  { id: 'item-12', name: 'Macarrão Espaguete 500g', category: 'Mercearia Seca & Grãos', quantity: 2, unit: 'un', basePrice: 4.50, checked: false },

  // Limpeza (4 itens)
  { id: 'item-13', name: 'Sabão em Pó 1.6kg', category: 'Limpeza & Lavanderia', quantity: 1, unit: 'un', basePrice: 23.90, checked: false },
  { id: 'item-14', name: 'Detergente Líquido 500ml', category: 'Limpeza & Lavanderia', quantity: 3, unit: 'un', basePrice: 2.70, checked: false },
  { id: 'item-15', name: 'Amaciante Concentrado 1.5L', category: 'Limpeza & Lavanderia', quantity: 1, unit: 'un', basePrice: 21.90, checked: false },
  { id: 'item-16', name: 'Desinfetante Pinho 1L', category: 'Limpeza & Lavanderia', quantity: 1, unit: 'un', basePrice: 9.90, checked: false },

  // Higiene (2 itens)
  { id: 'item-17', name: 'Papel Higiênico Folha Dupla 12 Rolos', category: 'Higiene Pessoal & Cuidados', quantity: 1, unit: 'un', basePrice: 21.90, checked: false },
  { id: 'item-18', name: 'Creme Dental 90g', category: 'Higiene Pessoal & Cuidados', quantity: 2, unit: 'un', basePrice: 5.50, checked: false },
];

// Histórico de compras correspondente ao dashboard da Tela 4
const DEFAULT_MOCKUP_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    marketName: 'Atacadão',
    date: '12 de mai.',
    totalPaid: 284.90,
    itemsCount: 18,
    estimatedEconomy: 38.40,
    estimatedTotal: 323.30,
    notes: 'Compra quinzenal de mantimentos'
  },
  {
    id: 'exp-2',
    marketName: 'Carrefour',
    date: '5 de mai.',
    totalPaid: 323.30,
    itemsCount: 14,
    estimatedEconomy: 44.50,
    estimatedTotal: 367.80,
    notes: 'Feira e itens de limpeza'
  },
  {
    id: 'exp-3',
    marketName: 'Assaí Atacadista',
    date: '28 de abr.',
    totalPaid: 210.40,
    itemsCount: 12,
    estimatedEconomy: 52.80,
    estimatedTotal: 263.20,
    notes: 'Bebidas e carnes'
  },
  {
    id: 'exp-4',
    marketName: 'Atacadão',
    date: '21 de abr.',
    totalPaid: 195.80,
    itemsCount: 10,
    estimatedEconomy: 51.00,
    estimatedTotal: 246.80,
    notes: 'Reposição da semana'
  }
];

// Metadados visuais de imagens e nomes limpos por departamento
const CATEGORY_META: Record<string, { title: string; image: string; order: number }> = {
  'hortifrúti & feira': { title: 'Hortifruti', image: '/categories/hortifruti.jpg', order: 1 },
  'hortifruti': { title: 'Hortifruti', image: '/categories/hortifruti.jpg', order: 1 },
  'mercearia seca & grãos': { title: 'Mercearia', image: '/categories/mercearia.jpg', order: 2 },
  'mercearia': { title: 'Mercearia', image: '/categories/mercearia.jpg', order: 2 },
  'limpeza & lavanderia': { title: 'Limpeza', image: '/categories/limpeza.jpg', order: 3 },
  'limpeza': { title: 'Limpeza', image: '/categories/limpeza.jpg', order: 3 },
  'higiene pessoal & cuidados': { title: 'Higiene', image: '/categories/higiene.jpg', order: 4 },
  'higiene': { title: 'Higiene', image: '/categories/higiene.jpg', order: 4 },
  'açougue & carnes': { title: 'Carnes & Açougue', image: '/categories/carnes.jpg', order: 5 },
  'carnes': { title: 'Carnes & Açougue', image: '/categories/carnes.jpg', order: 5 },
  'bebidas & adega': { title: 'Bebidas', image: '/categories/bebidas.jpg', order: 6 },
  'bebidas': { title: 'Bebidas', image: '/categories/bebidas.jpg', order: 6 },
  'padaria & matinais': { title: 'Padaria', image: '/categories/padaria.jpg', order: 7 },
  'padaria': { title: 'Padaria', image: '/categories/padaria.jpg', order: 7 },
  'frios & laticínios': { title: 'Frios & Laticínios', image: '/categories/frios.jpg', order: 8 },
};

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Auth & Profile state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [houseName, setHouseName] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('PR');
  const [gpsLocation, setGpsLocation] = useState<GpsLocation | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  
  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDirectInputOpen, setIsDirectInputOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  
  // Daily Quote & Tips
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App data state
  const [items, setItems] = useState<ListItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  // Input state
  const [inputText, setInputText] = useState('');
  const [isProcessingInput, setIsProcessingInput] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Hortifruti': true,
  });

  // New manual expense state
  const [newExpMarket, setNewExpMarket] = useState('');
  const [newExpValue, setNewExpValue] = useState('');
  const [newExpEconomy, setNewExpEconomy] = useState('');

  const mainScrollRef = useRef<HTMLElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Switch tabs with top scroll
  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  // Scroll to absolute top on tab change
  useEffect(() => {
    const scrollToTop = () => {
      if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    };
    scrollToTop();
    const t = setTimeout(scrollToTop, 50);
    return () => clearTimeout(t);
  }, [activeTab]);

  // Initial Load from LocalStorage
  useEffect(() => {
    setDailyQuote(getDailyQuote());

    // Check user session
    const session = localStorage.getItem('listme_user_session');
    const savedAccount = localStorage.getItem('listme_user_account');
    const savedProfile = localStorage.getItem('listme_profile');

    let parsedAccount: any = null;
    if (savedAccount) {
      try { parsedAccount = JSON.parse(savedAccount); } catch {}
    }

    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        setIsAuthenticated(!!parsedSession?.isLoggedIn);
      } catch {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setHouseName(parsed.houseName || 'Minha Casa');
        setUserName(parsed.userName || parsedAccount?.name || 'Filipe');
        setUserEmail(parsed.email || parsedAccount?.email || '');
        setUserPhone(parsed.phone || parsedAccount?.phone || '');
        setCity(parsed.city || parsedAccount?.city || 'Colombo');
        setStateCode(parsed.state || parsedAccount?.state || 'PR');
      } catch {}
    } else {
      setUserName('Filipe');
      setCity('Colombo');
      setStateCode('PR');
    }

    // Load Items (or initialize with mockup items)
    const savedItems = localStorage.getItem('listme_items');
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          setItems(DEFAULT_MOCKUP_ITEMS);
        }
      } catch {
        setItems(DEFAULT_MOCKUP_ITEMS);
      }
    } else {
      setItems(DEFAULT_MOCKUP_ITEMS);
    }

    // Load Expenses
    const savedExpenses = localStorage.getItem('listme_expenses');
    if (savedExpenses) {
      try {
        const parsed = JSON.parse(savedExpenses);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExpenses(parsed);
        } else {
          setExpenses(DEFAULT_MOCKUP_EXPENSES);
        }
      } catch {
        setExpenses(DEFAULT_MOCKUP_EXPENSES);
      }
    } else {
      setExpenses(DEFAULT_MOCKUP_EXPENSES);
    }
  }, []);

  // Save items whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('listme_items', JSON.stringify(items));
    }
  }, [items]);

  // Save expenses whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('listme_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  // GPS Auto-detect
  const detectCurrentLocation = async (userInitiated = false) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      if (userInitiated) showToast('Geolocalização não suportada neste aparelho.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsDetectingGps(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let detectedCity = 'Colombo';
        let detectedState = 'PR';
        if (lat >= -25.56 && lat <= -25.37 && lng >= -49.38 && lng <= -49.18) {
          detectedCity = 'Curitiba';
        }
        setCity(detectedCity);
        setStateCode(detectedState);
        setGpsLocation({
          latitude: lat,
          longitude: lng,
          city: detectedCity,
          state: detectedState,
          isGpsActive: true,
          status: 'active',
          lastUpdated: Date.now(),
        });
        showToast(`Localização atualizada: ${detectedCity}, ${detectedState}`);
      },
      () => {
        setIsDetectingGps(false);
        if (userInitiated) showToast('Acesso ao GPS não autorizado.');
      },
      { timeout: 8000 }
    );
  };

  // Process raw text (from audio or typing) into list items
  const handleProcessUserText = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessingInput(true);
    setIsDirectInputOpen(false);

    try {
      const parsedItems = extractGroceryItems(text);
      if (parsedItems.length > 0) {
        const newItems: ListItem[] = parsedItems.map((p, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          name: p.name,
          quantity: p.quantity || 1,
          unit: p.unit || 'un',
          category: p.category || 'Mercearia Seca & Grãos',
          basePrice: p.basePrice || 8.50,
          checked: false,
        }));

        setItems((prev) => [...newItems, ...prev]);
        setInputText('');
        showToast(`${newItems.length} ${newItems.length === 1 ? 'item adicionado' : 'itens adicionados'} à sua lista!`);
        
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#84E000', '#FFFFFF', '#497D00'],
          });
        } catch {}

        // Transition directly to Screen 2 ("Minha lista")
        setTimeout(() => switchTab('list'), 400);
      } else {
        // Fallback single item
        const fallbackItem: ListItem = {
          id: `item-${Date.now()}`,
          name: text.trim(),
          quantity: 1,
          unit: 'un',
          category: 'Mercearia Seca & Grãos',
          basePrice: 9.90,
          checked: false,
        };
        setItems((prev) => [fallbackItem, ...prev]);
        setInputText('');
        showToast('Item adicionado à sua lista!');
        setTimeout(() => switchTab('list'), 400);
      }
    } catch (e) {
      showToast('Erro ao processar texto.');
    } finally {
      setIsProcessingInput(false);
    }
  };

  // Audio recording completion
  const handleAudioCaptured = (transcript: string) => {
    setIsRecordingAudio(false);
    if (transcript.trim()) {
      handleProcessUserText(transcript);
    }
  };

  // Toggle item checked
  const handleToggleItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item))
    );
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removido da lista');
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQ = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQ };
        }
        return item;
      })
    );
  };

  // Clear all items
  const handleClearAllItems = () => {
    if (confirm('Deseja limpar todos os itens da sua lista atual?')) {
      setItems([]);
      localStorage.removeItem('listme_items');
      showToast('Lista zerada.');
    }
  };

  // Restore mockup demo items
  const handleResetToMockup = () => {
    setItems(DEFAULT_MOCKUP_ITEMS);
    setExpenses(DEFAULT_MOCKUP_EXPENSES);
    localStorage.setItem('listme_items', JSON.stringify(DEFAULT_MOCKUP_ITEMS));
    localStorage.setItem('listme_expenses', JSON.stringify(DEFAULT_MOCKUP_EXPENSES));
    showToast('Lista e métricas restauradas!');
    setIsDrawerOpen(false);
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    if (items.length === 0) {
      showToast('Sua lista está vazia!');
      return;
    }
    const message = formatListByAisleForWhatsApp(
      items,
      'Atacadão',
      calculatedPrices.atacadao,
      city || 'Colombo'
    );
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Open Maps Route
  const handleOpenRoute = (marketName = 'Atacadão') => {
    const query = encodeURIComponent(`${marketName} ${city || 'Colombo'} ${stateCode || 'PR'}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Add manual expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpMarket || !newExpValue) return;
    const paid = parseFloat(newExpValue.replace(',', '.')) || 0;
    const econ = parseFloat(newExpEconomy.replace(',', '.')) || (paid * 0.15);
    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      marketName: newExpMarket,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      totalPaid: paid,
      itemsCount: items.length || 10,
      estimatedEconomy: econ,
      estimatedTotal: paid + econ,
    };
    setExpenses((prev) => [newRecord, ...prev]);
    setNewExpMarket('');
    setNewExpValue('');
    setNewExpEconomy('');
    setIsNewExpenseModalOpen(false);
    showToast('Compra registrada com sucesso!');
  };

  // Toggle category expand
  const toggleCategoryExpand = (catTitle: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catTitle]: !prev[catTitle],
    }));
  };

  // Group items by category
  const groupedCategories = React.useMemo(() => {
    const map: Record<string, ListItem[]> = {};
    items.forEach((item) => {
      const catKey = (item.category || 'Mercearia').toLowerCase();
      const meta = CATEGORY_META[catKey] || { title: item.category || 'Mercearia', image: '/categories/mercearia.jpg', order: 99 };
      const groupName = meta.title;
      if (!map[groupName]) map[groupName] = [];
      map[groupName].push(item);
    });
    return map;
  }, [items]);

  // Dynamic Price Calculations for Screen 3
  const calculatedPrices = React.useMemo(() => {
    const baseSum = items.reduce((acc, it) => acc + (it.basePrice || 10) * (it.quantity || 1), 0);
    // Atacadão total (Winner)
    const atacadaoTotal = baseSum > 0 ? baseSum : 284.90;
    // Carrefour (Higher)
    const carrefourTotal = atacadaoTotal * 1.135;
    // Assaí (Competitor)
    const assaiTotal = atacadaoTotal * 1.218;
    // Economy
    const economy = carrefourTotal - atacadaoTotal;

    return {
      atacadao: atacadaoTotal,
      carrefour: carrefourTotal,
      assai: assaiTotal,
      economy: economy > 0 ? economy : 38.40,
    };
  }, [items]);

  // Expenses Calculations for Screen 4
  const expensesStats = React.useMemo(() => {
    const totalEconomy = expenses.reduce((acc, exp) => acc + (exp.estimatedEconomy || 0), 0);
    const count = expenses.length || 4;
    const avgPerTrip = count > 0 ? totalEconomy / count : 46.67;
    return {
      totalEconomy: totalEconomy > 0 ? totalEconomy : 186.70,
      count: count,
      avgPerTrip: avgPerTrip > 0 ? avgPerTrip : 46.67,
    };
  }, [expenses]);

  // Authentication check
  if (isAuthenticated === false) {
    return (
      <AuthRegistrationScreen
        onAuthenticated={(profile) => {
          setIsAuthenticated(true);
          setHouseName(profile.houseName);
          setUserName(profile.userName);
          setUserEmail(profile.email);
          setUserPhone(profile.phone);
          setCity(profile.city);
          setStateCode(profile.state);
        }}
      />
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#84E000] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050709] flex justify-center items-center md:py-6 font-sans selection:bg-[#84E000] selection:text-neutral-950 text-white">
      
      {/* Onboarding & Modals */}
      <OnboardingModal isOpen={isOnboardingOpen} onComplete={() => setIsOnboardingOpen(false)} />
      <InstallTutorialModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onItemsExtracted={(text) => {
          setIsPhotoModalOpen(false);
          handleProcessUserText(text);
        }}
      />

      {/* Audio Recorder Overlay Modal */}
      {isRecordingAudio && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#12161A] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <AudioRecorder
              onAudioCaptured={handleAudioCaptured}
              onCancel={() => setIsRecordingAudio(false)}
            />
          </div>
        </div>
      )}

      {/* Quick Direct Input Modal */}
      {isDirectInputOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#12161A] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Keyboard size={16} className="text-[#84E000]" /> Digitar itens da lista
              </h3>
              <button
                onClick={() => setIsDirectInputOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
            <textarea
              autoFocus
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: 5kg arroz, 2 leites, café Pilão, 1kg alcatra, sabão em pó Omo..."
              className="w-full bg-[#0C1014] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] resize-none leading-relaxed"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setIsDirectInputOpen(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-neutral-300 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!inputText.trim() || isProcessingInput}
                onClick={() => handleProcessUserText(inputText)}
                className="flex-1 py-3 bg-[#84E000] hover:bg-[#92F200] disabled:opacity-40 text-neutral-950 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isProcessingInput ? (
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Adicionar à Lista <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Hamburger Menu Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-start animate-in fade-in">
          <div className="w-[300px] sm:w-[340px] bg-[#0E1216] border-r border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              {/* Header do Drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
                  </div>
                  <span className="font-sans text-xl font-black tracking-tight text-white">
                    list<span className="text-[#84E000]">.me</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Perfil Rápido */}
              <div className="bg-[#14181D] border border-white/10 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#84E000]/20 text-[#84E000] flex items-center justify-center font-bold text-sm">
                    {(userName || 'U').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{userName || 'Usuário'}</h4>
                    <p className="text-[10px] text-neutral-400 truncate">{houseName || 'Minha Casa'}</p>
                    <span className="text-[9px] font-mono text-[#84E000] flex items-center gap-1 mt-0.5">
                      <MapPin size={9} /> {city || 'Colombo'}, {stateCode || 'PR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => { detectCurrentLocation(true); setIsDrawerOpen(false); }}
                  disabled={isDetectingGps}
                  className="w-full py-3 px-3.5 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white flex items-center gap-3 transition text-left cursor-pointer"
                >
                  <Navigation size={16} className="text-[#84E000]" />
                  <span>{isDetectingGps ? 'Buscando GPS...' : 'Atualizar Localização via GPS'}</span>
                </button>

                <button
                  onClick={() => { setIsInstallModalOpen(true); setIsDrawerOpen(false); }}
                  className="w-full py-3 px-3.5 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white flex items-center gap-3 transition text-left cursor-pointer"
                >
                  <ShoppingBag size={16} className="text-[#84E000]" />
                  <span>Instalar Atalho no Celular</span>
                </button>

                <button
                  onClick={() => { handleShareWhatsApp(); setIsDrawerOpen(false); }}
                  className="w-full py-3 px-3.5 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white flex items-center gap-3 transition text-left cursor-pointer"
                >
                  <Share2 size={16} className="text-[#84E000]" />
                  <span>Compartilhar Lista no WhatsApp</span>
                </button>

                <Link
                  href="/admin"
                  className="w-full py-3 px-3.5 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white flex items-center gap-3 transition text-left block"
                >
                  <ShieldCheck size={16} className="text-[#84E000]" />
                  <span>Painel do Administrador</span>
                </Link>
              </div>

              {/* Ações de Restaurar Mockup e Limpar */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                <button
                  onClick={handleResetToMockup}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] font-medium flex items-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw size={13} className="text-[#84E000]" /> Restaurar Dados do Mockup (18 itens)
                </button>
                <button
                  onClick={handleClearAllItems}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium flex items-center gap-2 transition cursor-pointer"
                >
                  <Trash2 size={13} /> Limpar Lista Atual
                </button>
              </div>
            </div>

            {/* Rodapé do Drawer */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (confirm('Deseja sair da sua conta?')) {
                    localStorage.removeItem('listme_user_session');
                    setIsAuthenticated(false);
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl text-neutral-400 hover:text-red-400 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <LogOut size={14} /> Sair da conta
              </button>
              <p className="text-[9px] font-mono text-neutral-500 mt-2 text-center">
                LIST.ME v2.4 · Suas compras pelo menor preço
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Popover */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#12161A] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Bell size={14} className="text-[#84E000]" /> Notificações da sua região
              </h3>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="bg-[#181D23] p-3 rounded-2xl border border-white/5">
                <span className="text-[9px] font-mono font-bold text-[#84E000] uppercase block mb-1">
                  HOJE · ENCARTE ATUALIZADO
                </span>
                <p className="text-neutral-200 text-xs leading-relaxed">
                  Atacadão e Assaí atualizaram os preços de Hortifrúti e Carnes em {city || 'Colombo'}.
                </p>
              </div>
              <div className="bg-[#181D23] p-3 rounded-2xl border border-white/5">
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase block mb-1">
                  INSPIRAÇÃO DO DIA
                </span>
                <p className="text-neutral-300 italic text-xs leading-relaxed">
                  &ldquo;{dailyQuote?.text || 'O Senhor é o meu pastor; de nada terei falta.'}&rdquo;
                </p>
                <span className="text-[10px] text-[#84E000] font-mono block mt-1">
                  — {dailyQuote?.reference || 'Salmos 23:1'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Luxury Smartphone Shell Container */}
      <div className="w-full max-w-[420px] bg-[#0C1014] text-white h-[100dvh] md:h-[860px] flex flex-col relative rounded-none md:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden">

        {/* 1. Header Fixo no Topo — Idêntico ao Mockup */}
        <header className="shrink-0 px-5 pt-4 pb-3 flex items-center justify-between bg-[#0C1014]/90 backdrop-blur-xl z-30 border-b border-white/10">
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Menu principal"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition cursor-pointer"
          >
            <Menu size={19} />
          </button>

          <div className="flex items-center gap-1">
            <span className="font-sans text-xl font-black tracking-tight text-white select-none">
              LIST<span className="text-[#84E000]">.ME</span>
            </span>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notificações"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition relative cursor-pointer"
          >
            <Bell size={18} />
            <span className="w-2 h-2 rounded-full bg-[#84E000] absolute top-2 right-2 ring-2 ring-[#0C1014]" />
          </button>
        </header>

        {/* Toast Alert Flutuante */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#84E000] text-neutral-950 text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
            <Sparkles size={13} className="text-neutral-950" />
            {toastMessage}
          </div>
        )}

        {/* 2. Área de Conteúdo Rolável */}
        <main
          key={activeTab}
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto [overflow-anchor:none] px-5 pt-4 pb-28 relative"
        >

          {/* ========================================================= */}
          {/* TELA 1: CRIAR NOVA LISTA (Voice-First com Waveform Neon)   */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col min-h-full justify-between animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Criar nova lista</h1>
                <p className="text-xs text-neutral-400 mt-0.5">Fale o que você precisa comprar</p>

                {/* Card Central com a Onda Sonora Neon */}
                <div className="bg-[#14181D] border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl my-5 min-h-[260px] group hover:border-[#84E000]/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-[#84E000]/5 blur-2xl pointer-events-none rounded-3xl" />

                  {/* Waveform Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-24 my-2 relative z-10">
                    {[16, 24, 38, 48, 28, 54, 72, 88, 64, 42, 68, 92, 58, 36, 74, 52, 32, 44, 28, 20, 14].map((h, idx) => (
                      <span
                        key={idx}
                        style={{
                          height: `${h}px`,
                          animationDelay: `${(idx * 0.08).toFixed(2)}s`,
                        }}
                        className="w-1 bg-[#84E000] rounded-full shadow-[0_0_10px_rgba(132,224,0,0.5)] animate-soundwave-pulse"
                      />
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-neutral-200 mt-4 flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-[#84E000] animate-pulse" />
                    Estou ouvindo...
                  </p>

                  <p className="text-xs text-neutral-400 italic max-w-xs mt-2 leading-relaxed relative z-10">
                    &ldquo;Arroz, feijão, café, leite e produtos de limpeza&rdquo;
                  </p>
                </div>
              </div>

              {/* Botões de Ação da Base */}
              <div className="space-y-3 pt-2">
                {/* Botão Primário Neon */}
                <button
                  type="button"
                  onClick={() => setIsRecordingAudio(true)}
                  className="w-full py-4 px-6 bg-[#84E000] hover:bg-[#92F200] active:scale-[0.98] text-neutral-950 font-bold text-xs sm:text-sm rounded-full shadow-[0_8px_25px_rgba(132,224,0,0.35)] transition-all flex items-center justify-center gap-2 font-sans cursor-pointer"
                >
                  <Mic size={18} />
                  <span>Criar minha lista</span>
                </button>

                {/* Botões Secundários: Foto e Digitar */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="flex-1 py-3.5 px-4 bg-[#14181D] hover:bg-[#1B2127] border border-white/10 hover:border-white/20 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Camera size={15} className="text-neutral-400" />
                    <span>Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDirectInputOpen(true)}
                    className="flex-1 py-3.5 px-4 bg-[#14181D] hover:bg-[#1B2127] border border-white/10 hover:border-white/20 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Keyboard size={15} className="text-neutral-400" />
                    <span>Digitar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TELA 2: MINHA LISTA (Organização por Categorias e Checklist)*/}
          {/* ========================================================= */}
          {activeTab === 'list' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header da Tela com subtle backdrop */}
              <div className="relative overflow-hidden pt-1 pb-1">
                <div className="absolute top-0 right-0 w-32 h-24 opacity-25 rounded-full overflow-hidden pointer-events-none blur-[1px]">
                  <Image src="/categories/hortifruti.jpg" alt="Banner" width={128} height={96} className="object-cover" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Minha lista</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {items.length} {items.length === 1 ? 'item organizado' : 'itens organizados'}
                </p>
              </div>

              {/* Lista de Categorias / Corredores */}
              <div className="space-y-3">
                {Object.entries(groupedCategories).map(([catTitle, catItems]) => {
                  const isExpanded = !!expandedCategories[catTitle];
                  const allChecked = catItems.length > 0 && catItems.every((it) => it.checked);
                  const firstItem = catItems[0];
                  const catKey = (firstItem?.category || catTitle).toLowerCase();
                  const meta = CATEGORY_META[catKey] || { title: catTitle, image: '/categories/mercearia.jpg', order: 99 };

                  return (
                    <div
                      key={catTitle}
                      className="bg-[#14181D] border border-white/10 rounded-2xl overflow-hidden shadow-md transition-all duration-200"
                    >
                      {/* Header do Card de Categoria */}
                      <div
                        onClick={() => toggleCategoryExpand(catTitle)}
                        className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail Real da Categoria */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-neutral-900 relative">
                            <Image
                              src={meta.image}
                              alt={meta.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white truncate leading-tight">
                              {catTitle}
                            </h3>
                            <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">
                              {catItems.length} {catItems.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Chevron Expand Indicator */}
                          <ChevronDown
                            size={16}
                            className={`text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-white' : ''}`}
                          />

                          {/* Completion Circle Status */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newCheckedState = !allChecked;
                              setItems((prev) =>
                                prev.map((it) =>
                                  catItems.some((c) => c.id === it.id) ? { ...it, checked: newCheckedState } : it
                                )
                              );
                            }}
                            className="focus:outline-none"
                          >
                            {allChecked ? (
                              <div className="w-6 h-6 rounded-full bg-[#84E000] text-neutral-950 flex items-center justify-center font-bold text-xs shadow-xs">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-neutral-600 hover:border-neutral-400 flex items-center justify-center transition" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Lista de Itens do Accordion Expandido */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 space-y-1.5 animate-in fade-in duration-150">
                          {catItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-[#0C1014]/60 border border-white/5 hover:border-white/10 transition"
                            >
                              <div
                                onClick={() => handleToggleItem(item.id)}
                                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                              >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${item.checked ? 'bg-[#84E000] border-[#84E000] text-neutral-950' : 'border-neutral-500'}`}>
                                  {item.checked && <Check size={11} strokeWidth={3} />}
                                </div>
                                <div className="min-w-0">
                                  <span className={`text-xs block truncate leading-tight ${item.checked ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-400">
                                    {item.quantity} {item.unit}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center text-xs"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="text-[11px] font-mono text-white px-1">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center text-xs"
                                >
                                  <Plus size={10} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="w-5 h-5 rounded text-neutral-500 hover:text-red-400 flex items-center justify-center text-xs ml-1"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="text-center py-12 bg-[#14181D] border border-white/10 rounded-3xl p-6">
                    <ShoppingBag size={36} className="mx-auto text-neutral-500 mb-3" />
                    <h3 className="text-sm font-bold text-white">Sua lista está vazia</h3>
                    <p className="text-xs text-neutral-400 mt-1 mb-4">
                      Dite por voz ou digite o que precisa comprar para organizar automaticamente.
                    </p>
                    <button
                      type="button"
                      onClick={() => switchTab('dashboard')}
                      className="py-2.5 px-5 bg-[#84E000] text-neutral-950 font-bold rounded-full text-xs shadow-xs"
                    >
                      Criar minha lista por voz
                    </button>
                  </div>
                )}
              </div>

              {/* Botão Fixo/Flutuante da Base: Comparar Mercados */}
              {items.length > 0 && (
                <div className="pt-2 sticky bottom-20 z-20">
                  <button
                    type="button"
                    onClick={() => switchTab('prices')}
                    className="w-full py-4 px-6 bg-[#84E000] hover:bg-[#92F200] active:scale-[0.98] text-neutral-950 font-bold text-xs sm:text-sm rounded-full shadow-[0_8px_25px_rgba(132,224,0,0.35)] transition-all flex items-center justify-center gap-2 font-sans cursor-pointer"
                  >
                    <Tag size={16} />
                    <span>Comparar mercados</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TELA 3: PREÇOS (Melhor Custo-Benefício & Comparador)      */}
          {/* ========================================================= */}
          {activeTab === 'prices' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Melhor custo-benefício</h1>
                <p className="text-xs text-neutral-400 mt-0.5">Encontramos os menores preços para a sua lista</p>
              </div>

              {/* Card Vencedor Destaque — "MELHOR ESCOLHA" */}
              <div className="bg-[#14181D] border-2 border-[#84E000] rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                {/* Badge Melhor Escolha */}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#84E000] text-neutral-950 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                  <span>👑</span> MELHOR ESCOLHA
                </div>

                {/* Logo e Preço do Mercado Vencedor */}
                <div className="flex items-center gap-4">
                  <MarketLogo name="Atacadão" className="w-14 h-14" />
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">Atacadão</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-sans mt-0.5">
                      R$ {calculatedPrices.atacadao.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-0.5">
                      <span>📍 2,4 km</span>
                      <span>🚗 8 min</span>
                    </div>
                  </div>
                </div>

                {/* Pill de Economia */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between bg-[#84E000]/10 border border-[#84E000]/30 rounded-xl px-3.5 py-2.5 text-[#84E000] text-xs font-bold font-mono">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown size={15} />
                    Economize R$ {calculatedPrices.economy.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] bg-[#84E000] text-neutral-950 px-1.5 py-0.5 rounded font-bold uppercase">
                    Mais barato
                  </span>
                </div>
              </div>

              {/* Concorrentes Comparados */}
              <div className="space-y-2.5 pt-1">
                {/* Carrefour */}
                <div
                  onClick={() => handleOpenRoute('Carrefour')}
                  className="bg-[#14181D] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-white/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MarketLogo name="Carrefour" className="w-10 h-10" />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">Carrefour</h4>
                      <span className="text-[10px] text-neutral-400 font-mono">📍 4,1 km · 🚗 11 min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold text-white block">
                        R$ {calculatedPrices.carrefour.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] font-mono text-red-400">
                        +R$ {(calculatedPrices.carrefour - calculatedPrices.atacadao).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-neutral-500" />
                  </div>
                </div>

                {/* Assaí */}
                <div
                  onClick={() => handleOpenRoute('Assaí')}
                  className="bg-[#14181D] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-white/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MarketLogo name="Assaí" className="w-10 h-10" />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">Assaí Atacadista</h4>
                      <span className="text-[10px] text-neutral-400 font-mono">📍 5,8 km · 🚗 14 min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold text-white block">
                        R$ {calculatedPrices.assai.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] font-mono text-red-400">
                        +R$ {(calculatedPrices.assai - calculatedPrices.atacadao).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-neutral-500" />
                  </div>
                </div>
              </div>

              {/* Botão Fixo/Flutuante: Ver Rota */}
              <div className="pt-2 sticky bottom-20 z-20">
                <button
                  type="button"
                  onClick={() => handleOpenRoute('Atacadão')}
                  className="w-full py-4 px-6 bg-[#84E000] hover:bg-[#92F200] active:scale-[0.98] text-neutral-950 font-bold text-xs sm:text-sm rounded-full shadow-[0_8px_25px_rgba(132,224,0,0.35)] transition-all flex items-center justify-center gap-2 font-sans cursor-pointer"
                >
                  <MapPin size={16} />
                  <span>Ver rota</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TELA 4: SUA ECONOMIA (Dashboard de Economia & Histórico)  */}
          {/* ========================================================= */}
          {activeTab === 'expenses' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Sua economia</h1>
                <p className="text-xs text-neutral-400 mt-0.5">Compras mais inteligentes, mais vida para você.</p>
              </div>

              {/* Hero Stat: Total Economizado */}
              <div className="bg-[#14181D] border border-white/10 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#84E000]/15 text-[#84E000] flex items-center justify-center shrink-0">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#84E000] font-sans tracking-tight">
                      R$ {expensesStats.totalEconomy.toFixed(2).replace('.', ',')}
                    </div>
                    <span className="text-xs text-neutral-400 block">economizados este mês</span>
                  </div>
                </div>

                {/* Gráfico Semanal em SVG */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="relative h-28 w-full">
                    <svg viewBox="0 0 320 100" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#84E000" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#84E000" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="30" y1="20" x2="310" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="30" y1="45" x2="310" y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="30" y1="70" x2="310" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                      {/* Y-axis labels */}
                      <text x="5" y="23" fill="#666" fontSize="8" fontFamily="monospace">200</text>
                      <text x="5" y="48" fill="#666" fontSize="8" fontFamily="monospace">100</text>
                      <text x="5" y="73" fill="#666" fontSize="8" fontFamily="monospace">50</text>
                      <text x="5" y="95" fill="#666" fontSize="8" fontFamily="monospace">0</text>

                      {/* Area fill */}
                      <polygon
                        points="40,80 120,55 200,45 280,25 280,95 40,95"
                        fill="url(#chartGlow)"
                      />

                      {/* Green glowing polyline */}
                      <polyline
                        points="40,80 120,55 200,45 280,25"
                        fill="none"
                        stroke="#84E000"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data dots */}
                      <circle cx="40" cy="80" r="3.5" fill="#84E000" />
                      <circle cx="120" cy="55" r="3.5" fill="#84E000" />
                      <circle cx="200" cy="45" r="3.5" fill="#84E000" />
                      <circle cx="280" cy="25" r="4.5" fill="#FFFFFF" stroke="#84E000" strokeWidth="2.5" />

                      {/* X-axis labels */}
                      <text x="30" y="98" fill="#888" fontSize="8" fontFamily="monospace">Sem 1</text>
                      <text x="110" y="98" fill="#888" fontSize="8" fontFamily="monospace">Sem 2</text>
                      <text x="190" y="98" fill="#888" fontSize="8" fontFamily="monospace">Sem 3</text>
                      <text x="270" y="98" fill="#888" fontSize="8" fontFamily="monospace">Sem 4</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Cards Secundários de Métricas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#14181D] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-neutral-400 mb-1">
                    <ShoppingBag size={14} className="text-[#84E000]" />
                    <span className="text-[10px] font-mono uppercase font-bold">Total compras</span>
                  </div>
                  <div className="text-xl font-bold text-white">{expensesStats.count} compras</div>
                </div>

                <div className="bg-[#14181D] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-neutral-400 mb-1">
                    <TrendingDown size={14} className="text-[#84E000]" />
                    <span className="text-[10px] font-mono uppercase font-bold">Economia média</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    R$ {expensesStats.avgPerTrip.toFixed(2).replace('.', ',')}
                  </div>
                  <span className="text-[9px] text-neutral-400 block">por compra</span>
                </div>
              </div>

              {/* Histórico Recente */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    Histórico recente <ChevronRight size={13} className="text-neutral-500" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsNewExpenseModalOpen(true)}
                    className="text-[11px] font-mono text-[#84E000] font-bold hover:underline cursor-pointer"
                  >
                    + Registrar compra
                  </button>
                </div>

                <div className="space-y-2">
                  {expenses.slice(0, 5).map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-[#14181D] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-white/20 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MarketLogo name={exp.marketName} className="w-10 h-10" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate leading-tight">{exp.marketName}</h4>
                          <span className="text-[10px] text-neutral-400 font-mono block">{exp.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-bold text-white block font-mono">
                            R$ {exp.totalPaid.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[10px] font-mono text-[#84E000] block">
                            -R$ {exp.estimatedEconomy.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <ChevronRight size={14} className="text-neutral-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Modal para Registrar Nova Compra */}
        {isNewExpenseModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-[#12161A] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-sm font-bold text-white">Registrar Compra Realizada</h3>
                <button onClick={() => setIsNewExpenseModalOpen(false)} className="text-neutral-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAddExpense} className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Nome do Mercado</label>
                  <input
                    type="text"
                    required
                    value={newExpMarket}
                    onChange={(e) => setNewExpMarket(e.target.value)}
                    placeholder="Ex: Atacadão, Assaí..."
                    className="w-full bg-[#0C1014] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Valor Total Pago (R$)</label>
                  <input
                    type="text"
                    required
                    value={newExpValue}
                    onChange={(e) => setNewExpValue(e.target.value)}
                    placeholder="Ex: 284,90"
                    className="w-full bg-[#0C1014] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Economia Estimada (R$)</label>
                  <input
                    type="text"
                    value={newExpEconomy}
                    onChange={(e) => setNewExpEconomy(e.target.value)}
                    placeholder="Ex: 38,40 (opcional)"
                    className="w-full bg-[#0C1014] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000]"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewExpenseModalOpen(false)}
                    className="flex-1 py-2.5 bg-white/5 rounded-xl text-xs font-semibold text-neutral-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#84E000] text-neutral-950 font-bold rounded-xl text-xs shadow-md cursor-pointer"
                  >
                    Salvar Compra
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. Bottom Navigation Bar Fixo (4 Abas Idênticas ao Mockup) */}
        <nav
          aria-label="Navegação do aplicativo"
          className="shrink-0 h-16 bg-[#0C1014]/95 backdrop-blur-2xl border-t border-white/10 px-2 flex items-center justify-around z-40"
        >
          {/* Aba 1: Início */}
          <button
            type="button"
            onClick={() => switchTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'dashboard' ? 'text-[#84E000] font-bold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Home size={20} strokeWidth={activeTab === 'dashboard' ? 2.4 : 1.8} />
            <span className="text-[10px]">Início</span>
            {activeTab === 'dashboard' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_8px_#84E000]" />
            )}
          </button>

          {/* Aba 2: Listas */}
          <button
            type="button"
            onClick={() => switchTab('list')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'list' ? 'text-[#84E000] font-bold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <CheckSquare size={20} strokeWidth={activeTab === 'list' ? 2.4 : 1.8} />
            <span className="text-[10px]">Listas</span>
            {activeTab === 'list' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_8px_#84E000]" />
            )}
          </button>

          {/* Aba 3: Preços */}
          <button
            type="button"
            onClick={() => switchTab('prices')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'prices' ? 'text-[#84E000] font-bold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Tag size={20} strokeWidth={activeTab === 'prices' ? 2.4 : 1.8} />
            <span className="text-[10px]">Preços</span>
            {activeTab === 'prices' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_8px_#84E000]" />
            )}
          </button>

          {/* Aba 4: Perfil / Economia */}
          <button
            type="button"
            onClick={() => switchTab('expenses')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'expenses' ? 'text-[#84E000] font-bold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <User size={20} strokeWidth={activeTab === 'expenses' ? 2.4 : 1.8} />
            <span className="text-[10px]">Perfil</span>
            {activeTab === 'expenses' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] shadow-[0_0_8px_#84E000]" />
            )}
          </button>
        </nav>

      </div>
    </div>
  );
}
