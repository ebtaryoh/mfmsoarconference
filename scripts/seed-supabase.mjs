import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set in environment.')
  process.exit(1)
}

const sql = postgres(connectionString, { ssl: 'require', max: 5 })

console.log('Seeding SOAR 2026 initial records to Supabase...')

try {
  // 1. Organization
  await sql`
    INSERT INTO organizations (id, name, slug, description, created_at, updated_at)
    VALUES (
      'org_mfm_youth', 
      'MFM Youth Ministry', 
      'mfm-youth-ministry', 
      'Mountain of Fire and Miracles Ministries Worldwide Youth Directorate',
      NOW(), 
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
  `
  console.log('✔ Organization seeded')

  // 2. Org Units
  await sql`
    INSERT INTO org_units (id, organization_id, name, type, state_or_region, contact_email, created_at)
    VALUES 
      ('unit_unilag', 'org_mfm_youth', 'UNILAG Campus Fellowship', 'campus_fellowship', 'Lagos State', 'unilag@mfmyouth.org', NOW()),
      ('unit_futa', 'org_mfm_youth', 'FUTA Campus Fellowship', 'campus_fellowship', 'Ondo State', 'futa@mfmyouth.org', NOW()),
      ('unit_ui', 'org_mfm_youth', 'UI Campus Fellowship', 'campus_fellowship', 'Oyo State', 'ui@mfmyouth.org', NOW()),
      ('unit_lagos_reg', 'org_mfm_youth', 'Lagos Regional Youth Church', 'youth_church', 'Lagos State', 'lagos@mfmyouth.org', NOW()),
      ('unit_ushers', 'org_mfm_youth', 'National Ushering Corps Directorate', 'ushering_corps', 'National HQ', 'ushers@mfmyouth.org', NOW())
    ON CONFLICT (id) DO NOTHING
  `
  console.log('✔ Org Units seeded (5 units)')

  // 3. Official Event
  await sql`
    INSERT INTO events (
      id, organization_id, name, slug, theme, year, start_date, end_date, 
      venue_name, venue_address, max_capacity, status, is_archived, settings, created_at, updated_at
    )
    VALUES (
      'event_soar_2026',
      'org_mfm_youth',
      'SOAR 2026 — Higher Together',
      'soar-2026',
      'Higher Together: Taking Flight into Kingdom Dominion',
      2026,
      '2026-12-10 08:00:00+00',
      '2026-12-13 18:00:00+00',
      'MFM Prayer City Multipurpose Hall',
      'Multipurpose Hall, MFM Prayer City, KM 12, Lagos-Ibadan Expressway, Ogun State, Nigeria',
      25000,
      'published',
      false,
      '{"allowFreeRegistration": true, "requirePhoneVerification": false, "paystackPublicKey": "pk_test_sample", "supportEmail": "soar@mfmyouth.org"}'::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET 
      start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date,
      venue_name = EXCLUDED.venue_name,
      venue_address = EXCLUDED.venue_address
  `
  console.log('✔ Event SOAR 2026 seeded (Dec 10-13, Multipurpose Hall)')

  // 4. Staff Users
  await sql`
    INSERT INTO users (id, email, "fullName", phone_number, role, org_unit_id, is_active, created_at, updated_at)
    VALUES 
      ('usr_admin_1', 'admin@mfmyouth.org', 'Pastor Daniel Olukoya (Youth Overseer)', '+2348000000001', 'platform_admin', 'unit_lagos_reg', true, NOW(), NOW()),
      ('usr_usher_lead', 'usher.lead@mfmyouth.org', 'Bro. Emmanuel Adeleke (Head Usher)', '+2348000000002', 'check_in_usher', 'unit_ushers', true, NOW(), NOW()),
      ('usr_merch_lead', 'merch.lead@mfmyouth.org', 'Sis. Deborah Adenuga (Merch Coordinator)', '+2348000000003', 'merchandise_manager', 'unit_lagos_reg', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `
  console.log('✔ Staff & Leadership users seeded')

  // 5. Merchandise Products with Real Photos
  await sql`
    INSERT INTO merchandise_products (id, event_id, name, slug, category, base_price, currency, description, images, is_active, created_at)
    VALUES 
      ('prod_tshirt', 'event_soar_2026', 'SOAR 2026 Official Conference T-Shirt', 'soar-2026-tshirt', 'apparel', 8500, 'NGN', '280 GSM heavyweight luxury cotton tee featuring metallic gold SOAR emblem and MFM Youth crest.', '["/merch/soar-merch-1.jpg"]'::jsonb, true, NOW()),
      ('prod_cap', 'event_soar_2026', 'SOAR 2026 3D Embroidered Structured Cap', 'soar-2026-cap', 'headwear', 6000, 'NGN', 'Authentic 6-panel structured cap with 3D puff metallic gold embroidery and brass buckle.', '["/merch/soar-merch-2.jpg"]'::jsonb, true, NOW()),
      ('prod_hoodie', 'event_soar_2026', 'SOAR 2026 Gen-Z Heavyweight Fleece Hoodie', 'soar-2026-hoodie', 'apparel', 18500, 'NGN', 'Oversized luxury fleece hoodie with embroidered wings motif, kangaroo pocket, and ribbed cuffs.', '["/merch/soar-merch-1.jpg"]'::jsonb, true, NOW()),
      ('prod_journal', 'event_soar_2026', 'SOAR 2026 Debossed Leather Journal & Pen', 'soar-2026-journal', 'stationery', 6000, 'NGN', 'Faux leather hardbound prayer and keynote journal with gold foil ribbon bookmark and ballpoint pen.', '["/merch/soar-merch-2.jpg"]'::jsonb, true, NOW()),
      ('prod_wristband', 'event_soar_2026', 'SOAR 2026 Glow-in-the-Dark Silicone Wristband', 'soar-2026-wristband', 'accessories', 1500, 'NGN', 'Embossed phosphorescent wristband with theme scripture (Isaiah 40:31).', '["/merch/soar-merch-2.jpg"]'::jsonb, true, NOW())
    ON CONFLICT (id) DO UPDATE SET 
      base_price = EXCLUDED.base_price,
      images = EXCLUDED.images
  `
  console.log('✔ Merchandise catalog seeded (5 items with real photos)')

  // 6. Product Variants & Inventory
  await sql`
    INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, inventory_count, reserved_count, price_offset)
    VALUES 
      ('var_ts_s', 'prod_tshirt', 'S', 'Midnight Navy', '#0c1b33', 'SOAR26-TSHIRT-S', 120, 0, 0),
      ('var_ts_m', 'prod_tshirt', 'M', 'Midnight Navy', '#0c1b33', 'SOAR26-TSHIRT-M', 250, 0, 0),
      ('var_ts_l', 'prod_tshirt', 'L', 'Midnight Navy', '#0c1b33', 'SOAR26-TSHIRT-L', 300, 0, 0),
      ('var_ts_xl', 'prod_tshirt', 'XL', 'Midnight Navy', '#0c1b33', 'SOAR26-TSHIRT-XL', 180, 0, 0),
      ('var_ts_xxl', 'prod_tshirt', '2XL', 'Midnight Navy', '#0c1b33', 'SOAR26-TSHIRT-2XL', 80, 0, 0),
      ('var_ts_boxy', 'prod_tshirt', 'Boxy Fit', 'Midnight Navy', '#0c1b33', 'SOAR26-TSHIRT-BOXY', 150, 0, 0),
      ('var_cap_adj', 'prod_cap', 'One Size', 'Deep Navy Blue', '#0c1b33', 'SOAR26-CAP-ADJ', 450, 0, 0),
      ('var_hd_m', 'prod_hoodie', 'M', 'Midnight Navy', '#0c1b33', 'SOAR26-HOODIE-M', 80, 0, 0),
      ('var_hd_l', 'prod_hoodie', 'L', 'Midnight Navy', '#0c1b33', 'SOAR26-HOODIE-L', 100, 0, 0),
      ('var_hd_xl', 'prod_hoodie', 'XL', 'Midnight Navy', '#0c1b33', 'SOAR26-HOODIE-XL', 60, 0, 0),
      ('var_jn_std', 'prod_journal', 'Standard A5', 'Midnight Navy & Gold', '#0c1b33', 'SOAR26-JOURNAL-STD', 400, 0, 0),
      ('var_wb_std', 'prod_wristband', 'One Size', 'Luminous Gold', '#ffd66a', 'SOAR26-WRISTBAND-STD', 1500, 0, 0)
    ON CONFLICT (id) DO UPDATE SET inventory_count = EXCLUDED.inventory_count
  `
  console.log('✔ Product variants & stock counts seeded (12 variants, 3,690 total items)')

  // 7. Conference Sessions (December 10th - 13th)
  await sql`
    INSERT INTO conference_sessions (id, event_id, day_number, session_date, time_window, title, category, venue_location, description, ministers, is_highlight, created_at)
    VALUES 
      ('sess_1', 'event_soar_2026', 1, 'Thursday, Dec 10, 2026', '08:00 AM – 02:00 PM', 'Delegate Arrival & Fast-Track Check-In', 'Logistics', 'Turnstiles & Multipurpose Hall Entry', 'Accreditation, digital wristband issuance, and accommodation check-in.', '["Ushering Corps"]'::jsonb, false, NOW()),
      ('sess_2', 'event_soar_2026', 1, 'Thursday, Dec 10, 2026', '05:00 PM – 09:30 PM', 'Opening Plenary: Taking Flight into Higher Dimensions', 'Plenary', 'MFM Prayer City Multipurpose Hall', 'Keynote address, high-energy praise celebration, and prophetic blessing.', '["Pastor D.K. Olukoya", "Youth Mass Choir"]'::jsonb, true, NOW()),
      ('sess_3', 'event_soar_2026', 2, 'Friday, Dec 11, 2026', '09:00 AM – 12:30 PM', 'Youth in Tech & Digital Entrepreneurship Masterclass', 'Workshop', 'Multipurpose Hall, Seminar Wing', 'Building world-class startups, AI solutions, and engineering with kingdom ethics.', '["Invited Tech Executives", "MFM Tech Directorate"]'::jsonb, true, NOW()),
      ('sess_4', 'event_soar_2026', 2, 'Friday, Dec 11, 2026', '06:00 PM – 11:00 PM', 'Holy Ghost Fire & Deliverance Night', 'Spiritual Warfare', 'MFM Prayer City Multipurpose Hall', 'Intense spiritual empowerment, breaking ancient barriers, and prophetic decree.', '["Dr. D.K. Olukoya"]'::jsonb, true, NOW()),
      ('sess_5', 'event_soar_2026', 3, 'Saturday, Dec 12, 2026', '09:00 AM – 02:00 PM', 'Campus Presidents & Leaders Summit', 'Leadership', 'Multipurpose Hall, Gallery', 'National strategies for campus awakening, academic distinction, and kingdom impact.', '["National Youth Leadership"]'::jsonb, true, NOW()),
      ('sess_6', 'event_soar_2026', 4, 'Sunday, Dec 13, 2026', '08:00 AM – 01:00 PM', 'Grand Thanksgiving & Commissioning Service', 'Plenary', 'MFM Prayer City Multipurpose Hall', 'Dedication of graduates, commissioning delegates to campuses and cities.', '["General Overseer", "Youth Pastors"]'::jsonb, true, NOW())
    ON CONFLICT (id) DO UPDATE SET 
      title = EXCLUDED.title,
      session_date = EXCLUDED.session_date,
      venue_location = EXCLUDED.venue_location
  `
  console.log('✔ Conference sessions seeded (Dec 10-13, 6 sessions)')

  // 8. Official Announcements
  await sql`
    INSERT INTO announcements (id, event_id, title, content, type, target_audience, author, is_active, is_pinned, published_at)
    VALUES 
      ('ann_1', 'event_soar_2026', 'Welcome to SOAR 2026 Pre-Registration!', 'Registration for SOAR 2026 (Dec 10–13, 2026 at MFM Prayer City Multipurpose Hall) is live! Save your digital ticket and calendar pass.', 'info', 'All Delegates', 'Conference Planning Committee', true, true, NOW()),
      ('ann_2', 'event_soar_2026', 'Official Merchandise Collection Guidelines', 'All pre-ordered conference shirts, hoodies, and journals can be collected from Pavilion Booth 4 upon presenting your pickup voucher QR code.', 'merchandise', 'Pre-Order Customers', 'Merchandise Directorate', true, false, NOW()),
      ('ann_3', 'event_soar_2026', 'Free Transportation Bus Terminals Announced', 'Free conference shuttle buses depart from Berger, Oshodi, Ojota, and Mile 12 to MFM Prayer City starting 06:00 AM Thursday, Dec 10, 2026.', 'transport', 'All Delegates', 'Transport & Welfare Team', true, false, NOW())
    ON CONFLICT (id) DO UPDATE SET 
      title = EXCLUDED.title,
      content = EXCLUDED.content
  `
  console.log('✔ Official announcements updated')

  console.log('\n>>> SUCCESS! All SOAR 2026 data successfully seeded into Supabase!')
} catch (error) {
  console.error('Error during seeding:', error)
} finally {
  await sql.end()
}
