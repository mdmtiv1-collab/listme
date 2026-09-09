export interface ListItem {
  id: string;
  name: string;
  matchedItem?: string;
  basePrice?: number;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  bestMarket?: {
    name: string;
    price: number;
    priceType: 'normal' | 'club' | 'promo';
  };
}

export interface MarketComparison {
  marketId: string;
  marketName: string;
  logoColor: string;
  priceFactor?: number;
  coveredItems: number;
  totalItems: number;
  totalPrice: number;
  savings: number;
  clubDiscounts: number;
  isBestValue: boolean;
  distance?: string;
  marketType?: 'atacadista' | 'supermercado';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  itemsFound?: Array<{
    name: string;
    matchedProduct: string;
    market: string;
    price: number;
    priceType: 'normal' | 'club' | 'promo';
    quantity: number;
    unit: string;
  }>;
}

export interface ExpenseRecord {
  id: string;
  marketName: string;
  date: string;
  totalPaid: number;
  itemsCount: number;
  estimatedEconomy: number;
  estimatedTotal?: number;
  notes?: string;
}

export type ActiveTab = 'dashboard' | 'chat' | 'list' | 'expenses' | 'prices';
