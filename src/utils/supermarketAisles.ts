import { ListItem } from '@/types';

export interface SupermarketAisle {
  id: string;
  order: number;
  corredorTitle: string;
  name: string;
  shortName: string;
  emoji: string;
  iconName: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  keywords: string[];
}

export const SUPERMARKET_AISLES: SupermarketAisle[] = [
  {
    id: 'aisle-1-bebidas',
    order: 1,
    corredorTitle: 'CORREDOR 1 · ENTRADA',
    name: 'Bebidas & Adega',
    shortName: 'Bebidas',
    emoji: '🥤',
    iconName: 'GlassWater',
    colorClass: 'text-sky-600',
    badgeBg: 'bg-sky-50 border-sky-200',
    badgeText: 'text-sky-700',
    description: 'Refrigerantes, sucos, cervejas, energéticos, vinhos e água',
    keywords: [
      'coca', 'refrigerante', 'refri', 'pepsi', 'guaraná', 'guarana', 'fanta', 'sprite',
      'suco', 'suco de uva', 'suco de laranja', 'néctar', 'nectar', 'del valle', 'maguary',
      'cerveja', 'heineken', 'amstel', 'brahma', 'skol', 'budweiser', 'corona', 'stella',
      'vinho', 'espumante', 'vodka', 'whisky', 'gin', 'energético', 'energetico', 'red bull',
      'monster', 'água', 'agua', 'água mineral', 'agua mineral', 'água de coco', 'cha', 'chá', 'mate'
    ],
  },
  {
    id: 'aisle-2-hortifruti',
    order: 2,
    corredorTitle: 'CORREDOR 2 · FEIRA FRESCA',
    name: 'Hortifrúti & Ovos',
    shortName: 'Hortifrúti',
    emoji: '🍎',
    iconName: 'Apple',
    colorClass: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-700',
    description: 'Frutas, verduras, legumes, temperos frescos e ovos',
    keywords: [
      'maçã', 'maca', 'banana', 'laranja', 'limão', 'limao', 'uva', 'melancia', 'melão', 'melao',
      'mamão', 'mamao', 'abacaxi', 'manga', 'morango', 'pêra', 'pera', 'abacate',
      'tomate', 'cebola', 'alho', 'batata', 'cenoura', 'abobrinha', 'chuchu', 'beterraba',
      'alface', 'rúcula', 'rucula', 'couve', 'espinafre', 'brócolis', 'brocolis', 'cheiro verde',
      'salsinha', 'cebolinha', 'coentro', 'pimentão', 'pimentao', 'repolho',
      'ovo', 'ovos', 'dúzia de ovos', 'cartela de ovos'
    ],
  },
  {
    id: 'aisle-3-padaria',
    order: 3,
    corredorTitle: 'CORREDOR 3 · MATINAIS & PADARIA',
    name: 'Padaria & Matinais',
    shortName: 'Padaria',
    emoji: '☕',
    iconName: 'Coffee',
    colorClass: 'text-amber-600',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-700',
    description: 'Pães, café, açúcar, achocolatados, bolos e biscoitos',
    keywords: [
      'café', 'cafe', 'pilão', 'pilao', 'melitta', '3 corações', 'nescafé', 'nescafe', 'baggio',
      'açúcar', 'acucar', 'alto alegre', 'união', 'uniao', 'caravelas', 'adoçante', 'adocante',
      'pão', 'pao', 'pão francês', 'pao frances', 'pão de forma', 'pao de forma', 'bisnaguinha',
      'bolo', 'torrada', 'bauduco', 'bauducco', 'marilan', 'mabel', 'trakinas',
      'biscoito', 'bolacha', 'passatempo', 'club social', 'oreo', 'cookie',
      'achocolatado', 'nescau', 'toddy', 'todt', 'chocolatto', 'cereal', 'sucrilhos', 'granola', 'aveia'
    ],
  },
  {
    id: 'aisle-4-mercearia',
    order: 4,
    corredorTitle: 'CORREDOR 4 · MERCEARIA & GRÃOS',
    name: 'Mercearia Básica & Grãos',
    shortName: 'Mercearia',
    emoji: '🌾',
    iconName: 'Wheat',
    colorClass: 'text-orange-600',
    badgeBg: 'bg-orange-50 border-orange-200',
    badgeText: 'text-orange-700',
    description: 'Arroz, feijão, trigo/farinhas, massas, óleos, azeite e molhos',
    keywords: [
      'arroz', 'tio joão', 'tio joao', 'camil', 'prato fino', 'parboilizado', 'integral',
      'feijão', 'feijao', 'kicaldo', 'carioca', 'feijão preto', 'feijao preto',
      'trigo', 'farinha de trigo', 'dona benta', 'renata', 'farinha', 'fubá', 'fuba', 'amido', 'maizena',
      'macarrão', 'macarrao', 'espaguete', 'spaghetti', 'penne', 'parafuso', 'massa', 'miojo', 'nissin',
      'óleo', 'oleo', 'soya', 'liza', 'óleo de soja', 'oleo de soja',
      'azeite', 'azeite de oliva', 'gallo', 'andorinha', 'borge',
      'molho de tomate', 'extrato de tomate', 'pomarola', 'elefante', 'fugini',
      'sal', 'sal refinado', 'vinagre', 'maionese', 'hellmanns', 'ketchup', 'mostarda',
      'atum', 'sardinha', 'milho verde', 'ervilha', 'azeitona', 'palmito'
    ],
  },
  {
    id: 'aisle-5-carnes',
    order: 5,
    corredorTitle: 'CORREDOR 5 · AÇOUGUE & CARNES',
    name: 'Açougue, Carnes & Aves',
    shortName: 'Açougue',
    emoji: '🥩',
    iconName: 'Beef',
    colorClass: 'text-rose-600',
    badgeBg: 'bg-rose-50 border-rose-200',
    badgeText: 'text-rose-700',
    description: 'Carne moída, bovinos, frango, suínos e peixes',
    keywords: [
      'carne', 'carne moída', 'carne moida', 'patinho', 'alcatra', 'coxão mole', 'coxao mole',
      'acém', 'acem', 'músculo', 'musculo', 'paleta', 'contrafilé', 'contra file', 'picanha',
      'fraldinha', 'maminha', 'costela', 'cupim', 'carne de primeira', 'carne de segunda',
      'frango', 'peito de frango', 'filé de frango', 'file de frango', 'coxa', 'sobrecoxa',
      'asa de frango', 'tulipa', 'coração de frango', 'coracao de frango',
      'porco', 'suíno', 'suino', 'bisteca', 'lombo', 'pernil', 'panceta', 'costelinha',
      'linguiça', 'linguica', 'calabresa', 'toscana', 'bacon',
      'peixe', 'tilápia', 'tilapia', 'salmão', 'salmao', 'bacalhau', 'camarão', 'camarao'
    ],
  },
  {
    id: 'aisle-6-laticinios',
    order: 6,
    corredorTitle: 'CORREDOR 6 · LATICÍNIOS & FRIOS',
    name: 'Laticínios & Frios',
    shortName: 'Laticínios',
    emoji: '🧀',
    iconName: 'Milk',
    colorClass: 'text-yellow-600',
    badgeBg: 'bg-yellow-50 border-yellow-200',
    badgeText: 'text-yellow-700',
    description: 'Leites, queijos, presunto, manteiga, iogurtes e requeijão',
    keywords: [
      'leite', 'leite integral', 'leite desnatado', 'leite semidesnatado', 'piracanjuba', 'italac', 'elegê', 'elege',
      'queijo', 'mussarela', 'muçarela', 'prato', 'parmesão', 'parmesao', 'provolone', 'gorgonzola',
      'presunto', 'apresuntado', 'peito de peru', 'salame', 'mortadela',
      'manteiga', 'margarina', 'qualy', 'doriana', 'vigor', 'danone', 'itambé', 'itambe',
      'iogurte', 'iorgute', 'danoninho', 'yakult', 'requeijão', 'requeijao', 'creme de leite',
      'leite condensado', 'leite moça', 'leite moca', 'nata'
    ],
  },
  {
    id: 'aisle-7-congelados',
    order: 7,
    corredorTitle: 'CORREDOR 7 · CONGELADOS & PRONTOS',
    name: 'Congelados & Sorvetes',
    shortName: 'Congelados',
    emoji: '🧊',
    iconName: 'Snowflake',
    colorClass: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-700',
    description: 'Hambúrgueres, pizzas, lasanhas, batata pré-frita e sorvetes',
    keywords: [
      'congelado', 'hambúrguer', 'hamburguer', 'texas burger', 'sadia burger', 'seara',
      'lasanha', 'pizza', 'pizza congelada', 'nuggets', 'empanado', 'steak',
      'batata congelada', 'batata pré-frita', 'sorvete', 'picolé', 'picole', 'kibon', 'nestlé', 'nestle', 'açaí', 'acai'
    ],
  },
  {
    id: 'aisle-8-higiene',
    order: 8,
    corredorTitle: 'CORREDOR 8 · HIGIENE & PERFUMARIA',
    name: 'Higiene Pessoal & Cuidados',
    shortName: 'Higiene',
    emoji: '🧴',
    iconName: 'Sparkles',
    colorClass: 'text-teal-600',
    badgeBg: 'bg-teal-50 border-teal-200',
    badgeText: 'text-teal-700',
    description: 'Sabonete, shampoo, pasta de dente, desodorante e papel higiênico',
    keywords: [
      'sabonete', 'dove', 'palmolive', 'lux', 'protex',
      'shampoo', 'xampu', 'condicionador', 'creme de cabelo', 'pantene', 'head & shoulders', 'seda', 'elseve',
      'pasta de dente', 'creme dental', 'colgate', 'sorriso', 'oral-b', 'escova de dente', 'fio dental',
      'desodorante', 'rexona', 'dove desodorante', 'axe', 'nivea',
      'papel higiênico', 'papel higienico', 'neve', 'personal', 'folha dupla',
      'absorvente', 'sempre livre', 'intimus', 'gilete', 'lâmina', 'barbeador', 'cotonete', 'hastes flexíveis'
    ],
  },
  {
    id: 'aisle-9-limpeza',
    order: 9,
    corredorTitle: 'CORREDOR 9 · LIMPEZA & LAVANDERIA',
    name: 'Limpeza & Lavanderia',
    shortName: 'Limpeza',
    emoji: '🧹',
    iconName: 'SprayCan',
    colorClass: 'text-purple-600',
    badgeBg: 'bg-purple-50 border-purple-200',
    badgeText: 'text-purple-700',
    description: 'Sabão em pó/líquido, amaciante, detergente, desinfetante e água sanitária',
    keywords: [
      'sabão', 'sabao', 'sabão em pó', 'sabao em po', 'sabão líquido', 'sabao liquido', 'omo', 'brilhante', 'tixan', 'ype', 'ypê',
      'amaciante', 'comfort', 'downy', 'amaciante ypê',
      'detergente', 'detergente ypê', 'detergente limpol', 'detergente minuano',
      'desinfetante', 'veja', 'pinho sol', 'ajax', 'lysoform',
      'água sanitária', 'agua sanitaria', 'q-boa', 'qboa', 'cloro', 'alvejante', 'vanish',
      'esponja', 'esponja scotch brite', 'bombril', 'palha de aço',
      'lustra móveis', 'lustra moveis', 'limpador perfumado', 'álcool', 'alcool', 'saco de lixo', 'sacos de lixo'
    ],
  },
  {
    id: 'aisle-10-bazar-pet',
    order: 10,
    corredorTitle: 'CORREDOR 10 · BAZAR & PET SHOP',
    name: 'Bazar, Pet Shop & Utilidades',
    shortName: 'Bazar & Pet',
    emoji: '🐾',
    iconName: 'Package',
    colorClass: 'text-neutral-600',
    badgeBg: 'bg-neutral-100 border-neutral-200',
    badgeText: 'text-neutral-700',
    description: 'Rações, carvão, fósforo, guardanapos, papel alumínio e descartáveis',
    keywords: [
      'ração', 'racao', 'pet', 'cachorro', 'gato', 'pedigree', 'whiskas', 'areia para gato',
      'carvão', 'carvao', 'fósforo', 'fosforo', 'acendedor',
      'guardanapo', 'papel toalha', 'papel alumínio', 'papel aluminio', 'filme pvc', 'plástico filme',
      'copo descartável', 'prato descartável', 'vela', 'pilha', 'lâmpada', 'lampada'
    ],
  },
  {
    id: 'aisle-11-diversos',
    order: 11,
    corredorTitle: 'CORREDOR 11 · OUTROS ITENS',
    name: 'Diversos & Outros',
    shortName: 'Diversos',
    emoji: '📦',
    iconName: 'Tag',
    colorClass: 'text-neutral-500',
    badgeBg: 'bg-neutral-100 border-neutral-200',
    badgeText: 'text-neutral-600',
    description: 'Outros produtos e itens especiais da sua lista',
    keywords: [],
  },
];

/**
 * Classifica um produto para o seu corredor físico correspondente no mercado.
 */
export function getAisleForItem(item: { name: string; category?: string; matchedItem?: string }): SupermarketAisle {
  const normCategory = (item.category || '').toLowerCase().trim();
  const textToScan = `${item.name || ''} ${item.matchedItem || ''} ${normCategory}`.toLowerCase();

  // 1. Mapeamento direto por Categoria Conhecida
  if (normCategory.includes('bebida') || normCategory.includes('suco') || normCategory.includes('cerveja') || normCategory.includes('adega')) {
    return SUPERMARKET_AISLES[0]; // Bebidas
  }
  if (normCategory.includes('horti') || normCategory.includes('fruta') || normCategory.includes('legume') || normCategory.includes('verdura')) {
    return SUPERMARKET_AISLES[1]; // Hortifrúti
  }
  if (normCategory.includes('padaria') || normCategory.includes('matinal') || normCategory.includes('café') || normCategory.includes('cafe') || normCategory.includes('biscoito')) {
    return SUPERMARKET_AISLES[2]; // Padaria
  }
  if (normCategory.includes('mercearia') || normCategory.includes('grão') || normCategory.includes('grao') || normCategory.includes('massa')) {
    // Trigo, farinha, arroz, feijão caem aqui
    return SUPERMARKET_AISLES[3]; // Mercearia
  }
  if (normCategory.includes('açougue') || normCategory.includes('acougue') || normCategory.includes('carne') || normCategory.includes('churrasco') || normCategory.includes('peix')) {
    return SUPERMARKET_AISLES[4]; // Carnes
  }
  if (normCategory.includes('laticínio') || normCategory.includes('laticinio') || normCategory.includes('frio') || normCategory.includes('queijo')) {
    return SUPERMARKET_AISLES[5]; // Laticínios
  }
  if (normCategory.includes('congelado') || normCategory.includes('sorvete')) {
    return SUPERMARKET_AISLES[6]; // Congelados
  }
  if (normCategory.includes('higiene') || normCategory.includes('perfumaria') || normCategory.includes('cuidado') || normCategory.includes('farmácia')) {
    return SUPERMARKET_AISLES[7]; // Higiene
  }
  if (normCategory.includes('limpeza') || normCategory.includes('lavanderia')) {
    return SUPERMARKET_AISLES[8]; // Limpeza
  }
  if (normCategory.includes('bazar') || normCategory.includes('pet') || normCategory.includes('utilidade')) {
    return SUPERMARKET_AISLES[9]; // Bazar
  }

  // 2. Busca por palavras-chave na ordem dos corredores
  for (const aisle of SUPERMARKET_AISLES) {
    if (aisle.order === 11) continue; // Pula diversos
    for (const kw of aisle.keywords) {
      if (textToScan.includes(kw)) {
        return aisle;
      }
    }
  }

  // 3. Fallback: Corredor 11 (Diversos)
  return SUPERMARKET_AISLES[10];
}

export interface AisleGroup {
  aisle: SupermarketAisle;
  items: ListItem[];
  pendingItems: ListItem[];
  completedItems: ListItem[];
  isFullyChecked: boolean;
}

/**
 * Agrupa os itens da lista por corredor e ordena na sequência física da rota de compras.
 */
export function groupItemsByAisles(items: ListItem[]): AisleGroup[] {
  const map = new Map<string, ListItem[]>();

  // Inicializa mapa apenas com os corredores
  for (const aisle of SUPERMARKET_AISLES) {
    map.set(aisle.id, []);
  }

  // Distribui os itens
  for (const item of items) {
    const aisle = getAisleForItem(item);
    const list = map.get(aisle.id) || [];
    list.push(item);
    map.set(aisle.id, list);
  }

  // Monta os grupos e filtra os corredores vazios
  const groups: AisleGroup[] = [];

  for (const aisle of SUPERMARKET_AISLES) {
    const aisleItems = map.get(aisle.id) || [];
    if (aisleItems.length > 0) {
      const pending = aisleItems.filter((it) => !it.checked);
      const completed = aisleItems.filter((it) => it.checked);
      groups.push({
        aisle,
        items: aisleItems,
        pendingItems: pending,
        completedItems: completed,
        isFullyChecked: pending.length === 0 && completed.length > 0,
      });
    }
  }

  return groups;
}

/**
 * Formata o texto de compartilhamento para WhatsApp agrupando ordenadamente pelos corredores do mercado.
 */
export function formatListByAisleForWhatsApp(
  items: ListItem[],
  marketName: string,
  totalValue: number,
  city?: string
): string {
  const groups = groupItemsByAisles(items);
  const nowStr = new Date().toLocaleDateString('pt-BR');

  let text = `🛒 *LIST.ME — ROTA DE COMPRAS NO MERCADO*\n`;
  text += `📍 *Melhor Opção:* ${marketName || 'Supermercado'} ${city ? `(${city})` : ''}\n`;
  text += `💰 *Total Estimado:* R$ ${totalValue.toFixed(2).replace('.', ',')} · ${nowStr}\n`;
  text += `✨ *Itens organizados na ordem exata dos corredores do mercado:*\n\n`;

  for (const group of groups) {
    text += `${group.aisle.emoji} *${group.aisle.corredorTitle.split(' · ')[0]} · ${group.aisle.name}*\n`;
    for (const item of group.items) {
      const checkMark = item.checked ? '✅' : '⬜';
      const priceStr = item.bestMarket?.price
        ? ` (R$ ${item.bestMarket.price.toFixed(2).replace('.', ',')})`
        : '';
      text += `${checkMark} ${item.quantity}${item.unit} ${item.matchedItem || item.name}${priceStr}\n`;
    }
    text += `\n`;
  }

  text += `👉 *Organizado com LIST.ME:* https://listmeapp.com.br`;
  return text;
}
