import { MarketComparison } from '@/types';

export interface RegionalMarketRule {
  state: string;
  markets: Array<{
    id: string;
    name: string;
    color: string;
    priceFactor: number;
    hasClub: boolean;
  }>;
}

export const REGIONAL_MARKETS_BY_STATE: Record<string, RegionalMarketRule['markets']> = {
  PR: [
    { id: 'circuito_pr', name: 'Circuito Atacadista', color: '#0B0E11', priceFactor: 0.88, hasClub: false },
    { id: 'max_pr', name: 'Max Atacadista', color: '#F57C00', priceFactor: 0.91, hasClub: false },
    { id: 'rioverde_pr', name: 'Supermercados Rio Verde', color: '#007A33', priceFactor: 0.92, hasClub: false },
    { id: 'atacadao_pr', name: 'Atacadão', color: '#E65100', priceFactor: 0.92, hasClub: false },
    { id: 'assai_pr', name: 'Assaí Atacadista', color: '#005CA9', priceFactor: 0.92, hasClub: true },
    { id: 'condor', name: 'Condor Hipermercado', color: '#D32F2F', priceFactor: 0.95, hasClub: true },
    { id: 'muffato', name: 'Super Muffato', color: '#1565C0', priceFactor: 0.97, hasClub: true },
    { id: 'jacomar_pr', name: 'Supermercado Jacomar', color: '#E53935', priceFactor: 0.97, hasClub: false },
    { id: 'festval', name: 'Festval', color: '#2E7D32', priceFactor: 1.15, hasClub: true },
  ],
  SP: [
    { id: 'assai', name: 'Assaí Atacadista', color: '#005CA9', priceFactor: 0.91, hasClub: true },
    { id: 'atacadao', name: 'Atacadão', color: '#E65100', priceFactor: 0.92, hasClub: false },
    { id: 'roldao', name: 'Roldão Atacadista', color: '#D32F2F', priceFactor: 0.93, hasClub: false },
    { id: 'sonda', name: 'Sonda Supermercados', color: '#F57C00', priceFactor: 0.97, hasClub: true },
    { id: 'carrefour', name: 'Carrefour Hiper', color: '#00387B', priceFactor: 1.01, hasClub: true },
    { id: 'extra', name: 'Mercado Extra', color: '#E53935', priceFactor: 1.03, hasClub: true },
    { id: 'paodeacucar', name: 'Pão de Açúcar', color: '#007A33', priceFactor: 1.15, hasClub: true },
  ],
  RJ: [
    { id: 'guanabara', name: 'Supermercados Guanabara', color: '#E53935', priceFactor: 0.89, hasClub: false },
    { id: 'mundial', name: 'Supermercados Mundial', color: '#1E88E5', priceFactor: 0.91, hasClub: false },
    { id: 'assai_rj', name: 'Assaí Atacadista', color: '#005CA9', priceFactor: 0.92, hasClub: true },
    { id: 'atacadao_rj', name: 'Atacadão', color: '#E65100', priceFactor: 0.93, hasClub: false },
    { id: 'prezunic', name: 'Prezunic', color: '#FB8C00', priceFactor: 1.02, hasClub: true },
    { id: 'zona_sul', name: 'Zona Sul Supermercados', color: '#007A33', priceFactor: 1.18, hasClub: true },
  ],
  MG: [
    { id: 'bh', name: 'Supermercados BH', color: '#D32F2F', priceFactor: 0.90, hasClub: false },
    { id: 'martminas', name: 'Mart Minas Atacado', color: '#F57C00', priceFactor: 0.91, hasClub: true },
    { id: 'atacadao_mg', name: 'Atacadão', color: '#E65100', priceFactor: 0.93, hasClub: false },
    { id: 'assai_mg', name: 'Assaí Atacadista', color: '#005CA9', priceFactor: 0.93, hasClub: true },
    { id: 'epa', name: 'EPA Supermercados', color: '#1976D2', priceFactor: 0.97, hasClub: false },
    { id: 'supernosso', name: 'Super Nosso', color: '#2E7D32', priceFactor: 1.10, hasClub: true },
  ],
  SC: [
    { id: 'komprao_sc', name: 'Komprão Koch', color: '#D92D20', priceFactor: 0.90, hasClub: true },
    { id: 'fort_sc', name: 'Fort Atacadista', color: '#E65100', priceFactor: 0.91, hasClub: true },
    { id: 'brasilatacadista', name: 'Brasil Atacadista', color: '#005CA9', priceFactor: 0.92, hasClub: false },
    { id: 'bistek', name: 'Bistek Supermercados', color: '#F57C00', priceFactor: 0.96, hasClub: true },
    { id: 'giassi_sc', name: 'Giassi Supermercados', color: '#1976D2', priceFactor: 0.98, hasClub: true },
    { id: 'angeloni_sc', name: 'Angeloni Supermercados', color: '#C2185B', priceFactor: 1.12, hasClub: true },
  ],
  RS: [
    { id: 'stok', name: 'Stok Center Atacado', color: '#E65100', priceFactor: 0.90, hasClub: true },
    { id: 'macromix', name: 'Macromix Atacado', color: '#1976D2', priceFactor: 0.92, hasClub: false },
    { id: 'desco', name: 'Desco Super&Atacado', color: '#007A33', priceFactor: 0.93, hasClub: false },
    { id: 'asuncion', name: 'Asun Supermercados', color: '#F57C00', priceFactor: 0.98, hasClub: true },
    { id: 'bourbon', name: 'Bourbon Hipermercado', color: '#D32F2F', priceFactor: 1.05, hasClub: true },
    { id: 'zaffari', name: 'Zaffari Supermercados', color: '#C2185B', priceFactor: 1.10, hasClub: true },
  ],
  DEFAULT: [
    { id: 'assai_gen', name: 'Assaí Atacadista', color: '#005CA9', priceFactor: 0.91, hasClub: true },
    { id: 'atacadao_gen', name: 'Atacadão', color: '#E65100', priceFactor: 0.92, hasClub: false },
    { id: 'carrefour_gen', name: 'Carrefour', color: '#00387B', priceFactor: 1.01, hasClub: true },
    { id: 'local_market', name: 'Supermercado Regional', color: '#007A33', priceFactor: 1.05, hasClub: false },
  ],
};

export function getMarketsForLocation(stateCode: string): MarketComparison[] {
  const normalizedState = (stateCode || 'SP').trim().toUpperCase();
  const rawMarkets = REGIONAL_MARKETS_BY_STATE[normalizedState] || REGIONAL_MARKETS_BY_STATE.DEFAULT;

  return rawMarkets.map((m, idx) => ({
    marketId: m.id,
    marketName: m.name,
    logoColor: m.color,
    priceFactor: m.priceFactor,
    coveredItems: 0,
    totalItems: 0,
    totalPrice: 0,
    savings: 0,
    clubDiscounts: m.hasClub ? 1 : 0,
    isBestValue: idx === 0,
  }));
}
