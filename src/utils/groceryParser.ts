export interface ParsedGroceryItem {
  name: string;
  matchedProduct: string;
  category: string;
  basePrice: number;
  unit: string;
  quantity: number;
}

interface GroceryCatalogEntry {
  canonical: string;
  matchedProduct: string;
  category: string;
  basePrice: number;
  unit: string;
}

const GROCERY_CATALOG: Record<string, GroceryCatalogEntry> = {
  // --- ARROZ & MARCAS ---
  'arroz tio joão': { canonical: 'Arroz Tio João', matchedProduct: 'Arroz Branco Nobre Tipo 1 Tio João 5kg', category: 'Mercearia', basePrice: 28.90, unit: 'pct' },
  'arroz tio joao': { canonical: 'Arroz Tio João', matchedProduct: 'Arroz Branco Nobre Tipo 1 Tio João 5kg', category: 'Mercearia', basePrice: 28.90, unit: 'pct' },
  'tio joão': { canonical: 'Arroz Tio João', matchedProduct: 'Arroz Branco Nobre Tipo 1 Tio João 5kg', category: 'Mercearia', basePrice: 28.90, unit: 'pct' },
  'tio joao': { canonical: 'Arroz Tio João', matchedProduct: 'Arroz Branco Nobre Tipo 1 Tio João 5kg', category: 'Mercearia', basePrice: 28.90, unit: 'pct' },
  'arroz camil': { canonical: 'Arroz Camil', matchedProduct: 'Arroz Branco Nobre Tipo 1 Camil 5kg', category: 'Mercearia', basePrice: 26.90, unit: 'pct' },
  'arroz prato fino': { canonical: 'Arroz Prato Fino', matchedProduct: 'Arroz Branco Nobre Tipo 1 Prato Fino 5kg', category: 'Mercearia', basePrice: 29.90, unit: 'pct' },
  'prato fino': { canonical: 'Arroz Prato Fino', matchedProduct: 'Arroz Branco Nobre Tipo 1 Prato Fino 5kg', category: 'Mercearia', basePrice: 29.90, unit: 'pct' },
  'arroz integral': { canonical: 'Arroz Integral', matchedProduct: 'Arroz Integral Tio João 1kg', category: 'Mercearia', basePrice: 8.90, unit: 'pct' },
  'arroz parboilizado': { canonical: 'Arroz Parboilizado', matchedProduct: 'Arroz Parboilizado Tio João 1kg', category: 'Mercearia', basePrice: 7.90, unit: 'pct' },
  'arroz': { canonical: 'Arroz', matchedProduct: 'Arroz Branco Nobre Tipo 1 5kg', category: 'Mercearia', basePrice: 25.90, unit: 'pct' },

  // --- FEIJÃO & MARCAS ---
  'feijão kicaldo': { canonical: 'Feijão Kicaldo', matchedProduct: 'Feijão Carioca Tipo 1 Kicaldo 1kg', category: 'Mercearia', basePrice: 8.49, unit: 'pct' },
  'feijao kicaldo': { canonical: 'Feijão Kicaldo', matchedProduct: 'Feijão Carioca Tipo 1 Kicaldo 1kg', category: 'Mercearia', basePrice: 8.49, unit: 'pct' },
  'kicaldo': { canonical: 'Feijão Kicaldo', matchedProduct: 'Feijão Carioca Tipo 1 Kicaldo 1kg', category: 'Mercearia', basePrice: 8.49, unit: 'pct' },
  'feijão camil': { canonical: 'Feijão Camil', matchedProduct: 'Feijão Carioca Camil 1kg', category: 'Mercearia', basePrice: 7.99, unit: 'pct' },
  'feijao camil': { canonical: 'Feijão Camil', matchedProduct: 'Feijão Carioca Camil 1kg', category: 'Mercearia', basePrice: 7.99, unit: 'pct' },
  'feijão preto': { canonical: 'Feijão Preto', matchedProduct: 'Feijão Preto Tipo 1 Kicaldo 1kg', category: 'Mercearia', basePrice: 8.29, unit: 'pct' },
  'feijao preto': { canonical: 'Feijão Preto', matchedProduct: 'Feijão Preto Tipo 1 Kicaldo 1kg', category: 'Mercearia', basePrice: 8.29, unit: 'pct' },
  'feijão carioca': { canonical: 'Feijão Carioca', matchedProduct: 'Feijão Carioca Tipo 1 1kg', category: 'Mercearia', basePrice: 7.89, unit: 'pct' },
  'feijao carioca': { canonical: 'Feijão Carioca', matchedProduct: 'Feijão Carioca Tipo 1 1kg', category: 'Mercearia', basePrice: 7.89, unit: 'pct' },
  'feijão': { canonical: 'Feijão', matchedProduct: 'Feijão Carioca Tipo 1 1kg', category: 'Mercearia', basePrice: 7.89, unit: 'pct' },
  'feijao': { canonical: 'Feijão', matchedProduct: 'Feijão Carioca Tipo 1 1kg', category: 'Mercearia', basePrice: 7.89, unit: 'pct' },

  // --- CAFÉ & MARCAS ---
  'café pilão': { canonical: 'Café Pilão', matchedProduct: 'Café Tradicional em Pó Pilão 500g', category: 'Mercearia', basePrice: 19.90, unit: 'pct' },
  'cafe pilao': { canonical: 'Café Pilão', matchedProduct: 'Café Tradicional em Pó Pilão 500g', category: 'Mercearia', basePrice: 19.90, unit: 'pct' },
  'pilão': { canonical: 'Café Pilão', matchedProduct: 'Café Tradicional em Pó Pilão 500g', category: 'Mercearia', basePrice: 19.90, unit: 'pct' },
  'pilao': { canonical: 'Café Pilão', matchedProduct: 'Café Tradicional em Pó Pilão 500g', category: 'Mercearia', basePrice: 19.90, unit: 'pct' },
  'café melitta': { canonical: 'Café Melitta', matchedProduct: 'Café Melitta Tradicional a Vácuo 500g', category: 'Mercearia', basePrice: 20.90, unit: 'pct' },
  'cafe melitta': { canonical: 'Café Melitta', matchedProduct: 'Café Melitta Tradicional a Vácuo 500g', category: 'Mercearia', basePrice: 20.90, unit: 'pct' },
  'melitta': { canonical: 'Café Melitta', matchedProduct: 'Café Melitta Tradicional a Vácuo 500g', category: 'Mercearia', basePrice: 20.90, unit: 'pct' },
  'café 3 corações': { canonical: 'Café 3 Corações', matchedProduct: 'Café Tradicional 3 Corações 500g', category: 'Mercearia', basePrice: 18.90, unit: 'pct' },
  'cafe 3 coracoes': { canonical: 'Café 3 Corações', matchedProduct: 'Café Tradicional 3 Corações 500g', category: 'Mercearia', basePrice: 18.90, unit: 'pct' },
  '3 corações': { canonical: 'Café 3 Corações', matchedProduct: 'Café Tradicional 3 Corações 500g', category: 'Mercearia', basePrice: 18.90, unit: 'pct' },
  'café nescafé': { canonical: 'Café Solúvel Nescafé', matchedProduct: 'Café Solúvel Nescafé Tradição 100g', category: 'Mercearia', basePrice: 14.90, unit: 'un' },
  'nescafé': { canonical: 'Café Solúvel Nescafé', matchedProduct: 'Café Solúvel Nescafé Tradição 100g', category: 'Mercearia', basePrice: 14.90, unit: 'un' },
  'nescafe': { canonical: 'Café Solúvel Nescafé', matchedProduct: 'Café Solúvel Nescafé Tradição 100g', category: 'Mercearia', basePrice: 14.90, unit: 'un' },
  'café': { canonical: 'Café', matchedProduct: 'Café Tradicional em Pó 500g', category: 'Mercearia', basePrice: 18.90, unit: 'pct' },
  'cafe': { canonical: 'Café', matchedProduct: 'Café Tradicional em Pó 500g', category: 'Mercearia', basePrice: 18.90, unit: 'pct' },

  // --- ÓLEO & AZEITE ---
  'azeite gallo': { canonical: 'Azeite Gallo', matchedProduct: 'Azeite de Oliva Extra Virgem Gallo 500ml', category: 'Mercearia', basePrice: 38.90, unit: 'un' },
  'gallo': { canonical: 'Azeite Gallo', matchedProduct: 'Azeite de Oliva Extra Virgem Gallo 500ml', category: 'Mercearia', basePrice: 38.90, unit: 'un' },
  'azeite andorinha': { canonical: 'Azeite Andorinha', matchedProduct: 'Azeite de Oliva Extra Virgem Andorinha 500ml', category: 'Mercearia', basePrice: 36.90, unit: 'un' },
  'andorinha': { canonical: 'Azeite Andorinha', matchedProduct: 'Azeite de Oliva Extra Virgem Andorinha 500ml', category: 'Mercearia', basePrice: 36.90, unit: 'un' },
  'azeite de oliva': { canonical: 'Azeite de Oliva', matchedProduct: 'Azeite de Oliva Extra Virgem 500ml', category: 'Mercearia', basePrice: 34.90, unit: 'un' },
  'azeite extra virgem': { canonical: 'Azeite Extra Virgem', matchedProduct: 'Azeite de Oliva Extra Virgem 500ml', category: 'Mercearia', basePrice: 34.90, unit: 'un' },
  'azeite': { canonical: 'Azeite', matchedProduct: 'Azeite de Oliva Extra Virgem 500ml', category: 'Mercearia', basePrice: 34.90, unit: 'un' },
  'óleo soya': { canonical: 'Óleo Soya', matchedProduct: 'Óleo de Soja Refinado Soya 900ml', category: 'Mercearia', basePrice: 6.89, unit: 'un' },
  'oleo soya': { canonical: 'Óleo Soya', matchedProduct: 'Óleo de Soja Refinado Soya 900ml', category: 'Mercearia', basePrice: 6.89, unit: 'un' },
  'soya': { canonical: 'Óleo Soya', matchedProduct: 'Óleo de Soja Refinado Soya 900ml', category: 'Mercearia', basePrice: 6.89, unit: 'un' },
  'óleo liza': { canonical: 'Óleo Liza', matchedProduct: 'Óleo de Soja Liza 900ml', category: 'Mercearia', basePrice: 7.19, unit: 'un' },
  'oleo liza': { canonical: 'Óleo Liza', matchedProduct: 'Óleo de Soja Liza 900ml', category: 'Mercearia', basePrice: 7.19, unit: 'un' },
  'óleo de soja': { canonical: 'Óleo de Soja', matchedProduct: 'Óleo de Soja Refinado 900ml', category: 'Mercearia', basePrice: 6.89, unit: 'un' },
  'oleo de soja': { canonical: 'Óleo de Soja', matchedProduct: 'Óleo de Soja Refinado 900ml', category: 'Mercearia', basePrice: 6.89, unit: 'un' },
  'óleo': { canonical: 'Óleo', matchedProduct: 'Óleo de Soja Refinado 900ml', category: 'Mercearia', basePrice: 6.89, unit: 'un' },
  'oleo': { canonical: 'Óleo', matchedProduct: 'Óleo de Soja Refinado 900ml', category: 'Mercearia', basePrice: 6.89, unit: 'un' },

  // --- AÇÚCAR & SAL ---
  'açúcar união': { canonical: 'Açúcar União', matchedProduct: 'Açúcar Refinado União 1kg', category: 'Mercearia', basePrice: 4.99, unit: 'pct' },
  'acucar uniao': { canonical: 'Açúcar União', matchedProduct: 'Açúcar Refinado União 1kg', category: 'Mercearia', basePrice: 4.99, unit: 'pct' },
  'união': { canonical: 'Açúcar União', matchedProduct: 'Açúcar Refinado União 1kg', category: 'Mercearia', basePrice: 4.99, unit: 'pct' },
  'açúcar refinado': { canonical: 'Açúcar Refinado', matchedProduct: 'Açúcar Refinado 1kg', category: 'Mercearia', basePrice: 4.89, unit: 'pct' },
  'açúcar cristal': { canonical: 'Açúcar Cristal', matchedProduct: 'Açúcar Cristal 1kg', category: 'Mercearia', basePrice: 4.29, unit: 'pct' },
  'açúcar': { canonical: 'Açúcar', matchedProduct: 'Açúcar Refinado 1kg', category: 'Mercearia', basePrice: 4.89, unit: 'pct' },
  'acucar': { canonical: 'Açúcar', matchedProduct: 'Açúcar Refinado 1kg', category: 'Mercearia', basePrice: 4.89, unit: 'pct' },
  'sal refinado': { canonical: 'Sal Refinado', matchedProduct: 'Sal Refinado Cisne 1kg', category: 'Mercearia', basePrice: 2.99, unit: 'pct' },
  'sal': { canonical: 'Sal', matchedProduct: 'Sal Refinado Cisne 1kg', category: 'Mercearia', basePrice: 2.99, unit: 'pct' },
  'sal grosso': { canonical: 'Sal Grosso', matchedProduct: 'Sal Grosso para Churrasco 1kg', category: 'Churrasco', basePrice: 4.50, unit: 'un' },

  // --- LEITE & LATICÍNIOS ---
  'leite ninho': { canonical: 'Leite Ninho', matchedProduct: 'Leite em Pó Integral Ninho Nestlé 380g', category: 'Laticínios', basePrice: 17.90, unit: 'un' },
  'ninho': { canonical: 'Leite Ninho', matchedProduct: 'Leite em Pó Integral Ninho Nestlé 380g', category: 'Laticínios', basePrice: 17.90, unit: 'un' },
  'leite moça': { canonical: 'Leite Condensado Moça', matchedProduct: 'Leite Condensado Moça Nestlé 395g', category: 'Laticínios', basePrice: 7.49, unit: 'un' },
  'leite moca': { canonical: 'Leite Condensado Moça', matchedProduct: 'Leite Condensado Moça Nestlé 395g', category: 'Laticínios', basePrice: 7.49, unit: 'un' },
  'moça': { canonical: 'Leite Condensado Moça', matchedProduct: 'Leite Condensado Moça Nestlé 395g', category: 'Laticínios', basePrice: 7.49, unit: 'un' },
  'moca': { canonical: 'Leite Condensado Moça', matchedProduct: 'Leite Condensado Moça Nestlé 395g', category: 'Laticínios', basePrice: 7.49, unit: 'un' },
  'leite condensado': { canonical: 'Leite Condensado', matchedProduct: 'Leite Condensado 395g', category: 'Laticínios', basePrice: 6.89, unit: 'un' },
  'creme de leite nestlé': { canonical: 'Creme de Leite Nestlé', matchedProduct: 'Creme de Leite Nestlé 200g', category: 'Laticínios', basePrice: 4.19, unit: 'un' },
  'creme de leite nestle': { canonical: 'Creme de Leite Nestlé', matchedProduct: 'Creme de Leite Nestlé 200g', category: 'Laticínios', basePrice: 4.19, unit: 'un' },
  'creme de leite': { canonical: 'Creme de Leite', matchedProduct: 'Creme de Leite 200g', category: 'Laticínios', basePrice: 3.79, unit: 'un' },
  'leite piracanjuba': { canonical: 'Leite Piracanjuba', matchedProduct: 'Leite UHT Integral Piracanjuba 1L', category: 'Laticínios', basePrice: 4.89, unit: 'un' },
  'leite italac': { canonical: 'Leite Italac', matchedProduct: 'Leite UHT Integral Italac 1L', category: 'Laticínios', basePrice: 4.69, unit: 'un' },
  'leite desnatado': { canonical: 'Leite Desnatado', matchedProduct: 'Leite UHT Desnatado 1L', category: 'Laticínios', basePrice: 4.89, unit: 'un' },
  'leite semidesnatado': { canonical: 'Leite Semidesnatado', matchedProduct: 'Leite UHT Semidesnatado 1L', category: 'Laticínios', basePrice: 4.89, unit: 'un' },
  'leite integral': { canonical: 'Leite Integral', matchedProduct: 'Leite UHT Integral 1L', category: 'Laticínios', basePrice: 4.79, unit: 'un' },
  'leite': { canonical: 'Leite Integral', matchedProduct: 'Leite UHT Integral 1L', category: 'Laticínios', basePrice: 4.79, unit: 'un' },
  'manteiga aviação': { canonical: 'Manteiga Aviação', matchedProduct: 'Manteiga com Sal Aviação 200g', category: 'Laticínios', basePrice: 13.90, unit: 'un' },
  'manteiga aviacao': { canonical: 'Manteiga Aviação', matchedProduct: 'Manteiga com Sal Aviação 200g', category: 'Laticínios', basePrice: 13.90, unit: 'un' },
  'manteiga': { canonical: 'Manteiga', matchedProduct: 'Manteiga com Sal 200g', category: 'Laticínios', basePrice: 12.90, unit: 'un' },
  'margarina qualy': { canonical: 'Margarina Qualy', matchedProduct: 'Margarina Qualy com Sal 500g', category: 'Laticínios', basePrice: 8.29, unit: 'un' },
  'qualy': { canonical: 'Margarina Qualy', matchedProduct: 'Margarina Qualy com Sal 500g', category: 'Laticínios', basePrice: 8.29, unit: 'un' },
  'margarina': { canonical: 'Margarina', matchedProduct: 'Margarina com Sal 500g', category: 'Laticínios', basePrice: 7.49, unit: 'un' },
  'requeijão': { canonical: 'Requeijão', matchedProduct: 'Requeijão Cremoso Tradicional 200g', category: 'Laticínios', basePrice: 8.90, unit: 'un' },
  'requeijao': { canonical: 'Requeijão', matchedProduct: 'Requeijão Cremoso Tradicional 200g', category: 'Laticínios', basePrice: 8.90, unit: 'un' },
  'queijo mussarela': { canonical: 'Queijo Mussarela', matchedProduct: 'Queijo Mussarela Fatiado 400g', category: 'Frios', basePrice: 18.90, unit: 'un' },
  'mussarela': { canonical: 'Queijo Mussarela', matchedProduct: 'Queijo Mussarela Fatiado 400g', category: 'Frios', basePrice: 18.90, unit: 'un' },
  'queijo prato': { canonical: 'Queijo Prato', matchedProduct: 'Queijo Prato Fatiado 400g', category: 'Frios', basePrice: 19.90, unit: 'un' },
  'queijo ralado': { canonical: 'Queijo Ralado', matchedProduct: 'Queijo Parmesão Ralado 50g', category: 'Mercearia', basePrice: 5.90, unit: 'un' },
  'parmesão': { canonical: 'Queijo Parmesão', matchedProduct: 'Queijo Parmesão Ralado 50g', category: 'Mercearia', basePrice: 5.90, unit: 'un' },
  'parmesao': { canonical: 'Queijo Parmesão', matchedProduct: 'Queijo Parmesão Ralado 50g', category: 'Mercearia', basePrice: 5.90, unit: 'un' },
  'queijo': { canonical: 'Queijo Mussarela', matchedProduct: 'Queijo Mussarela Fatiado 400g', category: 'Frios', basePrice: 18.90, unit: 'un' },
  'presunto sadia': { canonical: 'Presunto Sadia', matchedProduct: 'Presunto Cozido Fatiado Sadia 200g', category: 'Frios', basePrice: 8.90, unit: 'un' },
  'presunto': { canonical: 'Presunto', matchedProduct: 'Presunto Cozido Fatiado Sadia 200g', category: 'Frios', basePrice: 8.90, unit: 'un' },
  'iogurte': { canonical: 'Iogurte', matchedProduct: 'Iogurte Natural Danone 170g', category: 'Laticínios', basePrice: 3.99, unit: 'un' },

  // --- CARNES & CHURRASCO ---
  'picanha': { canonical: 'Picanha', matchedProduct: 'Picanha Bovina Peça a Vácuo 1kg', category: 'Açougue', basePrice: 69.90, unit: 'kg' },
  'alcatra': { canonical: 'Alcatra', matchedProduct: 'Alcatra Bovina com Maminha 1kg', category: 'Açougue', basePrice: 42.90, unit: 'kg' },
  'contra filé': { canonical: 'Contra Filé', matchedProduct: 'Contra Filé Bovino 1kg', category: 'Açougue', basePrice: 44.90, unit: 'kg' },
  'contra file': { canonical: 'Contra Filé', matchedProduct: 'Contra Filé Bovino 1kg', category: 'Açougue', basePrice: 44.90, unit: 'kg' },
  'patinho': { canonical: 'Carne Moída Patinho', matchedProduct: 'Carne Moída Bovina Patinho 1kg', category: 'Açougue', basePrice: 34.90, unit: 'kg' },
  'carne moída': { canonical: 'Carne Moída', matchedProduct: 'Carne Moída Bovina Patinho 1kg', category: 'Açougue', basePrice: 34.90, unit: 'kg' },
  'carne moida': { canonical: 'Carne Moída', matchedProduct: 'Carne Moída Bovina Patinho 1kg', category: 'Açougue', basePrice: 34.90, unit: 'kg' },
  'costela': { canonical: 'Costela Bovina', matchedProduct: 'Costela Bovina em Tiras 1kg', category: 'Açougue', basePrice: 28.90, unit: 'kg' },
  'carne': { canonical: 'Carne Bovina', matchedProduct: 'Carne Bovina em Cubos / Coxão Mole 1kg', category: 'Açougue', basePrice: 36.90, unit: 'kg' },
  'linguiça toscana': { canonical: 'Linguiça Toscana', matchedProduct: 'Linguiça Toscana Sadia para Churrasco 1kg', category: 'Açougue', basePrice: 21.90, unit: 'kg' },
  'linguica toscana': { canonical: 'Linguiça Toscana', matchedProduct: 'Linguiça Toscana Sadia para Churrasco 1kg', category: 'Açougue', basePrice: 21.90, unit: 'kg' },
  'linguiça': { canonical: 'Linguiça Toscana', matchedProduct: 'Linguiça Toscana Sadia para Churrasco 1kg', category: 'Açougue', basePrice: 21.90, unit: 'kg' },
  'linguica': { canonical: 'Linguiça Toscana', matchedProduct: 'Linguiça Toscana Sadia para Churrasco 1kg', category: 'Açougue', basePrice: 21.90, unit: 'kg' },
  'peito de frango': { canonical: 'Peito de Frango', matchedProduct: 'Filé de Peito de Frango Sadia 1kg', category: 'Açougue', basePrice: 19.50, unit: 'kg' },
  'filé de frango': { canonical: 'Filé de Frango', matchedProduct: 'Filé de Peito de Frango Sadia 1kg', category: 'Açougue', basePrice: 19.50, unit: 'kg' },
  'file de frango': { canonical: 'Filé de Frango', matchedProduct: 'Filé de Peito de Frango Sadia 1kg', category: 'Açougue', basePrice: 19.50, unit: 'kg' },
  'coxa e sobrecoxa': { canonical: 'Coxa e Sobrecoxa', matchedProduct: 'Coxa e Sobrecoxa de Frango 1kg', category: 'Açougue', basePrice: 13.90, unit: 'kg' },
  'frango': { canonical: 'Frango Inteiro', matchedProduct: 'Frango Resfriado Inteiro 1kg', category: 'Açougue', basePrice: 12.90, unit: 'kg' },
  'carvão': { canonical: 'Carvão', matchedProduct: 'Carvão Vegetal Especial para Churrasco 3kg', category: 'Churrasco', basePrice: 16.90, unit: 'pct' },
  'carvao': { canonical: 'Carvão', matchedProduct: 'Carvão Vegetal Especial para Churrasco 3kg', category: 'Churrasco', basePrice: 16.90, unit: 'pct' },
  'pão de alho santa massa': { canonical: 'Pão de Alho Santa Massa', matchedProduct: 'Pão de Alho Santa Massa Tradicional 400g', category: 'Churrasco', basePrice: 15.90, unit: 'pct' },
  'pao de alho santa massa': { canonical: 'Pão de Alho Santa Massa', matchedProduct: 'Pão de Alho Santa Massa Tradicional 400g', category: 'Churrasco', basePrice: 15.90, unit: 'pct' },
  'pão de alho': { canonical: 'Pão de Alho', matchedProduct: 'Pão de Alho Tradicional para Churrasco 400g', category: 'Churrasco', basePrice: 13.90, unit: 'pct' },
  'pao de alho': { canonical: 'Pão de Alho', matchedProduct: 'Pão de Alho Tradicional para Churrasco 400g', category: 'Churrasco', basePrice: 13.90, unit: 'pct' },
  'santa massa': { canonical: 'Pão de Alho Santa Massa', matchedProduct: 'Pão de Alho Santa Massa Tradicional 400g', category: 'Churrasco', basePrice: 15.90, unit: 'pct' },
  'maminha': { canonical: 'Maminha', matchedProduct: 'Maminha Bovina Resfriada Peça 1kg', category: 'Açougue', basePrice: 46.90, unit: 'kg' },
  'fraldinha': { canonical: 'Fraldinha', matchedProduct: 'Fraldinha Bovina para Churrasco 1kg', category: 'Açougue', basePrice: 39.90, unit: 'kg' },
  'cupim': { canonical: 'Cupim', matchedProduct: 'Cupim Bovino para Churrasco 1kg', category: 'Açougue', basePrice: 36.90, unit: 'kg' },
  'coração de frango': { canonical: 'Coração de Frango', matchedProduct: 'Coração de Frango Sadia 1kg', category: 'Açougue', basePrice: 26.90, unit: 'kg' },
  'coracao de frango': { canonical: 'Coração de Frango', matchedProduct: 'Coração de Frango Sadia 1kg', category: 'Açougue', basePrice: 26.90, unit: 'kg' },
  'bacon': { canonical: 'Bacon', matchedProduct: 'Bacon Manta Defumado Sadia 500g', category: 'Açougue', basePrice: 16.90, unit: 'un' },

  // --- LIMPEZA & HIGIENE ---
  'sabão omo': { canonical: 'Sabão em Pó OMO', matchedProduct: 'Sabão em Pó OMO Lavagem Perfeita 1.6kg', category: 'Limpeza', basePrice: 22.90, unit: 'pct' },
  'sabao omo': { canonical: 'Sabão em Pó OMO', matchedProduct: 'Sabão em Pó OMO Lavagem Perfeita 1.6kg', category: 'Limpeza', basePrice: 22.90, unit: 'pct' },
  'omo': { canonical: 'Sabão em Pó OMO', matchedProduct: 'Sabão em Pó OMO Lavagem Perfeita 1.6kg', category: 'Limpeza', basePrice: 22.90, unit: 'pct' },
  'sabão em pó': { canonical: 'Sabão em Pó', matchedProduct: 'Sabão em Pó OMO Lavagem Perfeita 1.6kg', category: 'Limpeza', basePrice: 21.90, unit: 'pct' },
  'sabao em po': { canonical: 'Sabão em Pó', matchedProduct: 'Sabão em Pó OMO Lavagem Perfeita 1.6kg', category: 'Limpeza', basePrice: 21.90, unit: 'pct' },
  'sabão líquido': { canonical: 'Sabão Líquido', matchedProduct: 'Sabão Líquido Ariel / OMO Concentrado 3L', category: 'Limpeza', basePrice: 38.90, unit: 'un' },
  'sabao liquido': { canonical: 'Sabão Líquido', matchedProduct: 'Sabão Líquido Ariel / OMO Concentrado 3L', category: 'Limpeza', basePrice: 38.90, unit: 'un' },
  'sabão ariel': { canonical: 'Sabão Ariel', matchedProduct: 'Sabão Líquido Ariel Concentrado 2L', category: 'Limpeza', basePrice: 38.90, unit: 'un' },
  'sabao ariel': { canonical: 'Sabão Ariel', matchedProduct: 'Sabão Líquido Ariel Concentrado 2L', category: 'Limpeza', basePrice: 38.90, unit: 'un' },
  'ariel': { canonical: 'Sabão Ariel', matchedProduct: 'Sabão Líquido Ariel Concentrado 2L', category: 'Limpeza', basePrice: 38.90, unit: 'un' },
  'detergente ypê': { canonical: 'Detergente Ypê', matchedProduct: 'Detergente Líquido Ypê 500ml', category: 'Limpeza', basePrice: 2.69, unit: 'un' },
  'detergente ype': { canonical: 'Detergente Ypê', matchedProduct: 'Detergente Líquido Ypê 500ml', category: 'Limpeza', basePrice: 2.69, unit: 'un' },
  'ypê': { canonical: 'Detergente Ypê', matchedProduct: 'Detergente Líquido Ypê 500ml', category: 'Limpeza', basePrice: 2.69, unit: 'un' },
  'ype': { canonical: 'Detergente Ypê', matchedProduct: 'Detergente Líquido Ypê 500ml', category: 'Limpeza', basePrice: 2.69, unit: 'un' },
  'detergente limpol': { canonical: 'Detergente Limpol', matchedProduct: 'Detergente Líquido Limpol 500ml', category: 'Limpeza', basePrice: 2.49, unit: 'un' },
  'limpol': { canonical: 'Detergente Limpol', matchedProduct: 'Detergente Líquido Limpol 500ml', category: 'Limpeza', basePrice: 2.49, unit: 'un' },
  'detergente': { canonical: 'Detergente', matchedProduct: 'Detergente Líquido Ypê 500ml', category: 'Limpeza', basePrice: 2.59, unit: 'un' },
  'amaciante downy': { canonical: 'Amaciante Downy', matchedProduct: 'Amaciante Concentrado Downy Brisa de Verão 1L', category: 'Limpeza', basePrice: 17.90, unit: 'un' },
  'downy': { canonical: 'Amaciante Downy', matchedProduct: 'Amaciante Concentrado Downy Brisa de Verão 1L', category: 'Limpeza', basePrice: 17.90, unit: 'un' },
  'amaciante comfort': { canonical: 'Amaciante Comfort', matchedProduct: 'Amaciante Concentrado Comfort 1L', category: 'Limpeza', basePrice: 16.90, unit: 'un' },
  'comfort': { canonical: 'Amaciante Comfort', matchedProduct: 'Amaciante Concentrado Comfort 1L', category: 'Limpeza', basePrice: 16.90, unit: 'un' },
  'amaciante ypê': { canonical: 'Amaciante Ypê', matchedProduct: 'Amaciante Ypê Aconchego 2L', category: 'Limpeza', basePrice: 12.90, unit: 'un' },
  'amaciante ype': { canonical: 'Amaciante Ypê', matchedProduct: 'Amaciante Ypê Aconchego 2L', category: 'Limpeza', basePrice: 12.90, unit: 'un' },
  'amaciante': { canonical: 'Amaciante', matchedProduct: 'Amaciante Concentrado 1L', category: 'Limpeza', basePrice: 14.90, unit: 'un' },
  'água sanitária q-boa': { canonical: 'Água Sanitária Q-Boa', matchedProduct: 'Água Sanitária Q-Boa 2L', category: 'Limpeza', basePrice: 7.90, unit: 'un' },
  'agua sanitaria q-boa': { canonical: 'Água Sanitária Q-Boa', matchedProduct: 'Água Sanitária Q-Boa 2L', category: 'Limpeza', basePrice: 7.90, unit: 'un' },
  'q-boa': { canonical: 'Água Sanitária Q-Boa', matchedProduct: 'Água Sanitária Q-Boa 2L', category: 'Limpeza', basePrice: 7.90, unit: 'un' },
  'qboa': { canonical: 'Água Sanitária Q-Boa', matchedProduct: 'Água Sanitária Q-Boa 2L', category: 'Limpeza', basePrice: 7.90, unit: 'un' },
  'água sanitária': { canonical: 'Água Sanitária', matchedProduct: 'Água Sanitária Q-Boa 2L', category: 'Limpeza', basePrice: 7.50, unit: 'un' },
  'agua sanitaria': { canonical: 'Água Sanitária', matchedProduct: 'Água Sanitária Q-Boa 2L', category: 'Limpeza', basePrice: 7.50, unit: 'un' },
  'desinfetante pinho sol': { canonical: 'Desinfetante Pinho Sol', matchedProduct: 'Desinfetante Pinho Sol Original 1L', category: 'Limpeza', basePrice: 9.90, unit: 'un' },
  'pinho sol': { canonical: 'Desinfetante Pinho Sol', matchedProduct: 'Desinfetante Pinho Sol Original 1L', category: 'Limpeza', basePrice: 9.90, unit: 'un' },
  'desinfetante veja': { canonical: 'Veja Multiuso', matchedProduct: 'Limpador Multiuso Veja Original 500ml', category: 'Limpeza', basePrice: 5.89, unit: 'un' },
  'veja': { canonical: 'Veja Multiuso', matchedProduct: 'Limpador Multiuso Veja Original 500ml', category: 'Limpeza', basePrice: 5.89, unit: 'un' },
  'desinfetante': { canonical: 'Desinfetante', matchedProduct: 'Desinfetante Pinho Sol 1L', category: 'Limpeza', basePrice: 9.90, unit: 'un' },
  'papel higiênico neve': { canonical: 'Papel Higiênico Neve', matchedProduct: 'Papel Higiênico Folha Dupla Neve 12 Rolos', category: 'Higiene', basePrice: 22.90, unit: 'pct' },
  'papel higienico neve': { canonical: 'Papel Higiênico Neve', matchedProduct: 'Papel Higiênico Folha Dupla Neve 12 Rolos', category: 'Higiene', basePrice: 22.90, unit: 'pct' },
  'neve': { canonical: 'Papel Higiênico Neve', matchedProduct: 'Papel Higiênico Folha Dupla Neve 12 Rolos', category: 'Higiene', basePrice: 22.90, unit: 'pct' },
  'papel higiênico': { canonical: 'Papel Higiênico', matchedProduct: 'Papel Higiênico Folha Dupla 12 Rolos', category: 'Higiene', basePrice: 19.90, unit: 'pct' },
  'papel higienico': { canonical: 'Papel Higiênico', matchedProduct: 'Papel Higiênico Folha Dupla 12 Rolos', category: 'Higiene', basePrice: 19.90, unit: 'pct' },
  'pasta de dente colgate': { canonical: 'Pasta de Dente Colgate', matchedProduct: 'Creme Dental Colgate Total 12 90g', category: 'Higiene', basePrice: 6.90, unit: 'un' },
  'creme dental colgate': { canonical: 'Pasta de Dente Colgate', matchedProduct: 'Creme Dental Colgate Total 12 90g', category: 'Higiene', basePrice: 6.90, unit: 'un' },
  'colgate': { canonical: 'Pasta de Dente Colgate', matchedProduct: 'Creme Dental Colgate Total 12 90g', category: 'Higiene', basePrice: 6.90, unit: 'un' },
  'pasta de dente': { canonical: 'Pasta de Dente', matchedProduct: 'Creme Dental Colgate Total 12 90g', category: 'Higiene', basePrice: 5.90, unit: 'un' },
  'creme dental': { canonical: 'Pasta de Dente', matchedProduct: 'Creme Dental Colgate Total 12 90g', category: 'Higiene', basePrice: 5.90, unit: 'un' },
  'sabonete dove': { canonical: 'Sabonete Dove', matchedProduct: 'Sabonete em Barra Dove 90g', category: 'Higiene', basePrice: 4.29, unit: 'un' },
  'dove': { canonical: 'Sabonete Dove', matchedProduct: 'Sabonete em Barra Dove 90g', category: 'Higiene', basePrice: 4.29, unit: 'un' },
  'sabonete': { canonical: 'Sabonete', matchedProduct: 'Sabonete em Barra 90g', category: 'Higiene', basePrice: 3.29, unit: 'un' },
  'shampoo pantene': { canonical: 'Shampoo Pantene', matchedProduct: 'Shampoo Pantene Restauração 400ml', category: 'Higiene', basePrice: 19.90, unit: 'un' },
  'pantene': { canonical: 'Shampoo Pantene', matchedProduct: 'Shampoo Pantene Restauração 400ml', category: 'Higiene', basePrice: 19.90, unit: 'un' },
  'shampoo seda': { canonical: 'Shampoo Seda', matchedProduct: 'Shampoo Seda Ceramidas 325ml', category: 'Higiene', basePrice: 12.90, unit: 'un' },
  'seda': { canonical: 'Shampoo Seda', matchedProduct: 'Shampoo Seda Ceramidas 325ml', category: 'Higiene', basePrice: 12.90, unit: 'un' },
  'shampoo': { canonical: 'Shampoo', matchedProduct: 'Shampoo Neutro 350ml', category: 'Higiene', basePrice: 14.90, unit: 'un' },
  'desodorante rexona': { canonical: 'Desodorante Rexona', matchedProduct: 'Desodorante Antitranspirante Rexona Aerosol 150ml', category: 'Higiene', basePrice: 14.90, unit: 'un' },
  'rexona': { canonical: 'Desodorante Rexona', matchedProduct: 'Desodorante Antitranspirante Rexona Aerosol 150ml', category: 'Higiene', basePrice: 14.90, unit: 'un' },
  'desodorante': { canonical: 'Desodorante', matchedProduct: 'Desodorante Antitranspirante Aerosol 150ml', category: 'Higiene', basePrice: 13.90, unit: 'un' },
  'fralda pampers': { canonical: 'Fralda Pampers', matchedProduct: 'Fralda Pampers Confort Sec Mega', category: 'Higiene', basePrice: 64.90, unit: 'pct' },
  'pampers': { canonical: 'Fralda Pampers', matchedProduct: 'Fralda Pampers Confort Sec Mega', category: 'Higiene', basePrice: 64.90, unit: 'pct' },
  'fralda': { canonical: 'Fralda Descartável', matchedProduct: 'Fralda Descartável Pacote Prático', category: 'Higiene', basePrice: 49.90, unit: 'pct' },
  'bombril': { canonical: 'Lã de Aço Bombril', matchedProduct: 'Lã de Aço Bombril Pacote com 8 un', category: 'Limpeza', basePrice: 4.29, unit: 'pct' },

  // --- BEBIDAS ---
  'refrigerante': { canonical: 'Refrigerante', matchedProduct: 'Refrigerante 2L Sabores', category: 'Bebidas', basePrice: 8.90, unit: 'un' },
  'coca cola 2l': { canonical: 'Coca-Cola 2L', matchedProduct: 'Refrigerante Coca-Cola Original 2L', category: 'Bebidas', basePrice: 9.99, unit: 'un' },
  'coca cola': { canonical: 'Coca-Cola', matchedProduct: 'Refrigerante Coca-Cola Original 2L', category: 'Bebidas', basePrice: 9.99, unit: 'un' },
  'coca-cola': { canonical: 'Coca-Cola', matchedProduct: 'Refrigerante Coca-Cola Original 2L', category: 'Bebidas', basePrice: 9.99, unit: 'un' },
  'coca': { canonical: 'Coca-Cola', matchedProduct: 'Refrigerante Coca-Cola Original 2L', category: 'Bebidas', basePrice: 9.99, unit: 'un' },
  'guaraná antarctica': { canonical: 'Guaraná Antarctica', matchedProduct: 'Refrigerante Guaraná Antarctica 2L', category: 'Bebidas', basePrice: 8.99, unit: 'un' },
  'guarana antarctica': { canonical: 'Guaraná Antarctica', matchedProduct: 'Refrigerante Guaraná Antarctica 2L', category: 'Bebidas', basePrice: 8.99, unit: 'un' },
  'guaraná': { canonical: 'Guaraná Antarctica', matchedProduct: 'Refrigerante Guaraná Antarctica 2L', category: 'Bebidas', basePrice: 8.99, unit: 'un' },
  'guarana': { canonical: 'Guaraná Antarctica', matchedProduct: 'Refrigerante Guaraná Antarctica 2L', category: 'Bebidas', basePrice: 8.99, unit: 'un' },
  'fanta': { canonical: 'Refrigerante Fanta', matchedProduct: 'Refrigerante Fanta Laranja 2L', category: 'Bebidas', basePrice: 8.49, unit: 'un' },
  'sprite': { canonical: 'Refrigerante Sprite', matchedProduct: 'Refrigerante Sprite Original 2L', category: 'Bebidas', basePrice: 8.49, unit: 'un' },
  'pepsi': { canonical: 'Refrigerante Pepsi', matchedProduct: 'Refrigerante Pepsi 2L', category: 'Bebidas', basePrice: 7.99, unit: 'un' },
  'cerveja heineken': { canonical: 'Cerveja Heineken', matchedProduct: 'Cerveja Heineken Puro Malte Long Neck 330ml (Pack 6)', category: 'Bebidas', basePrice: 29.90, unit: 'pct' },
  'heineken': { canonical: 'Cerveja Heineken', matchedProduct: 'Cerveja Heineken Puro Malte Long Neck 330ml (Pack 6)', category: 'Bebidas', basePrice: 29.90, unit: 'pct' },
  'cerveja amstel': { canonical: 'Cerveja Amstel', matchedProduct: 'Cerveja Amstel Puro Malte Lata 350ml (Pack 12)', category: 'Bebidas', basePrice: 34.90, unit: 'pct' },
  'amstel': { canonical: 'Cerveja Amstel', matchedProduct: 'Cerveja Amstel Puro Malte Lata 350ml (Pack 12)', category: 'Bebidas', basePrice: 34.90, unit: 'pct' },
  'cerveja brahma': { canonical: 'Cerveja Brahma', matchedProduct: 'Cerveja Brahma Duplo Malte Lata 350ml (Pack 12)', category: 'Bebidas', basePrice: 33.90, unit: 'pct' },
  'brahma': { canonical: 'Cerveja Brahma', matchedProduct: 'Cerveja Brahma Duplo Malte Lata 350ml (Pack 12)', category: 'Bebidas', basePrice: 33.90, unit: 'pct' },
  'cerveja spaten': { canonical: 'Cerveja Spaten', matchedProduct: 'Cerveja Spaten Puro Malte Lata 350ml (Pack 12)', category: 'Bebidas', basePrice: 36.90, unit: 'pct' },
  'spaten': { canonical: 'Cerveja Spaten', matchedProduct: 'Cerveja Spaten Puro Malte Lata 350ml (Pack 12)', category: 'Bebidas', basePrice: 36.90, unit: 'pct' },
  'cerveja stella': { canonical: 'Cerveja Stella Artois', matchedProduct: 'Cerveja Stella Artois Long Neck 330ml (Pack 6)', category: 'Bebidas', basePrice: 31.90, unit: 'pct' },
  'stella artois': { canonical: 'Cerveja Stella Artois', matchedProduct: 'Cerveja Stella Artois Long Neck 330ml (Pack 6)', category: 'Bebidas', basePrice: 31.90, unit: 'pct' },
  'stella': { canonical: 'Cerveja Stella Artois', matchedProduct: 'Cerveja Stella Artois Long Neck 330ml (Pack 6)', category: 'Bebidas', basePrice: 31.90, unit: 'pct' },
  'cerveja corona': { canonical: 'Cerveja Corona', matchedProduct: 'Cerveja Corona Extra Long Neck 330ml (Pack 6)', category: 'Bebidas', basePrice: 32.90, unit: 'pct' },
  'corona': { canonical: 'Cerveja Corona', matchedProduct: 'Cerveja Corona Extra Long Neck 330ml (Pack 6)', category: 'Bebidas', basePrice: 32.90, unit: 'pct' },
  'cerveja': { canonical: 'Cerveja', matchedProduct: 'Cerveja Pilsen Lata 350ml (Pack)', category: 'Bebidas', basePrice: 28.90, unit: 'pct' },
  'suco de uva': { canonical: 'Suco de Uva', matchedProduct: 'Suco Integral de Uva Campo Largo 1,5L', category: 'Bebidas', basePrice: 14.90, unit: 'un' },
  'suco integral': { canonical: 'Suco de Uva Integral', matchedProduct: 'Suco Integral de Uva Campo Largo 1,5L', category: 'Bebidas', basePrice: 14.90, unit: 'un' },
  'suco': { canonical: 'Suco', matchedProduct: 'Suco Integral 1L', category: 'Bebidas', basePrice: 9.90, unit: 'un' },
  'água mineral': { canonical: 'Água Mineral', matchedProduct: 'Água Mineral sem Gás 1,5L', category: 'Bebidas', basePrice: 3.29, unit: 'un' },
  'agua mineral': { canonical: 'Água Mineral', matchedProduct: 'Água Mineral sem Gás 1,5L', category: 'Bebidas', basePrice: 3.29, unit: 'un' },
  'água': { canonical: 'Água Mineral', matchedProduct: 'Água Mineral sem Gás 1,5L', category: 'Bebidas', basePrice: 3.29, unit: 'un' },
  'agua': { canonical: 'Água Mineral', matchedProduct: 'Água Mineral sem Gás 1,5L', category: 'Bebidas', basePrice: 3.29, unit: 'un' },
  'vinho': { canonical: 'Vinho', matchedProduct: 'Vinho Tinto de Mesa Fino 750ml', category: 'Bebidas', basePrice: 39.90, unit: 'un' },

  // --- HORTIFRÚTI ---
  'batata': { canonical: 'Batata', matchedProduct: 'Batata Branca Lavada Especial 1kg', category: 'Hortifrúti', basePrice: 5.99, unit: 'kg' },
  'cebola': { canonical: 'Cebola', matchedProduct: 'Cebola Nacional Selecionada 1kg', category: 'Hortifrúti', basePrice: 4.89, unit: 'kg' },
  'cebolas': { canonical: 'Cebola', matchedProduct: 'Cebola Nacional Selecionada 1kg', category: 'Hortifrúti', basePrice: 4.89, unit: 'kg' },
  'tomate': { canonical: 'Tomate', matchedProduct: 'Tomate Longa Vida Vermelho 1kg', category: 'Hortifrúti', basePrice: 7.99, unit: 'kg' },
  'tomates': { canonical: 'Tomate', matchedProduct: 'Tomate Longa Vida Vermelho 1kg', category: 'Hortifrúti', basePrice: 7.99, unit: 'kg' },
  'alho': { canonical: 'Alho', matchedProduct: 'Alho Roxo Nacional Pacote 200g', category: 'Hortifrúti', basePrice: 6.90, unit: 'pct' },
  'banana prata': { canonical: 'Banana Prata', matchedProduct: 'Banana Prata Selecionada 1kg', category: 'Hortifrúti', basePrice: 6.49, unit: 'kg' },
  'banana': { canonical: 'Banana', matchedProduct: 'Banana Prata Selecionada 1kg', category: 'Hortifrúti', basePrice: 6.49, unit: 'kg' },
  'bananas': { canonical: 'Banana', matchedProduct: 'Banana Prata Selecionada 1kg', category: 'Hortifrúti', basePrice: 6.49, unit: 'kg' },
  'maçã': { canonical: 'Maçã', matchedProduct: 'Maçã Fuji Nacional 1kg', category: 'Hortifrúti', basePrice: 8.90, unit: 'kg' },
  'maca': { canonical: 'Maçã', matchedProduct: 'Maçã Fuji Nacional 1kg', category: 'Hortifrúti', basePrice: 8.90, unit: 'kg' },
  'maçãs': { canonical: 'Maçã', matchedProduct: 'Maçã Fuji Nacional 1kg', category: 'Hortifrúti', basePrice: 8.90, unit: 'kg' },
  'macas': { canonical: 'Maçã', matchedProduct: 'Maçã Fuji Nacional 1kg', category: 'Hortifrúti', basePrice: 8.90, unit: 'kg' },
  'laranja': { canonical: 'Laranja', matchedProduct: 'Laranja Pêra para Suco 1kg', category: 'Hortifrúti', basePrice: 4.90, unit: 'kg' },
  'laranjas': { canonical: 'Laranja', matchedProduct: 'Laranja Pêra para Suco 1kg', category: 'Hortifrúti', basePrice: 4.90, unit: 'kg' },
  'limão': { canonical: 'Limão', matchedProduct: 'Limão Taiti Fresco 1kg', category: 'Hortifrúti', basePrice: 5.50, unit: 'kg' },
  'limao': { canonical: 'Limão', matchedProduct: 'Limão Taiti Fresco 1kg', category: 'Hortifrúti', basePrice: 5.50, unit: 'kg' },
  'limões': { canonical: 'Limão', matchedProduct: 'Limão Taiti Fresco 1kg', category: 'Hortifrúti', basePrice: 5.50, unit: 'kg' },
  'limoes': { canonical: 'Limão', matchedProduct: 'Limão Taiti Fresco 1kg', category: 'Hortifrúti', basePrice: 5.50, unit: 'kg' },
  'alface': { canonical: 'Alface', matchedProduct: 'Alface Crespa Hidropônica Maço', category: 'Hortifrúti', basePrice: 3.50, unit: 'un' },
  '30 ovos': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'cartela de 30 ovos': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'bandeja de 30 ovos': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'cartela de ovos 30': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'bandeja de ovos 30': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'cartela 30 ovos': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'bandeja 30 ovos': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'cartela de ovos': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  'bandeja de ovos': { canonical: 'Ovos (Bandeja 30 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 30 un', category: 'Hortifrúti', basePrice: 18.90, unit: 'bandeja' },
  '20 ovos': { canonical: 'Ovos (Bandeja 20 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 20 un', category: 'Hortifrúti', basePrice: 14.50, unit: 'bandeja' },
  'cartela de 20 ovos': { canonical: 'Ovos (Bandeja 20 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 20 un', category: 'Hortifrúti', basePrice: 14.50, unit: 'bandeja' },
  'bandeja de 20 ovos': { canonical: 'Ovos (Bandeja 20 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 20 un', category: 'Hortifrúti', basePrice: 14.50, unit: 'bandeja' },
  'bandeja 20 ovos': { canonical: 'Ovos (Bandeja 20 un)', matchedProduct: 'Ovos Brancos Grandes Bandeja 20 un', category: 'Hortifrúti', basePrice: 14.50, unit: 'bandeja' },
  '16 ovos': { canonical: 'Ovos (16 un)', matchedProduct: 'Ovos Brancos Embalagem 16 un', category: 'Hortifrúti', basePrice: 12.90, unit: 'bandeja' },
  'bandeja de 16 ovos': { canonical: 'Ovos (16 un)', matchedProduct: 'Ovos Brancos Embalagem 16 un', category: 'Hortifrúti', basePrice: 12.90, unit: 'bandeja' },
  '12 ovos': { canonical: 'Ovos (Dúzia 12 un)', matchedProduct: 'Ovos Brancos Grandes Estojo 12 un', category: 'Hortifrúti', basePrice: 10.90, unit: 'dz' },
  'bandeja de 12 ovos': { canonical: 'Ovos (Dúzia 12 un)', matchedProduct: 'Ovos Brancos Grandes Estojo 12 un', category: 'Hortifrúti', basePrice: 10.90, unit: 'dz' },
  'estojo de 12 ovos': { canonical: 'Ovos (Dúzia 12 un)', matchedProduct: 'Ovos Brancos Grandes Estojo 12 un', category: 'Hortifrúti', basePrice: 10.90, unit: 'dz' },
  'dúzia de ovos': { canonical: 'Ovos (Dúzia 12 un)', matchedProduct: 'Ovos Brancos Grandes Estojo 12 un', category: 'Hortifrúti', basePrice: 10.90, unit: 'dz' },
  'duzia de ovos': { canonical: 'Ovos (Dúzia 12 un)', matchedProduct: 'Ovos Brancos Grandes Estojo 12 un', category: 'Hortifrúti', basePrice: 10.90, unit: 'dz' },
  '6 ovos': { canonical: 'Ovos (Meia Dúzia 6 un)', matchedProduct: 'Ovos Brancos Estojo 6 un', category: 'Hortifrúti', basePrice: 5.90, unit: 'estojo' },
  'estojo de 6 ovos': { canonical: 'Ovos (Meia Dúzia 6 un)', matchedProduct: 'Ovos Brancos Estojo 6 un', category: 'Hortifrúti', basePrice: 5.90, unit: 'estojo' },
  'meia dúzia de ovos': { canonical: 'Ovos (Meia Dúzia 6 un)', matchedProduct: 'Ovos Brancos Estojo 6 un', category: 'Hortifrúti', basePrice: 5.90, unit: 'estojo' },
  'meia duzia de ovos': { canonical: 'Ovos (Meia Dúzia 6 un)', matchedProduct: 'Ovos Brancos Estojo 6 un', category: 'Hortifrúti', basePrice: 5.90, unit: 'estojo' },
  'meia dúzia': { canonical: 'Ovos (Meia Dúzia 6 un)', matchedProduct: 'Ovos Brancos Estojo 6 un', category: 'Hortifrúti', basePrice: 5.90, unit: 'estojo' },
  'meia duzia': { canonical: 'Ovos (Meia Dúzia 6 un)', matchedProduct: 'Ovos Brancos Estojo 6 un', category: 'Hortifrúti', basePrice: 5.90, unit: 'estojo' },
  'ovos': { canonical: 'Ovos (Dúzia 12 un)', matchedProduct: 'Ovos Brancos Grandes 12 un', category: 'Hortifrúti', basePrice: 10.90, unit: 'dz' },
  'ovo': { canonical: 'Ovos (Dúzia 12 un)', matchedProduct: 'Ovos Brancos Grandes 12 un', category: 'Hortifrúti', basePrice: 10.90, unit: 'dz' },

  // --- MERCEARIA, PADARIA & DOCES ---
  'macarrão espaguete': { canonical: 'Macarrão Espaguete', matchedProduct: 'Macarrão Espaguete com Ovos Barilla 500g', category: 'Mercearia', basePrice: 5.49, unit: 'pct' },
  'macarrao espaguete': { canonical: 'Macarrão Espaguete', matchedProduct: 'Macarrão Espaguete com Ovos Barilla 500g', category: 'Mercearia', basePrice: 5.49, unit: 'pct' },
  'macarrão': { canonical: 'Macarrão', matchedProduct: 'Macarrão Espaguete com Ovos 500g', category: 'Mercearia', basePrice: 4.99, unit: 'pct' },
  'macarrao': { canonical: 'Macarrão', matchedProduct: 'Macarrão Espaguete com Ovos 500g', category: 'Mercearia', basePrice: 4.99, unit: 'pct' },
  'molho de tomate': { canonical: 'Molho de Tomate', matchedProduct: 'Molho de Tomate Tradicional Pomarola 300g', category: 'Mercearia', basePrice: 3.49, unit: 'un' },
  'extrato de tomate': { canonical: 'Extrato de Tomate', matchedProduct: 'Extrato de Tomate Elefante 340g', category: 'Mercearia', basePrice: 4.90, unit: 'un' },
  'farinha de trigo dona benta': { canonical: 'Farinha de Trigo Dona Benta', matchedProduct: 'Farinha de Trigo Dona Benta Tipo 1 1kg', category: 'Mercearia', basePrice: 5.69, unit: 'pct' },
  'farinha de trigo': { canonical: 'Farinha de Trigo', matchedProduct: 'Farinha de Trigo Especial Tipo 1 1kg', category: 'Mercearia', basePrice: 5.49, unit: 'pct' },
  'pão de forma': { canonical: 'Pão de Forma', matchedProduct: 'Pão de Forma Tradicional 500g', category: 'Padaria', basePrice: 7.90, unit: 'pct' },
  'pao de forma': { canonical: 'Pão de Forma', matchedProduct: 'Pão de Forma Tradicional 500g', category: 'Padaria', basePrice: 7.90, unit: 'pct' },
  'pão francês': { canonical: 'Pão Francês', matchedProduct: 'Pão Francês Fresquinho 1kg', category: 'Padaria', basePrice: 14.90, unit: 'kg' },
  'pao frances': { canonical: 'Pão Francês', matchedProduct: 'Pão Francês Fresquinho 1kg', category: 'Padaria', basePrice: 14.90, unit: 'kg' },
  'pão': { canonical: 'Pão Francês', matchedProduct: 'Pão Francês Fresquinho 1kg', category: 'Padaria', basePrice: 14.90, unit: 'kg' },
  'pao': { canonical: 'Pão Francês', matchedProduct: 'Pão Francês Fresquinho 1kg', category: 'Padaria', basePrice: 14.90, unit: 'kg' },
  'bolacha recheada': { canonical: 'Bolacha Recheada', matchedProduct: 'Biscoito Recheado Chocolate Bono/Oreo 140g', category: 'Mercearia', basePrice: 4.29, unit: 'un' },
  'biscoito recheado': { canonical: 'Biscoito Recheado', matchedProduct: 'Biscoito Recheado Passatempo 130g', category: 'Mercearia', basePrice: 3.99, unit: 'un' },
  'bolacha': { canonical: 'Bolacha Cream Cracker', matchedProduct: 'Biscoito Cream Cracker 400g', category: 'Mercearia', basePrice: 5.49, unit: 'un' },
  'biscoito': { canonical: 'Biscoito Cream Cracker', matchedProduct: 'Biscoito Cream Cracker 400g', category: 'Mercearia', basePrice: 5.49, unit: 'un' },
  'bolo': { canonical: 'Bolo', matchedProduct: 'Bolo Tradicional Caseiro 400g', category: 'Padaria', basePrice: 12.90, unit: 'un' },
  'mistura para bolo': { canonical: 'Mistura para Bolo', matchedProduct: 'Mistura para Bolo Dona Benta 450g', category: 'Mercearia', basePrice: 5.99, unit: 'pct' },
  'mistura de bolo': { canonical: 'Mistura para Bolo', matchedProduct: 'Mistura para Bolo Dona Benta 450g', category: 'Mercearia', basePrice: 5.99, unit: 'pct' },
  'chocolate': { canonical: 'Barra de Chocolate', matchedProduct: 'Barra de Chocolate Nestlé/Lacta 80g', category: 'Doces', basePrice: 6.99, unit: 'un' },
  'fermento': { canonical: 'Fermento em Pó', matchedProduct: 'Fermento em Pó Químico Royal 100g', category: 'Mercearia', basePrice: 4.50, unit: 'un' },
  'fubá': { canonical: 'Fubá', matchedProduct: 'Fubá Mimoso Yoki 500g', category: 'Mercearia', basePrice: 3.49, unit: 'pct' },
  'fuba': { canonical: 'Fubá', matchedProduct: 'Fubá Mimoso Yoki 500g', category: 'Mercearia', basePrice: 3.49, unit: 'pct' },
  'maizena': { canonical: 'Amido de Milho Maizena', matchedProduct: 'Amido de Milho Maizena 200g', category: 'Mercearia', basePrice: 4.99, unit: 'cx' },
  'amido de milho': { canonical: 'Amido de Milho', matchedProduct: 'Amido de Milho Maizena 200g', category: 'Mercearia', basePrice: 4.99, unit: 'cx' },
  'vinagre': { canonical: 'Vinagre', matchedProduct: 'Vinagre de Álcool Castelo 750ml', category: 'Mercearia', basePrice: 2.49, unit: 'un' },
  'maionese': { canonical: 'Maionese', matchedProduct: 'Maionese Tradicional Hellmanns 500g', category: 'Mercearia', basePrice: 8.90, unit: 'un' },
  'ketchup': { canonical: 'Ketchup', matchedProduct: 'Ketchup Tradicional Heinz 397g', category: 'Mercearia', basePrice: 11.90, unit: 'un' },
  'mostarda': { canonical: 'Mostarda', matchedProduct: 'Mostarda Amarela Heinz 255g', category: 'Mercearia', basePrice: 9.90, unit: 'un' },
  'milho': { canonical: 'Milho Verde', matchedProduct: 'Milho Verde em Conserva Quero 170g', category: 'Mercearia', basePrice: 3.79, unit: 'lata' },
  'ervilha': { canonical: 'Ervilha', matchedProduct: 'Ervilha em Conserva Quero 170g', category: 'Mercearia', basePrice: 3.79, unit: 'lata' },
  'atum': { canonical: 'Atum Ralado', matchedProduct: 'Atum Ralado em Óleo Coqueiro 170g', category: 'Mercearia', basePrice: 7.90, unit: 'lata' },
  'sardinha': { canonical: 'Sardinha em Óleo', matchedProduct: 'Sardinha em Óleo Coqueiro 125g', category: 'Mercearia', basePrice: 4.99, unit: 'lata' },
  'palmito': { canonical: 'Palmito', matchedProduct: 'Palmito Pupunha Picado 300g', category: 'Mercearia', basePrice: 16.90, unit: 'un' },
  'salsicha': { canonical: 'Salsicha', matchedProduct: 'Salsicha Hot Dog Perdigão 1kg', category: 'Frios', basePrice: 10.90, unit: 'kg' },
  'mortadela': { canonical: 'Mortadela', matchedProduct: 'Mortadela Defumada Fatiada 200g', category: 'Frios', basePrice: 4.99, unit: 'un' },
  'esponja': { canonical: 'Esponja Dupla Face', matchedProduct: 'Esponja Dupla Face Scotch-Brite (Pack 3)', category: 'Limpeza', basePrice: 4.99, unit: 'pct' },
  'saco de lixo': { canonical: 'Saco de Lixo', matchedProduct: 'Saco para Lixo 50L Reforçado (Rolo 30 un)', category: 'Limpeza', basePrice: 12.90, unit: 'pct' },
  'papel toalha': { canonical: 'Papel Toalha', matchedProduct: 'Papel Toalha Folha Dupla Snob 2 Rolos', category: 'Limpeza', basePrice: 5.90, unit: 'pct' },
  'guardanapo': { canonical: 'Guardanapo', matchedProduct: 'Guardanapo de Papel Folha Dupla 50 un', category: 'Limpeza', basePrice: 3.50, unit: 'pct' },
  'papel alumínio': { canonical: 'Papel Alumínio', matchedProduct: 'Papel Alumínio Wyda 30cm x 7,5m', category: 'Limpeza', basePrice: 5.90, unit: 'un' },
  'papel aluminio': { canonical: 'Papel Alumínio', matchedProduct: 'Papel Alumínio Wyda 30cm x 7,5m', category: 'Limpeza', basePrice: 5.90, unit: 'un' },
  'filme pvc': { canonical: 'Filme Plástico PVC', matchedProduct: 'Filme Plástico PVC Wyda 15m', category: 'Limpeza', basePrice: 4.90, unit: 'un' },
  'condicionador': { canonical: 'Condicionador', matchedProduct: 'Condicionador Pantene 400ml', category: 'Higiene', basePrice: 21.90, unit: 'un' },
  'escova de dente': { canonical: 'Escova de Dente', matchedProduct: 'Escova Dental Colgate 360', category: 'Higiene', basePrice: 7.90, unit: 'un' },
  'fio dental': { canonical: 'Fio Dental', matchedProduct: 'Fio Dental Colgate Total 50m', category: 'Higiene', basePrice: 8.90, unit: 'un' },
  'absorvente': { canonical: 'Absorvente', matchedProduct: 'Absorvente Always Noturno com Abas 16 un', category: 'Higiene', basePrice: 9.90, unit: 'pct' },
  'abobrinha': { canonical: 'Abobrinha', matchedProduct: 'Abobrinha Italiana 1kg', category: 'Hortifrúti', basePrice: 4.90, unit: 'kg' },
  'chuchu': { canonical: 'Chuchu', matchedProduct: 'Chuchu Fresco 1kg', category: 'Hortifrúti', basePrice: 3.50, unit: 'kg' },
  'pimentão': { canonical: 'Pimentão Verde', matchedProduct: 'Pimentão Verde Fresco 500g', category: 'Hortifrúti', basePrice: 4.90, unit: 'un' },
  'pimentao': { canonical: 'Pimentão Verde', matchedProduct: 'Pimentão Verde Fresco 500g', category: 'Hortifrúti', basePrice: 4.90, unit: 'un' },
  'couve': { canonical: 'Couve Manteiga', matchedProduct: 'Couve Manteiga Picada Maço', category: 'Hortifrúti', basePrice: 3.50, unit: 'un' },
  'repolho': { canonical: 'Repolho', matchedProduct: 'Repolho Verde 1 un', category: 'Hortifrúti', basePrice: 4.50, unit: 'un' },
  'brócolis': { canonical: 'Brócolis', matchedProduct: 'Brócolis Ninja Fresco 1 un', category: 'Hortifrúti', basePrice: 6.90, unit: 'un' },
  'brocolis': { canonical: 'Brócolis', matchedProduct: 'Brócolis Ninja Fresco 1 un', category: 'Hortifrúti', basePrice: 6.90, unit: 'un' },
  'mamão': { canonical: 'Mamão Papaya', matchedProduct: 'Mamão Papaya 1 un', category: 'Hortifrúti', basePrice: 4.90, unit: 'un' },
  'mamao': { canonical: 'Mamão Papaya', matchedProduct: 'Mamão Papaya 1 un', category: 'Hortifrúti', basePrice: 4.90, unit: 'un' },
  'melancia': { canonical: 'Melancia', matchedProduct: 'Melancia Inteira / Pedaço 2kg', category: 'Hortifrúti', basePrice: 7.90, unit: 'un' },
  'uva': { canonical: 'Uva', matchedProduct: 'Uva Niágara Bandeja 500g', category: 'Hortifrúti', basePrice: 8.90, unit: 'pct' },
};

/**
 * Remove vícios de linguagem e saudações comuns ditadas por voz.
 */
function cleanFillerPhrases(rawText: string): string {
  let text = rawText;

  const prefixPatterns = [
    /^(chat|ô chat|o chat|ei chat|fala chat|olá chat|ola chat|oi chat|amigo|ia|bot|listme|list me|assistente|alexa|siri|google|cortana|tati|amélia|amelia)\b/gi,
    /^(olá|ola|oi|opa|e aí|e ai|bom dia|boa tarde|boa noite)\b/gi,
    /^(eu quero comprar|eu quero colocar|eu quero adicionar|eu quero|quero comprar|quero colocar|quero adicionar|quero|eu preciso comprar|eu preciso de|eu preciso|preciso comprar|preciso de|preciso|vou comprar|vamos comprar|tem que comprar|temos que comprar|coloque na lista|coloca na lista|bota na lista|bota aí|bota ai|adiciona na lista|adicionar na lista|anota aí|anota ai|anote aí|anote ai|anota|anote|adicionar|adiciona|adicione|coloque|coloca|colocar|bota|botar|inclua|incluir|pegar|pega|comprar|compre|me vê|me ve|vê pra mim|ve pra mim|vê aí|ve ai|precisamos de|precisamos comprar|precisamos)\b/gi,
    /^(por favor|faz favor|por gentileza|me ajuda aí|me ajuda ai)\b/gi,
  ];

  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of prefixPatterns) {
      if (pattern.test(text.trim())) {
        text = text.trim().replace(pattern, '').trim();
        text = text.replace(/^[,;.\-:]\s*/, '').trim();
        changed = true;
      }
    }
  }

  // Descarta frases genéricas de preenchimento (ex: "não sei o quê", "sei lá", "e mais algumas coisas", "e tudo isso")
  const boundaryStart = '(?:^|[^a-zA-Z0-9áéíóúãõçâêîôûÁÉÍÓÚÃÕÇÂÊÎÔÛ])';
  const boundaryEnd = '(?=$|[^a-zA-Z0-9áéíóúãõçâêîôûÁÉÍÓÚÃÕÇÂÊÎÔÛ])';
  const fillerTerms = [
    '(?:e\\s+)?(?:n[ãa]o|nao)\\s+sei\\s+(?:o\\s+que\\s+mais|o\\s+que\\s+l[áa]|mais\\s+o\\s+qu[êe]|o\\s+qu[êe]|o\\s+que|mais)',
    '(?:e\\s+)?sei\\s+l[áa](?:\\s+o\\s+que\\s+mais|\\s+o\\s+qu[êe]|\\s+o\\s+que)?',
    '(?:e\\s+)?(?:coisas?\\s+e\\s+tal|coisas?\\s+do\\s+tipo|essas\\s+coisas|outras\\s+coisas|por\\s+a[íi]|e\\s+afins)',
    '(?:e\\s+)?mais\\s+alguma(?:s)?\s+coisa(?:s)?',
    '(?:e\\s+)?alguma(?:s)?\s+outra(?:s)?\s+coisa(?:s)?',
    '(?:e\\s+)?mais\\s+uns?\s+(?:itens|coisas|produtos|negócios|negocios)',
    '(?:e\\s+)?o\\s+que\\s+mais\\s+tiver',
    '(?:e\\s+)?por\\s+enquanto\\s+(?:é\\s+)?só',
    '(?:e\\s+)?(?:tudo\\s+isso|tudo\\s+mais|isso\\s+tudo|e\\s+tudo|e\\s+tal|e\\s+etc)',
  ];
  for (const term of fillerTerms) {
    const regex = new RegExp(`${boundaryStart}${term}${boundaryEnd}`, 'gi');
    text = text.replace(regex, ' , ');
  }

  // Pausas de fala e conectores convertidos em separadores
  text = text
    .replace(/\s+(?:né|ne)\s+/gi, ' , ')
    .replace(/\s+(?:tá|ta)\s+/gi, ' , ')
    .replace(/\s+(?:e\s+também|e\s+mais)\s+/gi, ' , ');

  // Deduplica repetições consecutivas comuns em fala hesitante ("pão de alho pão de alho")
  text = text.replace(/\b([a-záéíóúãõçâêîôû]+(?:\s+[a-záéíóúãõçâêîôû]+){0,2})\s+\1\b/gi, '$1');

  // 1. Variação invertida: "com 12 unidades uma bandeja de ovos" / "com 30 ovos uma cartela"
  text = text.replace(
    /\bcom\s+(meia\s+d[úu]zia|meia\s+duzia|duas\s+d[úu]zias|d[úu]zia|duzia|30|20|16|12|6)\s*(?:unidades?|un|ovos?)?\s*(?:de\s+ovos?|de\s+ovo)?\s*(?:,|e\s+)?\s*(?:uma?\s+)?(?:bandeja|cartela|estojo|embalagem)\s*(?:de\s+ovos?|de\s+ovo)?\b/gi,
    (match, size) => {
      const s = (size || '').toLowerCase();
      if (s.includes('30') || s.includes('duas')) return ' , 1 bandeja de 30 ovos , ';
      if (s.includes('20')) return ' , 1 bandeja de 20 ovos , ';
      if (s.includes('16')) return ' , 1 bandeja de 16 ovos , ';
      if (s.includes('meia')) return ' , 1 meia dúzia de ovos , ';
      if (s.includes('12') || s.includes('dúzia') || s.includes('duzia')) return ' , 1 dúzia de ovos , ';
      return match;
    }
  );

  // 2. Normalização Inteligente de Embalagens e Pedidos Coloquiais de Ovos
  // Evita separar em "com 12 unidades" + "ovo", unificando na embalagem comercial correta
  text = text.replace(
    /\b(?:(?:preciso\s+comprar|comprar|quero)\s+)?(?:ovos?|ovo)?\s*(?:,|e\s+)?\s*(?:uma?\s+)?(?:bandeja|cartela|estojo|embalagem|caixa)?\s*(?:de\s+)?(?:ovos?|ovo)?\s*(?:com|de)?\s*(meia\s+d[úu]zia|meia\s+duzia|duas\s+d[úu]zias|d[úu]zia|duzia|30|20|16|12|6)\s*(?:unidades?|un|ovos?|itens)?(?:\s*(?:de\s+)?(?:ovos?|ovo))?\b/gi,
    (match, size) => {
      const s = (size || '').toLowerCase();
      if (s.includes('30') || s.includes('duas')) return ' , 1 bandeja de 30 ovos , ';
      if (s.includes('20')) return ' , 1 bandeja de 20 ovos , ';
      if (s.includes('16')) return ' , 1 bandeja de 16 ovos , ';
      if (s.includes('meia')) return ' , 1 meia dúzia de ovos , ';
      if (s.includes('12') || s.includes('dúzia') || s.includes('duzia')) return ' , 1 dúzia de ovos , ';
      return match;
    }
  );

  // 3. Variação: "ovo 12 unidades" / "ovo 20 unidades" / "ovo 30 unidades" / "ovos 12 un"
  text = text.replace(
    /\b(?:ovos?|ovo)\s+(?:com\s+|de\s+)?(meia\s+d[úu]zia|meia\s+duzia|duas\s+d[úu]zias|d[úu]zia|duzia|30|20|16|12|6)\s*(?:unidades?|un|ovos?)?\b/gi,
    (match, size) => {
      const s = (size || '').toLowerCase();
      if (s.includes('30') || s.includes('duas')) return ' , 1 bandeja de 30 ovos , ';
      if (s.includes('20')) return ' , 1 bandeja de 20 ovos , ';
      if (s.includes('16')) return ' , 1 bandeja de 16 ovos , ';
      if (s.includes('meia')) return ' , 1 meia dúzia de ovos , ';
      if (s.includes('12') || s.includes('dúzia') || s.includes('duzia')) return ' , 1 dúzia de ovos , ';
      return match;
    }
  );

  // 4. Variação: "ovo uma bandeja" / "ovos uma cartela" sem número explícito -> assume bandeja de 30 ovos
  text = text.replace(
    /\b(?:ovos?|ovo)\s+(?:,|e\s+)?\s*(?:uma?\s+)?(?:bandeja|cartela)\b/gi,
    ' , 1 bandeja de 30 ovos , '
  );

  // Conectores de marca falados naturalmente ("pão de alho é Santa massa", "arroz da Camil")
  text = text.replace(/\b(pão de alho|pao de alho)\s+(?:e\s+|é\s+|da\s+|marca\s+)?(santa\s+massa)\b/gi, '$1 $2');
  text = text.replace(/\b(arroz)\s+(?:e\s+|é\s+|da\s+|marca\s+)?(tio\s+jo[ãa]o|camil|prato\s+fino)\b/gi, '$1 $2');
  text = text.replace(/\b(feij[ãa]o)\s+(?:e\s+|é\s+|da\s+|marca\s+)?(kicaldo|camil)\b/gi, '$1 $2');
  text = text.replace(/\b(sab[ãa]o(?:\s+em\s+p[óo])?)\s+(?:e\s+|é\s+|da\s+|marca\s+)?(omo|ariel)\b/gi, '$1 $2');
  text = text.replace(/\b(cerveja)\s+(?:e\s+|é\s+|da\s+|marca\s+)?(heineken|amstel|brahma|spaten|corona|stella)\b/gi, '$1 $2');

  // Simplificação de categoria seguida pelo produto ("refrigerante uma coca-cola" -> "uma coca-cola")
  text = text.replace(/\b(?:refrigerante)\s*(?:,|e\s+)?\s*(?:(um|uma)\s+)?(coca[-\s]?cola|guaran[aá]|fanta|sprite|pepsi)\b/gi, '$1 $2');
  text = text.replace(/\b(?:carne)\s*(?:,|e\s+|de\s+)?\s*(alcatra|picanha|contra[- ]?fil[ée]|costela|maminha|cupim|fraldinha|patinho)\b/gi, '$1');

  // Sufixos comuns ao finalizar áudio (descarta despedidas e ruídos de fechamento)
  const suffixPatterns = [
    /\b(?:e\s+)?(?:é\s+|e\s+)?(?:isso|tudo\s+isso|tudo\s+mais|isso\s+tudo|era\s+isso|só\s+isso|so\s+isso|só\s+isso\s+aí|tudo|tá\s+bom)\b\.?$/gi,
    /\b(?:por\s+enquanto\s+(?:é\s+)?só|por\s+hoje\s+(?:é\s+)?só|por\s+favor|fechou|valeu|obrigado|obrigada|tá|ta|né|ne|beleza|ok)\.?$/gi,
  ];
  for (const pattern of suffixPatterns) {
    text = text.trim().replace(pattern, '').trim();
  }

  return text;
}

/**
 * Capitaliza palavras em um nome composto.
 */
function capitalizeWords(str: string): string {
  const lowercaseWords = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'com', 'e', 'para', 'a', 'o']);
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, idx) => {
      if (idx > 0 && lowercaseWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Extrai quantidade e unidade de medida de uma frase, suportando números por extenso.
 */
function extractQuantityAndUnit(clause: string): { quantity: number; unit: string; cleanPhrase: string } {
  let working = clause.trim();
  let quantity = 1;
  let unit = 'un';

  const wordNumbers: Record<string, number> = {
    'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 'tres': 3,
    'quatro': 4, 'cinco': 5, 'seis': 6, 'dez': 10
  };

  const qtyRegex = /^(\d+|(?:uma|um|duas|dois|tr[êe]s|tres|quatro|cinco|seis|dez|meia|meio)\b)\s*(kg|k|g|un|pct|pacotes?|garrafas?|latas?|litros?|l|caixas?|cx|dz|d[úu]zias?|duzias?|x)?\b\s*(?:de\b\s*)?/i;
  const match = working.match(qtyRegex);

  if (match) {
    const rawNum = match[1].toLowerCase();
    if (wordNumbers[rawNum]) {
      quantity = wordNumbers[rawNum];
    } else if (rawNum === 'meio' || rawNum === 'meia') {
      quantity = 1;
      unit = 'kg';
    } else {
      quantity = Math.max(1, parseInt(rawNum, 10));
    }

    if (rawNum === 'meia' && (match[2]?.toLowerCase().startsWith('d') || working.toLowerCase().includes('dúzia') || working.toLowerCase().includes('duzia'))) {
      quantity = 1;
      unit = 'estojo';
      working = 'meia dúzia de ovos';
      return { quantity, unit, cleanPhrase: working };
    }

    if (match[2]) {
      const u = match[2].toLowerCase();
      if (u.startsWith('k')) unit = 'kg';
      else if (u.startsWith('g')) unit = 'g';
      else if (u.startsWith('pct') || u.startsWith('pacote')) unit = 'pct';
      else if (u.startsWith('l') && !u.startsWith('lata')) unit = 'L';
      else if (u.startsWith('lata')) unit = 'lata';
      else if (u.startsWith('caixa') || u.startsWith('cx')) unit = 'cx';
      else if (u.startsWith('dz') || u.startsWith('duzia')) unit = 'dz';
      else unit = 'un';
    }
    working = working.slice(match[0].length).trim();
  }

  return { quantity, unit, cleanPhrase: working };
}

function isQuantityOrModifierOnly(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  const qtyOnlyRegex = /^(?:(?:\d+|(?:uma|um|duas|dois|tr[êe]s|tres|quatro|cinco|seis|dez|meia|meio)\b)\s*(?:kg|k|g|un|pct|pacotes?|garrafas?|latas?|litros?|l|caixas?|cx|dz|d[úu]zias?|x)?\b\s*(?:de\b)?|o|a|os|as|de|para|com|\s)+$/i;
  return qtyOnlyRegex.test(trimmed);
}

function isValidGroceryItemName(phrase: string): boolean {
  const trimmed = phrase.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return false;

  const invalidPhrases = new Set([
    'tudo isso', 'e tudo isso', 'tudo mais', 'e tudo mais', 'tudo', 'e tudo',
    'coisas', 'outras coisas', 'alguma coisa', 'mais coisas', 'itens', 'produtos',
    'negocios', 'negócios', 'isso', 'e isso', 'aquilo', 'e aquilo',
    'por enquanto', 'so isso', 'só isso', 'fechou', 'valeu', 'obrigado',
    'selecionado', 'unidades', 'unidade', 'bandeja', 'cartela', 'estojo',
    'pacote', 'pacotes', 'caixa', 'caixas', 'litro', 'litros', 'quilo', 'quilos',
    'não sei o que', 'nao sei o que', 'não sei o quê', 'nao sei o que mais', 'não sei o que mais',
    'sei lá o que', 'sei la o que', 'sei lá', 'sei la', 'coisa e tal', 'por aí', 'por ai',
  ]);
  if (invalidPhrases.has(trimmed)) return false;

  if (/(?:n[ãa]o|nao)\s+sei|sei\s+l[áa]|coisa\s+e\s+tal|por\s+a[íi]|essas?\s+coisas?|o\s+que\s+mais/i.test(trimmed)) {
    return false;
  }

  if (/^(?:com|de|em|para|por|e|a|o|um|uma|uns|umas|\d+|unidades?|un|kg|k|g|pct|cx|l|dz)+\s*$/i.test(trimmed)) {
    return false;
  }
  if (/^(?:com|de|para|em)\s+\d+(?:\s+(?:uma?|unidades?))?$/i.test(trimmed)) {
    return false;
  }
  return true;
}

/**
 * Se uma oração não pontuada contiver múltiplos itens de catálogo distintos
 * (ex: "linguiça alcatra carvão" ou "2 pacotes de arroz 1kg alcatra 3 coca cola"),
 * divide a oração nos itens individuais sem nunca desmembrar nomes compostos ou marcas.
 */
function splitClauseByRecognizedItems(clause: string, sortedKeys: string[]): string[] {
  const lower = clause.toLowerCase();
  const claimedMatches: Array<{ key: string; start: number; end: number }> = [];

  for (const key of sortedKeys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\s|,)(${escaped})($|\\s|,)`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = regex.exec(lower)) !== null) {
      const matchStart = m.index + m[1].length;
      const matchEnd = matchStart + m[2].length;

      const overlaps = claimedMatches.some(
        (c) => !(matchEnd <= c.start || matchStart >= c.end)
      );
      if (!overlaps) {
        claimedMatches.push({ key, start: matchStart, end: matchEnd });
      }
      if (regex.lastIndex === m.index) regex.lastIndex++;
    }
  }

  if (claimedMatches.length <= 1) {
    return [clause.trim()];
  }

  claimedMatches.sort((a, b) => a.start - b.start);

  const segments: string[] = [];
  let currentStart = 0;

  // Se houver texto antes do primeiro item reconhecido que não seja quantidade nem artigo:
  const textBeforeFirst = clause.substring(0, claimedMatches[0].start).trim();
  if (textBeforeFirst && !isQuantityOrModifierOnly(textBeforeFirst)) {
    segments.push(textBeforeFirst);
    currentStart = claimedMatches[0].start;
  }

  for (let i = 0; i < claimedMatches.length - 1; i++) {
    const current = claimedMatches[i];
    const next = claimedMatches[i + 1];

    const inBetween = clause.substring(current.end, next.start);
    const qtyRegex = /(?:^|\s)(\d+|(?:uma|um|duas|dois|tr[êe]s|tres|quatro|cinco|meia|meio)\b)\s*(kg|k|g|un|pct|pacotes?|garrafas?|latas?|litros?|l|caixas?|cx|dz|d[úu]zias?|x)?\b\s*(?:de\b\s*)?$/i;
    const qtyMatch = inBetween.match(qtyRegex);

    let splitIndex = next.start;
    if (qtyMatch && qtyMatch.index !== undefined) {
      splitIndex = current.end + qtyMatch.index;
      const matchedStr = inBetween.substring(qtyMatch.index);
      const leadSpaces = matchedStr.length - matchedStr.trimStart().length;
      splitIndex += leadSpaces;
    }

    const seg = clause.substring(currentStart, splitIndex).trim();
    if (seg) segments.push(seg);
    currentStart = splitIndex;
  }

  const lastSeg = clause.substring(currentStart).trim();
  if (lastSeg) segments.push(lastSeg);

  return segments;
}

/**
 * Segmenta o texto em orações/itens individuais preservando marcas e compostos.
 */
function segmentIntoClauses(rawText: string): string[] {
  const text = rawText
    .replace(/\r\n/g, '\n')
    // Converte quebras de linha e ponto-e-vírgula em delimitador de vírgula
    .replace(/[\n;]/g, ' , ')
    // Remove marcadores de listas numéricas (ex: "1.", "2)", "1 -")
    .replace(/(?:^|\s)\d+[\.\)\-]\s+/g, ' , ')
    // Remove bullets (ex: "*", "-", "•")
    .replace(/(?:^|\s)[\*\-•]\s+/g, ' , ')
    // Trata conjunções aditivas comuns como separadores de itens (" e ", " mais ", " além de ")
    .replace(/\s+(?:e|mais|além de)\s+/gi, ' , ');

  const initialClauses = text
    .split(',')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const sortedKeys = Object.keys(GROCERY_CATALOG).sort((a, b) => b.length - a.length);

  const finalClauses: string[] = [];
  for (const clause of initialClauses) {
    const subSegments = splitClauseByRecognizedItems(clause, sortedKeys);
    finalClauses.push(...subSegments);
  }

  return finalClauses;
}

/**
 * Analisador semântico de listas de supermercado.
 * Reconhece marcas compostas (ex: "Arroz Tio João", "Feijão Kicaldo", "Pão de Alho Santa Massa")
 * como um único item sem jamais desmembrar o produto da sua marca.
 */
export function extractGroceryItems(rawText: string): ParsedGroceryItem[] {
  const cleaned = cleanFillerPhrases(rawText);
  if (!cleaned) return [];

  const clauses = segmentIntoClauses(cleaned);
  const foundItems: ParsedGroceryItem[] = [];
  const addedItemKeys = new Set<string>();

  // Lista de chaves do catálogo ordenadas por tamanho decrescente (termos compostos primeiro!)
  const sortedCatalogKeys = Object.keys(GROCERY_CATALOG).sort((a, b) => b.length - a.length);

  for (const clause of clauses) {
    const { quantity, unit: detectedUnit, cleanPhrase } = extractQuantityAndUnit(clause);
    if (!cleanPhrase || cleanPhrase.length < 2) continue;

    const normalizedPhrase = cleanPhrase.toLowerCase().trim();

    // 1. Busca por correspondência direta no catálogo
    let matchedEntry: GroceryCatalogEntry | null = null;
    let matchedKey = '';

    for (const key of sortedCatalogKeys) {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');

      if (regex.test(normalizedPhrase)) {
        matchedEntry = GROCERY_CATALOG[key];
        matchedKey = key;
        break;
      }
    }

    if (matchedEntry) {
      let finalName = matchedEntry.canonical;
      let finalProduct = matchedEntry.matchedProduct;

      // Se o usuário adicionou marca ou especificação não catalogada (ex: "arroz camponês"):
      // Mantém a especificação original do usuário (exceto ovos onde usamos padronização)
      const isEggItem = finalName.toLowerCase().includes('ovo') || normalizedPhrase.includes('ovo');
      if (!isEggItem && !matchedKey.includes(' ') && normalizedPhrase.length > matchedKey.length) {
        finalName = capitalizeWords(cleanPhrase);
        finalProduct = `${finalName} (Melhor cotação na região)`;
      }

      let finalQty = quantity;
      let finalUnit = detectedUnit !== 'un' ? detectedUnit : matchedEntry.unit;
      let finalBasePrice = matchedEntry.basePrice;

      // Inteligência de Embalagem para Ovos (bandejas e estojos reais)
      const lowerClean = cleanPhrase.toLowerCase();
      if (isEggItem) {
        if (lowerClean.includes('30') || finalQty === 30) {
          finalName = 'Ovos (Bandeja 30 un)';
          finalProduct = 'Ovos Brancos Grandes Bandeja 30 un';
          finalBasePrice = 18.90;
          finalUnit = 'bandeja';
          finalQty = 1;
        } else if (lowerClean.includes('20') || finalQty === 20) {
          finalName = 'Ovos (Bandeja 20 un)';
          finalProduct = 'Ovos Brancos Grandes Bandeja 20 un';
          finalBasePrice = 14.50;
          finalUnit = 'bandeja';
          finalQty = 1;
        } else if (lowerClean.includes('16') || finalQty === 16) {
          finalName = 'Ovos (16 un)';
          finalProduct = 'Ovos Brancos Embalagem 16 un';
          finalBasePrice = 12.90;
          finalUnit = 'bandeja';
          finalQty = 1;
        } else if (lowerClean.includes('6') || lowerClean.includes('meia') || finalQty === 6) {
          finalName = 'Ovos (Meia Dúzia 6 un)';
          finalProduct = 'Ovos Brancos Estojo 6 un';
          finalBasePrice = 5.90;
          finalUnit = 'estojo';
          finalQty = 1;
        } else if (lowerClean.includes('12') || lowerClean.includes('duzia') || lowerClean.includes('dúzia') || finalQty === 12) {
          finalName = 'Ovos (Dúzia 12 un)';
          finalProduct = 'Ovos Brancos Grandes Estojo 12 un';
          finalBasePrice = 10.90;
          finalUnit = 'dz';
          finalQty = 1;
        } else if (lowerClean.includes('bandeja') || lowerClean.includes('cartela')) {
          finalName = 'Ovos (Bandeja 30 un)';
          finalProduct = 'Ovos Brancos Grandes Bandeja 30 un';
          finalBasePrice = 18.90;
          finalUnit = 'bandeja';
          finalQty = 1;
        }
      }

      const dedupeKey = finalName.toLowerCase();
      if (!addedItemKeys.has(dedupeKey)) {
        addedItemKeys.add(dedupeKey);
        foundItems.push({
          name: finalName,
          matchedProduct: finalProduct,
          category: matchedEntry.category,
          basePrice: finalBasePrice,
          unit: finalUnit,
          quantity: finalQty,
        });
      }
    } else {
      // 2. Se o produto não estiver no catálogo (ex: item regional ou marca customizada)
      if (!isValidGroceryItemName(cleanPhrase)) {
        continue;
      }

      const capitalized = capitalizeWords(cleanPhrase);
      const dedupeKey = capitalized.toLowerCase();

      if (!addedItemKeys.has(dedupeKey)) {
        addedItemKeys.add(dedupeKey);

        let inferredCategory = 'Mercearia';
        const lower = cleanPhrase.toLowerCase();
        if (lower.includes('fralda') || lower.includes('sabonete') || lower.includes('shampoo') || lower.includes('creme') || lower.includes('dente') || lower.includes('absorvente')) {
          inferredCategory = 'Higiene';
        } else if (lower.includes('sabão') || lower.includes('sabao') || lower.includes('limpeza') || lower.includes('detergente') || lower.includes('amaciante') || lower.includes('cloro') || lower.includes('desinfetante')) {
          inferredCategory = 'Limpeza';
        } else if (lower.includes('cerveja') || lower.includes('refrigerante') || lower.includes('suco') || lower.includes('vinho') || lower.includes('vodka') || lower.includes('bebida') || lower.includes('whisky')) {
          inferredCategory = 'Bebidas';
        } else if (lower.includes('carne') || lower.includes('frango') || lower.includes('costela') || lower.includes('picanha') || lower.includes('linguiça') || lower.includes('linguica') || lower.includes('peixe') || lower.includes('alho')) {
          inferredCategory = 'Açougue';
        } else if (lower.includes('maçã') || lower.includes('maca') || lower.includes('banana') || lower.includes('legume') || lower.includes('verdura') || lower.includes('tomate')) {
          inferredCategory = 'Hortifrúti';
        }

        foundItems.push({
          name: capitalized,
          matchedProduct: `${capitalized} (Melhor cotação na região)`,
          category: inferredCategory,
          basePrice: 14.90,
          unit: detectedUnit !== 'un' ? detectedUnit : 'un',
          quantity,
        });
      }
    }
  }

  // Se o usuário falou um "ovo" genérico no início (ex: "preciso de ovo...") mas também
  // incluiu uma bandeja específica (ex: "bandeja de 20 ovos"), prioriza a bandeja específica.
  const hasSpecificEggTray = foundItems.some(
    (it) => it.name.includes('Bandeja') || it.name.includes('16') || it.name.includes('Meia Dúzia')
  );
  if (hasSpecificEggTray) {
    const eggCount = foundItems.filter((it) => it.name.toLowerCase().includes('ovo')).length;
    if (eggCount > 1) {
      return foundItems.filter((it) => it.name !== 'Ovos (Dúzia 12 un)');
    }
  }

  return foundItems;
}
