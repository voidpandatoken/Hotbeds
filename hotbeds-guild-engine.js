<!-- 1. Include Supabase v2 CDN in your HTML <head> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- 2. Complete Hotbeds -> The Guild Corporate Rate & Profit Engine -->
<script>
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_YOUR_KEY_HERE';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const ENGINE_CONFIG = {
  MIN_PUBLIC_RATE_FOR_GUILD: 175.00, // High-end guest filter
  MIN_PROFIT_FLOOR_PER_NIGHT: 25.00, // Hard rule: Must clear >= $25/night after 20% off
  PROMO_DISCOUNT_PCT: 0.20,          // 20% introductory Hotbeds -> Guild promo
  DEFAULT_GUILD_RATIO: 195 / 289.99, // ~0.6724 ($195 Guild rate on $289.99 public rate)
  MULTI_NIGHT_THRESHOLD: 3,          // 3+ nights triggers multi-night bonus savings
  MULTI_NIGHT_BONUS_PCT: 0.04,       // Extra 4% off on 3+ nights if profit floor allows
  SPLIT: {
    GATEWAY_RESERVE: 0.15,           // 15% for card fees & VCC buffer
    HOTBEDS_SHARE: 0.55,             // 55% allocated to Hotbeds acquisition engine
    GUILD_TREASURY: 0.30             // 30% allocated to The Guild perks & charter pool
  }
};

/**
 * Evaluates a hotel's corporate rate, 20% Hotbeds promo eligibility,
 * multi-night savings, and exact Hotbeds vs. Guild profit split.
 *
 * Example input:
 *   publicRate: 289.99, corporateNetCost: 140.00, guildNativeRate: 195.00, nights: 3
 */
function calculateCorporateArbitrage({
  publicRate = 289.99,
  corporateNetCost = 140.00,
  guildNativeRate = null,
  nights = 1,
  rateType = 'fixed_corporate' // 'fixed_corporate' (promoted first) or 'seasonal_corporate'
}) {
  // 1. Standard Guild native rate (defaults to $195.00 on $289.99 ratio if not explicitly set)
  const baseGuildRate = guildNativeRate !== null
    ? +guildNativeRate.toFixed(2)
    : +(publicRate * ENGINE_CONFIG.DEFAULT_GUILD_RATIO).toFixed(2);

  // 2. Calculate 20% off Hotbeds introductory promo rate ($289.99 * 0.80 = $231.99)
  let promoRate20Pct = +(publicRate * (1 - ENGINE_CONFIG.PROMO_DISCOUNT_PCT)).toFixed(2);

  // 3. Apply Multi-Night Savings if staying 3+ nights (and floor still holds)
  let multiNightBonusApplied = false;
  if (nights >= ENGINE_CONFIG.MULTI_NIGHT_THRESHOLD) {
    const candidateMultiRate = +(promoRate20Pct * (1 - ENGINE_CONFIG.MULTI_NIGHT_BONUS_PCT)).toFixed(2);
    if ((candidateMultiRate - corporateNetCost) >= ENGINE_CONFIG.MIN_PROFIT_FLOOR_PER_NIGHT) {
      promoRate20Pct = candidateMultiRate;
      multiNightBonusApplied = true;
    }
  }

  // 4. Calculate Net Profit Per Night on the 20% Promo Rate ($231.99 - $140.00 = $91.99)
  const netProfitPerNight = +(promoRate20Pct - corporateNetCost).toFixed(2);
  const totalNetProfit = +(netProfitPerNight * nights).toFixed(2);

  // 5. Enforce the High-End Price Filter AND the $25/Night Net Profit Floor
  const qualifiesFor20PctGuildOffer =
    publicRate >= ENGINE_CONFIG.MIN_PUBLIC_RATE_FOR_GUILD &&
    netProfitPerNight >= ENGINE_CONFIG.MIN_PROFIT_FLOOR_PER_NIGHT;

  // 6. Calculate Revenue Split (Per Night & Total Stay)
  const gatewayReservePerNight = +(netProfitPerNight * ENGINE_CONFIG.SPLIT.GATEWAY_RESERVE).toFixed(2);
  const hotbedsSharePerNight = +(netProfitPerNight * ENGINE_CONFIG.SPLIT.HOTBEDS_SHARE).toFixed(2);
  const guildTreasuryPerNight = +(netProfitPerNight - gatewayReservePerNight - hotbedsSharePerNight).toFixed(2);

  return {
    rateType,
    isNaturallyPromoted: rateType === 'fixed_corporate',
    nights,
    publicRate: +publicRate.toFixed(2),
    corporateNetCost: +corporateNetCost.toFixed(2),
    guildNativeRate: baseGuildRate,
    promoRate20Pct,
    customerSavingsPerNight: +(publicRate - promoRate20Pct).toFixed(2),
    totalCustomerSavings: +((publicRate - promoRate20Pct) * nights).toFixed(2),
    multiNightBonusApplied,
    qualifiesFor20PctGuildOffer,
    netProfitPerNight,
    totalNetProfit,
    revenueSplitPerNight: {
      gatewayReserve: gatewayReservePerNight,
      hotbedsProfit: hotbedsSharePerNight,
      guildTreasury: guildTreasuryPerNight
    },
    revenueSplitTotalStay: {
      gatewayReserve: +(gatewayReservePerNight * nights).toFixed(2),
      hotbedsProfit: +(hotbedsSharePerNight * nights).toFixed(2),
      guildTreasury: +(guildTreasuryPerNight * nights).toFixed(2)
    }
  };
}

/**
 * Generates a unique Guild Key (GH-XXXXXX)
 */
function generateGuildKey() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let key = 'GH-';
  for (let i = 0; i < 6; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

/**
 * Logs a 20% Guild SMS Promotional Lead from Hotbeds into Supabase
 * Only fires the 20% Guild flags if the room cleared the $25 profit floor.
 */
async function logHotbedsToGuildSmsLead({
  email,
  phone,
  fullName = '',
  city = 'Hamilton',
  publicRate = 289.99,
  corporateNetCost = 140.00,
  nights = 1,
  rateType = 'fixed_corporate'
}) {
  const deal = calculateCorporateArbitrage({ publicRate, corporateNetCost, nights, rateType });
  const assignedGuildKey = deal.qualifiesFor20PctGuildOffer ? generateGuildKey() : null;

  const { error } = await supabaseClient
    .from('member_leads')
    .insert([{
      email: email ? email.trim().toLowerCase() : null,
      phone: phone.trim(),
      full_name: fullName.trim(),
      brand_source: deal.qualifiesFor20PctGuildOffer ? 'Hotbeds -> The Guild' : 'Hotbeds',
      signup_funnel: deal.qualifiesFor20PctGuildOffer ? 'guild_20pct_sms' : 'hotbeds_club',
      used_20pct_guild_discount: deal.qualifiesFor20PctGuildOffer,
      sms_verified: true,
      guild_key: assignedGuildKey,
      city_interest: city,
      rate_type: deal.rateType,
      public_rate: deal.publicRate,
      promo_rate_20pct: deal.promoRate20Pct,
      corporate_net_cost: deal.corporateNetCost,
      net_profit_per_night: deal.netProfitPerNight,
      hotbeds_profit_share: deal.revenueSplitPerNight.hotbedsProfit,
      guild_treasury_share: deal.revenueSplitPerNight.guildTreasury,
      metadata: {
        nights: deal.nights,
        multi_night_bonus: deal.multiNightBonusApplied,
        gateway_reserve_per_night: deal.revenueSplitPerNight.gatewayReserve,
        total_stay_profit: deal.totalNetProfit
      }
    }]);

  if (error) {
    console.error('Supabase Lead Insert Error:', error.message);
    return { success: false, error: error.message };
  }

  return {
    success: true,
    guildKey: assignedGuildKey,
    pricing: deal
  };
}
</script>
