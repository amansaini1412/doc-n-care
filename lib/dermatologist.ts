import type { ChatMessage, SkinProfile } from './types';

const CLINICAL_DISCLAIMER =
  '📌 *Clinical Notice:* I provide cosmetic and educational skincare guidance grounded in dermatological literature (AAD, DermNet, PubMed). I do not provide medical diagnosis or replace a qualified in-person board-certified dermatologist.';

function has(text: string, patterns: (string | RegExp)[]): boolean {
  return patterns.some((p) => (typeof p === 'string' ? text.includes(p) : p.test(text)));
}

export function dermatologistReply(
  input: string,
  profile: SkinProfile,
  history: ChatMessage[]
): string {
  const text = input.trim().toLowerCase();
  const type = profile.skinType;
  const concerns = profile.concerns;
  const barrier = profile.barrierStatus || 'Balanced';
  const hasScan = Boolean(profile.lastScanAt);

  // Personalized patient profile context banner
  const patientContext = hasScan
    ? `📋 *Your Profile Context:* ${type} Skin · Barrier Status: ${barrier} · Confidence: ${profile.confidence}%${
        concerns.length ? ` · Primary Focus: ${concerns.join(', ')}` : ''
      }`
    : '📋 *Profile Context:* No recent face scan detected. My advice is generalized — complete a Face Scan for precision personalization.';

  // 1. Triage Red Flags / Urgent Medical Situations
  if (
    has(text, [
      'infection',
      'pus',
      'oozing',
      'bleeding',
      'fever',
      'cystic',
      'deep nodule',
      'severe pain',
      'mole change',
      'swelling',
      'blister',
      'melanoma',
      'eczema flare',
      'hives',
    ])
  ) {
    return `${patientContext}

⚠️ **Clinical Triage Warning:**
Your symptoms indicate potential acute cutaneous distress, deep inflammatory lesions, or a condition requiring clinical diagnosis.

**Immediate Guidance:**
1. **Do not squeeze or self-drain:** Manipulation of deep cysts or infected pustules forces bacteria deeper into dermal layers, leading to secondary cellulitis and permanent atrophic scarring.
2. **Cease all topical actives:** Immediately discontinue direct acids (AHA/BHA), retinoids, and benzoyl peroxide on the affected area.
3. **Gentle cool compress:** If swollen or warm, apply a clean, sterile cloth moistened with cool distilled water for 5–10 minutes.
4. **Consult a Physician:** Please schedule an in-person consultation with a board-certified dermatologist or primary care physician promptly.

${CLINICAL_DISCLAIMER}`;
  }

  // 2. Greetings & Introductions
  if (has(text, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you'])) {
    const greetingName = profile.name && profile.name !== 'there' ? ` ${profile.name}` : '';
    return `Hello${greetingName}! I am your **DOC-N-CARE AI Dermatologist Assistant**.

${patientContext}

I am here to help you navigate evidence-based skincare routines, ingredient compatibility, barrier recovery, and safe home care backed by the American Academy of Dermatology (AAD) and clinical research.

**What would you like to explore today?**
• Breakout management & acne protocols
• Morning & nighttime routine optimization
• Active ingredient combinations & conflicts (e.g., Retinol, Niacinamide, Vitamin C)
• Fading hyperpigmentation & post-acne marks
• Safe, low-risk home remedies vs dangerous DIY hacks
• Barrier recovery & sunscreen guidance`;
  }

  // 3. Acne & Breakout Inquiries
  if (has(text, ['acne', 'pimple', 'breakout', 'zits', 'blackhead', 'whitehead', 'clogged pore', 'congestion'])) {
    const specificToType =
      type === 'Sensitive'
        ? 'Since your skin has sensitive tendencies, avoid harsh 10% benzoyl peroxide or multiple drying acids. Favor gentle 1% Salicylic Acid or Azelaic Acid with soothing Centella.'
        : type === 'Dry'
        ? 'Because your skin is dry, acne treatments can easily compromise your moisture barrier. Always apply acne actives over a thin layer of hydrator, not on bare, stripped skin.'
        : 'For oily and combination skin, target both sebum reduction and follicular hyperkeratinization with BHA and Niacinamide.';

    return `${patientContext}

🔬 **Dermatological Protocol for Breakouts:**

**1. The Pathophysiology:**
Breakouts develop from follicular occlusion (dead skin cells + sebum) combined with *C. acnes* proliferation and subsequent inflammatory response.

**2. Evidence-Based Topical Care:**
• **Salicylic Acid (BHA 1–2%):** Lipophilic beta-hydroxy acid that penetrates lipid-rich sebaceous glands to dissolve keratotic plugs.
• **Niacinamide (2–5%):** Clinically proven to regulate sebum excretion rate and calm inflammatory erythema without drying.
• **Azelaic Acid (10%):** Antimicrobial, anti-inflammatory, and inhibits tyrosinase (preventing dark marks).

**3. Tailored to your profile:**
${specificToType}

**4. Clinical Habits to Follow:**
• Cleanse twice daily with a lukewarm, pH-balanced cleanser — aggressive scrubbing exacerbates inflammation.
• Never pick, squeeze, or pop blemishes; doing so ruptures follicular walls and causes dermal scarring.
• Replace pillowcases twice weekly and sanitize phone surfaces.

${CLINICAL_DISCLAIMER}`;
  }

  // 4. Dryness, Dehydration, Flaking, Barrier Compromise
  if (has(text, ['dry', 'dehydrat', 'flak', 'tight', 'peel', 'barrier', 'parched', 'cracking'])) {
    return `${patientContext}

💧 **Stratum Corneum Barrier Recovery Protocol:**

**1. Root Cause Analysis:**
Tightness and flaking indicate elevated **Transepidermal Water Loss (TEWL)** caused by a depleted intercellular lipid matrix (ceramides, cholesterol, free fatty acids).

**2. The 3-Tier Rehydration Rule:**
• **Humectants (Draw Water):** Apply Hyaluronic Acid or Glycerin exclusively on **damp skin** immediately after cleansing. If applied to dry skin in dry air, humectants can pull moisture out of deeper dermal layers.
• **Emollients (Smooth Micro-fissures):** Squalane or Panthenol fill intercellular spaces.
• **Occlusives (Lock it Down):** Seal with a physiological ceramide cream (NP, AP, EOP) to prevent water evaporation.

**3. Critical Adjustments:**
• Drop water temperature from hot to lukewarm.
• Pause all chemical exfoliants (glycolic, salicylic) and retinoids for 7–10 days until tightness resolves.
• If indoors in AC or winter air, an ultrasonic room humidifier can increase ambient humidity and preserve epidermal hydration.

${CLINICAL_DISCLAIMER}`;
  }

  // 5. Oily Skin, Shine, Sebum Control
  if (has(text, ['oil', 'shine', 'greasy', 'sebum', 't-zone', 'mattify', 'slick'])) {
    return `${patientContext}

✨ **Evidence-Based Sebum Management Strategy:**

**1. The Rebound Sebum Mechanism:**
The most common mistake with oily skin is over-washing with harsh sulfates or alcohol-based astringents. When the acid mantle (~pH 5.5) is stripped, sebocytes receive a compensatory signal to overproduce sebum.

**2. Recommended Regimen:**
• **Cleanser:** Mild foaming or gel cleanser formulated with gentle surfactants (e.g., Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine).
• **Serum:** Niacinamide 5–10% combined with Zinc PCA 1% — clinically shown in PubMed literature to reduce sebum excretion rate and refine pore appearance.
• **Moisturizer:** Do not skip moisturizer! Use an oil-free, non-comedogenic water-gel hydrator rich in hyaluronic acid.

**3. Daytime Maintenance:**
• Use blotting sheets rather than powdering excessively over existing oil and dirt.
• Choose fluid, matte-finish broad-spectrum sunscreens (look for silica or zinc oxide).

${CLINICAL_DISCLAIMER}`;
  }

  // 6. Hyperpigmentation, Dark Spots, PIH, PIE, Melasma
  if (has(text, ['dark', 'spot', 'pigment', 'mark', 'tan', 'melasma', 'pie', 'pih', 'uneven', 'fade'])) {
    return `${patientContext}

🎯 **Clinical Approach to Hyperpigmentation & Post-Acne Marks:**

**1. Identify your Mark Type:**
• **PIE (Post-Inflammatory Erythema):** Pink or red marks caused by dilated microscopic capillaries after a blemish. Responds best to Centella, Niacinamide, and Azelaic Acid.
• **PIH (Post-Inflammatory Hyperpigmentation):** Brown or dusky marks caused by excess melanin deposited in the epidermis. Responds to tyrosinase inhibitors.

**2. Proven Tyrosinase Inhibitors:**
• **Vitamin C (Ascorbic Acid or 3-O-Ethyl Ascorbic Acid):** Scavenges UV-induced reactive oxygen species and suppresses melanogenesis.
• **Azelaic Acid (10%):** Selectively targets hyperactive melanocytes with minimal risk of lightening surrounding normal skin.
• **Alpha Arbutin & Niacinamide:** Interfere with melanosome transfer from melanocytes to keratinocytes.

**3. The Golden Rule:**
No brightening active will work without **Broad-Spectrum SPF 50 daily**. Sunlight (both UVA and visible light) stimulates melanocytes and rapidly re-darkens fading marks.

${CLINICAL_DISCLAIMER}`;
  }

  // 7. Sensitivity, Rosacea, Redness, Burning, Stinging
  if (has(text, ['red', 'irritat', 'sensitiv', 'itch', 'burn', 'sting', 'reactive', 'rosacea', 'flush'])) {
    return `${patientContext}

🌿 **Soothing & Anti-Erythema Protocol:**

**1. Cutaneous Neurosensory Calming:**
When skin stings or flushes, the stratum corneum's defensive barrier is micro-fissured, allowing neuro-irritants to stimulate sensory nerve endings.

**2. Elimination Protocol (Next 7–10 Days):**
• Zero fragrance, essential oils (lavender, tea tree, citrus), menthol, eucalyptus, or alcohol denat.
• Pause all active serums (retinoids, vitamin C, AHA/BHA).
• Wash with cold or lukewarm water only; never rub with towels.

**3. Proven Barrier Therapeutics:**
• **Centella Asiatica & Madecassoside:** Accelerates microvascular healing and suppresses pro-inflammatory cytokines.
• **Colloidal Oatmeal (FDA skin protectant):** Contains avenanthramides that clinically reduce pruritus and redness.
• **Panthenol (5% Pro-Vitamin B5):** Enhances epidermal differentiation and lipid synthesis.

${CLINICAL_DISCLAIMER}`;
  }

  // 8. Safe Home Remedies vs Dangerous DIY Hacks
  if (has(text, ['home', 'remed', 'natural', 'diy', 'kitchen', 'honey', 'aloe', 'lemon', 'baking soda', 'toothpaste'])) {
    return `${patientContext}

🍯 **Dermatologist Review of Home Remedies:**

**✅ Clinically Supported, Low-Risk Home Care:**
1. **Raw / Medical-grade Honey Mask:** Natural humectant with osmotic antimicrobial properties and low pH. Apply a thin layer for 10–15 minutes on cleansed skin, then rinse with lukewarm water.
2. **Pure Aloe Vera (Inner Fillet Gel):** Contains acemannan polysaccharides that soothe acute erythema and minor sunburns. Keep refrigerated for extra cooling relief.
3. **Colloidal Oatmeal Compress:** Finely ground whole oat grain boiled in water and cooled. Soaks alleviate intense itchiness and dry dermatitis.
4. **Cooled Green Tea Compress:** Brewed, chilled green tea bags contain epigallocatechin gallate (EGCG), a potent antioxidant and mild vasoconstrictor that temporarily calms puffiness and redness.

**❌ Dangerous DIY Hacks to AVOID:**
• **Lemon Juice / Citrus:** Highly acidic (pH ~2) and causes severe photophotodermatitis, chemical burns, and deep hyperpigmentation when exposed to UV light.
• **Baking Soda:** Strongly alkaline (pH ~9). Destroys the skin's acidic barrier (~pH 5.5), promoting bacterial colonization and severe dryness.
• **Toothpaste on Pimples:** Contains sodium lauryl sulfate, menthol, and flavoring agents that cause contact dermatitis and chemical burns.
• **Undiluted Apple Cider Vinegar or Garlic:** Causes localized chemical necrosis and ulceration.

${CLINICAL_DISCLAIMER}`;
  }

  // 9. Routine Building & Step Sequencing
  if (has(text, ['routine', 'regimen', 'step', 'morning', 'night', 'order', 'sequence', 'how to layer'])) {
    const amSteps = profile.dailyRoutine.filter((r) => r.time === 'AM');
    const pmSteps = profile.dailyRoutine.filter((r) => r.time === 'PM');

    const formattedAM = amSteps.length
      ? amSteps.map((s, idx) => `  ${idx + 1}. ${s.step}`).join('\n')
      : '  1. Gentle Cleanser\n  2. Antioxidant / Niacinamide Serum\n  3. Light Moisturizer\n  4. Broad-Spectrum SPF 50';

    const formattedPM = pmSteps.length
      ? pmSteps.map((s, idx) => `  ${idx + 1}. ${s.step}`).join('\n')
      : '  1. Gentle Cleanser\n  2. Targeted Active / Treatment\n  3. Barrier Repair Moisturizer';

    return `${patientContext}

📅 **Your Personalized Dermatological Daily Routine:**

**The Golden Rule of Layering:**
Always apply topical products from **thinnest viscosity (water-based) to thickest viscosity (oil/cream-based)**, finishing with SPF in the AM.

☀️ **Morning Routine (Defend & Protect):**
${formattedAM}

🌙 **Night Routine (Repair & Restore):**
${formattedPM}

**Important Rule:**
Introduce only **one new active product at a time**, waiting 2 weeks before introducing another. This allows you to monitor compatibility without guessing what caused an irritation.

${CLINICAL_DISCLAIMER}`;
  }

  // 10. Ingredient Combinations & Conflicts
  if (has(text, ['combine', 'combination', 'mix', 'conflict', 'layer', 'together', 'retinol', 'vitamin c', 'niacinamide', 'aha', 'bha'])) {
    return `${patientContext}

🧪 **Dermatological Active Compatibility & Conflict Guide:**

**✅ Power Synergies:**
• **Vitamin C + Sunscreen (AM):** Vitamin C neutralizes free radicals that penetrate UV filters, boosting photoprotection.
• **Niacinamide + Salicylic Acid:** Niacinamide calms inflammation while BHA clears follicular debris.
• **Hyaluronic Acid + Ceramides:** Humectant delivers hydration; ceramides lock it into the stratum corneum.

**⚠️ Caution & Separation Protocols:**
• **Retinol + Direct Acids (Glycolic/Salicylic):** Do not apply simultaneously in the same PM session. Alternate nights (e.g., Skin Cycling: Exfoliation Night 1, Retinol Night 2, Recovery Nights 3 & 4).
• **Vitamin C (L-Ascorbic Acid) + Retinol:** Use Vitamin C in the morning and Retinol exclusively at night.
• **Benzoyl Peroxide + Pure Retinol:** Benzoyl peroxide can oxidize and degrade pure retinol. Separate by AM/PM.

${CLINICAL_DISCLAIMER}`;
  }

  // 11. Sunscreen & Photoprotection
  if (has(text, ['sunscreen', 'spf', 'sun', 'uv', 'mineral', 'chemical', 'white cast', 'tan'])) {
    return `${patientContext}

☀️ **Clinical Photoprotection Standards (AAD Guidelines):**

**1. Minimum Requirement:**
Use a broad-spectrum sunscreen with **SPF 30 to 50+** that protects against both UVB (burning) and UVA (deep photoaging and pigmentation).

**2. Mineral vs. Chemical Filters:**
• **Mineral / Physical (Zinc Oxide, Titanium Dioxide):** Sits on the skin surface to reflect/absorb UV. Recommended for sensitive, post-procedure, rosacea, and reactive skin.
• **Organic / Chemical (Mexoryl, Tinosorb, Avobenzone):** Absorbs UV and converts it to mild heat. Offers ultra-lightweight, invisible textures ideal for oily skin and daily wear under makeup.

**3. Dosage & Reapplication:**
• Use the **two-finger rule** (two strips of sunscreen along index and middle fingers) for face and neck.
• Reapply every **2 hours** when outdoors, sweating, or swimming.

${CLINICAL_DISCLAIMER}`;
  }

  // 12. Diet, Hydration, Sleep, Lifestyle
  if (has(text, ['diet', 'food', 'water', 'sleep', 'lifestyle', 'gut', 'dairy', 'sugar'])) {
    return `${patientContext}

🥗 **Systemic & Lifestyle Dermatological Evidence:**

**1. High-Glycemic Diets & Acne:**
Clinical trials demonstrate that high-glycemic foods (sugary beverages, refined carbohydrates) elevate insulin and IGF-1 levels, directly triggering sebocyte proliferation and androgen synthesis.

**2. Dairy:**
In certain acne-prone individuals, whey protein and skim dairy correlate with increased microcomedone formation due to natural bovine hormones.

**3. Internal Hydration & Sleep:**
• Drinking sufficient water is vital for general cellular physiology, though topical moisturizers are still required to seal surface TEWL.
• During deep sleep, nocturnal epidermal cell turnover peaks and barrier recovery accelerates. Aim for 7–8 hours.

${CLINICAL_DISCLAIMER}`;
  }

  // 13. General Fallback with Contextual Encouragement
  const recentTopics = concerns.length ? concerns.join(', ') : 'hydration, barrier care, and oil regulation';

  return `${patientContext}

Thank you for your question: *“${input.trim()}”*

To give you the most accurate dermatological guidance, I can delve into:
• **Your active concerns:** Tailored solutions for ${recentTopics}.
• **Product ingredients:** Paste an ingredient list or product name to analyze compatibility.
• **Active scheduling:** How to cycle retinoids, BHAs, or vitamin C without burning your barrier.
• **Clinical home remedies:** Low-risk, scientifically validated home treatments.

Could you tell me a little more about how your skin feels right now (e.g., tight, oily, stinging, breaking out) and what products you currently use?

${CLINICAL_DISCLAIMER}`;
}
