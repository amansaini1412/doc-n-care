import type { CatalogProduct, SkinType } from './types';

export const CATALOG: CatalogProduct[] = [
  // --- THE DERMA CO ---
  {
    id: 'dc1',
    barcode: '8906087779773',
    name: '1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++',
    brand: 'The Derma Co',
    price: '₹499',
    category: 'sunscreen',
    image: 'https://thedermaco.com/cdn/shop/files/1_PDP_2cce8939-1296-471f-8b74-f4fbfa814378.jpg?v=1791452607',
    ingredients: ['Aqua', 'Titanium Dioxide', 'Zinc Oxide', 'Hyaluronic Acid', 'Vitamin E', 'Dimethicone', 'Glycerin'],
    skinTypes: ['Oily', 'Combination', 'Normal', 'Acne-Prone'],
    benefits: ['Ultra-lightweight aqua gel finish', 'Zero white cast on Indian skin tones', 'Broad spectrum UVA/UVB & Blue Light protection'],
    warnings: ['Reapply every 2 to 3 hours during continuous sun exposure'],
    description: 'Designed by dermatologists with 1% Hyaluronic Acid and Vitamin E, this cooling aqua gel shields against UV while keeping skin non-greasy.',
    howToUse: 'Apply evenly on face and neck 15-20 minutes before stepping into the sun. Use as the final step of your morning skincare routine.',
    precautions: 'Do not apply to inflamed open wounds. Reapply after heavy perspiration or swimming.',
    beneficialActives: ['Hyaluronic Acid 1%', 'Vitamin E', 'Zinc Oxide', 'Titanium Dioxide'],
    potentialIrritants: [],
  },
  {
    id: 'dc2',
    barcode: '8906087776437',
    name: '1% Salicylic Acid Gel Face Wash for Active Acne',
    brand: 'The Derma Co',
    price: '₹299',
    category: 'cleanser',
    image: 'https://images-static.nykaa.com/media/catalog/product/3/0/30d80ac8906087776437__1_.jpg?tr=w-500',
    ingredients: ['Aqua', 'Salicylic Acid (1%)', 'Witch Hazel Extract', 'Willow Bark Extract', 'Sodium Lauroyl Sarcosinate', 'Glycerin'],
    skinTypes: ['Oily', 'Acne-Prone', 'Combination'],
    benefits: ['Unclogs pores and prevents active breakouts', 'Gently exfoliates dead skin without stripping moisture', 'Controls excess oil excretion'],
    warnings: ['Avoid direct eye contact', 'Slight tingling during first few uses is normal'],
    description: 'A dermatologically formulated gel cleanser with 1% Salicylic Acid and Witch Hazel to penetrate deep into pores and dissolve breakout-causing debris.',
    howToUse: 'Lather between damp hands, gently massage onto face for 60 seconds avoiding the eye area, then rinse with lukewarm water.',
    precautions: 'Use once daily at night initially; increase to twice daily if skin tolerates well. Always follow with sunscreen in the morning.',
    beneficialActives: ['Salicylic Acid (1% BHA)', 'Witch Hazel', 'Willow Bark'],
    potentialIrritants: [],
  },
  {
    id: 'dc3',
    barcode: '8906087779797',
    name: '10% Niacinamide Face Serum with Zinc PCA',
    brand: 'The Derma Co',
    price: '₹599',
    category: 'serum',
    image: 'https://thedermaco.com/cdn/shop/files/6_eaa2dc41-c120-4360-baa2-a33521eec3c1.jpg?v=1783947202&width=1080',
    ingredients: ['Aqua', 'Niacinamide (10%)', 'Zinc PCA (1%)', 'Glycerin', 'Centella Asiatica Leaf Extract', 'Sodium Hyaluronate'],
    skinTypes: ['Oily', 'Acne-Prone', 'Combination', 'Normal'],
    benefits: ['Visibly fades post-acne marks and dark spots', 'Reduces enlarged pore appearance', 'Balances daily sebum production'],
    warnings: ['Patch test on jawline for 24 hours prior to first full application'],
    description: 'An evidence-backed serum formulated with 10% pure Niacinamide and 1% Zinc PCA to target acne marks, blemishes, and uneven skin texture.',
    howToUse: 'Dispense 3-4 drops onto cleansed skin morning and evening. Gently pat into face and neck until fully absorbed.',
    precautions: 'Do not layer simultaneously with pure L-Ascorbic Acid (Vitamin C) if you experience skin flushing.',
    beneficialActives: ['Niacinamide (10%)', 'Zinc PCA (1%)', 'Centella Asiatica', 'Hyaluronic Acid'],
    potentialIrritants: [],
  },
  {
    id: 'dc4',
    barcode: '8906087779803',
    name: '2% Kojic Acid Face Serum with Alpha Arbutin',
    brand: 'The Derma Co',
    price: '₹499',
    category: 'serum',
    image: 'https://thedermaco.com/cdn/shop/files/6_ec52c150-a4f3-4cd4-bf5a-365815e81627.jpg?v=1783946914&width=1080',
    ingredients: ['Aqua', 'Kojic Acid (2%)', 'Alpha Arbutin (1%)', 'Niacinamide', 'Glycerin', 'Sodium Metabisulfite'],
    skinTypes: ['Normal', 'Combination', 'Oily', 'Dry'],
    benefits: ['Clinically proven to reduce pigmentation and sun spots', 'Inhibits tyrosinase enzyme activity', 'Evens out skin tone discoloration'],
    warnings: ['Mandatory daily broad-spectrum SPF 50 during treatment'],
    description: 'A potent dermatologist formulation combining 2% Kojic Acid and 1% Alpha Arbutin to safely reduce melanin synthesis and lighten stubborn post-inflammatory hyperpigmentation.',
    howToUse: 'Apply 3 drops onto affected blemish and dark spot areas after cleansing at night. Follow with a barrier moisturizer.',
    precautions: 'Store in a cool, dark cabinet away from direct light. Do not mix with harsh physical scrubs.',
    beneficialActives: ['Kojic Acid (2%)', 'Alpha Arbutin (1%)', 'Niacinamide'],
    potentialIrritants: [],
  },
  {
    id: 'dc5',
    barcode: '8906087779827',
    name: 'Ceramide + HA Intense Face Moisturizer',
    brand: 'The Derma Co',
    price: '₹349',
    category: 'moisturizer',
    image: 'https://thedermaco.com/cdn/shop/files/ceramide_ha_intense_moisturizer_1.jpg?v=1758286468&width=1200',
    ingredients: ['Aqua', 'Ceramide Complex (NP, AP, EOP)', 'Hyaluronic Acid', 'Phytosphingosine', 'Cholesterol', 'Glycerin'],
    skinTypes: ['Dry', 'Sensitive', 'Normal', 'Combination'],
    benefits: ['Restores compromised moisture barrier', 'Relieves skin dryness and flaking', '72-hour deep epidermal hydration'],
    warnings: ['May feel rich on extremely oily T-zones during peak humidity'],
    description: 'A dermatologist-tested ceramide cream featuring essential skin lipids and Hyaluronic Acid to heal dry, reactive, or peeling skin.',
    howToUse: 'Apply generously to face and neck as the moisturizing step morning and night, particularly when skin feels tight.',
    precautions: 'Ideal for skin recovering from retinoid-induced dryness or chemical exfoliants.',
    beneficialActives: ['Ceramides (NP, AP, EOP)', 'Hyaluronic Acid', 'Cholesterol', 'Phytosphingosine'],
    potentialIrritants: [],
  },

  // --- MAMAEARTH ---
  {
    id: 'me1',
    barcode: '8906087770671',
    name: 'Tea Tree Face Wash with Neem for Acne & Pimples',
    brand: 'Mamaearth',
    price: '₹259',
    category: 'cleanser',
    image: 'https://mamaearth.in/cdn/shop/files/2_d7b9903e-7ca8-449f-9436-362fb6911814.jpg?v=1784181663&width=559',
    ingredients: ['Aqua', 'Tea Tree Oil', 'Neem Leaf Extract', 'Aloe Barbadensis Leaf Juice', 'Sodium Lauroyl Sarcosinate', 'Glycerin'],
    skinTypes: ['Oily', 'Acne-Prone'],
    benefits: ['Natural antibacterial defense against pimples', 'Controls excess oil without harsh stripping', 'Calms irritated redness'],
    warnings: ['Avoid direct contact with eyes', 'Do not use if allergic to tea tree oil'],
    description: 'Formulated with natural Tea Tree Oil and Neem extract to purify congested pores, wash away pollution, and calm bacterial breakouts.',
    howToUse: 'Apply a coin-sized amount onto wet skin. Gently work into a lather and massage in circular motions for 45-60 seconds before rinsing.',
    precautions: 'Natural extracts may cause mild cooling sensation. Suitable for everyday morning and evening use.',
    beneficialActives: ['Tea Tree Oil', 'Neem Leaf Extract', 'Aloe Vera', 'Glycerin'],
    potentialIrritants: ['Tea Tree Oil (sensitizing for eczema/hyper-reactive skin)'],
  },
  {
    id: 'me2',
    barcode: '8906087772101',
    name: 'Vitamin C Daily Glow Face Serum with Turmeric',
    brand: 'Mamaearth',
    price: '₹399',
    category: 'serum',
    image: 'https://mamaearth.in/cdn/shop/files/product_2_white_bg.jpg?v=1777972772&width=559',
    ingredients: ['Aqua', 'Ascorbyl Glucoside (Vitamin C)', 'Curcuma Longa (Turmeric) Root Extract', 'Niacinamide', 'Glycerin', 'Sodium Hyaluronate'],
    skinTypes: ['Normal', 'Combination', 'Dry', 'Oily'],
    benefits: ['Improves natural skin glow and radiance', 'Protects against environmental oxidants', 'Reduces appearance of dullness'],
    warnings: ['Store in a cool, dry place away from sunlight', 'Patch test before use'],
    description: 'Enriched with Vitamin C and antioxidant-rich Turmeric, this serum revives tired skin, minimizes dullness, and boosts natural radiance.',
    howToUse: 'Dispense 3-4 drops onto clean face. Pat gently across forehead, cheeks, and neck until absorbed. Follow with moisturizer and SPF in daytime.',
    precautions: 'Pair with broad-spectrum sunscreen in the morning for best antioxidant defense.',
    beneficialActives: ['Ascorbyl Glucoside', 'Turmeric Extract', 'Niacinamide', 'Sodium Hyaluronate'],
    potentialIrritants: [],
  },
  {
    id: 'me3',
    barcode: '8906087772125',
    name: 'Rice Oil-Free Face Moisturizer with Niacinamide',
    brand: 'Mamaearth',
    price: '₹319',
    category: 'moisturizer',
    image: 'https://mamaearth.in/cdn/shop/files/rice-oil-free-face-moisturizer_1.jpg?v=1777971600&width=559',
    ingredients: ['Aqua', 'Oryza Sativa (Rice Water) Extract', 'Niacinamide', 'Black Oats Extract', 'Glycerin', 'Sodium Hyaluronate'],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone', 'Normal'],
    benefits: ['24-hour hydration without greasy residue', 'Minimizes enlarged pores with Niacinamide', 'Provides a soft glass-skin finish'],
    warnings: ['For external use only'],
    description: 'Powered by fermented Rice Water and Niacinamide, this non-comedogenic oil-free moisturizer hydrates deeply while controlling T-zone shine.',
    howToUse: 'Take an adequate amount and smooth evenly over cleansed face and neck every morning and night.',
    precautions: 'Formulated oil-free, making it an excellent choice for acne-prone skin prone to clogged pores.',
    beneficialActives: ['Fermented Rice Water', 'Niacinamide', 'Black Oats Extract', 'Hyaluronic Acid'],
    potentialIrritants: [],
  },
  {
    id: 'me4',
    barcode: '8906087772132',
    name: 'Ultra Light Indian Sunscreen with Carrot Seed & Turmeric SPF 50',
    brand: 'Mamaearth',
    price: '₹499',
    category: 'sunscreen',
    image: 'https://mamaearth.in/cdn/shop/files/2_241.jpg?v=1777973825&width=559',
    ingredients: ['Aqua', 'Zinc Oxide', 'Titanium Dioxide', 'Daucus Carota Sativa (Carrot Seed) Oil', 'Curcuma Longa (Turmeric) Extract', 'Glycerin'],
    skinTypes: ['Combination', 'Dry', 'Normal', 'Sensitive'],
    benefits: ['SPF 50 PA+++ protection tailored for Indian weather', 'Non-greasy natural moisturizing finish', 'Protects from harsh UV rays and tanning'],
    warnings: ['Reapply every 2 hours during direct sun exposure'],
    description: 'Specifically crafted for Indian skin exposed to intense UV rays and tropical weather, featuring Carrot Seed Oil and mineral filters for sun defense.',
    howToUse: 'Apply liberally to face, neck, and ears 15 minutes before sun exposure. Reapply after excessive sweating.',
    precautions: 'Mineral zinc oxide formula provides gentle physical barrier protection with minimal irritation risk.',
    beneficialActives: ['Zinc Oxide', 'Titanium Dioxide', 'Carrot Seed Oil', 'Turmeric'],
    potentialIrritants: [],
  },
  {
    id: 'me5',
    barcode: '8906087771154',
    name: 'Ubtan Detan Face Mask with Saffron & Turmeric',
    brand: 'Mamaearth',
    price: '₹499',
    category: 'mask',
    image: 'https://images-static.nykaa.com/media/catalog/product/f/e/fe7b5a8MAMAE00001154_x1.jpg',
    ingredients: ['Aqua', 'Kaolin Clay', 'Curcuma Longa (Turmeric) Powder', 'Saffron Extract', 'Apricot Oil', 'Glycerin'],
    skinTypes: ['Normal', 'Combination', 'Oily', 'Dry'],
    benefits: ['Fades sun tan and surface dullness', 'Draws out dirt and excess sebum with Kaolin clay', 'Leaves skin radiant and refreshed'],
    warnings: ['Turmeric may leave a mild temporary natural yellowish tint on very fair skin, which rinses away easily'],
    description: 'An Ayurvedic-inspired detoxifying face pack with pure Turmeric, Saffron, and Kaolin clay to remove sun tan and restore glow.',
    howToUse: 'Apply a generous, even layer over cleansed face avoiding eye and lip areas. Leave on for 10-15 minutes until dry, then rinse with lukewarm water.',
    precautions: 'Use 1-2 times per week. Do not apply on irritated or broken skin.',
    beneficialActives: ['Turmeric', 'Saffron Extract', 'Kaolin Clay', 'Apricot Oil'],
    potentialIrritants: [],
  },

  // --- DR. SHETH'S ---
  {
    id: 'ds1',
    barcode: '8906140040116',
    name: 'Ceramide & Vitamin C Oil-Free Moisturizer',
    brand: "Dr. Sheth's",
    price: '₹349',
    category: 'moisturizer',
    image: 'https://www.drsheths.com/cdn/shop/files/CVC_OFM_4.jpg?v=1791291978&width=1200',
    ingredients: ['Aqua', 'Ceramide Complex', 'Ascorbyl Glucoside (Vitamin C)', 'Niacinamide', 'Glycerin', 'Sodium Hyaluronate'],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone', 'Normal'],
    benefits: ['Strengthens barrier while brightening dark spots', 'Zero sticky feel, rapid absorption', 'Formulated specifically for Indian skin physiology'],
    warnings: ['For external use only'],
    description: 'Designed by Indian dermatologists to provide barrier repair with ceramides while simultaneously brightening pigmentation with stabilized Vitamin C.',
    howToUse: 'Gently massage a nickel-sized amount into face and neck twice daily after cleansing.',
    precautions: 'Non-comedogenic gel-cream that avoids clogging pores even in humid climates.',
    beneficialActives: ['Ceramide NP', 'Ascorbyl Glucoside', 'Niacinamide', 'Hyaluronic Acid'],
    potentialIrritants: [],
  },
  {
    id: 'ds2',
    barcode: '8906140040130',
    name: 'Haldi & Hyaluronic Acid Sunscreen SPF 50+ PA++++',
    brand: "Dr. Sheth's",
    price: '₹499',
    category: 'sunscreen',
    image: 'https://www.drsheths.com/cdn/shop/files/3_key_benefits_1.jpg?v=1771323399&width=1200',
    ingredients: ['Aqua', 'Titanium Dioxide', 'Zinc Oxide', 'Curcuma Longa (Haldi) Extract', 'Hyaluronic Acid', 'Glycerin'],
    skinTypes: ['Sensitive', 'Combination', 'Dry', 'Normal', 'Oily'],
    benefits: ['Superior PA++++ UVA protection', 'Anti-inflammatory haldi prevents sun redness', 'Hydrating, dew-like finish without white cast'],
    warnings: ['Reapply every 2 hours during continuous outdoor activity'],
    description: 'A hybrid sunscreen offering SPF 50+ PA++++ protection enriched with soothing turmeric and 1% hyaluronic acid for glow and UV defense.',
    howToUse: 'Apply two finger lengths to face and neck as the last step of morning skincare 15 minutes before stepping out.',
    precautions: 'Suitable for highly sensitive and post-acne reactive skin.',
    beneficialActives: ['Haldi Extract', 'Hyaluronic Acid', 'Zinc Oxide', 'Titanium Dioxide'],
    potentialIrritants: [],
  },

  // --- MINIMALIST ---
  {
    id: 'min1',
    barcode: '8906005999001',
    name: '10% Niacinamide Face Serum with Zinc PCA',
    brand: 'Minimalist',
    price: '₹599',
    category: 'serum',
    image: 'https://beminimalist.co/cdn/shop/products/NewNia10_720x_30d37e0e-0147-4caa-8160-449c2bbefbe1.webp',
    ingredients: ['Aqua', 'Niacinamide (10%)', 'Glycerin', 'Zinc PCA (1%)', 'Hyaluronic Acid', 'Centella Asiatica Leaf Extract', 'Phenoxyethanol'],
    skinTypes: ['Oily', 'Acne-Prone', 'Combination', 'Normal'],
    benefits: ['Visibly regulates sebum secretion', 'Minimizes enlarged pores and post-acne blemishes', 'Calms inflammation and redness'],
    warnings: ['Introduce gradually if you have highly reactive skin'],
    description: 'A potent 10% pure Vitamin B3 serum clinically proven to diminish acne marks, refine skin texture, and regulate sebum balance.',
    howToUse: 'Apply 2-3 drops to entire face after cleansing and toning in AM and PM routines. Gently pat until absorbed.',
    precautions: 'Do not layer directly with high-potency Vitamin C (L-Ascorbic Acid) simultaneously if prone to temporary flushing.',
    beneficialActives: ['Niacinamide (10%)', 'Zinc PCA (1%)', 'Centella Asiatica Leaf Extract', 'Hyaluronic Acid'],
    potentialIrritants: [],
  },
  {
    id: 'min2',
    barcode: '8906103200151',
    name: 'Salicylic Acid 2% Face Serum',
    brand: 'Minimalist',
    price: '₹549',
    category: 'serum',
    image: 'https://beminimalist.co/cdn/shop/products/SalicylicAcid2_1200-1-min.png',
    ingredients: ['Aqua', 'Salicylic Acid', 'Aloe Barbadensis Leaf Juice', 'Dimethyl Isosorbide', 'Glycerin', 'Zinc PCA'],
    skinTypes: ['Oily', 'Acne-Prone', 'Combination'],
    benefits: ['Decongests pores and reduces comedones', 'Formulated in calming Aloe base to minimize dryness', 'Regulates excess sebum'],
    warnings: ['Introduce slowly (2-3 times per week)', 'Avoid eye contour'],
    description: 'An effective BHA exfoliant that unclogs pores, clears stubborn whiteheads/blackheads, and prevents inflammatory breakouts.',
    howToUse: 'Apply 2-3 drops after cleansing on dry skin at night. Allow 2 minutes to absorb before applying moisturizer.',
    precautions: 'Start 2-3 nights per week. Always follow with SPF during the day. Do not combine with retinoids in the same application.',
    beneficialActives: ['Salicylic Acid 2%', 'Aloe Vera', 'Zinc PCA'],
    potentialIrritants: [],
  },

  // --- DOT & KEY ---
  {
    id: 'dk1',
    barcode: '8906006450123',
    name: 'Watermelon Cooling Sunscreen SPF 50 PA+++',
    brand: 'Dot & Key',
    price: '₹495',
    category: 'sunscreen',
    image: 'https://www.dotandkey.com/cdn/shop/files/VitaminCSunscreenListing1.jpg?v=1745308871&width=700',
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Watermelon Fruit Extract', 'Niacinamide', 'Hyaluronic Acid', 'Aqua'],
    skinTypes: ['Oily', 'Combination', 'Normal', 'Acne-Prone'],
    benefits: ['Broad-spectrum UVA/UVB SPF 50 PA+++ protection', 'Zero white cast, ultra-light fluid feel', 'Controls excess oil with watermelon cooling effect'],
    warnings: ['Reapply every 2 to 3 hours during continuous sun exposure'],
    description: 'A lightweight daily hybrid sunscreen formulated to block UV damage while cooling the skin and controlling excess shine.',
    howToUse: 'Apply generously (two-finger rule) 15-20 minutes before sun exposure as the final step of your morning skincare routine.',
    precautions: 'Reapplication is essential for continued photoprotection. Ensure complete cleansing at night.',
    beneficialActives: ['Watermelon Extract', 'Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid'],
    potentialIrritants: [],
  },

  // --- CETAPHIL ---
  {
    id: 'cet1',
    barcode: '8901030700456',
    name: 'Gentle Skin Cleanser',
    brand: 'Cetaphil',
    price: '₹400',
    category: 'cleanser',
    image: 'https://images-static.nykaa.com/media/catalog/product/1/5/153feb3NYCETA0000010_M.jpg?tr=w-500',
    ingredients: ['Aqua', 'Glycerin', 'Cetearyl Alcohol', 'Panthenol', 'Niacinamide', 'Sodium Cocoyl Isethionate'],
    skinTypes: ['Dry', 'Normal', 'Sensitive', 'Combination'],
    benefits: ['Soap-free and non-comedogenic', 'Preserves natural lipid barrier', 'Clinically proven to hydrate skin while cleansing'],
    warnings: ['For external cleansing only'],
    description: 'A dermatologist-backed hypoallergenic cleanser that gently lifts dirt, oil, and impurities without stripping natural moisture.',
    howToUse: 'Apply to wet skin and gently massage in circular motions. Rinse thoroughly with lukewarm water or tissue off gently.',
    precautions: 'Avoid aggressive friction with washcloths. Suitable for morning and nighttime cleansing.',
    beneficialActives: ['Glycerin', 'Panthenol (Pro-Vitamin B5)', 'Niacinamide (Vitamin B3)'],
    potentialIrritants: [],
  },

  // --- CERAVE ---
  {
    id: 'cer1',
    barcode: '8901030555666',
    name: 'Moisturizing Barrier Cream with 3 Essential Ceramides',
    brand: 'CeraVe',
    price: '₹799',
    category: 'moisturizer',
    image: 'https://images-static.nykaa.com/media/catalog/product/4/8/480b2a7CERAV00000001_1.jpg?tr=w-500',
    ingredients: ['Aqua', 'Glycerin', 'Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Cholesterol', 'Hyaluronic Acid', 'Phytosphingosine'],
    skinTypes: ['Dry', 'Sensitive', 'Normal'],
    benefits: ['Rebuilds compromised skin lipid barrier', 'MVE delivery technology for sustained 24h hydration', 'Fragrance-free and hypoallergenic'],
    warnings: ['Rich texture may feel heavy on congested oily T-zones'],
    description: 'Developed with dermatologists, this cream contains 3 essential ceramides and hyaluronic acid to restore the protective skin barrier.',
    howToUse: 'Apply liberally to face and body as often as needed, particularly following bathing or water exposure.',
    precautions: 'May feel heavy on acne-prone or extremely oily skin; primarily recommended for dry, barrier-impaired, or eczema-prone skin.',
    beneficialActives: ['Ceramides 1, 3, 6-II', 'Hyaluronic Acid', 'Cholesterol', 'Phytosphingosine'],
    potentialIrritants: [],
  },

  // --- NEUTROGENA ---
  {
    id: 'neu1',
    barcode: '8906005123789',
    name: 'Hydro Boost Water Gel Moisturizer',
    brand: 'Neutrogena',
    price: '₹450',
    category: 'moisturizer',
    image: 'https://images-static.nykaa.com/media/catalog/product/2/f/2fe27eaNEUTR00000100_1.jpg?tr=w-500,h-500',
    ingredients: ['Aqua', 'Dimethicone', 'Glycerin', 'Sodium Hyaluronate', 'Cetearyl Olivate', 'Sorbitan Olivate'],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone', 'Normal'],
    benefits: ['Non-comedogenic oil-free formulation', 'Provides instant 72-hour hydration boost', 'Absorbs instantly with zero shine'],
    warnings: ['If contact with eyes occurs, rinse immediately with clean water'],
    description: 'An oil-free, non-comedogenic water-gel moisturizer powered by purified hyaluronic acid that acts like a moisture reservoir.',
    howToUse: 'Apply evenly over face and neck after cleansing and serum application every morning and night.',
    precautions: 'Ideal for acne-prone skin that requires hydration without rich lipid occlusives.',
    beneficialActives: ['Sodium Hyaluronate', 'Glycerin', 'Olive-derived Cetearyl Olivate'],
    potentialIrritants: [],
  },

  // --- PLUM ---
  {
    id: 'pl1',
    barcode: '8901030901234',
    name: '15% Vitamin C Glow Face Serum with Mandarin',
    brand: 'Plum',
    price: '₹550',
    category: 'serum',
    image: 'https://images-static.nykaa.com/media/catalog/product/b/0/b0b3422PLUMX00000068_1.jpg?tr=w-500',
    ingredients: ['Aqua', '3-O-Ethyl Ascorbic Acid (15%)', 'Kakadu Plum Extract', 'Japanese Mandarin Extract', 'Rose Damascena Flower Water', 'Glycerin'],
    skinTypes: ['Normal', 'Dry', 'Combination'],
    benefits: ['Fades dark spots and hyperpigmentation', 'Protects against environmental free radicals', 'Restores natural radiance'],
    warnings: ['Always apply broad-spectrum sunscreen in daytime', 'Mild tingling may occur during initial use'],
    description: 'A stabilized 15% Vitamin C serum with pure Japanese Mandarin extract to promote luminous, even-toned skin.',
    howToUse: 'Apply 2-3 drops onto face and neck after cleansing every morning. Follow with moisturizer and SPF.',
    precautions: 'Store in a cool, dark place away from direct sunlight.',
    beneficialActives: ['3-O-Ethyl Ascorbic Acid (15%)', 'Kakadu Plum', 'Japanese Mandarin'],
    potentialIrritants: [],
  },
  {
    id: 'pl2',
    barcode: '8901030901241',
    name: 'Green Tea Pore Clarifying Toner with Glycolic Acid',
    brand: 'Plum',
    price: '₹390',
    category: 'toner',
    image: 'https://images-static.nykaa.com/media/catalog/product/b/0/b00850c737534800058_1.jpg?tr=w-500',
    ingredients: ['Aqua', 'Camellia Sinensis (Green Tea) Leaf Extract', 'Glycolic Acid', 'Glycerin', 'Sodium Gluconate'],
    skinTypes: ['Oily', 'Acne-Prone', 'Combination'],
    benefits: ['Clarifies clogged pores and tightens texture', 'Green tea antioxidants fight acne bacteria', '100% alcohol-free toner formula'],
    warnings: ['Do not use on open or active bleeding cystic lesions'],
    description: 'An alcohol-free clarifying toner with green tea and gentle glycolic acid that shrinks the appearance of pores and combats shine.',
    howToUse: 'Pour onto cotton pad or hands and gently pat across face after cleansing in PM.',
    precautions: 'Contains AHA (Glycolic Acid); use sunscreen the following morning.',
    beneficialActives: ['Green Tea Extract', 'Glycolic Acid', 'Glycerin'],
    potentialIrritants: [],
  },

  // --- COSRX & BIODERMA ---
  {
    id: 'cx1',
    barcode: '8809416470009',
    name: 'Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    price: '₹1450',
    category: 'serum',
    image: 'https://images-static.nykaa.com/media/catalog/product/5/2/52c16568809416470009_01.jpg?tr=w-500',
    ingredients: ['Snail Secretion Filtrate', 'Betaine', 'Butylene Glycol', 'Sodium Hyaluronate', 'Panthenol', 'Allantoin'],
    skinTypes: ['Dry', 'Normal', 'Combination', 'Sensitive', 'Acne-Prone'],
    benefits: ['Intense cellular hydration and barrier repair', 'Soothes redness and post-acne scarring', 'Improves skin elasticity and glow'],
    warnings: ['Check for mollusk/snail allergies before use'],
    description: 'Composed of 96% snail secretion filtrate to protect skin from moisture loss while improving skin elasticity and soothing irritation.',
    howToUse: 'After cleansing and toning, apply a dime-sized amount to the entire face. Gently pat using fingertips to aid absorption.',
    precautions: 'Apply to damp skin for maximum plumping efficacy. Follow with moisturizer.',
    beneficialActives: ['96% Snail Secretion Filtrate', 'Sodium Hyaluronate', 'Panthenol', 'Allantoin'],
    potentialIrritants: [],
  },
  {
    id: 'bio1',
    barcode: '3401575645851',
    name: 'Sensibio H2O Micellar Cleansing Water',
    brand: 'Bioderma',
    price: '₹590',
    category: 'cleanser',
    image: 'https://images-static.nykaa.com/media/catalog/product/7/c/7c9d1b23401345935571_1.jpg?tr=w-500',
    ingredients: ['Aqua', 'PEG-6 Caprylic/Capric Glycerides', 'Fructooligosaccharides', 'Mannitol', 'Xylitol', 'Rhamnose', 'Cucumis Sativus Fruit Extract'],
    skinTypes: ['Sensitive', 'Normal', 'Dry', 'Combination', 'Acne-Prone'],
    benefits: ['Cleanses makeup, pollutants, and excess sebum', 'Respects skin physiological pH (~5.5)', 'Soothes skin reactivity with cucumber extract'],
    warnings: ['For external use only'],
    description: 'The iconic dermatological micellar water that captures impurities without compromising the cutaneous barrier.',
    howToUse: 'Soak a cotton pad with Sensibio H2O. Gently cleanse and/or remove makeup from your face and eyes. No rinsing required.',
    precautions: 'Ideal first step in a double cleansing routine, especially for reactive or rosacea-prone skin.',
    beneficialActives: ['Cucumber Extract', 'Physiological Micelles', 'Biomimetic sugars'],
    potentialIrritants: [],
  },
];

export const TRENDING = [
  {
    id: 't1',
    title: 'AAD Core Skincare Principles',
    description: 'Gentle cleanser, targeted active, non-comedogenic hydration, and daily broad-spectrum SPF 30-50+ form the foundation of skin health.',
    topic: 'routine',
  },
  {
    id: 't2',
    title: 'Evidence-Based Post-Acne Mark Care',
    description: 'Differentiate between PIE (red vascular marks) and PIH (brown melanic marks). Azelaic acid, niacinamide, and strict SPF prevent darkening.',
    topic: 'dark spots',
  },
  {
    id: 't3',
    title: 'Preserving the Stratum Corneum',
    description: 'Over-washing and stripping disrupts the acid mantle (~pH 5.5), triggering rebound sebum and neurosensory erythema. Stick to lukewarm water.',
    topic: 'barrier',
  },
  {
    id: 't4',
    title: 'Active Layering & Conflict Protocols',
    description: 'Avoid stacking high-potency BHAs with retinoids or strong Vitamin C simultaneously. Separate active steps between AM and PM.',
    topic: 'actives',
  },
];

export function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Find product by barcode.
 * Returns the exact catalog product if registered, or null if unknown.
 * Never generates fake dummy products!
 */
export function findProductByBarcode(barcode: string): CatalogProduct | null {
  const clean = barcode.trim();
  const exact = CATALOG.find((item) => item.barcode === clean);
  return exact || null;
}

/**
 * Backward compatible helper for barcode lookup.
 * Returns the exact product if found, or null if not found.
 */
export function productFromBarcode(barcode: string): CatalogProduct | null {
  return findProductByBarcode(barcode);
}

export function searchCatalog(query: string, category: string = 'all'): CatalogProduct[] {
  const q = query.trim().toLowerCase();
  return CATALOG.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    const searchHaystack = `${item.name} ${item.brand} ${item.description} ${item.ingredients.join(' ')} ${item.benefits.join(' ')}`.toLowerCase();
    return searchHaystack.includes(q);
  });
}

export function productsForSkin(skinType: SkinType, ids?: string[]): CatalogProduct[] {
  if (ids?.length) {
    const picked = ids
      .map((id) => CATALOG.find((item) => item.id === id))
      .filter((item): item is CatalogProduct => Boolean(item));
    if (picked.length) return picked;
  }
  return CATALOG.filter((item) => item.skinTypes.includes(skinType)).slice(0, 8);
}

export function parsePrice(price: string): number {
  return parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
}

export function catalogBrands(): string[] {
  return [...new Set(CATALOG.map((item) => item.brand))].sort();
}

export function substitutesFor(product: CatalogProduct, excludeIds: string[] = []): CatalogProduct[] {
  return CATALOG.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id &&
      !excludeIds.includes(item.id)
  ).slice(0, 8);
}

export function productById(id: string): CatalogProduct | undefined {
  return CATALOG.find((item) => item.id === id);
}

const ENRICHMENTS: Record<
  string,
  { rating: number; reviewCount: string; discount?: string; originalPrice?: string }
> = {
  dc1: { rating: 4.6, reviewCount: '12.4k', discount: '10% OFF', originalPrice: '₹550' },
  dc2: { rating: 4.5, reviewCount: '8.2k', discount: '15% OFF', originalPrice: '₹349' },
  dc3: { rating: 4.7, reviewCount: '15.1k', discount: '10% OFF', originalPrice: '₹649' },
  dc4: { rating: 4.4, reviewCount: '6.3k', discount: '10% OFF', originalPrice: '₹549' },
  dc5: { rating: 4.8, reviewCount: '9.8k', discount: '12% OFF', originalPrice: '₹399' },
  me1: { rating: 4.4, reviewCount: '5.1k', discount: '10% OFF', originalPrice: '₹289' },
  me2: { rating: 4.5, reviewCount: '7.6k', discount: '10% OFF', originalPrice: '₹449' },
  me3: { rating: 4.6, reviewCount: '6.9k', discount: '12% OFF', originalPrice: '₹399' },
  me4: { rating: 4.3, reviewCount: '4.8k', discount: '10% OFF', originalPrice: '₹549' },
  me5: { rating: 4.5, reviewCount: '3.9k', discount: '15% OFF', originalPrice: '₹349' },
  ds1: { rating: 4.7, reviewCount: '8.4k', discount: '10% OFF', originalPrice: '₹399' },
  ds2: { rating: 4.8, reviewCount: '14.2k', discount: '10% OFF', originalPrice: '₹550' },
  min1: { rating: 4.8, reviewCount: '19.8k', discount: '5% OFF', originalPrice: '₹599' },
  min2: { rating: 4.7, reviewCount: '11.5k', discount: '5% OFF', originalPrice: '₹699' },
  dk1: { rating: 4.6, reviewCount: '7.9k', discount: '10% OFF', originalPrice: '₹495' },
  cet1: { rating: 4.9, reviewCount: '28.1k' },
  cer1: { rating: 4.9, reviewCount: '34.5k' },
  neu1: { rating: 4.7, reviewCount: '16.7k', discount: '10% OFF', originalPrice: '₹520' },
  pl1: { rating: 4.6, reviewCount: '9.2k', discount: '15% OFF', originalPrice: '₹650' },
  pl2: { rating: 4.5, reviewCount: '5.4k', discount: '10% OFF', originalPrice: '₹395' },
  cx1: { rating: 4.9, reviewCount: '42.3k' },
  bio1: { rating: 4.9, reviewCount: '31.2k' },
};

CATALOG.forEach((item) => {
  const enrich = ENRICHMENTS[item.id];
  if (enrich) {
    item.rating = enrich.rating;
    item.reviewCount = enrich.reviewCount;
    item.discount = enrich.discount;
    item.originalPrice = enrich.originalPrice;
  }
});
