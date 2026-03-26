export type GigPackage = {
    name: "Basic" | "Standard" | "Premium";
    price: number;
    description: string;
    delivery: string;
    revisions: number;
    includes: string[];
};

export type Gig = {
    id: number;
    title: string;
    vendor: string;
    vendorImg: string;
    image: string;
    gallery: string[];
    rating: number;
    reviews: number;
    price: string;
    level: string;
    isFavo: boolean;
    category: string;
    location: string;
    vendorSince: string;
    vendorOrders: number;
    vendorBio: string;
    description: string;
    highlights: string[];
    packages: GigPackage[];
    reviewsList: { name: string; avatar: string; rating: number; comment: string; date: string }[];
};

export const gigs: Gig[] = [
    {
        id: 1,
        title: "I will host an authentic Southern Sri Lankan cooking class in Galle",
        vendor: "Kumari Jayawardena",
        vendorImg: "/images/traveler2.png",
        image: "/images/cooking_class_galle.png",
        gallery: ["/images/cooking_class_galle.png", "/images/cultural_heritage_train_trip.png", "/images/tuktuk_food_tour_colombo.png"],
        rating: 4.9,
        reviews: 142,
        price: "3,200",
        level: "Top Rated",
        isFavo: false,
        category: "Culinary & Food",
        location: "Galle Fort, Southern Province",
        vendorSince: "2022",
        vendorOrders: 312,
        vendorBio: "Professional chef and cultural host from Galle. I've been sharing the secrets of Sri Lankan cuisine for over 8 years.",
        description: "Join me for an immersive cooking class inside a colonial-era kitchen in Galle Fort. You'll learn to prepare 4 authentic Southern Sri Lankan dishes using fresh spices from my garden — including pol sambol, fish curry, and coconut roti. No experience needed!",
        highlights: ["3-hour hands-on class", "All ingredients provided", "Recipe booklet to take home", "Vegetarian options available", "Galle Fort setting"],
        packages: [
            { name: "Basic", price: 3200, description: "1 dish + tasting", delivery: "3 hrs", revisions: 0, includes: ["1 core recipe", "Tasting session", "Tea & snacks"] },
            { name: "Standard", price: 5500, description: "4 dishes + lunch", delivery: "5 hrs", revisions: 0, includes: ["4 full recipes", "Sit-down lunch", "Spice kit", "Recipe booklet"] },
            { name: "Premium", price: 9000, description: "Private full-day experience", delivery: "8 hrs", revisions: 0, includes: ["6 recipes", "Market visit", "Lunch + dinner", "Spice kit", "Certificate", "Transfer included"] },
        ],
        reviewsList: [
            { name: "Emily J.", avatar: "EJ", rating: 5, comment: "Absolutely loved it! Kumari is such a warm host and the food was incredible.", date: "Mar 10, 2026" },
            { name: "Lucas M.", avatar: "LM", rating: 5, comment: "Best experience in Sri Lanka. The curry we made was better than any restaurant.", date: "Feb 28, 2026" },
            { name: "Aiko T.", avatar: "AT", rating: 4, comment: "Great fun, very authentic. The pol sambol recipe alone was worth it!", date: "Feb 15, 2026" },
        ],
    },
    {
        id: 2,
        title: "I will take you on a verified ethical elephant safari in Udawalawe",
        vendor: "Saman Wildlife",
        vendorImg: "/images/traveler3.png",
        image: "/images/elephant_safari_udawalawe.png",
        gallery: ["/images/elephant_safari_udawalawe.png", "/images/yala_safari.png", "/images/nine_arches_bridge_sunrise.png"],
        rating: 5.0,
        reviews: 89,
        price: "8,500",
        level: "Level 2 Seller",
        isFavo: true,
        category: "Nature & Wildlife",
        location: "Udawalawe National Park",
        vendorSince: "2021",
        vendorOrders: 201,
        vendorBio: "Certified wildlife guide with 12 years in Sri Lankan national parks. Committed to ethical, low-impact wildlife tourism.",
        description: "Experience Sri Lanka's wild elephants the right way. This ethical jeep safari through Udawalawe National Park is led by a certified guide. We never approach animals unsafely or support exploitative practices. Witness herds, calves, and if lucky — leopards and water buffalo.",
        highlights: ["Certified ethical guide", "4x4 open-top jeep", "Morning & sunset slots", "Binoculars provided", "No elephant riding"],
        packages: [
            { name: "Basic", price: 8500, description: "3-hour morning safari", delivery: "3 hrs", revisions: 0, includes: ["3hr jeep safari", "Guide", "Entry tickets", "Water"] },
            { name: "Standard", price: 14000, description: "Full-day safari + lunch", delivery: "7 hrs", revisions: 0, includes: ["7hr safari", "Packed lunch", "2 game drives", "Binoculars"] },
            { name: "Premium", price: 22000, description: "2-day safari + lodge stay", delivery: "2 days", revisions: 0, includes: ["2-day safari", "Lodge stay", "All meals", "Night walk", "Transfer"] },
        ],
        reviewsList: [
            { name: "Sophie M.", avatar: "SM", rating: 5, comment: "Saw over 40 elephants! Saman is incredibly knowledgeable and passionate.", date: "Mar 5, 2026" },
            { name: "Omar H.", avatar: "OH", rating: 5, comment: "The most ethical wildlife experience I've had anywhere in Asia.", date: "Feb 20, 2026" },
        ],
    },
    {
        id: 3,
        title: "I will guide a sunset TukTuk food tour around Colombo Fort",
        vendor: "Nuwan's Tuk Tours",
        vendorImg: "/images/traveler1.png",
        image: "/images/tuktuk_food_tour_colombo.png",
        gallery: ["/images/tuktuk_food_tour_colombo.png", "/images/cooking_class_galle.png", "/images/cultural_heritage_train_trip.png"],
        rating: 4.8,
        reviews: 215,
        price: "2,800",
        level: "Top Rated",
        isFavo: false,
        category: "Transport",
        location: "Colombo Fort & Pettah",
        vendorSince: "2020",
        vendorOrders: 487,
        vendorBio: "Colombo born and raised, I've been showing tourists the real city — street food, hidden gems, and local haunts — for 6 years.",
        description: "Hop into a colorful TukTuk at golden hour and weave through Colombo Fort, Pettah market, and the waterfront. Stop at 6 local food stalls to try hoppers, kottu, isso vadai, and more. A fun, social evening with great stories and even better food.",
        highlights: ["6 food stops", "Sunset timing", "Local storytelling", "Small group (max 6)", "Vegetarian-friendly"],
        packages: [
            { name: "Basic", price: 2800, description: "2hr tour, 4 stops", delivery: "2 hrs", revisions: 0, includes: ["TukTuk ride", "4 food tastings", "Guide", "Water"] },
            { name: "Standard", price: 4500, description: "3hr tour, 6 stops + drinks", delivery: "3 hrs", revisions: 0, includes: ["6 tastings", "King Coconut drinks", "Night market visit", "Photo stops"] },
            { name: "Premium", price: 7500, description: "Private group tour + rooftop", delivery: "4 hrs", revisions: 0, includes: ["Private TukTuk", "8 tastings", "Rooftop bar visit", "Transfer", "Souvenir"] },
        ],
        reviewsList: [
            { name: "Clara D.", avatar: "CD", rating: 5, comment: "Best evening in Colombo! The kottu stop was life-changing.", date: "Mar 12, 2026" },
            { name: "James W.", avatar: "JW", rating: 5, comment: "Nuwan is hilarious and knows every corner of the city.", date: "Mar 1, 2026" },
            { name: "Yuki S.", avatar: "YS", rating: 4, comment: "Great fun, a little rushed at some stops but overall fantastic.", date: "Feb 18, 2026" },
        ],
    },
    {
        id: 4,
        title: "I will teach you traditional wooden mask carving in Ambalangoda",
        vendor: "Ariyaratne Studio",
        vendorImg: "/images/traveler2.png",
        image: "/images/mask_carving_ambalangoda.png",
        gallery: ["/images/mask_carving_ambalangoda.png", "/images/cooking_class_galle.png", "/images/ayurvedic_meditation_session_sri_lanka.png"],
        rating: 4.9,
        reviews: 67,
        price: "5,100",
        level: "Level 1 Seller",
        isFavo: false,
        category: "Local Crafts",
        location: "Ambalangoda, Southern Province",
        vendorSince: "2023",
        vendorOrders: 98,
        vendorBio: "Third-generation mask carver from Ambalangoda. Our studio has been crafting traditional Kolam and Raksha masks for over 70 years.",
        description: "Learn the ancient craft of Sri Lankan wooden mask carving in our family studio. You'll carve, sand and paint your own miniature mask to take home. Our master carver walks you through every step — from chisel technique to traditional paint patterns.",
        highlights: ["Take home your creation", "Master carver guidance", "All tools provided", "Heritage studio setting", "2–3 hrs"],
        packages: [
            { name: "Basic", price: 5100, description: "Miniature mask class", delivery: "2 hrs", revisions: 0, includes: ["Mini mask", "All tools", "Painting", "Take-home"] },
            { name: "Standard", price: 8500, description: "Full mask + studio tour", delivery: "4 hrs", revisions: 0, includes: ["Full mask", "Studio tour", "History talk", "Certificate"] },
            { name: "Premium", price: 15000, description: "2-day master carving workshop", delivery: "2 days", revisions: 0, includes: ["3 masks", "Advanced techniques", "Museum visit", "Lunch", "Certificate"] },
        ],
        reviewsList: [
            { name: "Anna B.", avatar: "AB", rating: 5, comment: "Such a unique experience. My mask is now the centerpiece of my living room!", date: "Mar 8, 2026" },
            { name: "Raj P.", avatar: "RP", rating: 5, comment: "The family is so welcoming. Incredibly skilled artisans.", date: "Feb 22, 2026" },
        ],
    },
    {
        id: 5,
        title: "I will organize a private hike to Nine Arches Bridge at sunrise",
        vendor: "Ella Trail Guides",
        vendorImg: "/images/traveler3.png",
        image: "/images/nine_arches_bridge_sunrise.png",
        gallery: ["/images/nine_arches_bridge_sunrise.png", "/images/elephant_safari_udawalawe.png", "/images/surfing_weligama_reef.png"],
        rating: 5.0,
        reviews: 310,
        price: "4,000",
        level: "Top Rated",
        isFavo: true,
        category: "Adventure",
        location: "Ella, Uva Province",
        vendorSince: "2019",
        vendorOrders: 742,
        vendorBio: "Professional trekking guide based in Ella. Expert in Sri Lanka's hill country trails, wildlife and photography spots.",
        description: "Wake before dawn and hike through misty jungle paths to reach the iconic Nine Arches Bridge just as the first train crosses at sunrise. A truly magical experience. Our guide knows the best vantage points and secret spots most tourists never find.",
        highlights: ["Sunrise timing guaranteed", "Private certified guide", "Tea estate walk", "Train crossing photo op", "Complimentary tea"],
        packages: [
            { name: "Basic", price: 4000, description: "Sunrise bridge hike", delivery: "3 hrs", revisions: 0, includes: ["Guide", "Sunrise hike", "Tea stop", "Train photo op"] },
            { name: "Standard", price: 7000, description: "Full hill country day", delivery: "7 hrs", revisions: 0, includes: ["3 viewpoints", "Ella Rock option", "Packed breakfast", "Transfer"] },
            { name: "Premium", price: 12000, description: "2-day photographer's trail", delivery: "2 days", revisions: 0, includes: ["Drone shots", "2 trails", "Accommodation", "All meals", "Photo edits"] },
        ],
        reviewsList: [
            { name: "Emily J.", avatar: "EJ", rating: 5, comment: "The mist, the train, the bridge — it was like a dream. Worth every rupee.", date: "Mar 15, 2026" },
            { name: "Lucas M.", avatar: "LM", rating: 5, comment: "Our guide knew exactly when the train would arrive. Perfectly timed.", date: "Mar 3, 2026" },
            { name: "Clara D.", avatar: "CD", rating: 5, comment: "Got the best photos of my entire trip to Sri Lanka here.", date: "Feb 25, 2026" },
        ],
    },
    {
        id: 6,
        title: "I will craft a customized 3-day cultural heritage itinerary via train",
        vendor: "Malini Perera",
        vendorImg: "/images/traveler1.png",
        image: "/images/cultural_heritage_train_trip.png",
        gallery: ["/images/cultural_heritage_train_trip.png", "/images/nine_arches_bridge_sunrise.png", "/images/mask_carving_ambalangoda.png"],
        rating: 4.8,
        reviews: 44,
        price: "12,500",
        level: "New Seller",
        isFavo: false,
        category: "Heritage Tours",
        location: "Island-wide (Train Route)",
        vendorSince: "2025",
        vendorOrders: 51,
        vendorBio: "Travel curator and heritage enthusiast. I design bespoke, train-based itineraries covering Sri Lanka's UNESCO sites and hidden gems.",
        description: "Let me design your perfect 3-day train journey through Sri Lanka's cultural triangle. I'll create a day-by-day plan with train bookings, heritage site schedules, guesthouse recommendations, and local dining spots — all customized to your interests and pace.",
        highlights: ["Fully customized plan", "Train ticket booking", "3 days / 2 nights", "24/7 support during trip", "UNESCO sites included"],
        packages: [
            { name: "Basic", price: 12500, description: "Digital itinerary only", delivery: "2 days", revisions: 1, includes: ["Day-by-day plan", "Train schedule", "Site entry info", "1 revision"] },
            { name: "Standard", price: 22000, description: "Itinerary + bookings", delivery: "3 days", revisions: 2, includes: ["All bookings made", "Guesthouse selection", "Dining guide", "Emergency contact"] },
            { name: "Premium", price: 38000, description: "Fully guided 3-day tour", delivery: "3 days", revisions: 0, includes: ["Personal guide", "All transport", "Accommodation", "All meals", "Emergency support"] },
        ],
        reviewsList: [
            { name: "Sophie M.", avatar: "SM", rating: 5, comment: "Malini thought of everything! The train journey was the highlight of our holiday.", date: "Mar 1, 2026" },
            { name: "Omar H.", avatar: "OH", rating: 4, comment: "Very detailed itinerary, saved us hours of research.", date: "Feb 10, 2026" },
        ],
    },
    {
        id: 7,
        title: "I will teach you how to surf at a hidden reef break in Weligama",
        vendor: "Surfer Kasun",
        vendorImg: "/images/traveler2.png",
        image: "/images/surfing_weligama_reef.png",
        gallery: ["/images/surfing_weligama_reef.png", "/images/elephant_safari_udawalawe.png", "/images/nine_arches_bridge_sunrise.png"],
        rating: 4.9,
        reviews: 120,
        price: "4,500",
        level: "Level 2 Seller",
        isFavo: false,
        category: "Adventure",
        location: "Weligama Bay, Southern Coast",
        vendorSince: "2021",
        vendorOrders: 289,
        vendorBio: "ISA certified surf instructor and lifeguard. Born in Weligama, I know every wave and reef break on this coast.",
        description: "Learn to surf at one of Sri Lanka's best beginner-friendly breaks in Weligama Bay. My ISA-certified lessons start with beach safety and board basics before we hit the water. I offer beginner, intermediate, and advanced sessions tailored to your level.",
        highlights: ["ISA certified instructor", "Board & rash vest included", "Hidden reef break", "Beginner to advanced", "Action photos included"],
        packages: [
            { name: "Basic", price: 4500, description: "2hr beginner lesson", delivery: "2 hrs", revisions: 0, includes: ["2hr lesson", "Board + vest", "Beach safety", "Action photos"] },
            { name: "Standard", price: 8000, description: "Full-day surf course", delivery: "6 hrs", revisions: 0, includes: ["3 sessions", "Video analysis", "Reef break session", "Lunch"] },
            { name: "Premium", price: 18000, description: "3-day surf camp", delivery: "3 days", revisions: 0, includes: ["Daily coaching", "Surf theory", "All gear", "Accommodation", "Meals"] },
        ],
        reviewsList: [
            { name: "James W.", avatar: "JW", rating: 5, comment: "Kasun is a phenomenal teacher. I was standing up on waves by day 2!", date: "Mar 9, 2026" },
            { name: "Aiko T.", avatar: "AT", rating: 5, comment: "The hidden reef break was incredible. Felt like a local secret.", date: "Feb 28, 2026" },
        ],
    },
    {
        id: 8,
        title: "I will host a traditional Ayurvedic healing and meditation session",
        vendor: "Dr. Wickramasinghe",
        vendorImg: "/images/traveler3.png",
        image: "/images/ayurvedic_meditation_session_sri_lanka.png",
        gallery: ["/images/ayurvedic_meditation_session_sri_lanka.png", "/images/cooking_class_galle.png", "/images/mask_carving_ambalangoda.png"],
        rating: 5.0,
        reviews: 58,
        price: "7,200",
        level: "Verified Pro",
        isFavo: false,
        category: "Wellness",
        location: "Kandy, Central Province",
        vendorSince: "2020",
        vendorOrders: 134,
        vendorBio: "Ayurvedic practitioner (BAMS, Colombo) and mindfulness teacher with 15 years of practice. Specialising in traditional ceylonese healing.",
        description: "Restore your body and mind with an authentic Ayurvedic session in a serene Kandy garden setting. Includes a dosha consultation, therapeutic oil massage (Abhyangam), herbal steam therapy, and a guided meditation. All treatments use locally sourced herbs and oils.",
        highlights: ["BAMS qualified doctor", "Dosha consultation", "Herbal steam therapy", "Guided meditation", "Herbal tea ceremony"],
        packages: [
            { name: "Basic", price: 7200, description: "90-min healing session", delivery: "90 mins", revisions: 0, includes: ["Consultation", "Oil massage", "Herbal tea"] },
            { name: "Standard", price: 13500, description: "3-hour full treatment", delivery: "3 hrs", revisions: 0, includes: ["Massage", "Steam therapy", "Meditation", "Herbal kit"] },
            { name: "Premium", price: 28000, description: "Full-day Panchakarma", delivery: "8 hrs", revisions: 0, includes: ["5 therapies", "Yoga session", "Ayurvedic lunch", "Herb kit", "Follow-up"] },
        ],
        reviewsList: [
            { name: "Anna B.", avatar: "AB", rating: 5, comment: "I have never felt so relaxed in my life. Dr. W is exceptional.", date: "Mar 7, 2026" },
            { name: "Raj P.", avatar: "RP", rating: 5, comment: "Completely transformed my wellbeing. Booked the Premium and it was worth every rupee.", date: "Feb 14, 2026" },
        ],
    },
];
