import { supabase, isSupabaseConfigured } from './supabase.js';
import { initialSeedData } from '../data/seedData.js';

export async function seedSupabaseDb() {
  if (!isSupabaseConfigured() || !supabase) {
    console.log('Supabase not configured, skipping cloud seed.');
    return;
  }

  console.log('🌱 Checking Supabase database tables...');

  try {
    // 1. Check Profiles
    const { data: profiles } = await supabase.from('profiles').select('id');
    if (!profiles || profiles.length === 0) {
      console.log('Inserting default Admin & Staff profiles...');
      const profileRows = initialSeedData.adminUsers.map(u => ({
        id: u.id,
        email: u.email,
        password_hash: 'KeralaPG@123',
        name: u.name,
        phone: u.phone,
        role: u.role,
        status: u.status,
        permissions: u.permissions
      }));
      await supabase.from('profiles').upsert(profileRows, { onConflict: 'email' });
    }

    // 2. Check States & Cities
    const { data: states } = await supabase.from('locations_states').select('id');
    if (!states || states.length === 0) {
      console.log('Inserting States & Cities...');
      for (const country of initialSeedData.locations) {
        for (const state of country.states || []) {
          await supabase.from('locations_states').upsert({
            id: state.id,
            name: state.name,
            code: state.code,
            country: country.name
          }, { onConflict: 'name' });

          for (const city of state.cities || []) {
            await supabase.from('locations_cities').upsert({
              id: city.id,
              state_id: state.id,
              state_name: state.name,
              name: city.name,
              code: city.code,
              display_order: 1
            }, { onConflict: 'state_id,name' });

            for (const area of city.areas || []) {
              const areaName = typeof area === 'string' ? area : area.name;
              await supabase.from('locations_areas').upsert({
                id: `area_${Math.random().toString(36).substring(2, 8)}`,
                city_id: city.id,
                city_name: city.name,
                name: areaName,
                is_popular: true
              }, { onConflict: 'city_id,name' });
            }
          }
        }
      }
    }

    // 3. Check Facilities
    const { data: facs } = await supabase.from('facilities').select('id');
    if (!facs || facs.length === 0) {
      console.log('Inserting Facilities & Amenities...');
      const facRows = initialSeedData.facilities.map(f => ({
        id: f.id,
        name: f.name,
        icon: f.icon,
        category: f.category,
        is_default: f.isDefault,
        is_active: true
      }));
      await supabase.from('facilities').upsert(facRows, { onConflict: 'name' });
    }

    // 4. Check Properties
    const { data: props } = await supabase.from('properties').select('id');
    if (!props || props.length === 0) {
      console.log('Inserting Properties...');
      const propRows = initialSeedData.properties.map(p => {
        let normalizedType = p.type;
        if (normalizedType === 'Co-living' || normalizedType === 'Co-Living') normalizedType = 'Coliving';
        if (normalizedType === 'Male') normalizedType = 'Boys';
        if (normalizedType === 'Female') normalizedType = 'Girls';

        let normVerification = p.verificationStatus || 'Pending';
        if (normVerification === 'Not Verified') normVerification = 'Pending';

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          type: normalizedType || 'Boys',
          status: p.status || 'Active',
          availability_status: p.availabilityStatus || 'Available',
          verification_status: normVerification,
          is_featured: Boolean(p.isFeatured),
          featured_order: p.featuredOrder || 0,
          state: p.state || 'Kerala',
          city: p.city,
          area: p.area,
          full_address: p.fullAddress || '',
          landmark: p.landmark || '',
          pincode: p.pincode || '',
          map_url: p.mapUrl || '',
          description: p.description || '',
          notice_period: p.noticePeriod || '30 Days',
          gate_closing_time: p.gateClosingTime || '10:30 PM',
          food_availability: p.foodAvailability || 'Included in Rent',
          rules: p.rules || [],
          rooms: p.rooms || [],
          facilities: p.facilities || [],
          photos: p.photos || [],
          videos: p.videoUrl ? [p.videoUrl] : (p.videos || []),
          owner_name: p.ownerName || p.owner?.name || 'Property Manager',
          owner_phone: p.ownerPhone || p.contactNumber || '+91 98470 12345',
          whatsapp_number: p.whatsappNumber || p.contactNumber || '+91 98470 12345',
          owner_email: p.ownerEmail || '',
          view_count: p.viewCount || 0,
          inquiry_count: p.inquiryCount || 0,
          unlock_count: p.unlockCount || 0
        };
      });
      const { error: propErr } = await supabase.from('properties').upsert(propRows, { onConflict: 'id' });
      if (propErr) console.error('Property insert error:', propErr);
    }

    // 5. Check Enquiries
    const { data: enqs } = await supabase.from('enquiries').select('id');
    if (!enqs || enqs.length === 0) {
      console.log('Inserting Enquiries...');
      const enqRows = (initialSeedData.enquiries || []).map(e => ({
        id: e.id,
        pg_id: e.pgId || 'pg_101',
        pg_name: e.pgName || 'Malabar Luxury PG',
        customer_name: e.customerName || e.name,
        customer_phone: e.customerPhone || e.phone,
        customer_email: e.customerEmail || e.email || '',
        room_type: e.roomType || '2 Sharing',
        message: e.message || '',
        status: e.status || 'New',
        created_at: e.createdAt || new Date().toISOString()
      }));
      if (enqRows.length > 0) {
        await supabase.from('enquiries').upsert(enqRows, { onConflict: 'id' });
      }
    }

    // 6. Check Customers
    const { data: custs } = await supabase.from('customers').select('id');
    if (!custs || custs.length === 0) {
      console.log('Inserting Customers...');
      const custRows = (initialSeedData.customers || []).map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        city: c.city || 'Kochi',
        saved_pgs: c.savedPgs || [],
        unlocked_pgs: c.unlockedPgs || [],
        total_enquiries: c.totalEnquiries || 0,
        total_paid: c.totalPaid || 0,
        date_joined: c.dateJoined || new Date().toISOString().split('T')[0]
      }));
      if (custRows.length > 0) {
        await supabase.from('customers').upsert(custRows, { onConflict: 'id' });
      }
    }

    // 7. Check Reports
    const { data: reps } = await supabase.from('reports').select('id');
    if (!reps || reps.length === 0) {
      console.log('Inserting Reported Listings...');
      const repRows = (initialSeedData.reportedListings || []).map(r => ({
        id: r.id,
        pg_id: r.pgId || 'pg_101',
        pg_name: r.pgName || 'PG',
        customer_name: r.customerName,
        customer_phone: r.customerPhone,
        reason: r.reason,
        complaint: r.complaint,
        status: r.status || 'Pending',
        action_taken: r.actionTaken || null,
        created_at: r.createdAt || new Date().toISOString()
      }));
      if (repRows.length > 0) {
        await supabase.from('reports').upsert(repRows, { onConflict: 'id' });
      }
    }

    // 8. Check Payments
    const { data: pays } = await supabase.from('payments').select('id');
    if (!pays || pays.length === 0) {
      console.log('Inserting Payments...');
      const payRows = (initialSeedData.payments || []).map(p => ({
        id: p.id,
        transaction_id: p.transactionId,
        customer_name: p.customerName,
        customer_phone: p.customerPhone,
        pg_name: p.pgName,
        purpose: p.purpose,
        amount: p.amount || 19,
        status: p.status || 'Success',
        payment_gateway: p.paymentGateway || 'UPI / Razorpay',
        created_at: p.date || new Date().toISOString()
      }));
      if (payRows.length > 0) {
        await supabase.from('payments').upsert(payRows, { onConflict: 'id' });
      }
    }

    // 9. Check Banners
    const { data: banners } = await supabase.from('banners').select('id');
    if (!banners || banners.length === 0) {
      console.log('Inserting Banners...');
      const bannerRows = initialSeedData.banners.map(b => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle || '',
        image_url: b.imageUrl,
        target_url: b.targetUrl || '/search',
        placement: b.placement || 'Homepage Hero Top',
        city: b.city || 'All Cities',
        is_active: Boolean(b.isActive)
      }));
      await supabase.from('banners').upsert(bannerRows, { onConflict: 'id' });
    }

    // 10. Check CMS
    const { data: cms } = await supabase.from('cms_content').select('key');
    if (!cms || cms.length === 0) {
      console.log('Inserting CMS Pages...');
      for (const [key, content] of Object.entries(initialSeedData.cmsPages || {})) {
        await supabase.from('cms_content').upsert({
          key,
          title: content.title || key,
          content
        }, { onConflict: 'key' });
      }
    }

    console.log('✅ Supabase PostgreSQL Database Seed Completed Successfully!');
  } catch (err) {
    console.error('Error during Supabase auto-seed:', err.message);
  }
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seedDb.js')) {
  seedSupabaseDb().then(() => process.exit(0));
}
