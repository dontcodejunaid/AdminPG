export const initialSeedData = {
  locations: [
    {
      id: "loc_in",
      name: "India",
      code: "IN",
      type: "country",
      parentId: null,
      isActive: true,
      states: [
        {
          id: "state_kl",
          name: "Kerala",
          code: "KL",
          type: "state",
          cities: [
            {
              id: "city_kochi",
              name: "Kochi",
              code: "COK",
              areas: ["Kakkanad", "Edappally", "Kaloor", "Palarivattom", "Vyttila", "Infopark Campus", "MG Road"]
            },
            {
              id: "city_tvm",
              name: "Thiruvananthapuram",
              code: "TRV",
              areas: ["Kazhakkoottam (Technopark)", "Pattom", "Karyavattom", "Palayam", "Vellayambalam", "Sreekaryam"]
            },
            {
              id: "city_clt",
              name: "Kozhikode",
              code: "CCJ",
              areas: ["Cyberpark", "Hilite City", "Mavoor Road", "Nadakkavu", "Palayam"]
            }
          ]
        },
        {
          id: "state_ka",
          name: "Karnataka",
          code: "KA",
          cities: [
            {
              id: "city_blr",
              name: "Bangalore",
              code: "BLR",
              areas: ["Electronic City Phase 1", "Electronic City Phase 2", "Marathahalli", "Koramangala", "HSR Layout", "BTM Layout", "Whitefield", "Indiranagar", "Bellandur"]
            }
          ]
        },
        {
          id: "state_tn",
          name: "Tamil Nadu",
          code: "TN",
          cities: [
            {
              id: "city_chn",
              name: "Chennai",
              code: "MAA",
              areas: ["OMR", "Velachery", "Guindy", "Sholinganallur", "Adyar"]
            },
            {
              id: "city_cbe",
              name: "Coimbatore",
              code: "CJB",
              areas: ["Gandhipuram", "Peelamedu", "Saravanampatti (TIDEL Park)", "RS Puram"]
            }
          ]
        }
      ]
    }
  ],

  facilities: [
    { id: "fac_food", name: "3 Times Food (Kerala / Veg & Non-Veg)", icon: "Utensils", category: "Food & Dining", isDefault: true },
    { id: "fac_wifi", name: "High Speed Wi-Fi (100+ Mbps)", icon: "Wifi", category: "Connectivity", isDefault: true },
    { id: "fac_ac", name: "Air Conditioner (AC)", icon: "Wind", category: "Comfort", isDefault: true },
    { id: "fac_wm", name: "Automatic Washing Machine", icon: "Shirt", category: "Laundry", isDefault: true },
    { id: "fac_cctv", name: "24/7 CCTV & Security Guard", icon: "ShieldCheck", category: "Security", isDefault: true },
    { id: "fac_housekeep", name: "Daily Housekeeping", icon: "Sparkles", category: "Cleaning", isDefault: true },
    { id: "fac_hotwater", name: "24x7 Geyser / Hot Water", icon: "Flame", category: "Bathroom", isDefault: true },
    { id: "fac_parking", name: "2 & 4 Wheeler Parking", icon: "Car", category: "Vehicle", isDefault: true },
    { id: "fac_lift", name: "Elevator / Lift", icon: "ArrowUpDown", category: "Building", isDefault: true },
    { id: "fac_attach_bath", name: "Attached Bathroom in all rooms", icon: "Bath", category: "Bathroom", isDefault: true },
    { id: "fac_power", name: "Full Power Backup (Generator / Inverter)", icon: "Zap", category: "Utility", isDefault: true },
    { id: "fac_gym", name: "Fitness Gym", icon: "Dumbbell", category: "Health", isDefault: true },
    { id: "fac_studytable", name: "Individual Study Table & Wardrobe", icon: "BookOpen", category: "Furniture", isDefault: true },
    { id: "fac_kitchen", name: "Self Cooking Area with Gas / Induction", icon: "Soup", category: "Food & Dining", isDefault: true }
  ],

  properties: [
    {
      id: "pg_101",
      name: "Malabar Luxury Executive PG for Men",
      slug: "malabar-luxury-executive-pg-men-kakkanad",
      type: "Boys",
      state: "Kerala",
      city: "Kochi",
      area: "Kakkanad",
      fullAddress: "Near Infopark South Gate, Kusumagiri PO, Kakkanad, Kochi, Kerala 682030",
      mapUrl: "https://maps.google.com/?q=Infopark+Kakkanad+Kochi",
      description: "Premium AC & Non-AC luxury accommodation tailored for IT professionals working in Infopark Kochi and SmartCity. Authentic Kerala-style delicious home-cooked meals, super-fast fiber Wi-Fi, and 24/7 power backup.",
      contactNumber: "+91 98470 12345",
      whatsappNumber: "+91 98470 12345",
      photos: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
      ],
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      status: "Active", // Active, Inactive
      availabilityStatus: "Available", // Available, Limited, Full
      verificationStatus: "Verified", // Verified, Pending, Not Verified
      isFeatured: true,
      featuredOrder: 1,
      totalBeds: 42,
      availableBeds: 6,
      charges: {
        deposit: 5000,
        foodCharges: "Included (3 times daily)",
        electricityCharges: "As per sub-meter (₹9/unit)",
        maintenanceCharges: 500,
        otherCharges: "None"
      },
      rooms: [
        { id: "r_101_1", type: "Single Sharing", rent: 14000, deposit: 10000, totalBeds: 6, availableBeds: 1, hasAC: true, hasAttachedBath: true },
        { id: "r_101_2", type: "2 Sharing", rent: 9500, deposit: 5000, totalBeds: 16, availableBeds: 3, hasAC: true, hasAttachedBath: true },
        { id: "r_101_3", type: "3 Sharing", rent: 7500, deposit: 4000, totalBeds: 12, availableBeds: 2, hasAC: false, hasAttachedBath: true },
        { id: "r_101_4", type: "4 Sharing", rent: 6500, deposit: 3000, totalBeds: 8, availableBeds: 0, hasAC: false, hasAttachedBath: true }
      ],
      facilities: ["fac_food", "fac_wifi", "fac_ac", "fac_wm", "fac_cctv", "fac_housekeep", "fac_hotwater", "fac_parking", "fac_attach_bath", "fac_power"],
      createdAt: "2026-08-15T09:30:00.000Z",
      updatedAt: "2026-09-08T14:20:00.000Z"
    },
    {
      id: "pg_102",
      name: "Green Valley Premium Ladies PG & Hostel",
      slug: "green-valley-premium-ladies-pg-kazhakkoottam",
      type: "Girls",
      state: "Kerala",
      city: "Thiruvananthapuram",
      area: "Kazhakkoottam (Technopark)",
      fullAddress: "Technopark Phase 1 Bypass Road, Near Main Gate, Kazhakkoottam, Thiruvananthapuram, Kerala 695582",
      mapUrl: "https://maps.google.com/?q=Technopark+Phase+1+Kazhakkoottam",
      description: "Safe, secure and peaceful hostel with biometric entry, female warden on-premises 24/7, hygienic food, daily cleaning, and walking distance to Technopark campus.",
      contactNumber: "+91 94460 78901",
      whatsappNumber: "+91 94460 78901",
      photos: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80"
      ],
      videoUrl: "",
      status: "Active",
      availabilityStatus: "Limited",
      verificationStatus: "Verified",
      isFeatured: true,
      featuredOrder: 2,
      totalBeds: 35,
      availableBeds: 2,
      charges: {
        deposit: 6000,
        foodCharges: "Included (Veg & Non-Veg Kerala items)",
        electricityCharges: "Included in rent",
        maintenanceCharges: 300,
        otherCharges: "Biometric card one-time fee ₹200"
      },
      rooms: [
        { id: "r_102_1", type: "Single Sharing", rent: 13500, deposit: 8000, totalBeds: 5, availableBeds: 0, hasAC: true, hasAttachedBath: true },
        { id: "r_102_2", type: "2 Sharing", rent: 9000, deposit: 5000, totalBeds: 20, availableBeds: 1, hasAC: true, hasAttachedBath: true },
        { id: "r_102_3", type: "3 Sharing", rent: 7200, deposit: 4000, totalBeds: 10, availableBeds: 1, hasAC: false, hasAttachedBath: true }
      ],
      facilities: ["fac_food", "fac_wifi", "fac_ac", "fac_wm", "fac_cctv", "fac_housekeep", "fac_hotwater", "fac_parking", "fac_lift", "fac_attach_bath", "fac_power"],
      createdAt: "2026-08-20T11:15:00.000Z",
      updatedAt: "2026-09-09T10:00:00.000Z"
    },
    {
      id: "pg_103",
      name: "Urban Nest Co-Living & Studio PG",
      slug: "urban-nest-co-living-electronic-city-bangalore",
      type: "Co-living",
      state: "Karnataka",
      city: "Bangalore",
      area: "Electronic City Phase 1",
      fullAddress: "Behind Wipro Gate 5, Neeladri Road, Electronic City Phase 1, Bangalore 560100",
      mapUrl: "https://maps.google.com/?q=Neeladri+Road+Electronic+City+Bangalore",
      description: "Modern co-living space with high-speed internet, workstation setups in every room, gaming zone, open terrace cafeteria, and community events every weekend.",
      contactNumber: "+91 80880 34567",
      whatsappNumber: "+91 80880 34567",
      photos: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
      ],
      videoUrl: "",
      status: "Active",
      availabilityStatus: "Available",
      verificationStatus: "Verified",
      isFeatured: true,
      featuredOrder: 3,
      totalBeds: 50,
      availableBeds: 12,
      charges: {
        deposit: 10000,
        foodCharges: "₹3,500 optional subscription",
        electricityCharges: "Individual meters (actuals)",
        maintenanceCharges: 800,
        otherCharges: "Gym access included"
      },
      rooms: [
        { id: "r_103_1", type: "Single Studio", rent: 18000, deposit: 15000, totalBeds: 10, availableBeds: 3, hasAC: true, hasAttachedBath: true },
        { id: "r_103_2", type: "2 Sharing", rent: 11000, deposit: 8000, totalBeds: 30, availableBeds: 7, hasAC: true, hasAttachedBath: true },
        { id: "r_103_3", type: "3 Sharing", rent: 8500, deposit: 6000, totalBeds: 10, availableBeds: 2, hasAC: false, hasAttachedBath: true }
      ],
      facilities: ["fac_wifi", "fac_ac", "fac_wm", "fac_cctv", "fac_housekeep", "fac_hotwater", "fac_parking", "fac_lift", "fac_gym", "fac_studytable", "fac_power", "fac_kitchen"],
      createdAt: "2026-08-25T16:45:00.000Z",
      updatedAt: "2026-09-09T18:30:00.000Z"
    },
    {
      id: "pg_104",
      name: "Cyber Heights Gents PG",
      slug: "cyber-heights-gents-pg-marathahalli",
      type: "Boys",
      state: "Karnataka",
      city: "Bangalore",
      area: "Marathahalli",
      fullAddress: "Opposite Innovative Multiplex, Outer Ring Road, Marathahalli, Bangalore 560037",
      mapUrl: "https://maps.google.com/?q=Marathahalli+Bridge+Bangalore",
      description: "Affordable stay near Outer Ring Road tech parks. North and South Indian food provided 3 times daily with Sunday special Biryani.",
      contactNumber: "+91 97410 56789",
      whatsappNumber: "+91 97410 56789",
      photos: [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
      ],
      videoUrl: "",
      status: "Active",
      availabilityStatus: "Full",
      verificationStatus: "Pending",
      isFeatured: false,
      featuredOrder: 0,
      totalBeds: 28,
      availableBeds: 0,
      charges: {
        deposit: 3000,
        foodCharges: "Included",
        electricityCharges: "Fixed ₹300/bed",
        maintenanceCharges: 200,
        otherCharges: "None"
      },
      rooms: [
        { id: "r_104_1", type: "2 Sharing", rent: 8500, deposit: 4000, totalBeds: 12, availableBeds: 0, hasAC: false, hasAttachedBath: true },
        { id: "r_104_2", type: "3 Sharing", rent: 6500, deposit: 3000, totalBeds: 16, availableBeds: 0, hasAC: false, hasAttachedBath: true }
      ],
      facilities: ["fac_food", "fac_wifi", "fac_wm", "fac_cctv", "fac_hotwater", "fac_parking"],
      createdAt: "2026-09-01T08:20:00.000Z",
      updatedAt: "2026-09-07T12:00:00.000Z"
    },
    {
      id: "pg_105",
      name: "Calicut Coast Stay Women's PG",
      slug: "calicut-coast-stay-womens-pg-cyberpark",
      type: "Girls",
      state: "Kerala",
      city: "Kozhikode",
      area: "Cyberpark",
      fullAddress: "Nellikode Road, Near Cyberpark Gateway, Kozhikode, Kerala 673016",
      mapUrl: "https://maps.google.com/?q=Cyberpark+Kozhikode",
      description: "Brand new furnished accommodation with air-conditioned dining, security surveillance, library study hall, and free Wi-Fi.",
      contactNumber: "+91 99950 44332",
      whatsappNumber: "+91 99950 44332",
      photos: [
        "https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?auto=format&fit=crop&w=1000&q=80"
      ],
      videoUrl: "",
      status: "Active",
      availabilityStatus: "Available",
      verificationStatus: "Not Verified",
      isFeatured: false,
      featuredOrder: 0,
      totalBeds: 24,
      availableBeds: 8,
      charges: {
        deposit: 4000,
        foodCharges: "Included (Kerala Meals)",
        electricityCharges: "Free up to 50 units",
        maintenanceCharges: 0,
        otherCharges: "None"
      },
      rooms: [
        { id: "r_105_1", type: "2 Sharing", rent: 8000, deposit: 4000, totalBeds: 12, availableBeds: 4, hasAC: true, hasAttachedBath: true },
        { id: "r_105_2", type: "3 Sharing", rent: 6500, deposit: 3000, totalBeds: 12, availableBeds: 4, hasAC: false, hasAttachedBath: true }
      ],
      facilities: ["fac_food", "fac_wifi", "fac_ac", "fac_wm", "fac_cctv", "fac_housekeep", "fac_hotwater", "fac_parking", "fac_attach_bath"],
      createdAt: "2026-09-05T14:10:00.000Z",
      updatedAt: "2026-09-09T11:45:00.000Z"
    }
  ],

  enquiries: [
    {
      id: "enq_501",
      customerName: "Salih Rahman",
      customerPhone: "+91 98460 99881",
      customerEmail: "salih.rahman@gmail.com",
      pgId: "pg_101",
      pgName: "Malabar Luxury Executive PG for Men",
      roomType: "2 Sharing",
      budget: "₹9,000 - ₹10,000",
      moveInDate: "2026-09-15",
      message: "Looking for immediate joining near Infopark. Need AC 2-sharing room with food.",
      status: "New", // New, Contacted, Interested, Visited, Closed
      adminNotes: "Customer called once, asked for callback around 6 PM.",
      source: "Enquiry Form",
      createdAt: "2026-09-10T08:15:00.000Z"
    },
    {
      id: "enq_502",
      customerName: "Ananya Suresh",
      customerPhone: "+91 97455 11223",
      customerEmail: "ananya.suresh@outlook.com",
      pgId: "pg_102",
      pgName: "Green Valley Premium Ladies PG & Hostel",
      roomType: "Single Sharing",
      budget: "₹13,000",
      moveInDate: "2026-09-20",
      message: "Need single room with attached bath near Technopark Phase 1.",
      status: "Contacted",
      adminNotes: "Sent photos & WhatsApp brochure. Scheduled visit for Saturday 11 AM.",
      source: "WhatsApp Direct",
      createdAt: "2026-09-09T14:30:00.000Z"
    },
    {
      id: "enq_503",
      customerName: "Rahul Menon",
      customerPhone: "+91 91234 56789",
      customerEmail: "rahul.m@infosys.com",
      pgId: "pg_103",
      pgName: "Urban Nest Co-Living & Studio PG",
      roomType: "Single Studio",
      budget: "₹18,000",
      moveInDate: "2026-10-01",
      message: "Joining Wipro Electronic City next month. Want high-speed WiFi for WFH.",
      status: "Interested",
      adminNotes: "Shared virtual 3D tour. Waiting for confirmation token deposit.",
      source: "Scheduled Visit",
      createdAt: "2026-09-08T10:00:00.000Z"
    },
    {
      id: "enq_504",
      customerName: "Kavya Nair",
      customerPhone: "+91 98451 22334",
      customerEmail: "kavya.nair@tcs.com",
      pgId: "pg_102",
      pgName: "Green Valley Premium Ladies PG & Hostel",
      roomType: "2 Sharing",
      budget: "₹9,000",
      moveInDate: "2026-09-12",
      message: "Visited hostel yesterday. Looking forward to complete admission.",
      status: "Visited",
      adminNotes: "Visited property with father on Sunday. Happy with warden and food.",
      source: "Direct Call",
      createdAt: "2026-09-06T16:20:00.000Z"
    },
    {
      id: "enq_505",
      customerName: "Fahad Basil",
      customerPhone: "+91 94000 88776",
      customerEmail: "fahad.basil@yahoo.com",
      pgId: "pg_101",
      pgName: "Malabar Luxury Executive PG for Men",
      roomType: "3 Sharing",
      budget: "₹7,500",
      moveInDate: "2026-09-01",
      message: "Admission completed. Advance ₹4,000 paid to owner.",
      status: "Closed",
      adminNotes: "Bed allocated: Room 204 Bed B. Lead successfully closed!",
      source: "Enquiry Form",
      createdAt: "2026-08-28T09:45:00.000Z"
    }
  ],

  customers: [
    {
      id: "cust_301",
      name: "Salih Rahman",
      phone: "+91 98460 99881",
      email: "salih.rahman@gmail.com",
      city: "Kochi",
      dateJoined: "2026-09-10",
      savedPgs: ["pg_101", "pg_103"],
      totalEnquiries: 1,
      totalPaid: 19
    },
    {
      id: "cust_302",
      name: "Ananya Suresh",
      phone: "+91 97455 11223",
      email: "ananya.suresh@outlook.com",
      city: "Thiruvananthapuram",
      dateJoined: "2026-09-09",
      savedPgs: ["pg_102"],
      totalEnquiries: 1,
      totalPaid: 38
    },
    {
      id: "cust_303",
      name: "Rahul Menon",
      phone: "+91 91234 56789",
      email: "rahul.m@infosys.com",
      city: "Bangalore",
      dateJoined: "2026-09-08",
      savedPgs: ["pg_103", "pg_104"],
      totalEnquiries: 2,
      totalPaid: 19
    },
    {
      id: "cust_304",
      name: "Kavya Nair",
      phone: "+91 98451 22334",
      email: "kavya.nair@tcs.com",
      city: "Thiruvananthapuram",
      dateJoined: "2026-09-06",
      savedPgs: ["pg_102"],
      totalEnquiries: 1,
      totalPaid: 0
    },
    {
      id: "cust_305",
      name: "Fahad Basil",
      phone: "+91 94000 88776",
      email: "fahad.basil@yahoo.com",
      city: "Kochi",
      dateJoined: "2026-08-28",
      savedPgs: ["pg_101"],
      totalEnquiries: 1,
      totalPaid: 19
    }
  ],

  reportedListings: [
    {
      id: "rep_701",
      pgId: "pg_104",
      pgName: "Cyber Heights Gents PG",
      customerName: "Aravind K",
      customerPhone: "+91 94471 99000",
      reason: "Full/unavailable", // Wrong price, Fake photos, Full/unavailable, Wrong contact number, Other
      complaint: "Owner told over call that all beds are full for past 2 months, but website still shows it as available.",
      status: "Pending", // Pending, Resolved, Ignored, Deactivated
      actionTaken: null,
      createdAt: "2026-09-08T15:20:00.000Z"
    },
    {
      id: "rep_702",
      pgId: "pg_105",
      pgName: "Calicut Coast Stay Women's PG",
      customerName: "Sneha P",
      customerPhone: "+91 98950 11224",
      reason: "Wrong price",
      complaint: "Listed price is ₹6,500 on website, but owner is asking ₹8,500 when visiting in person.",
      status: "Resolved",
      actionTaken: "Contacted owner and updated room pricing to reflect correct rates.",
      createdAt: "2026-09-04T11:00:00.000Z"
    }
  ],

  payments: [
    {
      id: "pay_901",
      transactionId: "TXN_KP_89201934",
      customerName: "Salih Rahman",
      customerPhone: "+91 98460 99881",
      pgName: "Malabar Luxury Executive PG",
      purpose: "Owner Direct Contact Unlock (₹19 Plan)",
      amount: 19,
      status: "Success", // Success, Pending, Failed
      paymentGateway: "UPI / Razorpay",
      date: "2026-09-10T08:14:22.000Z"
    },
    {
      id: "pay_902",
      transactionId: "TXN_KP_89201889",
      customerName: "Ananya Suresh",
      customerPhone: "+91 97455 11223",
      pgName: "Green Valley Premium Ladies PG",
      purpose: "Owner Direct Contact Unlock (₹19 Plan)",
      amount: 19,
      status: "Success",
      paymentGateway: "UPI / PhonePe",
      date: "2026-09-09T14:28:10.000Z"
    },
    {
      id: "pay_903",
      transactionId: "TXN_KP_89201821",
      customerName: "Ananya Suresh",
      customerPhone: "+91 97455 11223",
      pgName: "Calicut Coast Stay",
      purpose: "Owner Direct Contact Unlock (₹19 Plan)",
      amount: 19,
      status: "Success",
      paymentGateway: "Google Pay",
      date: "2026-09-09T12:10:05.000Z"
    },
    {
      id: "pay_904",
      transactionId: "TXN_KP_89201740",
      customerName: "Rahul Menon",
      customerPhone: "+91 91234 56789",
      pgName: "Urban Nest Co-Living",
      purpose: "Owner Direct Contact Unlock (₹19 Plan)",
      amount: 19,
      status: "Success",
      paymentGateway: "Credit Card",
      date: "2026-09-08T09:55:40.000Z"
    },
    {
      id: "pay_905",
      transactionId: "TXN_KP_89201611",
      customerName: "Vipin Das",
      customerPhone: "+91 98477 33445",
      pgName: "Cyber Heights Gents PG",
      purpose: "Owner Direct Contact Unlock (₹19 Plan)",
      amount: 19,
      status: "Failed",
      paymentGateway: "UPI / Paytm",
      date: "2026-09-07T18:22:15.000Z"
    }
  ],

  banners: [
    {
      id: "ban_01",
      title: "Best Girls PGs in Kochi Infopark & SmartCity",
      subtitle: "Verified hostels with food, Wi-Fi & 24/7 security",
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
      targetUrl: "/search?city=Kochi&type=Girls",
      placement: "Homepage Hero Top",
      city: "Kochi",
      isActive: true,
      startDate: "2026-08-01",
      endDate: "2026-12-31"
    },
    {
      id: "ban_02",
      title: "Premium Boys & Co-Living Spaces in Electronic City, Bangalore",
      subtitle: "Zero brokerage • High speed internet • Food included",
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      targetUrl: "/search?city=Bangalore",
      placement: "Search Results Header",
      city: "Bangalore",
      isActive: true,
      startDate: "2026-08-15",
      endDate: "2026-12-31"
    }
  ],

  cmsPages: {
    aboutUs: {
      title: "About KeralaPG.com",
      subtitle: "Kerala & Bangalore's #1 Dedicated Paying Guest & Hostel Discovery Platform",
      content: "KeralaPG.com was founded with a single mission: to make finding verified, safe, and comfortable Paying Guest (PG) accommodations completely hassle-free for students and working professionals. Whether you are moving to Kochi's Infopark, Trivandrum's Technopark, Kozhikode Cyberpark, or tech hubs across Bangalore, we connect you directly with genuine property owners with zero fake broker commissions.",
      statsHighlight: [
        { label: "Verified Properties", value: "500+" },
        { label: "Happy Residents", value: "10,000+" },
        { label: "Cities Covered", value: "15+" },
        { label: "Direct Owner Connect", value: "100%" }
      ],
      updatedAt: "2026-09-01T10:00:00.000Z"
    },
    contactUs: {
      phone: "+91 98470 00000",
      whatsapp: "+91 98470 00000",
      email: "support@keralapg.com",
      officeAddress: "4th Floor, Infopark TBC, Kakkanad, Kochi, Kerala 682030",
      operatingHours: "Monday – Saturday: 9:00 AM – 8:00 PM IST",
      supportNote: "For urgent listing updates or owner verifications, reach out directly on our WhatsApp helpline."
    },
    faq: [
      {
        id: "faq_1",
        question: "How does KeralaPG verify properties?",
        answer: "Our field team physically visits properties or verifies legal ownership, electricity bills, safety infrastructure, and amenities before issuing the KeralaPG Verified badge."
      },
      {
        id: "faq_2",
        question: "What is the ₹19 direct contact unlock fee?",
        answer: "To prevent spam and protect PG owners from telemarketers while keeping our platform free of broker commissions, we charge a nominal ₹19 commitment fee to view direct owner contact and schedule instant visits."
      },
      {
        id: "faq_3",
        question: "Can I list my PG property for free?",
        answer: "Yes! Basic listing on KeralaPG.com is free. Featured and priority listings are available for owners who want 5x faster occupancy."
      }
    ],
    termsAndConditions: {
      content: "By using KeralaPG.com, users agree to verify all rental agreements directly with property managers. KeralaPG acts as an aggregation and discovery medium...",
      updatedAt: "2026-08-01T00:00:00.000Z"
    },
    privacyPolicy: {
      content: "KeralaPG values your privacy. We never sell your phone number or email to third-party telemarketers...",
      updatedAt: "2026-08-01T00:00:00.000Z"
    }
  },

  notifications: [
    {
      id: "notif_1",
      type: "enquiry",
      title: "New Enquiry Received",
      message: "Salih Rahman submitted an enquiry for Malabar Luxury Executive PG (2 Sharing).",
      timestamp: "2026-09-10T08:15:00.000Z",
      read: false,
      link: "/enquiries"
    },
    {
      id: "notif_2",
      type: "report",
      title: "Listing Reported",
      message: "Cyber Heights Gents PG reported for 'Full/unavailable'.",
      timestamp: "2026-09-08T15:20:00.000Z",
      read: false,
      link: "/reported"
    },
    {
      id: "notif_3",
      type: "payment",
      title: "New ₹19 Payment Success",
      message: "Salih Rahman unlocked contact for Malabar Luxury PG.",
      timestamp: "2026-09-10T08:14:22.000Z",
      read: true,
      link: "/payments"
    }
  ],

  adminUsers: [
    {
      id: "usr_1",
      name: "Junaid (Super Admin)",
      email: "superadmin@keralapg.com",
      role: "Super Admin",
      phone: "+91 98470 11111",
      status: "Active",
      lastLogin: "2026-09-10T10:30:00.000Z",
      permissions: {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: true,
        canVerifyPG: true,
        canManageLocations: true,
        canManageFacilities: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canModerateReports: true,
        canManagePayments: true,
        canManageCMS: true,
        canManageBanners: true,
        canManageUsers: true
      }
    },
    {
      id: "usr_2",
      name: "Father / Operations Manager",
      email: "admin@keralapg.com",
      role: "Admin",
      phone: "+91 98470 22222",
      status: "Active",
      lastLogin: "2026-09-09T18:00:00.000Z",
      permissions: {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: true,
        canVerifyPG: true,
        canManageLocations: true,
        canManageFacilities: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canModerateReports: true,
        canManagePayments: false,
        canManageCMS: true,
        canManageBanners: true,
        canManageUsers: false
      }
    },
    {
      id: "usr_3",
      name: "Staff Member / Field Executive",
      email: "staff@keralapg.com",
      role: "Staff",
      phone: "+91 98470 33333",
      status: "Active",
      lastLogin: "2026-09-10T09:15:00.000Z",
      permissions: {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: false,
        canVerifyPG: false,
        canManageLocations: false,
        canManageFacilities: false,
        canManageEnquiries: true,
        canManageCustomers: false,
        canModerateReports: false,
        canManagePayments: false,
        canManageCMS: false,
        canManageBanners: false,
        canManageUsers: false
      }
    }
  ]
};
