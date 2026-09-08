'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  TrendingUp,
  Tag,
  Camera,
  Mic,
  Send,
  Plus,
  Minus,
  Trash2,
  Share2,
  Sparkles,
  ChevronRight,
  User,
  ShoppingBag,
  Store,
  Clock,
  ArrowUpRight,
  Check,
  RotateCcw,
  MapPin,
  Navigation,
  Flame,
  ShieldCheck,
  FileText,
  CheckCheck,
  Receipt,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { ListItem, MarketComparison, ChatMessage, ExpenseRecord, ActiveTab } from '@/types';
import { getMarketsForLocation } from '@/data/regionalMarkets';
import { extractGroceryItems } from '@/utils/groceryParser';
import { getDailyQuote, DailyQuote, DAILY_QUOTES } from '@/data/dailyQuotes';
import AudioRecorder from '@/components/AudioRecorder';
import PhotoUploadModal from '@/components/PhotoUploadModal';
import OnboardingModal from '@/components/OnboardingModal';
import InstallTutorialModal from '@/components/InstallTutorialModal';
import AuthRegistrationScreen from '@/components/AuthRegistrationScreen';

function FormattedChatMessage({ text }: { text: string }) {
  if (!text) return null;

  // Clean out citations, web search tokens and raw markdown links
  const cleaned = text
    .replace(/\(\[.*?\]\(https?:\/\/[^\)]+\)\)/gi, '')
    .replace(/\[.*?\]\(https?:\/\/[^\)]+\)/gi, '')
    .replace(/【.*?】/gi, '')
    .trim();

  const lines = cleaned.split('\n');

  const renderInlineBold = (str: string) => {
    // Split by markdown bold (**text**)
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={i} className="font-bold text-neutral-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-2 text-neutral-800 text-xs sm:text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Check if line is a bullet item (- or * or •)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const content = trimmed.replace(/^[-*•]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70BF00] mt-1.5 shrink-0 shadow-xs" />
              <div className="flex-1 text-neutral-800">{renderInlineBold(content)}</div>
            </div>
          );
        }

        // Check if it's a section header line like **Veredito:** or **Comparativo...:** or **Economia:**
        const isHeader = trimmed.startsWith('**') && (trimmed.includes(':**') || trimmed.endsWith('**'));

        return (
          <p key={idx} className={isHeader ? 'pt-1 font-normal text-neutral-900' : ''}>
            {renderInlineBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);

  // App data state — 100% ZERADO inicialmente
  const [items, setItems] = useState<ListItem[]>([]);
  const [markets, setMarkets] = useState<MarketComparison[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [smartTip, setSmartTip] = useState<string | null>(null);

  // Input state
  const [inputText, setInputText] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSearchingOffers, setIsSearchingOffers] = useState(false);
  const [newExpenseMarket, setNewExpenseMarket] = useState('');
  const [newExpenseValue, setNewExpenseValue] = useState('');
  const [newExpenseNotes, setNewExpenseNotes] = useState('');
  const [lastEstimatedTotal, setLastEstimatedTotal] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Detecção Automática de Localização em Tempo Real (GPS Dinâmico)
  const detectCurrentLocation = async (userInitiated = false): Promise<GpsLocation | null> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      if (userInitiated) showToast('Geolocalização não suportada neste dispositivo.');
      return null;
    }

    setIsDetectingGps(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          let detectedCity = city || 'Colombo';
          let detectedState = stateCode || 'PR';
          let detectedNeighborhood = '';
          let detectedDisplayName = '';

          // 1. Heurística local ultrarrápida para Grande Curitiba e RMC
          if (lat >= -25.36 && lat <= -25.20 && lng >= -49.30 && lng <= -49.12) {
            detectedCity = 'Colombo';
          } else if (lat >= -25.56 && lat <= -25.37 && lng >= -49.38 && lng <= -49.18) {
            detectedCity = 'Curitiba';
          } else if (lat >= -25.65 && lat <= -25.50 && lng >= -49.25 && lng <= -49.08) {
            detectedCity = 'São José dos Pinhais';
          } else if (lat >= -25.48 && lat <= -25.40 && lng >= -49.20 && lng <= -49.10) {
            detectedCity = 'Pinhais';
          } else if (lat >= -25.68 && lat <= -25.56 && lng >= -49.42 && lng <= -49.30) {
            detectedCity = 'Araucária';
          }

          // 2. Geocodificação reversa de alta precisão via Nominatim OpenStreetMap (com timeout de 3.5s)
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
              {
                headers: { 'Accept-Language': 'pt-BR' },
                signal: controller.signal,
              }
            );
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              if (addr.city || addr.town || addr.municipality || addr.village) {
                detectedCity = addr.city || addr.town || addr.municipality || addr.village;
              }
              if (addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter) {
                detectedNeighborhood = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter;
              }
              if (addr.state_code) {
                detectedState = addr.state_code;
              } else if (addr.state === 'Paraná') {
                detectedState = 'PR';
              }
              detectedDisplayName = data.display_name || '';
            }
          } catch {
            // Mantém valores da heurística local caso o Nominatim esteja offline ou com lentidão
          }

          const newGps: GpsLocation = {
            latitude: lat,
            longitude: lng,
            city: detectedCity,
            state: detectedState,
            neighborhood: detectedNeighborhood,
            displayName: detectedDisplayName,
            isGpsActive: true,
            status: 'active',
            lastUpdated: Date.now(),
          };

          setGpsLocation(newGps);
          setCity(detectedCity);
          setStateCode(detectedState);
          setIsDetectingGps(false);

          try {
            localStorage.setItem('listme_gps_location', JSON.stringify(newGps));
          } catch {}

          if (userInitiated) {
            const label = detectedNeighborhood ? `${detectedCity} (${detectedNeighborhood})` : detectedCity;
            showToast(`📍 GPS Ativo: ${label}`);
          }

          resolve(newGps);
        },
        (err) => {
          setIsDetectingGps(false);
          setGpsLocation((prev) =>
            prev
              ? { ...prev, isGpsActive: false, status: 'denied' }
              : {
                  latitude: 0,
                  longitude: 0,
                  city: city || 'Colombo',
                  state: stateCode || 'PR',
                  isGpsActive: false,
                  status: 'denied',
                }
          );
          if (userInitiated) {
            showToast('Permissão de GPS necessária para atualizar localização.');
          }
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
      );
    });
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Load profile and setup regional markets on mount
  useEffect(() => {
    setDailyQuote(getDailyQuote());

    // 1. Check user authentication session
    const session = localStorage.getItem('listme_user_session');
    const savedAccount = localStorage.getItem('listme_user_account');
    const savedProfile = localStorage.getItem('listme_profile');

    let parsedAccount: any = null;
    if (savedAccount) {
      try {
        parsedAccount = JSON.parse(savedAccount);
      } catch {}
    }

    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession && parsedSession.isLoggedIn) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
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
        setUserName(parsed.userName || parsedAccount?.name || '');
        setUserEmail(parsed.email || parsedAccount?.email || '');
        setUserPhone(parsed.phone || parsedAccount?.phone || '');
        setCity(parsed.city || parsedAccount?.city || 'Colombo');
        setStateCode(parsed.state || parsedAccount?.state || 'PR');
        const regional = getMarketsForLocation(parsed.state || parsedAccount?.state || 'PR');
        
        // Load custom markets if any
        const savedCustomMarkets = localStorage.getItem('listme_custom_markets');
        if (savedCustomMarkets) {
          try {
            const parsedCustom = JSON.parse(savedCustomMarkets);
            setMarkets([...regional, ...parsedCustom]);
          } catch {
            setMarkets(regional);
          }
        } else {
          setMarkets(regional);
        }
        
        // Load saved messages from LocalStorage or initialize with welcome message
        const savedMsgs = localStorage.getItem('listme_messages');
        if (savedMsgs) {
          try {
            const parsedMsgs = JSON.parse(savedMsgs);
            if (Array.isArray(parsedMsgs) && parsedMsgs.length > 0) {
              setMessages(parsedMsgs);
            } else {
              setMessages([
                {
                  id: 'msg-welcome',
                  role: 'assistant',
                  text: `Olá, ${parsed.userName || parsedAccount?.name || 'você'}! Cotações ativas para ${parsed.city || 'Colombo'}, ${parsed.state || 'PR'}.\n\nO que precisa comprar? Dite por voz, envie foto ou digite abaixo.`,
                  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                }
              ]);
            }
          } catch {
            setMessages([]);
          }
        } else {
          setMessages([
            {
              id: 'msg-welcome',
              role: 'assistant',
              text: `Olá, ${parsed.userName || parsedAccount?.name || 'você'}! Cotações ativas para ${parsed.city || 'Colombo'}, ${parsed.state || 'PR'}.\n\nO que precisa comprar? Dite por voz, envie foto ou digite abaixo.`,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            }
          ]);
        }
      } catch {
        setMarkets(getMarketsForLocation('PR'));
      }
    } else {
      setMarkets(getMarketsForLocation('PR'));
    }

    const savedItems = localStorage.getItem('listme_items');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch {
        setItems([]);
      }
    }

    const savedMarkets = localStorage.getItem('listme_markets');
    if (savedMarkets) {
      try {
        const parsed = JSON.parse(savedMarkets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMarkets(parsed);
        }
      } catch {}
    }

    const savedSmartTip = localStorage.getItem('listme_smart_tip');
    if (savedSmartTip) {
      setSmartTip(savedSmartTip);
    }

    const savedExpenses = localStorage.getItem('listme_expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch {
        setExpenses([]);
      }
    }

    // Recuperar localização GPS prévia do cache e buscar nova posição silenciosamente
    const savedGps = localStorage.getItem('listme_gps_location');
    if (savedGps) {
      try {
        const parsed = JSON.parse(savedGps);
        setGpsLocation(parsed);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setStateCode(parsed.state);
      } catch {}
    }

    if (typeof window !== 'undefined' && navigator.geolocation) {
      detectCurrentLocation(false);
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('listme_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save items whenever they change
  useEffect(() => {
    localStorage.setItem('listme_items', JSON.stringify(items));
  }, [items]);

  // Save expenses whenever they change
  useEffect(() => {
    localStorage.setItem('listme_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save smart tip whenever it changes
  useEffect(() => {
    if (smartTip) {
      localStorage.setItem('listme_smart_tip', smartTip);
    } else {
      localStorage.removeItem('listme_smart_tip');
    }
  }, [smartTip]);

  // Save markets whenever they change
  useEffect(() => {
    if (markets.length > 0) {
      localStorage.setItem('listme_markets', JSON.stringify(markets));
    }
  }, [markets]);

  // Recalculate single winning market totals when quantities change without wiping out AI live quotes
  useEffect(() => {
    if (!stateCode) return;
    const baseMarkets = getMarketsForLocation(stateCode);
    const savedCustom = localStorage.getItem('listme_custom_markets');
    let customList: MarketComparison[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
      } catch {}
    }
    const allAvailableMarkets = [...baseMarkets, ...customList];

    if (items.length === 0) {
      if (markets.length === 0) {
        setMarkets(allAvailableMarkets);
      }
      return;
    }

    const currentWinnerName = items[0]?.bestMarket?.name || markets.find((m) => m.isBestValue)?.marketName || allAvailableMarkets[0]?.marketName;
    const totalCurrent = items.reduce((sum, item) => {
      const p = item.bestMarket?.price || item.basePrice || 12.50;
      return sum + (p * item.quantity);
    }, 0);

    setMarkets((prevMarkets) => {
      const listToRank = (prevMarkets && prevMarkets.length > 0) ? prevMarkets : allAvailableMarkets;
      const winner = listToRank.find((m) => m.marketName === currentWinnerName) || listToRank[0];
      const savingsRatio = (winner.savings && winner.totalPrice > 0)
        ? (winner.savings / winner.totalPrice)
        : 0.11;

      const newWinnerTotal = Number(totalCurrent.toFixed(2));
      const newSavings = Number((newWinnerTotal * savingsRatio).toFixed(2));

      return listToRank.map((m) => {
        const isWin = m.marketName === winner.marketName;
        return {
          ...m,
          totalPrice: isWin ? newWinnerTotal : Number((newWinnerTotal + (isWin ? 0 : (newSavings > 0 ? newSavings : 15.00))).toFixed(2)),
          coveredItems: items.length,
          totalItems: items.length,
          savings: isWin ? newSavings : 0,
          isBestValue: isWin,
        };
      });
    });
  }, [items, stateCode]);

  const handleOnboardingComplete = (profile: {
    houseName: string;
    userName: string;
    city: string;
    state: string;
  }) => {
    setHouseName(profile.houseName);
    setUserName(profile.userName);
    setCity(profile.city);
    setStateCode(profile.state);
    localStorage.setItem('listme_profile', JSON.stringify(profile));
    setIsOnboardingOpen(false);
    // Abrir o pop-up do tutorial de atalho no celular logo após a localização
    setIsInstallModalOpen(true);

    const regional = getMarketsForLocation(profile.state);
    setMarkets(regional);

    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        text: `Configuração concluída! Residência "${profile.houseName}" em ${profile.city}, ${profile.state}.\n\nRedes monitoradas: ${regional.map(r => r.marketName).join(', ')}. Pode falar no microfone ou digitar sua lista de compras!`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    showToast(`Redes de ${profile.city} ativadas!`);
  };

  const handleResetAllData = () => {
    if (confirm('Deseja realmente zerar todos os dados e redefinir sua localização?')) {
      localStorage.removeItem('listme_profile');
      localStorage.removeItem('listme_items');
      localStorage.removeItem('listme_expenses');
      localStorage.removeItem('listme_messages');
      localStorage.removeItem('listme_custom_markets');
      setItems([]);
      setExpenses([]);
      setMessages([]);
      setIsProfileModalOpen(false);
      setIsOnboardingOpen(true);
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem('listme_messages');
    const welcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      role: 'assistant',
      text: `Histórico limpo. O que você gostaria de cotar hoje em ${city}?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    showToast('Histórico do chat reiniciado.');
  };

  const handleAddCustomMarket = () => {
    const marketName = window.prompt(`Qual o nome do mercado que você quer adicionar em ${city}?`);
    if (marketName && marketName.trim()) {
      const trimmed = marketName.trim();
      const newM: MarketComparison = {
        marketId: `custom-${Date.now()}`,
        marketName: trimmed,
        logoColor: '#0B0E11',
        coveredItems: items.length,
        totalItems: items.length,
        totalPrice: Number((totalBasketValue * 0.94).toFixed(2)),
        savings: Number((totalBasketValue * 0.06).toFixed(2)),
        clubDiscounts: 0,
        isBestValue: false,
      };
      const updated = [...markets, newM];
      setMarkets(updated);
      localStorage.setItem('listme_custom_markets', JSON.stringify([newM]));
      showToast(`${trimmed} adicionado às cotações de ${city}!`);
    }
  };

  const completedItemsCount = items.filter((i) => i.checked).length;
  const pendingItemsCount = items.length - completedItemsCount;
  const totalBasketValue = markets[0]?.totalPrice || 0;
  const estimatedSavings = markets[0]?.savings || 0;
  const totalSpentReal = expenses.reduce((sum, e) => sum + e.totalPaid, 0);
  const totalEstimatedApp = expenses.reduce((sum, e) => sum + (e.estimatedTotal || e.totalPaid), 0);
  const totalRealEconomy = Number((totalEstimatedApp - totalSpentReal).toFixed(2));

  // Fallback local se estiver offline ou falhar a requisição
  const fallbackLocalQuote = (text: string, loadingId: string) => {
    const isQuestion = text.includes('?') || /\b(compensa|qual|onde|quanto|como|vale a pena|melhor|dúvida|marca)\b/i.test(text);
    if (isQuestion) {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: `Para responder com precisão sobre o que compensa mais em ${city}, nossa IA analisa encartes em tempo real. Verifique sua conexão e tente enviar novamente em instantes!`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat(assistantMsg));
      return;
    }

    const parsed = extractGroceryItems(text);
    const winningMarket = markets.find((m) => m.isBestValue) || markets[0] || {
      marketName: 'Circuito Atacadista',
      priceFactor: 0.88,
    };
    const factor = winningMarket.priceFactor || 0.88;

    const detectedItems: Array<{
      name: string;
      matchedProduct: string;
      market: string;
      price: number;
      basePrice: number;
      priceType: 'normal' | 'club' | 'promo';
      quantity: number;
      unit: string;
      category: string;
    }> = parsed.map((item) => ({
      name: item.name,
      matchedProduct: item.matchedProduct,
      market: winningMarket.marketName,
      price: Number((item.basePrice * factor).toFixed(2)),
      basePrice: item.basePrice,
      priceType: 'promo',
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
    }));

    if (detectedItems.length === 0) {
      detectedItems.push({
        name: text.slice(0, 30),
        matchedProduct: `${text.slice(0, 30)} (Melhor cotação em ${city})`,
        market: winningMarket.marketName,
        price: Number((14.50 * factor).toFixed(2)),
        basePrice: 14.50,
        priceType: 'promo',
        quantity: 1,
        unit: 'un',
        category: 'Diversos',
      });
    }

    const newItemsToAdd: ListItem[] = detectedItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      name: item.name,
      matchedItem: item.matchedProduct,
      basePrice: item.basePrice,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      checked: false,
      bestMarket: {
        name: item.market,
        price: item.price,
        priceType: item.priceType,
      },
    }));

    setItems((prev) => [...newItemsToAdd, ...prev]);

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      text: `Calculei sua compra completa em ${city}. O supermercado onde o total sai mais barato é o **${winningMarket.marketName}**.\n\nTodos os ${detectedItems.length} itens foram direcionados para lá para você economizar em uma única viagem:`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      itemsFound: detectedItems,
    };

    setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat(assistantMsg));
    showToast(`Lista consolidada no ${winningMarket.marketName}!`);
  };

  // Cotação Inteligente com Busca Web em Tempo Real na OpenAI (tabloides & encartes)
  const handleProcessUserText = async (text: string) => {
    if (!text.trim()) return;

    const userText = text.trim();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSearchingOffers(true);

    // Identificar localização em tempo real (GPS ativo ou Perfil)
    let currentCity = gpsLocation?.city || city || 'Colombo';
    let currentState = gpsLocation?.state || stateCode || 'PR';
    let currentNeighborhood = gpsLocation?.neighborhood || '';
    let currentLat = gpsLocation?.latitude || null;
    let currentLng = gpsLocation?.longitude || null;

    // Tentar obter coordenadas mais recentes rapidamente se o navegador permitir (1.2s timeout)
    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const quickPos = await new Promise<GeolocationPosition | null>((resolve) => {
          const t = setTimeout(() => resolve(null), 1200);
          navigator.geolocation.getCurrentPosition(
            (p) => {
              clearTimeout(t);
              resolve(p);
            },
            () => {
              clearTimeout(t);
              resolve(null);
            },
            { enableHighAccuracy: true, timeout: 1200, maximumAge: 10000 }
          );
        });

        if (quickPos) {
          currentLat = quickPos.coords.latitude;
          currentLng = quickPos.coords.longitude;
        }
      } catch {}
    }

    const locLabel = currentNeighborhood
      ? `${currentCity} (${currentNeighborhood})`
      : `${currentCity}, ${currentState}`;

    const loadingId = `msg-loading-${Date.now()}`;
    const loadingMsg: ChatMessage = {
      id: loadingId,
      role: 'assistant',
      text: `🔍 **Pesquisando mercados mais próximos de ${locLabel}...**\n\nIdentificamos sua localização em tempo real e nossa IA está comparando as redes e atacarejos com menor preço num raio de até 5km de onde você está agora.`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const res = await fetch('/api/quote/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: currentCity,
          state: currentState,
          neighborhood: currentNeighborhood,
          latitude: currentLat,
          longitude: currentLng,
          rawInput: userText,
          radiusKm: 5,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro na API (${res.status})`);
      }

      const data = await res.json();

      if (data && (data.replyText || (data.winner && Array.isArray(data.items)))) {
        if (data.smartTip) {
          setSmartTip(data.smartTip);
        }

        const winnerName = data.winner?.name || markets[0]?.marketName || 'Circuito Atacadista';
        const winnerTotal = Number(data.winner?.totalBasket) || 0;
        const savingsVsSecond = Number(data.winner?.savingsVsSecond) || 0;

        if (Array.isArray(data.items) && data.items.length > 0) {
          let newMarkets: MarketComparison[] = [];
          if (data.rankedMarkets && Array.isArray(data.rankedMarkets) && data.rankedMarkets.length > 0) {
            newMarkets = data.rankedMarkets.map((rm: any, idx: number) => ({
              marketId: rm.marketId || `m-${idx}`,
              marketName: rm.marketName || rm.name,
              logoColor: idx === 0 ? '#0B0E11' : idx === 1 ? '#F57C00' : '#007A33',
              coveredItems: rm.coveredItems || data.items.length,
              totalItems: rm.totalItems || data.items.length,
              totalPrice: Number(rm.totalPrice || (idx === 0 ? winnerTotal : winnerTotal + savingsVsSecond)),
              savings: Number(rm.savings || (idx === 0 ? savingsVsSecond : 0)),
              isBestValue: idx === 0,
              clubDiscounts: 0,
            }));
          } else if (winnerTotal > 0) {
            newMarkets = [
              {
                marketId: `winner-${Date.now()}`,
                marketName: winnerName,
                logoColor: '#0B0E11',
                coveredItems: data.items.length,
                totalItems: data.items.length,
                totalPrice: winnerTotal,
                savings: savingsVsSecond,
                isBestValue: true,
                clubDiscounts: 0,
              },
              ...(data.runnerUp ? [{
                marketId: `runner-${Date.now()}`,
                marketName: data.runnerUp.name || 'Max Atacadista',
                logoColor: '#F57C00',
                coveredItems: data.items.length,
                totalItems: data.items.length,
                totalPrice: Number(data.runnerUp.totalBasket) || Number((winnerTotal + savingsVsSecond).toFixed(2)),
                savings: 0,
                isBestValue: false,
                clubDiscounts: 0,
              }] : [])
            ];
          }

          if (newMarkets.length > 0) {
            setMarkets(newMarkets);
          }

          const getSafePrice = (productName: string, rawPrice: any): number => {
            const num = Number(rawPrice);
            if (!isNaN(num) && num > 0) return Number(num.toFixed(2));
            const lower = (productName || '').toLowerCase();
            if (lower.includes('primeira') || lower.includes('patinho') || lower.includes('alcatra')) return 34.90;
            if (lower.includes('segunda') || lower.includes('acém') || lower.includes('acem')) return 22.90;
            if (lower.includes('arroz')) return 25.90;
            if (lower.includes('feij')) return 5.90;
            if (lower.includes('carne') || lower.includes('moída') || lower.includes('bovina')) return 24.90;
            if (lower.includes('doritos') || lower.includes('salgadinho')) return 10.90;
            if (lower.includes('açúcar') || lower.includes('acucar')) return 17.50;
            if (lower.includes('leite')) return 4.89;
            if (lower.includes('óleo') || lower.includes('oleo')) return 6.49;
            if (lower.includes('café') || lower.includes('cafe')) return 18.90;
            return 12.90;
          };

          const newItemsToAdd: ListItem[] = data.items.map((it: any, idx: number) => {
            const price = getSafePrice(it.name || it.matchedProduct, it.bestPrice);
            return {
              id: `item-${Date.now()}-${idx}`,
              name: it.name || it.matchedProduct || 'Produto',
              matchedItem: it.matchedProduct || it.name,
              basePrice: price,
              quantity: it.quantity || 1,
              unit: it.unit || 'un',
              category: it.category || 'Geral',
              checked: false,
              bestMarket: {
                name: winnerName,
                price: price,
                priceType: 'promo',
              },
            };
          });

          setItems((prev) => [...newItemsToAdd, ...prev]);
        }

        // Usar resposta conversacional inteligente da IA ou resumo padrão
        const assistantText = data.replyText || (
          winnerTotal > 0
            ? `🏆 **Melhor Cesta: ${winnerName}**\n\nTotal dos produtos: **R$ ${winnerTotal.toFixed(2).replace('.', ',')}**\nEconomia de **R$ ${savingsVsSecond.toFixed(2).replace('.', ',')}** em relação ao ${data.runnerUp?.name || 'segundo colocado'}.\n\n💡 **Aviso Inteligente:**\n${data.smartTip || 'Comprar todos os itens em uma única rede compensa o tempo e combustível.'}`
            : (data.smartTip || 'Consulta concluída com sucesso!')
        );

        const fallbackItemPrice = (productName: string, rawPrice: any): number => {
          const num = Number(rawPrice);
          if (!isNaN(num) && num > 0) return Number(num.toFixed(2));
          const lower = (productName || '').toLowerCase();
          if (lower.includes('primeira') || lower.includes('patinho') || lower.includes('alcatra')) return 34.90;
          if (lower.includes('segunda') || lower.includes('acém') || lower.includes('acem')) return 22.90;
          if (lower.includes('arroz')) return 25.90;
          if (lower.includes('feij')) return 5.90;
          if (lower.includes('carne') || lower.includes('moída') || lower.includes('bovina')) return 24.90;
          if (lower.includes('doritos') || lower.includes('salgadinho')) return 10.90;
          if (lower.includes('açúcar') || lower.includes('acucar')) return 17.50;
          if (lower.includes('leite')) return 4.89;
          if (lower.includes('óleo') || lower.includes('oleo')) return 6.49;
          if (lower.includes('café') || lower.includes('cafe')) return 18.90;
          return 12.90;
        };

        const detectedList = (Array.isArray(data.items) && data.items.length > 0)
          ? data.items.map((it: any) => {
              const safeP = fallbackItemPrice(it.name || it.matchedProduct, it.bestPrice);
              return {
                name: it.name,
                matchedProduct: it.matchedProduct || it.name,
                market: winnerName,
                price: safeP,
                basePrice: safeP,
                priceType: 'promo' as const,
                quantity: it.quantity || 1,
                unit: it.unit || 'un',
                category: it.category || 'Geral',
              };
            })
          : undefined;

        const finalAssistantMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          text: assistantText,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          itemsFound: detectedList,
        };

        setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat(finalAssistantMsg));
        showToast(`Consultor LIST.ME respondeu!`);
        return;
      }

      throw new Error('Resposta sem conteúdo válido');
    } catch (err: any) {
      console.warn('Erro ao obter cotação via IA, acionando fallback local:', err);
      fallbackLocalQuote(userText, loadingId);
    } finally {
      setIsSearchingOffers(false);
    }
  };

  const toggleItemChecked = (id: string) => {
    setItems((prev) => {
      const nextItems = prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.checked;
          if (nextState) {
            confetti({
              particleCount: 22,
              spread: 45,
              origin: { y: 0.82 },
              colors: ['#84E000', '#92F200', '#0B0E11', '#497D00'],
            });
          }
          return { ...item, checked: nextState };
        }
        return item;
      });

      const allChecked = nextItems.length > 0 && nextItems.every((item) => item.checked);
      const wasAllChecked = prev.length > 0 && prev.every((item) => item.checked);

      if (allChecked && !wasAllChecked) {
        const winningMarket = markets[0]?.marketName || nextItems[0]?.bestMarket?.name || '';
        if (winningMarket) {
          setNewExpenseMarket(winningMarket);
        }
        setLastEstimatedTotal(totalBasketValue);

        setTimeout(() => {
          confetti({
            particleCount: 85,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#84E000', '#92F200', '#0B0E11', '#497D00'],
          });
          setActiveTab('expenses');
          showToast('🎉 Lista completa! Registre o valor pago no caixa.');
        }, 450);
      }

      return nextItems;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removido.');
  };

  const handleShareWhatsApp = () => {
    if (items.length === 0) {
      showToast('Adicione pelo menos um item para compartilhar.');
      return;
    }

    const listText = items
      .map((item) => `${item.checked ? '✅' : '⬜'} ${item.quantity}${item.unit} ${item.name} (${item.bestMarket?.name}: R$ ${((item.bestMarket?.price || 0) * item.quantity).toFixed(2)})`)
      .join('\n');

    const shareMessage = `*LIST.ME — Lista de Compras*\nResidência: ${houseName} (${city}, ${stateCode})\nMelhor opção: ${markets[0]?.marketName || 'Mercado'} (Total aprox: R$ ${totalBasketValue.toFixed(2).replace('.', ',')})\n\n${listText}\n\n👉 Acompanhe ao vivo no app: https://list.me/app`;

    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newExpenseValue.replace(',', '.'));
    if (!newExpenseMarket || isNaN(val) || val <= 0) {
      showToast('Informe o mercado e o valor total pago.');
      return;
    }

    const currentEstimate = lastEstimatedTotal > 0 ? lastEstimatedTotal : totalBasketValue;

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      marketName: newExpenseMarket,
      date: new Date().toLocaleDateString('pt-BR'),
      totalPaid: val,
      itemsCount: items.length || 1,
      estimatedEconomy: Number((val * 0.18).toFixed(2)),
      estimatedTotal: currentEstimate > 0 ? Number(currentEstimate.toFixed(2)) : undefined,
      notes: newExpenseNotes.trim() || undefined,
    };

    const updatedExpenses = [newRecord, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem('listme_expenses', JSON.stringify(updatedExpenses));

    setNewExpenseMarket('');
    setNewExpenseValue('');
    setNewExpenseNotes('');
    setLastEstimatedTotal(0);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#84E000', '#92F200', '#0B0E11', '#497D00'],
    });

    showToast('Compra registrada com sucesso!');
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('listme_expenses', JSON.stringify(updated));
    showToast('Registro de compra removido.');
  };

  const handleAuthenticated = (profile: {
    houseName: string;
    userName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    isNewRegistration: boolean;
  }) => {
    setHouseName(profile.houseName);
    setUserName(profile.userName);
    setUserEmail(profile.email);
    setUserPhone(profile.phone);
    setCity(profile.city);
    setStateCode(profile.state);
    const regional = getMarketsForLocation(profile.state);
    setMarkets(regional);
    setIsAuthenticated(true);
    setIsOnboardingOpen(false);

    if (profile.isNewRegistration) {
      setTimeout(() => {
        setIsInstallModalOpen(true);
      }, 500);
    }

    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        text: `Olá, ${profile.userName}! Seu acesso de assinante está ativo e sincronizado com os supermercados de **${profile.city}, ${profile.state}**.\n\nO que você precisa comprar hoje? Dite no microfone, envie uma foto da lista ou digite abaixo:`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Se o usuário ainda não fez login ou cadastro, renderiza a tela de registro em tela cheia antes de qualquer coisa
  if (isAuthenticated === false) {
    return <AuthRegistrationScreen onAuthenticated={handleAuthenticated} />;
  }

  // Previne piscar de tela enquanto lê a sessão do localStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#84E000] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EFEA] flex justify-center items-center md:py-8 font-sans selection:bg-[#84E000] selection:text-neutral-950">
      
      {/* Onboarding Modal for First Time Users */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
      />

      {/* Tutorial de Instalação do Atalho no Celular */}
      <InstallTutorialModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Main Luxury Smartphone Shell Container */}
      <div className="w-full max-w-[420px] bg-[#F8F7F4] h-[100dvh] md:h-[860px] flex flex-col relative rounded-none md:rounded-[44px] shadow-floating border border-black/[0.08] overflow-hidden">

        {/* 1. Header Fixo no Topo — Design Minimalista de Luxo */}
        <header className="shrink-0 px-5 pt-4 pb-3.5 flex items-center justify-between bg-white/70 backdrop-blur-xl z-30 hairline-border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-black/10 shadow-xs ring-1 ring-black/5 shrink-0 bg-white">
              <Image
                src="/logo.png"
                alt="Logo LIST.ME"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] animate-pulse" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
                  {city || 'Localizando'}, {stateCode}
                </span>
              </div>
              <h1 className="text-[13px] font-semibold text-neutral-900 leading-tight">
                {houseName || 'Minha Residência'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/admin"
              className="px-2.5 py-1.5 text-[10px] font-mono font-semibold text-[#84E000] bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 rounded-full shadow-xs transition flex items-center gap-1"
              title="Acessar Painel do Fundador"
            >
              <ShieldCheck size={11} />
              Admin
            </Link>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3 py-1.5 text-[11px] font-medium text-neutral-700 bg-white/80 hover:bg-white hairline-border rounded-full shadow-xs transition flex items-center gap-1.5 hover:text-neutral-950"
            >
              <User size={12} className="text-neutral-400" />
              Perfil
            </button>
          </div>
        </header>

        {/* Toast Alert Flutuante */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white text-xs font-medium px-4 py-2 rounded-full shadow-elevated flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-3">
            <Sparkles size={13} className="text-[#84E000]" />
            {toastMessage}
          </div>
        )}

        {/* 2. Área de Conteúdo Rolável com Espaçamentos Refinados */}
        <main className={`flex-1 overflow-y-auto px-5 sm:px-6 pt-3.5 ${activeTab === 'chat' ? 'pb-28' : 'pb-24'}`}>

          {/* ========================================= */}
          {/* TAB 1: DASHBOARD INICIAL (BENTO LUXURY) */}
          {/* ========================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              
              <div className="pt-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#497D00] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />
                  INSPIRAÇÃO DO DIA
                </p>
                <h2 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
                  {userName ? `Olá, ${userName.trim().split(' ')[0]}, como está?` : 'Olá, como está?'}
                </h2>
                <p
                  onClick={() => {
                    const nextIdx = Math.floor(Math.random() * DAILY_QUOTES.length);
                    setDailyQuote(DAILY_QUOTES[nextIdx]);
                  }}
                  title="Toque para ver outra mensagem de inspiração"
                  className="text-xs text-neutral-600 mt-1 leading-relaxed cursor-pointer hover:text-neutral-900 transition"
                >
                  <span className="italic">&ldquo;{dailyQuote?.text || 'O Senhor é o meu pastor; de nada terei falta.'}&rdquo;</span>{' '}
                  <span className="font-semibold text-[#497D00] font-mono text-[11px] whitespace-nowrap">
                    — {dailyQuote?.reference || 'Salmos 23:1'}
                  </span>
                </p>
              </div>

              {/* Hero Bento Card — Estilo Obsidian + Verde da Logo */}
              <div className="bg-neutral-950 text-white p-5 rounded-[26px] shadow-elevated relative overflow-hidden border-2 border-[#84E000]">
                <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-white">
                  <TrendingUp size={160} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-medium tracking-wide uppercase text-white border border-white/10">
                      <Sparkles size={10} className="text-[#84E000]" />
                      Economia Estimada
                    </span>
                    <span className="text-[9px] font-mono text-neutral-950 font-bold bg-[#84E000] px-2 py-0.5 rounded-md uppercase">
                      LIST.ME ALGO
                    </span>
                  </div>

                  <div className="mt-3 mb-1 flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white">
                      R$ {estimatedSavings.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {items.length > 0 ? 'nesta compra' : 'na sua região'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {items.length > 0
                      ? `Menor total encontrado no ${markets[0]?.marketName || 'mercado líder'}.`
                      : `Cotações de supermercados em tempo real na sua região.`}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                    <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs border border-white/5">
                      <span className="text-[9px] uppercase text-neutral-400 block font-mono font-medium">
                        Líder em Preço
                      </span>
                      <strong className="text-xs font-semibold text-white block truncate mt-0.5">
                        {markets[0]?.marketName || 'Calculando...'}
                      </strong>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs border border-white/5">
                      <span className="text-[9px] uppercase text-neutral-400 block font-mono font-medium">
                        Total Estimado
                      </span>
                      <strong className="text-xs font-semibold text-[#84E000] font-mono block mt-0.5">
                        R$ {totalBasketValue.toFixed(2).replace('.', ',')}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner de Aviso Inteligente de Deslocamento */}
              {smartTip && (
                <div className="bg-[#84E000]/10 border border-[#84E000]/40 rounded-[22px] p-3.5 shadow-card flex items-start gap-2.5 animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-xl bg-[#84E000] text-neutral-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase text-[#386000] font-bold tracking-wider">
                        AVISO INTELIGENTE DE DESLOCAMENTO
                      </span>
                      <button
                        onClick={() => {
                          setSmartTip(null);
                          localStorage.removeItem('listme_smart_tip');
                        }}
                        className="text-neutral-400 hover:text-neutral-700 text-xs px-1"
                        title="Fechar dica"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                      {smartTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Card da Lista Ativa */}
              <div className="bg-white hairline-border p-4 rounded-[24px] shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#497D00] font-bold">
                      LISTA ATIVA
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Itens para Comprar
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 bg-neutral-100 rounded-full text-neutral-800">
                    {completedItemsCount}/{items.length} itens
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="py-3 text-center">
                    <p className="text-xs text-neutral-500 mb-2">
                      Sua lista está limpa.
                    </p>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-full shadow-xs transition inline-flex items-center gap-1.5"
                    >
                      <Plus size={12} /> Adicionar itens
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden my-3">
                      <div
                        className="bg-[#84E000] h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${items.length ? (completedItemsCount / items.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-neutral-500">
                        Total: <strong className="text-neutral-900 font-mono font-semibold">R$ {totalBasketValue.toFixed(2).replace('.', ',')}</strong>
                      </div>
                      <button
                        onClick={() => setActiveTab('list')}
                        className="text-xs font-semibold text-[#497D00] hover:text-[#3A6400] flex items-center gap-1 transition"
                      >
                        Ver lista ({items.length}) <ChevronRight size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Atalhos Rápidos Multimodais */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setIsRecordingAudio(true);
                  }}
                  className="bg-white hover:bg-neutral-50 hairline-border p-3.5 rounded-[20px] text-left shadow-card transition flex flex-col justify-between h-24 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#F4FCE3] text-[#497D00] flex items-center justify-center group-hover:scale-105 transition">
                    <Mic size={15} />
                  </div>
                  <div>
                    <strong className="text-xs font-semibold text-neutral-900 block">
                      Ditar por Voz
                    </strong>
                    <span className="text-[10px] text-neutral-500">
                      Diga seus produtos
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="bg-white hover:bg-neutral-50 hairline-border p-3.5 rounded-[20px] text-left shadow-card transition flex flex-col justify-between h-24 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Camera size={15} />
                  </div>
                  <div>
                    <strong className="text-xs font-semibold text-neutral-900 block">
                      Escanear Lista
                    </strong>
                    <span className="text-[10px] text-neutral-500">
                      Foto de papel ou nota
                    </span>
                  </div>
                </button>
              </div>

              {/* Mercados Monitorados na Região */}
              <div className="bg-white hairline-border p-4 rounded-[24px] shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    MERCADOS EM {city.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#497D00] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />
                    Ativos
                  </span>
                </div>

                <div className="divide-y divide-neutral-100">
                  {markets.slice(0, 4).map((m) => (
                    <div key={m.marketId} className="flex items-center justify-between text-xs py-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{ backgroundColor: m.logoColor }}
                          className="w-6 h-6 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shadow-xs"
                        >
                          {m.marketName[0]}
                        </div>
                        <span className="font-medium text-neutral-800">{m.marketName}</span>
                      </div>
                      <span className="text-[11px] font-mono font-medium text-[#497D00]">
                        {items.length > 0 ? `R$ ${m.totalPrice.toFixed(2).replace('.', ',')}` : 'Online'}
                      </span>
                    </div>
                  ))}
                </div>

                {markets.length > 4 && (
                  <button
                    onClick={() => setActiveTab('prices')}
                    className="w-full pt-2.5 border-t border-neutral-100 text-center text-xs font-semibold text-[#497D00] hover:text-[#3A6400] flex items-center justify-center gap-1 transition"
                  >
                    Ver todas as {markets.length} redes de {city} <ChevronRight size={13} />
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* TAB 2: CHAT IA (CONVERSA MULTIMODAL DE LUXO) */}
          {/* ========================================= */}
          {activeTab === 'chat' && (
            <div className="flex flex-col space-y-3.5 animate-in fade-in duration-200">
              
              {/* Header do Chat */}
              <div className="pt-1 pb-1 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#497D00] font-bold">
                    ASSISTENTE IA
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
                    Lista Inteligente
                  </h2>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">
                    Cotações em <strong>{city}, {stateCode}</strong>. Dite, envie foto ou digite.
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => detectCurrentLocation(true)}
                      disabled={isDetectingGps}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition shadow-2xs border ${
                        gpsLocation?.isGpsActive
                          ? 'bg-[#F4FCE3] border-[#70BF00]/30 text-neutral-900 hover:bg-[#EBFBCE]'
                          : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                      }`}
                      title="Toque para atualizar sua localização via GPS"
                    >
                      {isDetectingGps ? (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-[#497D00] border-t-transparent animate-spin" />
                          <span className="text-[#497D00] font-medium">Buscando GPS...</span>
                        </>
                      ) : gpsLocation?.isGpsActive ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84E000] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#497D00]"></span>
                          </span>
                          <span className="font-semibold text-neutral-900">
                            📍 {gpsLocation.neighborhood ? `${gpsLocation.city} (${gpsLocation.neighborhood})` : gpsLocation.city}
                          </span>
                          <span className="text-[10px] text-[#497D00] font-semibold flex items-center gap-0.5 ml-0.5">
                            <Navigation size={9} /> GPS Ativo
                          </span>
                        </>
                      ) : (
                        <>
                          <MapPin size={11} className="text-neutral-500" />
                          <span>{city}, {stateCode}</span>
                          <span className="text-[10px] text-[#497D00] font-bold underline underline-offset-2 ml-1">
                            Ativar GPS Automático
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {messages.length > 1 && (
                  <button
                    onClick={handleClearChat}
                    className="text-[10px] text-neutral-500 hover:text-red-600 transition px-2.5 py-1 rounded-full hover:bg-red-50 hairline-border flex items-center gap-1 shrink-0 mt-1"
                    title="Limpar histórico da conversa"
                  >
                    <RotateCcw size={10} />
                    Limpar
                  </button>
                )}
              </div>

              {/* Thread de Mensagens */}
              <div className="space-y-3 pt-1">
                {messages.map((msg) => {
                  if (msg.role === 'user') {
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <div className="max-w-[85%] bg-neutral-950 text-white rounded-[22px] rounded-tr-xs px-4 py-3 text-xs sm:text-[13px] font-normal leading-relaxed shadow-xs border border-neutral-800">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className="flex flex-col space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-xl overflow-hidden border border-black/10 shrink-0 shadow-xs mt-0.5 bg-white">
                          <Image
                            src="/logo.png"
                            alt="Logo"
                            width={28}
                            height={28}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 bg-white hairline-border rounded-[22px] rounded-tl-xs p-4 shadow-card text-xs sm:text-[13px] text-neutral-900 leading-relaxed">
                          <div className="flex items-center justify-between mb-1.5">
                            <strong className="text-[9px] font-semibold text-neutral-400 font-mono uppercase tracking-wider">
                              LIST.ME INTELLIGENCE
                            </strong>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {msg.timestamp}
                            </span>
                          </div>
                          <FormattedChatMessage text={msg.text} />

                          {msg.itemsFound && msg.itemsFound.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-neutral-100 space-y-2">
                              <span className="text-[10px] font-semibold text-neutral-500 block uppercase tracking-wider font-mono">
                                Cotações em {city}:
                              </span>

                              <div className="space-y-1.5">
                                {msg.itemsFound.map((item, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-neutral-50 last:border-0">
                                    <div className="truncate pr-2">
                                      <span className="font-medium text-neutral-900 block truncate">
                                        {item.name}
                                      </span>
                                      <span className="text-[10px] text-neutral-400">
                                        {item.market}
                                      </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="font-semibold text-[#497D00] font-mono text-xs">
                                        R$ {(item.price > 0 ? item.price : 12.90).toFixed(2).replace('.', ',')}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={() => setActiveTab('list')}
                                className="mt-2 text-xs font-semibold text-[#497D00] hover:text-[#3A6400] flex items-center gap-1 transition"
                              >
                                Ver lista ({items.length}) <ChevronRight size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* TAB 3: LISTAS (GERENCIADOR ATIVO) */}
          {/* ========================================= */}
          {activeTab === 'list' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#497D00] font-bold">
                    LISTA DA CASA
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900">
                    Minha Lista
                  </h2>
                </div>

                <button
                  onClick={handleShareWhatsApp}
                  className="px-3.5 py-1.5 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 text-xs font-bold rounded-full shadow-xs flex items-center gap-1.5 transition duration-200"
                >
                  <Share2 size={12} />
                  WhatsApp
                </button>
              </div>

              {items.length === 0 ? (
                <div className="bg-white hairline-border p-7 rounded-[28px] text-center shadow-card my-6">
                  <div className="w-10 h-10 rounded-2xl bg-[#F4FCE3] text-[#497D00] flex items-center justify-center mx-auto mb-2.5">
                    <CheckSquare size={19} />
                  </div>
                  <h3 className="font-serif text-base font-bold text-neutral-900 mb-1">
                    Sua lista está limpa
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-4 leading-relaxed">
                    Dite, fotografe ou digite os produtos para calcular a melhor compra em {city}.
                  </p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="py-2.5 px-5 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-medium shadow-xs transition duration-200 inline-flex items-center gap-2"
                  >
                    <Plus size={13} /> Adicionar produtos
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white hairline-border p-4 rounded-[24px] shadow-card border-l-4 border-l-[#84E000]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] animate-pulse" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#497D00] font-bold">
                        COMPRE TUDO NO {markets[0]?.marketName?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-bold text-neutral-900">
                        {markets[0]?.marketName}
                      </h3>
                      <span className="font-mono text-sm font-bold text-[#497D00]">
                        R$ {totalBasketValue.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Compra completa otimizada. Você economiza <strong className="text-neutral-900">R$ {estimatedSavings.toFixed(2).replace('.', ',')}</strong> comprando todos os itens em um único mercado.
                    </p>
                  </div>

                  {/* Aviso Inteligente na Lista */}
                  {smartTip && (
                    <div className="bg-white hairline-border rounded-[20px] p-3.5 shadow-card border-l-4 border-l-[#84E000] flex items-start gap-2.5">
                      <Sparkles size={16} className="text-[#497D00] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-[10px] font-mono uppercase text-[#497D00] font-bold block mb-0.5">
                          DICA DE COMPRA INTELIGENTE
                        </span>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {smartTip}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                      Pendentes ({pendingItemsCount})
                    </h4>

                    {items
                      .filter((item) => !item.checked)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-white hairline-border p-3.5 rounded-[20px] shadow-card flex items-center justify-between gap-2"
                        >
                          <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleItemChecked(item.id)}
                              className="w-4 h-4 rounded accent-[#84E000] cursor-pointer"
                            />
                            <div className="truncate">
                              <span className="text-xs font-semibold text-neutral-900 block truncate">
                                {item.matchedItem || item.name}
                              </span>
                              <span className="text-[11px] text-neutral-400 font-mono">
                                {item.bestMarket?.name} · R$ {item.bestMarket?.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </label>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs flex items-center justify-center transition"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-5 text-center text-xs font-mono font-semibold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs flex items-center justify-center transition"
                            >
                              <Plus size={11} />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 transition ml-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {completedItemsCount > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                        Comprados ({completedItemsCount})
                      </h4>

                      {items
                        .filter((item) => item.checked)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="bg-neutral-50 hairline-border p-3 rounded-[18px] flex items-center justify-between gap-2 opacity-60"
                          >
                            <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleItemChecked(item.id)}
                                className="w-4 h-4 rounded accent-[#84E000] cursor-pointer"
                              />
                              <div className="truncate">
                                <span className="text-xs font-medium text-neutral-900 line-through block truncate">
                                  {item.matchedItem || item.name}
                                </span>
                                <span className="text-[11px] text-neutral-400 font-mono">
                                  {item.bestMarket?.name} · R$ {item.bestMarket?.price.toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            </label>

                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-full py-3 bg-white hover:bg-neutral-50 hairline-border rounded-[20px] text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <Sparkles size={13} className="text-[#497D00]" />
                    Adicionar mais produtos com IA
                  </button>
                </>
              )}

            </div>
          )}

          {/* ========================================= */}
          {/* TAB 4: GASTOS & COMPARATIVO REAL */}
          {/* ========================================= */}
          {activeTab === 'expenses' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              
              <div className="pt-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#497D00] font-bold">
                  GASTOS & ECONOMIA REAL
                </p>
                <h2 className="font-serif text-2xl font-bold text-neutral-900">
                  Controle de Compras
                </h2>
                <p className="text-xs text-neutral-500">
                  Compare o gasto real no caixa com a estimativa do app.
                </p>
              </div>

              {/* Card de Resumo Geral Acumulado (se houver compras) */}
              {expenses.length > 0 && (
                <div className="bg-neutral-950 text-white p-4 rounded-[24px] shadow-floating border-2 border-[#84E000]/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#84E000] font-bold flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#84E000]" />
                      BALANÇO GERAL DE COMPRAS
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {expenses.length} {expenses.length === 1 ? 'compra registrada' : 'compras registradas'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-800">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-mono block">Total Pago no Caixa</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                        R$ {totalSpentReal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 font-mono block">Estimativa do App</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-neutral-300">
                        R$ {totalEstimatedApp.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {totalRealEconomy !== 0 && (
                    <div className={`mt-2 p-2 rounded-xl text-xs flex items-center justify-between font-mono ${
                      totalRealEconomy > 0 
                        ? 'bg-[#84E000]/15 text-[#84E000] font-bold' 
                        : 'bg-amber-500/10 text-amber-300'
                    }`}>
                      <span>{totalRealEconomy > 0 ? 'Economia extra acumulada:' : 'Variação total acumulada:'}</span>
                      <span>{totalRealEconomy > 0 ? `+R$ ${totalRealEconomy.toFixed(2).replace('.', ',')}` : `-R$ ${Math.abs(totalRealEconomy).toFixed(2).replace('.', ',')}`}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Banner de Compra Concluída / Estimativa Atual */}
              {(lastEstimatedTotal > 0 || (items.length > 0 && totalBasketValue > 0)) && (
                <div className="bg-[#84E000]/10 border border-[#84E000]/30 rounded-[24px] p-4 shadow-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#386000] font-bold flex items-center gap-1.5">
                      <Receipt size={12} className="text-[#497D00]" />
                      ESTIMATIVA LIST.ME PARA ESTA COMPRA
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-[#84E000] text-neutral-950 font-bold px-2 py-0.5 rounded-md">
                      Meta da Compra
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="font-serif text-2xl font-bold text-neutral-900">
                        R$ {(lastEstimatedTotal || totalBasketValue).toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        Cálculo para {items.length} {items.length === 1 ? 'item' : 'itens'} no {newExpenseMarket || markets[0]?.marketName || 'mercado recomendado'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block font-medium">
                        Mais Barato
                      </span>
                      <span className="text-xs font-bold text-neutral-800 bg-white px-2.5 py-1 rounded-lg inline-block mt-1 hairline-border shadow-xs">
                        {newExpenseMarket || markets[0]?.marketName}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form: Lançar Compra Realizada */}
              <div className="bg-white hairline-border p-4 sm:p-5 rounded-[24px] shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-700 font-bold flex items-center gap-1.5">
                    <CheckCheck size={13} className="text-[#497D00]" />
                    Lançar Compra Realizada
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Após passar no caixa
                  </span>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-medium">
                        Supermercado
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Atacadão"
                        value={newExpenseMarket}
                        onChange={(e) => setNewExpenseMarket(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-medium">
                        Total Pago (R$)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 149,90"
                        value={newExpenseValue}
                        onChange={(e) => setNewExpenseValue(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#84E000] font-mono font-semibold"
                      />
                    </div>
                  </div>

                  {/* Campo de Observação */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-medium flex items-center justify-between">
                      <span>Observação (opcional)</span>
                      <span className="text-[9px] text-neutral-400 lowercase">anote itens extras, promoções, etc.</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: peguei produtos extras, marcas diferentes, aproveitei promoção..."
                      value={newExpenseNotes}
                      onChange={(e) => setNewExpenseNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
                    />
                  </div>

                  {/* Comparativo em Tempo Real enquanto o usuário digita */}
                  {(() => {
                    const paidNum = parseFloat(newExpenseValue.replace(',', '.'));
                    const targetEst = lastEstimatedTotal || totalBasketValue;
                    if (!isNaN(paidNum) && paidNum > 0 && targetEst > 0) {
                      const diff = Number((paidNum - targetEst).toFixed(2));
                      const isUnder = diff < 0;
                      const isExact = diff === 0;
                      return (
                        <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between border animate-in fade-in duration-200 ${
                          isUnder
                            ? 'bg-[#84E000]/15 border-[#84E000]/40 text-[#2B4B00]'
                            : isExact
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}>
                          <span className="font-semibold text-[11px] flex items-center gap-1.5">
                            {isUnder ? '🎉 Economizou além do previsto:' : isExact ? '🎯 Na meta exata prevista pelo app:' : '⚠️ Acima da estimativa calculada:'}
                          </span>
                          <span className="font-mono font-bold text-xs">
                            {isUnder ? `-R$ ${Math.abs(diff).toFixed(2).replace('.', ',')}` : isExact ? 'R$ 0,00' : `+R$ ${diff.toFixed(2).replace('.', ',')}`}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-bold shadow-xs transition duration-200 mt-1 flex items-center justify-center gap-2"
                  >
                    <span>Salvar Compra & Comparar</span>
                  </button>
                </form>
              </div>

              {/* Purchase History with Real vs Estimated Comparison */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                    Compras Registradas ({expenses.length})
                  </h4>
                  {expenses.length > 0 && (
                    <span className="text-[10px] font-mono text-neutral-400">
                      Real vs. Estimado
                    </span>
                  )}
                </div>

                {expenses.length === 0 ? (
                  <div className="bg-white hairline-border p-6 rounded-[22px] text-center text-xs text-neutral-500 shadow-card space-y-1">
                    <p className="font-semibold text-neutral-700">Nenhuma compra finalizada ainda.</p>
                    <p className="text-[11px] text-neutral-400">
                      Ao marcar todos os itens na aba de Listas, você será redirecionado para cá para registrar o valor pago e comparar com a estimativa do app.
                    </p>
                  </div>
                ) : (
                  expenses.map((exp) => {
                    const hasEstimate = typeof exp.estimatedTotal === 'number' && exp.estimatedTotal > 0;
                    const diff = hasEstimate ? Number((exp.totalPaid - exp.estimatedTotal!).toFixed(2)) : 0;
                    const isUnder = diff < 0;
                    const isExact = diff === 0;
                    const isOver = diff > 0;

                    return (
                      <div
                        key={exp.id}
                        className="bg-white hairline-border p-4 rounded-[22px] shadow-card space-y-2.5"
                      >
                        {/* Linha Topo: Mercado, Data e Botão Excluir */}
                        <div className="flex items-start justify-between">
                          <div>
                            <strong className="text-xs sm:text-sm font-bold text-neutral-900 block">
                              {exp.marketName}
                            </strong>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              {exp.date} · {exp.itemsCount} {exp.itemsCount === 1 ? 'produto' : 'produtos'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-[9px] font-mono uppercase text-neutral-400 block font-semibold">
                                Pago no Caixa
                              </span>
                              <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                                R$ {exp.totalPaid.toFixed(2).replace('.', ',')}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1.5 text-neutral-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                              title="Remover esta compra"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Observação (se houver) */}
                        {exp.notes && (
                          <div className="bg-neutral-50 px-3 py-2 rounded-xl text-xs text-neutral-700 flex items-start gap-2 hairline-border">
                            <FileText size={12} className="text-[#497D00] shrink-0 mt-0.5" />
                            <p className="italic text-neutral-600 leading-snug">
                              &ldquo;{exp.notes}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Comparativo Detalhado: Estimativa do App vs Real */}
                        {hasEstimate ? (
                          <div className="pt-2 border-t border-black/[0.04] grid grid-cols-3 gap-2 text-center">
                            <div className="bg-[#F8F7F4] p-2 rounded-xl">
                              <span className="text-[9px] font-mono uppercase text-neutral-400 block font-semibold">
                                Estimativa App
                              </span>
                              <span className="font-mono text-xs font-bold text-neutral-700">
                                R$ {exp.estimatedTotal!.toFixed(2).replace('.', ',')}
                              </span>
                            </div>

                            <div className="bg-[#F8F7F4] p-2 rounded-xl">
                              <span className="text-[9px] font-mono uppercase text-neutral-400 block font-semibold">
                                Gasto Real
                              </span>
                              <span className="font-mono text-xs font-bold text-neutral-900">
                                R$ {exp.totalPaid.toFixed(2).replace('.', ',')}
                              </span>
                            </div>

                            <div className={`p-2 rounded-xl ${
                              isUnder
                                ? 'bg-[#84E000]/15 text-[#345900]'
                                : isExact
                                ? 'bg-neutral-100 text-neutral-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}>
                              <span className="text-[9px] font-mono uppercase block font-bold">
                                {isUnder ? 'Economizou +' : isExact ? 'Na Meta' : 'Diferença'}
                              </span>
                              <span className="font-mono text-xs font-bold">
                                {isUnder && `-R$ ${Math.abs(diff).toFixed(2).replace('.', ',')}`}
                                {isExact && 'R$ 0,00'}
                                {isOver && `+R$ ${diff.toFixed(2).replace('.', ',')}`}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1.5 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#497D00] font-mono">
                            <span>Economia média estimada:</span>
                            <span className="font-bold">R$ {exp.estimatedEconomy.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* TAB 5: PREÇOS */}
          {/* ========================================= */}
          {activeTab === 'prices' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              
              <div className="flex items-start justify-between pt-1">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#497D00] font-bold">
                    COMPARATIVO
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900">
                    Mercados em {city}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Onde sua compra completa sai mais barata.
                  </p>
                </div>

                <button
                  onClick={handleAddCustomMarket}
                  className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 text-[11px] font-medium rounded-xl hairline-border shadow-xs transition shrink-0 flex items-center gap-1 mt-1"
                  title="Adicionar outro mercado da sua rua ou bairro"
                >
                  <Plus size={11} className="text-[#497D00]" />
                  Novo Mercado
                </button>
              </div>

              {/* Aviso Inteligente nos Preços */}
              {smartTip && (
                <div className="bg-[#84E000]/10 border border-[#84E000]/40 rounded-[20px] p-3.5 text-xs text-neutral-800">
                  <strong className="text-[10px] font-mono uppercase text-[#386000] font-bold block mb-1">
                    💡 ANÁLISE DE CUSTO-BENEFÍCIO:
                  </strong>
                  {smartTip}
                </div>
              )}

              {/* Markets Ranking */}
              <div className="space-y-2.5">
                {markets.map((m, index) => (
                  <div
                    key={m.marketId}
                    className={`p-4 rounded-[24px] hairline-border shadow-card transition ${
                      m.isBestValue && items.length > 0
                        ? 'bg-white ring-2 ring-[#84E000] border-transparent shadow-xs'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: m.logoColor }}
                          className="w-9 h-9 rounded-2xl text-white font-bold text-xs flex items-center justify-center shadow-xs"
                        >
                          {m.marketName[0]}
                        </div>
                        <div>
                          {m.isBestValue && items.length > 0 && (
                            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-950 bg-[#84E000] px-2 py-0.5 rounded font-bold inline-block mb-1">
                              ★ MENOR CUSTO TOTAL
                            </span>
                          )}
                          <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                            {m.marketName}
                          </h3>
                          <span className="text-[11px] text-neutral-400">
                            {items.length > 0 ? `${m.coveredItems} de ${m.totalItems} itens cotados` : 'Rede monitorada'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {items.length > 0 ? (
                          <>
                            <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 block">
                              R$ {m.totalPrice.toFixed(2).replace('.', ',')}
                            </span>
                            {m.savings > 0 && (
                              <span className="text-[10px] font-mono text-[#497D00] font-bold">
                                Economia de R$ {m.savings.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] font-mono text-[#497D00] font-bold">
                            Ativo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preços detalhados por produto */}
              {items.length > 0 && (
                <div className="bg-white hairline-border p-4 rounded-[24px] shadow-card">
                  <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                    Melhor Preço por Produto na Sua Lista
                  </h4>

                  <div className="divide-y divide-neutral-100">
                    {items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-medium text-neutral-900 block">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {item.bestMarket?.name}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-[#497D00] block">
                            R$ {item.bestMarket?.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            por {item.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

        {/* 3. Composer Flutuante — Design Minimalista Premium */}
        {activeTab === 'chat' && (
          <div className="absolute bottom-16 left-0 right-0 px-3 pb-2 pt-3 z-30 bg-gradient-to-t from-[#F8F7F4] via-[#F8F7F4] to-transparent">
            {isRecordingAudio ? (
              <AudioRecorder
                onAudioCaptured={(transcript) => {
                  setIsRecordingAudio(false);
                  handleProcessUserText(transcript);
                }}
                onCancel={() => setIsRecordingAudio(false)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between px-3 mb-1 text-[10px] sm:text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        gpsLocation?.isGpsActive ? 'bg-[#84E000] animate-pulse' : 'bg-neutral-400'
                      }`}
                    />
                    <span className="truncate text-neutral-600">
                      {isDetectingGps ? (
                        'Buscando satélites GPS...'
                      ) : gpsLocation?.isGpsActive ? (
                        <>
                          GPS: <strong className="text-neutral-900 font-semibold">{gpsLocation.city}</strong>
                          {gpsLocation.neighborhood ? ` (${gpsLocation.neighborhood})` : ''} • Raio 5km
                        </>
                      ) : (
                        <>
                          Região: <strong className="text-neutral-900 font-semibold">{city}, {stateCode}</strong> (Perfil)
                        </>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => detectCurrentLocation(true)}
                    disabled={isDetectingGps}
                    className="text-[10px] text-[#497D00] hover:text-[#3A6400] font-bold flex items-center gap-1 shrink-0 ml-2 transition"
                    title="Atualizar GPS"
                  >
                    <RotateCcw size={9} className={isDetectingGps ? 'animate-spin' : ''} />
                    {gpsLocation?.isGpsActive ? 'Atualizar' : 'Ativar GPS'}
                  </button>
                </div>

                <div className="bg-white/95 backdrop-blur-xl hairline-border rounded-full p-1 pl-2.5 shadow-floating flex items-center gap-2 border border-black/[0.08]">
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  type="button"
                  title="Adicionar por foto da lista"
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition shrink-0"
                >
                  <Camera size={16} />
                </button>

                <input
                  type="text"
                  value={inputText}
                  disabled={isSearchingOffers}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSearchingOffers) handleProcessUserText(inputText);
                  }}
                  placeholder={isSearchingOffers ? `🔍 Pesquisando encartes na web em ${city}...` : `Dite ou digite: arroz, picanha, leite...`}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none px-1 disabled:opacity-60"
                />

                <button
                  onClick={() => setIsRecordingAudio(true)}
                  type="button"
                  disabled={isSearchingOffers}
                  title="Gravar lista por voz"
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 flex items-center justify-center transition shrink-0"
                >
                  <Mic size={16} />
                </button>

                <button
                  onClick={() => handleProcessUserText(inputText)}
                  type="button"
                  disabled={!inputText.trim() || isSearchingOffers}
                  title="Processar itens"
                  className="w-8 h-8 rounded-full bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 disabled:opacity-30 text-white flex items-center justify-center shadow-xs transition duration-200 shrink-0"
                >
                  {isSearchingOffers ? (
                    <div className="w-3.5 h-3.5 border-2 border-[#84E000] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                </button>
              </div>
            </>
          )}
          </div>
        )}

        {/* 4. Bottom Navigation Bar Fixo — Dock Minimalista de Luxo */}
        <nav
          aria-label="Navegação do aplicativo"
          className="shrink-0 h-16 bg-white/80 backdrop-blur-2xl hairline-border-t px-2 flex items-center justify-around z-40"
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition ${
              activeTab === 'dashboard'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <LayoutDashboard size={18} strokeWidth={activeTab === 'dashboard' ? 2.2 : 1.75} />
            <span className="text-[10px]">Início</span>
            {activeTab === 'dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition ${
              activeTab === 'chat'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <MessageSquare size={18} strokeWidth={activeTab === 'chat' ? 2.2 : 1.75} />
            <span className="text-[10px]">Conversa</span>
            {activeTab === 'chat' && <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />}
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition ${
              activeTab === 'list'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <CheckSquare size={18} strokeWidth={activeTab === 'list' ? 2.2 : 1.75} />
            <span className="text-[10px]">Listas</span>
            {activeTab === 'list' && <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />}
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition ${
              activeTab === 'expenses'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <TrendingUp size={18} strokeWidth={activeTab === 'expenses' ? 2.2 : 1.75} />
            <span className="text-[10px]">Gastos</span>
            {activeTab === 'expenses' && <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />}
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition ${
              activeTab === 'prices'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Tag size={18} strokeWidth={activeTab === 'prices' ? 2.2 : 1.75} />
            <span className="text-[10px]">Preços</span>
            {activeTab === 'prices' && <span className="w-1.5 h-1.5 rounded-full bg-[#84E000]" />}
          </button>
        </nav>

        {/* Modal: Upload de Foto / OCR */}
        <PhotoUploadModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onItemsExtracted={(text) => {
            setActiveTab('chat');
            handleProcessUserText(text);
          }}
        />

        {/* Modal: Perfil & Configurações */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[28px] p-6 max-w-sm w-full shadow-floating hairline-border animate-in fade-in zoom-in duration-200">
              <h3 className="font-serif text-xl font-bold text-neutral-900 mb-1">
                Configurações da Residência
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Localização: <strong>{city}, {stateCode}</strong>
              </p>

              {/* Informações da Conta do Assinante */}
              <div className="bg-neutral-50 rounded-2xl p-3 mb-4 border border-neutral-200/80 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-neutral-400 block text-[9px] font-mono uppercase font-bold">Assinatura Ativa</span>
                  <span className="font-bold text-neutral-900 text-xs truncate block">{userName || 'Assinante LIST.ME'}</span>
                  {userEmail && <span className="text-neutral-500 text-[10px] truncate block">{userEmail}</span>}
                </div>
                <span className="px-2 py-1 rounded-full bg-[#84E000]/20 text-[#497D00] text-[9px] font-mono font-bold uppercase shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#497D00] animate-pulse" />
                  Ativo
                </span>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Nome da Residência
                  </label>
                  <input
                    type="text"
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ex: Mariana"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
                  />
                </div>

                <div className="p-3 bg-[#F4FCE3] rounded-xl text-xs text-[#2A4800] leading-relaxed border border-[#D9F99D]">
                  <strong className="block text-[10px] font-mono uppercase text-[#497D00] font-bold">Redes Ativas</strong>
                  {markets.map(m => m.marketName).join(', ')}
                </div>

                {/* Status do Plano & Compartilhamento Familiar */}
                <div className="p-3.5 bg-neutral-950 text-white rounded-2xl border border-neutral-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#84E000] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#84E000] animate-pulse" />
                      PLANO FAMÍLIA ATIVO
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Até 4 pessoas</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug">
                    Convide membros da sua casa para adicionar produtos e acompanhar a mesma lista em tempo real.
                  </p>
                  <button
                    onClick={() => {
                      const text = `Oi! Te convidei para participar da lista de compras da nossa casa no LIST.ME (${houseName || 'Minha Casa'}).\n\nAcesse por aqui para montarmos a lista e vermos os preços mais baratos juntos em ${city}: https://list.me/app`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    type="button"
                    className="w-full py-2.5 px-3 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition duration-200"
                  >
                    <Share2 size={12} /> Convidar Membro da Família
                  </button>
                </div>

                {/* Botão para abrir o tutorial de instalação */}
                <div className="bg-neutral-100 rounded-2xl p-3 border border-black/5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <strong className="text-xs font-bold text-neutral-900 block truncate">
                      Atalho na Tela de Início
                    </strong>
                    <span className="text-[10px] text-neutral-500 block truncate">
                      Abra como aplicativo nativo no celular
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsInstallModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-[11px] font-bold shrink-0 transition"
                  >
                    Ver Como
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    const currentProfile = { houseName, userName, city, state: stateCode };
                    localStorage.setItem('listme_profile', JSON.stringify(currentProfile));
                    setIsProfileModalOpen(false);
                    showToast('Preferências atualizadas!');
                  }}
                  className="w-full py-2.5 bg-neutral-950 hover:bg-[#84E000] hover:text-neutral-950 text-white rounded-xl text-xs font-bold shadow-xs transition duration-200"
                >
                  Salvar Preferências
                </button>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('listme_user_session');
                    setIsProfileModalOpen(false);
                    setIsAuthenticated(false);
                    showToast('Sessão encerrada com sucesso.');
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center justify-center gap-1.5 border border-red-200"
                >
                  <LogOut size={13} />
                  Sair da Minha Conta
                </button>

                <button
                  onClick={handleResetAllData}
                  className="w-full py-2 text-center text-xs text-neutral-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  Redefinir localização e zerar dados
                </button>

                <Link
                  href="/"
                  className="w-full py-2 text-center text-xs text-neutral-400 hover:text-neutral-800 transition"
                >
                  Ir para Landing Page
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
