/* Hotel images live in /assets as "hotel 1.webp" ... "hotel 20.webp" */
const IMG = (n) => `assets/hotel%20${n}.webp`;

const HOTELS = [
  { name: "Royal Garden Hotel",     city: "London, UK",          flag: "🇬🇧", rating: 4.6, pay: 420, img: IMG(1),  desc: "Elegant dining room with white-linen tables and warm lighting." },
  { name: "Villa Bellavista",       city: "Amalfi, Italy",       flag: "🇮🇹", rating: 4.9, pay: 560, img: IMG(2),  desc: "Sea-view suite with plush bedding and a calm, airy feel." },
  { name: "The Grand Palm",         city: "Miami, USA",          flag: "🇺🇸", rating: 4.8, pay: 550, img: IMG(3),  desc: "Glass-fronted city tower glowing at dusk." },
  { name: "Desert Pearl Retreat",   city: "Dubai, UAE",          flag: "🇦🇪", rating: 4.9, pay: 600, img: IMG(4),  desc: "Landscaped courtyard, lagoon pool and modern design." },
  { name: "Oasis Crown Lodge",      city: "Abu Dhabi, UAE",      flag: "🇦🇪", rating: 4.7, pay: 500, img: IMG(5),  desc: "Grand suite with vaulted ceilings and crystal chandeliers." },
  { name: "Riviera Palace",         city: "Nice, France",        flag: "🇫🇷", rating: 4.8, pay: 520, img: IMG(6),  desc: "Belle-époque terraces wrapped around a glowing pool." },
  { name: "Seychelles Palm Court",  city: "Mahé, Seychelles",    flag: "🇸🇨", rating: 4.8, pay: 480, img: IMG(7),  desc: "Beachfront resort with palms and sun loungers on soft sand." },
  { name: "The Mariner",            city: "Sydney, Australia",   flag: "🇦🇺", rating: 4.6, pay: 340, img: IMG(8),  desc: "Modern city hotel with a resort-style pool." },
  { name: "Vineyard House Lodge",   city: "Napa, USA",           flag: "🇺🇸", rating: 4.8, pay: 400, img: IMG(9),  desc: "Light-filled dining room with a seasonal menu." },
  { name: "Casa del Sol",           city: "Barcelona, Spain",    flag: "🇪🇸", rating: 4.5, pay: 300, img: IMG(10), desc: "Courtyard-style lounge under woven rattan lighting." },
  { name: "Tahoe Crest Retreat",    city: "Lake Tahoe, USA",     flag: "🇺🇸", rating: 4.6, pay: 300, img: IMG(11), desc: "Warm timber lounge and dining with a relaxed mood." },
  { name: "Jebel Vista Lodge",      city: "Ras Al Khaimah, UAE", flag: "🇦🇪", rating: 4.8, pay: 450, img: IMG(12), desc: "Panoramic dining with sweeping views of the skyline." },
  { name: "Ubud Jungle Retreat",    city: "Bali, Indonesia",     flag: "🇮🇩", rating: 4.7, pay: 380, img: IMG(13), desc: "Tropical-garden restaurant with natural textures." },
  { name: "Red Rock Haven",         city: "Sedona, USA",         flag: "🇺🇸", rating: 4.7, pay: 450, img: IMG(14), desc: "Terracotta-toned resort with a cascading water feature." },
  { name: "Pacific Palm Lodge",     city: "Maui, USA",           flag: "🇺🇸", rating: 4.7, pay: 350, img: IMG(15), desc: "Thatched pool deck, palms and ocean breezes." },
  { name: "Andaman Sands Resort",   city: "Phuket, Thailand",    flag: "🇹🇭", rating: 4.6, pay: 320, img: IMG(16), desc: "Beachfront resort on white sand with a calm lagoon." },
  { name: "Hajar Coast Lodge",      city: "Fujairah, UAE",       flag: "🇦🇪", rating: 4.8, pay: 400, img: IMG(17), desc: "Balconied rooms around a palm-lined pool." },
  { name: "Alpine Haus",            city: "Zermatt, Switzerland",flag: "🇨🇭", rating: 4.7, pay: 460, img: IMG(18), desc: "Spacious suite with ornate décor and a cosy lounge." },
  { name: "Lakeside Haven",         city: "Como, Italy",         flag: "🇮🇹", rating: 4.7, pay: 410, img: IMG(19), desc: "Bright, airy room with blue accents and a fruit welcome." },
  { name: "Maldives Lagoon Villas", city: "Malé, Maldives",      flag: "🇲🇻", rating: 4.9, pay: 580, img: IMG(20), desc: "Vast resort with lagoon-style pools and a lazy river." }
];

const STEPS = [
  ["Enter your details", "Username (no spaces, e.g. Mary23), phone number (e.g. 712345678), valid email, and a password you will remember."],
  ["Choose your country", "Select it from the list."],
  ["Create your account", "Tick Terms & Conditions, then press Create Account."],
  ["Pay the activation fee", "Pay the one-time KSh 500 to activate your account."],
  ["Start reviewing", "Open a hotel, write your review, and earn KSh 200 to 800 per review."]
];
