<!-- Load Supabase JS v2 CDN -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // 1. Initialize with your Project URL and new Publishable Key
  const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_REPLACE_WITH_YOUR_KEY';

  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  /**
   * FUNCTION A: Capture Hotbeds Club Signups (Standard Email/Phone Signup)
   */
  async function captureHotbedsClubSignup({ email, phone, fullName = '', city = '' }) {
    // Note: Do NOT chain .select() here because RLS is Insert-Only for security
    const { error } = await supabaseClient
      .from('member_leads')
      .insert([{
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        full_name: fullName.trim(),
        brand_source: 'Hotbeds',
        signup_funnel: 'hotbeds_club',
        used_20pct_guild_discount: false,
        sms_verified: false,
        city_interest: city
      }]);

    if (error) console.error('Supabase Club Signup Error:', error.message);
    return !error;
  }

  /**
   * FUNCTION B: Capture Users Who Selected the 20% Discount via Guild SMS Verification
   */
  async function captureGuild20PercentSmsConvert({ email, phone, fullName = '', guildKey = '', city = '' }) {
    const { error } = await supabaseClient
      .from('member_leads')
      .insert([{
        email: email ? email.trim().toLowerCase() : null,
        phone: phone.trim(),
        full_name: fullName.trim(),
        brand_source: 'Hotbeds -> The Guild',
        signup_funnel: 'guild_20pct_sms',
        used_20pct_guild_discount: true,
        sms_verified: true,
        guild_key: guildKey,
        city_interest: city
      }]);

    if (error) console.error('Supabase 20% Guild SMS Error:', error.message);
    return !error;
  }

  /**
   * FUNCTION C: Capture All Booking Contacts (Across Hotbeds, The Guild, or RateHack)
   */
  async function captureBookingContact({
    folioRef,
    brandSource, // 'Hotbeds', 'The Guild', or 'RateHack.ca'
    guestName,
    guestEmail,
    guestPhone,
    hotelName,
    city,
    checkIn,
    checkOut,
    nightlyRate,
    totalPaid,
    used20PctDiscount = false,
    smsVerified = false,
    guildKey = null,
    arrivalNotes = ''
  }) {
    const { error } = await supabaseClient
      .from('bookings_ledger')
      .insert([{
        folio_reference: folioRef,
        brand_source: brandSource,
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim().toLowerCase(),
        guest_phone: guestPhone.trim(),
        hotel_name: hotelName,
        city: city,
        check_in: checkIn,
        check_out: checkOut,
        nightly_rate: nightlyRate,
        total_paid: totalPaid,
        used_20pct_guild_discount: used20PctDiscount,
        sms_verified: smsVerified,
        guild_key: guildKey,
        arrival_notes: arrivalNotes
      }]);

    if (error) console.error('Supabase Booking Error:', error.message);
    return !error;
  }
</script>
