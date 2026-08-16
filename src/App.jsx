import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';
import LiveChat from './components/LiveChat';
import CustomerPortal from './components/CustomerPortal';
import NotificationBanner from './components/NotificationBanner';
import TrackOrderModal from './components/TrackOrderModal';

// OFFICIAL LOGO URL/PATH
const MA_LOGO_URL = "/logo.jpg.jpeg";

// MULTI-LANGUAGE TRANSLATION DICTIONARY
const TRANSLATIONS = {
  en: {
    langName: 'English',
    storeTitle: 'MA PRODUCTS',
    lightMode: '☀️ Light Mode',
    darkMode: '🌙 Dark Mode',
    shopCatalog: '🛍️ Shop Catalog',
    wishlist: '❤️ Wishlist',
    myOrders: '📦 My Orders & Complaints',
    trackOrder: '🔍 Track Order',
    itemsInCart: '🛒 Items in Cart:',
    proceedCheckout: '⚡ Proceed to Checkout',
    yourActiveCart: 'Your Active Cart',
    emptyCart: 'Your cart is empty. Add items to see total budget.',
    totalBudget: 'Total Budget:',
    adminTerminal: 'Admin Security Terminal',
    verifyIdentity: 'Authenticate Admin',
    cancel: 'Cancel',
    masterConsole: 'MA MASTER CONSOLE',
    exitTerminal: 'Exit Terminal',
    liveSupport: '💬 Live Support',
    addToCart: '🛒 Add to Cart',
    soldOut: '🚫 OUT OF STOCK',
    applyCoupon: 'Apply Promo',
    discount: 'Discount',
    reviews: 'Reviews',
    writeReview: 'Write a Review',
    recentlyViewed: '👀 Recently Viewed Items',
    compareProducts: '⚖️ Product Comparison',
    stockAlert: '⚠️ Stock Alert',
    restockAll: '🔄 Restock All Items'
  },
  ur: {
    langName: 'اردو',
    storeTitle: 'ایم اے پروڈکٹس',
    lightMode: '☀️ لائٹ موڈ',
    darkMode: '🌙 ڈارک موڈ',
    shopCatalog: '🛍️ خریداری کیٹلاگ',
    wishlist: '❤️ پسندیدہ اشیاء',
    myOrders: '📦 میرے آرڈرز اور شکایات',
    trackOrder: '🔍 آرڈر ٹریک کریں',
    itemsInCart: '🛒 کارٹ میں اشیاء:',
    proceedCheckout: '⚡ چیک آؤٹ کی طرف بڑھیں',
    yourActiveCart: 'آپ کا کارٹ',
    emptyCart: 'آپ کا کارٹ خالی ہے۔',
    totalBudget: 'کل رقم:',
    adminTerminal: 'ایڈمن سیکیورٹی ٹرمینل',
    verifyIdentity: 'شناخت کی تصدیق کریں',
    cancel: 'منسوخ کریں',
    masterConsole: 'ایم اے ماسٹر کنسول',
    exitTerminal: 'ٹرمینل سے باہر نکلیں',
    liveSupport: '💬 لائیو سپورٹ',
    addToCart: '🛒 کارٹ میں شامل کریں',
    soldOut: '🚫 ختم ہو گیا (OUT OF STOCK)',
    applyCoupon: 'پروپو کوڈ لگائیں',
    discount: 'رعایت',
    reviews: 'رائے / تبصرے',
    writeReview: 'رائے درج کریں',
    recentlyViewed: '👀 حال ہی میں دیکھی گئی اشیاء',
    compareProducts: '⚖️ پروڈکٹس کا موازنہ',
    stockAlert: '⚠️ اسٹاک الرٹ',
    restockAll: '🔄 تمام اسٹاک ری فل کریں'
  }
};

// AVAILABLE VALID COUPONS
const VALID_COUPONS = {
  'MAVIP20': { discountPercent: 20, description: 'VIP 20% Off' },
  'SAVE10': { discountPercent: 10, description: '10% Discount' },
  'FREESHIP': { fixedDiscount: 250, description: 'PKR 250 Off Shipping' }
};

// REALISTIC PRODUCTS LIST WITH DEFAULT STOCK THRESHOLDS
const REALISTIC_20_PRODUCTS = [
  {
    id: 1,
    name: "Luxury Leather Jacket",
    category: "Apparel",
    originalPrice: 15000,
    salePrice: 12000,
    isOnSale: true,
    saleLabel: "Hot Sale",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 6, "Islamabad Outlet": 4 },
    description: "Handcrafted genuine leather finish with ultra-soft inner velvet lining.",
    stock: 10,
    minStockAlert: 3,
    rating: 4.8,
    reviewsCount: 14,
    userReviews: [
      { id: 101, author: "Ali R.", rating: 5, comment: "Premium quality jacket! Super warm.", date: "2026-08-01" },
      { id: 102, author: "Usman K.", rating: 4, comment: "Leather smells genuine. Fitting is nice.", date: "2026-08-05" }
    ]
  },
  {
    id: 2,
    name: "Premium Gold Rim Shades",
    category: "Accessories",
    originalPrice: 3500,
    salePrice: 2500,
    isOnSale: true,
    saleLabel: "Limited Offer",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Gold", "Black"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 4 },
    description: "18k Gold plated frame with UV400 polarized protection lenses.",
    stock: 4,
    minStockAlert: 2,
    rating: 4.9,
    reviewsCount: 22,
    userReviews: [
      { id: 103, author: "Hamza S.", rating: 5, comment: "Very stylish and original look.", date: "2026-08-02" }
    ]
  },
  {
    id: 3,
    name: "Urban Minimalist Black Hoodie",
    category: "Apparel",
    originalPrice: 4800,
    salePrice: 3200,
    isOnSale: true,
    saleLabel: "Hot Deal",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["M", "L"],
    colors: ["Black", "Grey"],
    location: "Outlet Rawalpindi",
    branchStock: { "Outlet Rawalpindi": 10, "Main Warehouse": 5 },
    description: "Heavyweight fleece cotton hoodie designed for modern streetwear look.",
    stock: 15,
    minStockAlert: 4,
    rating: 4.6,
    reviewsCount: 9,
    userReviews: []
  },
  {
    id: 4,
    name: "Chrono Heritage Gold Watch",
    category: "Watches",
    originalPrice: 18500,
    salePrice: 14500,
    isOnSale: true,
    saleLabel: "Luxury Tier",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Gold"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 2 },
    description: "Japanese Movement with Sapphire Crystal scratch-resistant glass.",
    stock: 2,
    minStockAlert: 2,
    rating: 5.0,
    reviewsCount: 31,
    userReviews: [
      { id: 104, author: "Bilal A.", rating: 5, comment: "Royalty on wrist. Loved it!", date: "2026-08-10" }
    ]
  },
  {
    id: 5,
    name: "Classic Italian Leather Boots",
    category: "Footwear",
    originalPrice: 12000,
    salePrice: 9500,
    isOnSale: false,
    saleLabel: "New Arrival",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["40", "41", "42", "43"],
    colors: ["Brown", "Black"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 0 },
    description: "Hand-stitched genuine calfskin leather with memory foam sole.",
    stock: 0,
    minStockAlert: 3,
    rating: 4.7,
    reviewsCount: 8,
    userReviews: []
  },
  {
    id: 6,
    name: "Sleek Matte-Black Wallet",
    category: "Accessories",
    originalPrice: 2800,
    salePrice: 1950,
    isOnSale: true,
    saleLabel: "Best Seller",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Black"],
    location: "Outlet Islamabad",
    branchStock: { "Outlet Islamabad": 8 },
    description: "RFID blocking slim bi-fold leather wallet.",
    stock: 8,
    minStockAlert: 2,
    rating: 4.5,
    reviewsCount: 19,
    userReviews: []
  },
  {
    id: 7,
    name: "Executive Leather Briefcase",
    category: "Bags",
    originalPrice: 16500,
    salePrice: 13200,
    isOnSale: true,
    saleLabel: "Executive",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Brown"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 5 },
    description: "Full-grain leather office briefcase with dedicated laptop compartment.",
    stock: 5,
    minStockAlert: 2,
    rating: 4.9,
    reviewsCount: 11,
    userReviews: []
  },
  {
    id: 8,
    name: "Royal Velvet Blazer",
    category: "Apparel",
    originalPrice: 22000,
    salePrice: 18000,
    isOnSale: false,
    saleLabel: "Exclusive",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Blue", "Black"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 3 },
    description: "Tailored fit velvet tuxedo blazer for formal events.",
    stock: 3,
    minStockAlert: 2,
    rating: 5.0,
    reviewsCount: 6,
    userReviews: []
  },
  {
    id: 9,
    name: "Minimalist Silver Chronograph",
    category: "Watches",
    originalPrice: 14000,
    salePrice: 11500,
    isOnSale: true,
    saleLabel: "Trending",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Silver"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 12 },
    description: "Sleek stainless steel watch with minimalist white dial.",
    stock: 12,
    minStockAlert: 3,
    rating: 4.8,
    reviewsCount: 27,
    userReviews: []
  },
  {
    id: 10,
    name: "Oud Royale Perfume (100ml)",
    category: "Fragrance",
    originalPrice: 9500,
    salePrice: 7500,
    isOnSale: true,
    saleLabel: "Hot Deal",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["100ml"],
    colors: ["Standard"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 7 },
    description: "Long-lasting concentrated Arabian Oud with woody amber undertones.",
    stock: 7,
    minStockAlert: 3,
    rating: 4.9,
    reviewsCount: 40,
    userReviews: []
  },
  {
    id: 11,
    name: "Signature Aviator Sunglasses",
    category: "Accessories",
    originalPrice: 4200,
    salePrice: 3100,
    isOnSale: true,
    saleLabel: "Popular",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Black", "Gold"],
    location: "Outlet Islamabad",
    branchStock: { "Outlet Islamabad": 14 },
    description: "Classic metal aviator frame with dark glare-reduction lenses.",
    stock: 14,
    minStockAlert: 4,
    rating: 4.6,
    reviewsCount: 18,
    userReviews: []
  },
  {
    id: 12,
    name: "Tactical Matte Black Backpack",
    category: "Bags",
    originalPrice: 7800,
    salePrice: 5900,
    isOnSale: true,
    saleLabel: "Sale",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Black"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 9 },
    description: "Water-resistant travel backpack with USB charging port.",
    stock: 9,
    minStockAlert: 3,
    rating: 4.7,
    reviewsCount: 15,
    userReviews: []
  },
  {
    id: 13,
    name: "Suede Leather Loafers",
    category: "Footwear",
    originalPrice: 8900,
    salePrice: 6900,
    isOnSale: false,
    saleLabel: "Classic",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["41", "42", "43"],
    colors: ["Brown", "Navy"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 0 },
    description: "Comfortable soft suede slip-on loafers for casual luxury.",
    stock: 0,
    minStockAlert: 2,
    rating: 4.4,
    reviewsCount: 5,
    userReviews: []
  },
  {
    id: 14,
    name: "Automatic Skeleton Watch",
    category: "Watches",
    originalPrice: 24000,
    salePrice: 19500,
    isOnSale: true,
    saleLabel: "Masterpiece",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Black", "Silver"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 1 },
    description: "Self-winding transparent mechanical skeletal dial.",
    stock: 1,
    minStockAlert: 2,
    rating: 5.0,
    reviewsCount: 38,
    userReviews: []
  },
  {
    id: 15,
    name: "Luxury Silk Tie & Cufflinks Set",
    category: "Accessories",
    originalPrice: 3200,
    salePrice: 2200,
    isOnSale: true,
    saleLabel: "Gift Pack",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Red", "Black"],
    location: "Outlet Rawalpindi",
    branchStock: { "Outlet Rawalpindi": 18 },
    description: "100% Woven silk tie paired with polished brass cufflinks.",
    stock: 18,
    minStockAlert: 5,
    rating: 4.7,
    reviewsCount: 12,
    userReviews: []
  },
  {
    id: 16,
    name: "Denim Trucker Jacket",
    category: "Apparel",
    originalPrice: 6500,
    salePrice: 4800,
    isOnSale: true,
    saleLabel: "Hot Sale",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L"],
    colors: ["Blue"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 11 },
    description: "Vintage washed heavy denim jacket with metal buttons.",
    stock: 11,
    minStockAlert: 3,
    rating: 4.8,
    reviewsCount: 20,
    userReviews: []
  },
  {
    id: 17,
    name: "Velvet Amber Cologne (50ml)",
    category: "Fragrance",
    originalPrice: 6800,
    salePrice: 5200,
    isOnSale: false,
    saleLabel: "New",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["50ml"],
    colors: ["Standard"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 6 },
    description: "Warm vanilla and spiced cinnamon luxury cologne.",
    stock: 6,
    minStockAlert: 2,
    rating: 4.6,
    reviewsCount: 16,
    userReviews: []
  },
  {
    id: 18,
    name: "Minimalist Leather Duffle Bag",
    category: "Bags",
    originalPrice: 13500,
    salePrice: 10500,
    isOnSale: true,
    saleLabel: "Travel",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Brown", "Black"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 4 },
    description: "Spacious weekender duffle bag crafted from soft leather.",
    stock: 4,
    minStockAlert: 2,
    rating: 4.9,
    reviewsCount: 23,
    userReviews: []
  },
  {
    id: 19,
    name: "High-Top White Leather Sneakers",
    category: "Footwear",
    originalPrice: 9800,
    salePrice: 7600,
    isOnSale: true,
    saleLabel: "Streetwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["40", "41", "42", "43"],
    colors: ["White"],
    location: "Raja Bazar",
    branchStock: { "Raja Bazar": 13 },
    description: "Clean minimalist white leather sneakers with cushioned soles.",
    stock: 13,
    minStockAlert: 4,
    rating: 4.7,
    reviewsCount: 29,
    userReviews: []
  },
  {
    id: 20,
    name: "Polarized Clubmaster Sunglasses",
    category: "Accessories",
    originalPrice: 3800,
    salePrice: 2800,
    isOnSale: false,
    saleLabel: "Clearance",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Black", "Brown"],
    location: "Main Warehouse",
    branchStock: { "Main Warehouse": 5 },
    description: "Retro browline frame sunglasses with anti-glare coating.",
    stock: 5,
    minStockAlert: 2,
    rating: 4.5,
    reviewsCount: 8,
    userReviews: []
  }
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // LANGUAGE STATE
  const [language, setLanguage] = useState(() => localStorage.getItem('ma_language') || 'en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('ma_language', language);
  }, [language]);
  
  const t = (key) => (TRANSLATIONS[language] && TRANSLATIONS[language][key]) || TRANSLATIONS.en[key] || key;

  // DYNAMIC ADMIN CREDENTIAL SECURITY & PERSISTENT URL PARAMETERS
  const [adminEmail, setAdminEmail] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('admin_email');
    if (emailParam) {
      localStorage.setItem('ma_admin_email', emailParam);
      return emailParam;
    }
    return localStorage.getItem('ma_admin_email') || 'admin@maproducts.com';
  });
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('ma_admin_password') || 'ma786');

  // UPDATE LOCALSTORAGE AND URL PARAMS WHEN ADMIN EMAIL CHANGES
  useEffect(() => {
    localStorage.setItem('ma_admin_email', adminEmail);
    const url = new URL(window.location.href);
    url.searchParams.set('admin_email', adminEmail);
    window.history.replaceState(null, '', url.toString());
  }, [adminEmail]);

  useEffect(() => {
    localStorage.setItem('ma_admin_password', adminPassword);
  }, [adminPassword]);

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  // AUDIT LOGS FOR ADMIN SECURITY & STOCK
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('ma_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: 1, action: "System Initialized", time: new Date().toLocaleString(), user: "System" }
    ];
  });

  const logAudit = (action) => {
    const entry = { id: Date.now(), action, time: new Date().toLocaleString(), user: "Admin" };
    setAuditLogs(prev => [entry, ...prev]);
  };

  useEffect(() => {
    localStorage.setItem('ma_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // PRODUCT CATALOGUE STATE
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ma_luxury_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Storage parse error", e);
      }
    }
    return REALISTIC_20_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('ma_luxury_products_v3', JSON.stringify(products));
  }, [products]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  };

  // ==================== ADMIN STOCK & RESTOCK MANAGEMENT ENGINE ====================
  const handleUpdateStock = (productId, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedStock = Math.max(0, (p.stock || 0) + delta);
        logAudit(`Stock updated for ${p.name}: ${updatedStock}`);
        return { ...p, stock: updatedStock };
      }
      return p;
    }));
  };

  const handleSetStockExact = (productId, exactAmount) => {
    const qty = Math.max(0, parseInt(exactAmount) || 0);
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        logAudit(`Stock explicitly set for ${p.name} to ${qty}`);
        return { ...p, stock: qty };
      }
      return p;
    }));
    addNotification("📦 Stock Refilled", `Product stock set to ${qty}`, "info");
  };

  const handleRestock = (productId, amount = 10) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedStock = (p.stock || 0) + amount;
        logAudit(`Restocked ${p.name} (+${amount}). Total: ${updatedStock}`);
        return { ...p, stock: updatedStock };
      }
      return p;
    }));
    addNotification("📦 Restocked", "Product stock increased successfully!", "info");
  };

  const handleRefillAllOutOfStock = (amount = 15) => {
    setProducts(prev => prev.map(p => {
      if ((p.stock || 0) <= 0 || (p.stock || 0) <= (p.minStockAlert || 3)) {
        return { ...p, stock: (p.stock || 0) + amount };
      }
      return p;
    }));
    logAudit(`Bulk Refill Executed (+${amount} items to low/out of stock items)`);
    addNotification("🔄 Mass Restock Complete", `All empty/low stock items refilled by ${amount} units!`, "info");
  };

  const handleUpdateMinAlert = (productId, minAlert) => {
    const val = Math.max(1, parseInt(minAlert) || 1);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, minStockAlert: val } : p));
    logAudit(`Updated stock alert limit for product ID ${productId} to ${val}`);
  };

  // OUT OF STOCK AND LOW STOCK CALCULATOR FOR ADMIN NOTIFICATIONS
  const lowStockItems = useMemo(() => {
    return products.filter(p => (p.stock || 0) <= (p.minStockAlert || 3));
  }, [products]);

  const outOfStockItems = useMemo(() => {
    return products.filter(p => (p.stock || 0) <= 0);
  }, [products]);

  // CUSTOMER STORE STATES
  const [customerTab, setCustomerTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [wishlist, setWishlist] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [adminStockTabFilter, setAdminStockTabFilter] = useState('all'); // 'all', 'low', 'out'

  // RECENTLY VIEWED & COMPARISON STATE
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });
  };

  const toggleCompare = (product) => {
    if (compareList.some(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
      addNotification("⚖️ Comparison", `${product.name} removed from comparison`, "info");
    } else {
      if (compareList.length >= 3) {
        alert("You can only compare up to 3 products at a time.");
        return;
      }
      setCompareList([...compareList, product]);
      addNotification("⚖️ Comparison", `${product.name} added to comparison!`, "info");
    }
  };

  // FLASH SALE TIMER ENGINE
  const [flashSaleConfig, setFlashSaleConfig] = useState(() => {
    const saved = localStorage.getItem('ma_flash_sale_config');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      title: "🔥 MA LUXURY FLASH SALE IS LIVE!",
      subTitle: "Get flat discounts on high-end luxury items before stock runs out.",
      endTime: Date.now() + (5 * 3600 * 1000 + 59 * 60 * 1000 + 13 * 1000)
    };
  });

  const [timeLeftStr, setTimeLeftStr] = useState("00h : 00m : 00s");
  const [isSaleExpired, setIsSaleExpired] = useState(false);

  useEffect(() => {
    localStorage.setItem('ma_flash_sale_config', JSON.stringify(flashSaleConfig));
  }, [flashSaleConfig]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = flashSaleConfig.endTime - now;
      if (diff <= 0) {
        setTimeLeftStr("EXPIRED");
        setIsSaleExpired(true);
      } else {
        setIsSaleExpired(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeftStr(
          `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [flashSaleConfig]);

  const updateFlashSaleTimer = (hoursToAdd) => {
    const newEndTime = Date.now() + (parseFloat(hoursToAdd) * 3600 * 1000);
    setFlashSaleConfig(prev => ({ ...prev, endTime: newEndTime, enabled: true }));
    logAudit(`Flash sale extended by ${hoursToAdd} hours.`);
  };

  // CART, COUPONS & ORDER STATES
  const [cart, setCart] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [companyAddress, setCompanyAddress] = useState(() => localStorage.getItem('ma_company_address') || "Main Commercial Market, Rawalpindi, Pakistan");
  
  const [bankDetails, setBankDetails] = useState(() => {
    const saved = localStorage.getItem('ma_bank_details');
    return saved ? JSON.parse(saved) : {
      bankName: "Meezan Bank Ltd",
      accountTitle: "MA Products Official",
      accountNumber: "0312 3456789",
      iban: "PK12 MEZN 0012 3456 7890",
      easypaisaName: "EasyPaisa Wallet",
      easypaisaNumber: "0300 1234567",
      easypaisaTitle: "Khawaja Awais"
    };
  });

  // MODAL STATES WITH QUANTITY CONTROL
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedModalSize, setSelectedModalSize] = useState('');
  const [selectedModalColor, setSelectedModalColor] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');

  const addNotification = (title, message, type = 'info') => {
    const newNote = { id: Date.now(), title, message, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setNotifications(prev => [newNote, ...prev]);
    setTimeout(() => clearNotification(newNote.id), 5000);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addToCart = (product, customColor = '', customSize = '', qty = 1) => {
    if (product.stock <= 0) {
      alert("This item is currently Out of Stock!");
      return;
    }
    const price = product.isOnSale ? Number(product.salePrice) : Number(product.originalPrice);
    const chosenColor = customColor || selectedModalColor || (product.colors && product.colors[0]) || '';
    const chosenSize = customSize || selectedModalSize || (product.sizes && product.sizes[0]) || '';
    const existingIndex = cart.findIndex(item => item.id === product.id && item.selectedColor === chosenColor && item.selectedSize === chosenSize);
    
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const newTotalQty = updatedCart[existingIndex].quantity + qty;
      if (newTotalQty > product.stock) {
        alert(`Only ${product.stock} items are available in stock.`);
        return;
      }
      updatedCart[existingIndex].quantity = newTotalQty;
      setCart(updatedCart);
    } else {
      if (qty > product.stock) {
        alert(`Only ${product.stock} items are available in stock.`);
        return;
      }
      setCart([...cart, { ...product, finalPrice: price, quantity: qty, selectedColor: chosenColor, selectedSize: chosenSize, cartId: Date.now() }]);
    }
    addNotification("🛒 Cart Updated", `${product.name} added to cart!`, "order");
    setSelectedProductModal(null);
  };

  const updateQuantity = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = (item.quantity || 1) + delta;
        if (newQty > item.stock) {
          alert(`Limit: Only ${item.stock} items available.`);
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));

  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      addNotification("💔 Wishlist", `${product.name} removed from Wishlist`, "info");
    } else {
      setWishlist([...wishlist, product]);
      addNotification("❤️ Wishlist", `${product.name} added to Wishlist!`, "info");
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, ...VALID_COUPONS[code] });
      addNotification("🎉 Coupon Applied", `${code} coupon successful!`, "info");
    } else {
      alert("Invalid Coupon Code! (Try: MAVIP20 or SAVE10)");
    }
  };

  const rawSubTotal = cart.reduce((acc, curr) => acc + (Number(curr.finalPrice) * (curr.quantity || 1)), 0);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return (rawSubTotal * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.fixedDiscount) {
      return Math.min(rawSubTotal, appliedCoupon.fixedDiscount);
    }
    return 0;
  }, [rawSubTotal, appliedCoupon]);

  const subTotalBudget = Math.max(0, rawSubTotal - discountAmount);

  const filteredProducts = useMemo(() => {
    let result = products.filter(prod => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || prod.name.toLowerCase().includes(query) || (prod.category && prod.category.toLowerCase().includes(query));
      const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.isOnSale ? a.salePrice : a.originalPrice) - (b.isOnSale ? b.salePrice : b.originalPrice));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.isOnSale ? b.salePrice : b.originalPrice) - (a.isOnSale ? a.salePrice : a.originalPrice));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];

  const handleAddReview = (e, productId) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      alert("Please enter your name and review comment.");
      return;
    }
    const reviewObj = {
      id: Date.now(),
      author: newReviewAuthor,
      rating: Number(newReviewRating),
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [reviewObj, ...(p.userReviews || [])];
        const avgRating = (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1);
        return {
          ...p,
          userReviews: updatedReviews,
          rating: Number(avgRating),
          reviewsCount: updatedReviews.length
        };
      }
      return p;
    }));

    setNewReviewAuthor('');
    setNewReviewComment('');
    addNotification("⭐ Review Added", "Thank you for your feedback!", "info");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (inputEmail.trim().toLowerCase() === adminEmail.trim().toLowerCase() && inputPassword === adminPassword) {
      setIsAdminAuthenticated(true);
      setInputEmail('');
      setInputPassword('');
      logAudit("Admin authenticated successfully.");
    } else {
      alert("Invalid Email or Password!");
    }
  };

  const resetCatalogueToDefault = () => {
    localStorage.removeItem('ma_luxury_products_v3');
    setProducts(REALISTIC_20_PRODUCTS);
    logAudit("Catalogue reset to default 20 items.");
    addNotification("🔄 Catalogue Reset", "Catalogue restored to 20 realistic luxury items!", "info");
  };

  const handleCopyProductLink = (product) => {
    navigator.clipboard?.writeText?.(window.location.href);
    addNotification("🔗 Link Copied", `${product.name} link copied to clipboard!`, "info");
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-[#0D0D0E] text-white' : 'bg-[#F4F4F7] text-gray-900'}`}>
      
      <NotificationBanner notifications={notifications} clearNotification={clearNotification} />
      
      {/* HEADER TOP BAR */}
      <div className="p-3 flex justify-between items-center gap-2 px-6 border-b border-white/5 relative bg-black/40 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          {isAdminRoute && (
            <button onClick={() => navigate('/')} className="px-3 py-1.5 bg-[#BA963E] text-black font-bold text-xs rounded-xl hover:bg-[#E5C158] transition-all cursor-pointer">
              🛍️ Return to Storefront
            </button>
          )}
          {compareList.length > 0 && !isAdminRoute && (
            <button onClick={() => setIsCompareModalOpen(true)} className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition-all cursor-pointer">
              ⚖️ Compare ({compareList.length})
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="bg-white/10 text-xs px-3 py-1.5 rounded-xl hover:bg-white/20 cursor-pointer">
              🌐 {TRANSLATIONS[language].langName}
            </button>
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#121214] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {Object.keys(TRANSLATIONS).map((langKey) => (
                  <button key={langKey} onClick={() => { setLanguage(langKey); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs ${language === langKey ? 'bg-[#BA963E] text-black font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
                    {TRANSLATIONS[langKey].langName}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="bg-white/10 text-xs px-3 py-1.5 rounded-xl hover:bg-white/20 cursor-pointer">
            {darkMode ? t('lightMode') : t('darkMode')}
          </button>
        </div>
      </div>

      {/* ==================== 1. STOREFRONT ROUTE ("/") ==================== */}
      {!isAdminRoute && (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-24">
          
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700/20 pb-4 gap-4">
            
            {/* UPDATED LOGO + BRAND NAME DISPLAY */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCustomerTab('catalog')}>
              <div className="p-1.5 bg-gradient-to-b from-[#BA963E]/20 to-transparent rounded-2xl border border-[#BA963E]/30 shadow-lg">
                <img src={MA_LOGO_URL} alt="MA LOGO" className="h-12 w-12 object-contain drop-shadow-md rounded-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-200 drop-shadow-sm uppercase font-serif">
                  MA PRODUCTS
                </span>
                <span className="text-[10px] text-amber-500/80 tracking-[0.2em] font-bold uppercase -mt-1 font-mono">
                  MOST AMAZING PRODUCTS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setCustomerTab('catalog')} className={`px-4 py-2 rounded-xl text-xs font-bold ${customerTab === 'catalog' ? 'bg-[#BA963E] text-black' : 'bg-white/5 text-gray-300'}`}>
                {t('shopCatalog')}
              </button>
              <button onClick={() => setCustomerTab('wishlist')} className={`px-4 py-2 rounded-xl text-xs font-bold ${customerTab === 'wishlist' ? 'bg-[#BA963E] text-black' : 'bg-white/5 text-gray-300'}`}>
                {t('wishlist')} ({wishlist.length})
              </button>
              <button onClick={() => setCustomerTab('portal')} className={`px-4 py-2 rounded-xl text-xs font-bold ${customerTab === 'portal' ? 'bg-[#BA963E] text-black' : 'bg-white/5 text-gray-300'}`}>
                {t('myOrders')}
              </button>
              <button onClick={() => setIsTrackModalOpen(true)} className="bg-[#BA963E]/10 border border-[#BA963E]/30 text-[#E5C158] px-3.5 py-2 rounded-xl text-xs font-bold">
                {t('trackOrder')}
              </button>
            </div>
            <div onClick={() => setIsCartDrawerOpen(true)} className="text-xs bg-[#BA963E]/10 border border-[#BA963E]/30 px-4 py-2 rounded-xl text-[#E5C158] font-bold cursor-pointer flex items-center gap-2">
              <span>{t('itemsInCart')}</span>
              <span className="bg-[#BA963E] text-black px-2 py-0.5 rounded-full text-[11px] font-mono font-bold">
                {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </span>
            </div>
          </div>

          {customerTab === 'catalog' && (
            <>
              {/* FLASH SALE BANNER */}
              {flashSaleConfig.enabled && !isSaleExpired && (
                <div className="bg-gradient-to-r from-[#BA963E]/20 via-[#121214] to-[#BA963E]/20 border border-[#BA963E]/30 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left shadow-lg">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#E5C158] uppercase tracking-wider">{flashSaleConfig.title}</h3>
                    <p className="text-xs text-gray-400">{flashSaleConfig.subTitle}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-black/60 px-4 py-2 rounded-xl border border-white/10">
                    <span className="text-gray-400">Ends In:</span>
                    <span className="text-[#E5C158] font-bold">{timeLeftStr}</span>
                  </div>
                </div>
              )}

              {/* SEARCH & SORT ONLY */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#121214]/50 p-4 rounded-2xl border border-white/5">
                <div className="w-full md:w-1/3 relative">
                  <input
                    type="text"
                    placeholder="Search products by name, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">Sort:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#1A1A1D] text-xs text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#BA963E]"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${selectedCategory === cat ? 'bg-[#BA963E] text-black font-bold' : 'bg-white/5 text-gray-400'}`}>
                      {cat}
                    </button>
                  ))}
                  <button onClick={resetCatalogueToDefault} className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
                    🔄 Reset (20 Items)
                  </button>
                </div>
              </div>

              {/* PRODUCT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProducts.map((prod) => {
                    const isSoldOut = (prod.stock || 0) <= 0;
                    const isLowStock = prod.stock > 0 && prod.stock <= (prod.minStockAlert || 3);
                    const isComparing = compareList.some(c => c.id === prod.id);
                    return (
                      <div key={prod.id} className="bg-[#121214]/40 p-4 rounded-3xl border border-white/5 shadow-xl flex flex-col justify-between hover:border-[#BA963E]/30 transition-all relative overflow-hidden group">
                        
                        {/* FLASH SALE / SALE BADGE */}
                        {prod.isOnSale && !isSoldOut && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                              🔥 {prod.saleLabel || 'FLASH SALE'}
                            </span>
                          </div>
                        )}
                        {isSoldOut && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-gray-800 text-red-400 border border-red-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                              🚫 OUT OF STOCK
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 z-10 flex gap-1">
                          <button onClick={() => toggleCompare(prod)} className={`p-2 rounded-full border text-xs ${isComparing ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black/40 border-white/10'}`} title="Compare Product">
                            秤️
                          </button>
                          <button onClick={() => toggleWishlist(prod)} className="bg-black/40 p-2 rounded-full border border-white/10 text-xs">
                            {wishlist.some(w => w.id === prod.id) ? '❤️' : '🤍'}
                          </button>
                        </div>
                        <div 
                          onClick={() => {
                            setSelectedProductModal(prod);
                            addToRecentlyViewed(prod);
                            setActiveImageIdx(0);
                            setSelectedModalSize((prod.sizes && prod.sizes[0]) || '');
                            setSelectedModalColor((prod.colors && prod.colors[0]) || '');
                            setModalQuantity(1);
                          }} 
                          className="rounded-2xl overflow-hidden border border-white/10 h-56 mb-4 bg-[#1A1A1D] cursor-pointer relative flex items-center justify-center"
                        >
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            onError={handleImageError} 
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
                            👁️ Quick View
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h2 className="text-lg font-serif tracking-wide">{prod.name}</h2>
                            <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                              ⭐ {prod.rating || 5.0}
                            </span>
                          </div>
                          
                          <div className="text-[11px] text-gray-400 space-y-1">
                            {prod.location && <p>📍 <span className="text-gray-300 font-medium">{prod.location}</span></p>}
                            {prod.colors && prod.colors.length > 0 && <p>🎨 Colors: <span className="text-gray-200">{prod.colors.join(', ')}</span></p>}
                            {prod.sizes && prod.sizes.length > 0 && <p>📐 Sizes: <span className="text-gray-200">{prod.sizes.join(', ')}</span></p>}
                          </div>
                          <div className="text-md font-sans font-semibold">
                            {prod.isOnSale ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-[#E5C158] text-lg font-mono font-bold">{prod.salePrice} PKR</span>
                                <span className="text-xs text-gray-500 line-through font-mono">{prod.originalPrice} PKR</span>
                              </div>
                            ) : (
                              <span className="text-white text-md font-mono font-bold">{prod.originalPrice} PKR</span>
                            )}
                          </div>
                          
                          {/* DYNAMIC REAL-TIME STOCK STATUS DISPLAY FOR CUSTOMER */}
                          <div className="text-[11px] font-mono flex justify-between items-center py-1 bg-black/20 px-2 rounded-lg border border-white/5">
                            <span>Stock Status:</span>
                            {isSoldOut ? (
                              <span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded">0 units (Out of Stock)</span>
                            ) : isLowStock ? (
                              <span className="text-amber-400 font-bold animate-pulse">⚡ Left {prod.stock} piece{prod.stock > 1 ? 's' : ''}!</span>
                            ) : (
                              <span className="text-emerald-400 font-bold">{prod.stock} units available</span>
                            )}
                          </div>
                          {/* VIEW PRODUCT BUTTON & ADD TO CART */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedProductModal(prod);
                                addToRecentlyViewed(prod);
                                setActiveImageIdx(0);
                                setSelectedModalSize((prod.sizes && prod.sizes[0]) || '');
                                setSelectedModalColor((prod.colors && prod.colors[0]) || '');
                                setModalQuantity(1);
                              }}
                              className="w-1/2 font-bold py-2.5 rounded-xl uppercase tracking-wider text-xs bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                            >
                              👁️ View Details
                            </button>
                            <button
                              onClick={() => addToCart(prod)}
                              disabled={isSoldOut}
                              className={`w-1/2 font-bold py-2.5 rounded-xl uppercase tracking-wider text-xs transition-all ${
                                isSoldOut 
                                  ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-60' 
                                  : 'bg-[#BA963E] text-black hover:bg-[#E5C158] cursor-pointer'
                              }`}
                            >
                              {isSoldOut ? t('soldOut') : t('addToCart')}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* ACTIVE CART SIDEBAR */}
                <div className="bg-[#121214] border border-white/5 p-5 rounded-3xl space-y-4 shadow-xl lg:sticky lg:top-6">
                  <h3 className="text-md font-serif text-[#E5C158] border-b border-white/5 pb-2 uppercase tracking-wider flex justify-between items-center">
                    <span>{t('yourActiveCart')}</span>
                    <span className="text-xs font-mono text-gray-400">({cart.length})</span>
                  </h3>
                  {cart.length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center">{t('emptyCart')}</p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div key={item.cartId} className="flex justify-between items-center bg-[#1A1A1D] p-2.5 rounded-xl border border-white/5 text-xs">
                            <div className="flex items-center gap-2">
                              <img src={item.image} onError={handleImageError} className="w-8 h-8 rounded object-cover" alt="" />
                              <div>
                                <p className="font-medium max-w-[100px] truncate">{item.name}</p>
                                {(item.selectedColor || item.selectedSize) && (
                                  <p className="text-[9px] text-gray-400">{item.selectedColor} {item.selectedSize ? `/ ${item.selectedSize}` : ''}</p>
                                )}
                                <p className="text-[#E5C158] text-[11px] font-bold font-mono">{item.finalPrice * (item.quantity || 1)} PKR</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                              <button onClick={() => updateQuantity(item.cartId, -1)} className="text-xs font-bold">-</button>
                              <span className="text-[11px] font-bold font-mono">{item.quantity || 1}</span>
                              <button onClick={() => updateQuantity(item.cartId, 1)} className="text-xs font-bold">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 text-[10px]">Remove</button>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo Code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#BA963E]"
                        />
                        <button type="submit" className="bg-[#BA963E] text-black font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-[#E5C158]">
                          Apply
                        </button>
                      </form>
                      {appliedCoupon && (
                        <div className="text-[11px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2 rounded-xl flex justify-between">
                          <span>Coupon Applied ({appliedCoupon.code})</span>
                          <span>-{discountAmount} PKR</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Raw Subtotal:</span>
                          <span className="font-mono">{rawSubTotal} PKR</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">{t('totalBudget')}</span>
                          <span className="text-xl font-bold text-[#E5C158] font-mono">{subTotalBudget} PKR</span>
                        </div>
                        <button onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black font-bold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg cursor-pointer">
                          {t('proceedCheckout')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {recentlyViewed.length > 0 && (
                <div className="pt-8 border-t border-white/5 space-y-4">
                  <h3 className="text-md font-serif text-[#E5C158] uppercase tracking-wider">{t('recentlyViewed')}</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {recentlyViewed.map(item => (
                      <div key={item.id} onClick={() => setSelectedProductModal(item)} className="bg-[#121214] p-3 rounded-2xl border border-white/5 min-w-[160px] cursor-pointer hover:border-[#BA963E]/40">
                        <img src={item.image} onError={handleImageError} className="w-full h-24 object-cover rounded-xl mb-2" alt="" />
                        <p className="text-xs font-bold truncate">{item.name}</p>
                        <p className="text-xs text-[#E5C158] font-mono">{item.isOnSale ? item.salePrice : item.originalPrice} PKR</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {cart.length > 0 && (
                <div id="checkout-section" className="pt-6 scroll-mt-6">
                  <Checkout
                    darkMode={darkMode}
                    cartItems={cart}
                    totalBudget={subTotalBudget}
                    bankDetails={bankDetails}
                    companyAddress={companyAddress}
                    onOrderPlaced={() => setCart([])}
                  />
                </div>
              )}
            </>
          )}
          {customerTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-[#E5C158]">{t('wishlist')}</h2>
              {wishlist.length === 0 ? (
                <p className="text-xs text-gray-400">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map(prod => (
                    <div key={prod.id} className="bg-[#121214] p-4 rounded-2xl border border-white/5 space-y-2 relative">
                      {prod.isOnSale && prod.stock > 0 && (
                        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          🔥 SALE
                        </div>
                      )}
                      <img src={prod.image} onError={handleImageError} className="w-full h-36 object-cover rounded-xl cursor-pointer" onClick={() => setSelectedProductModal(prod)} alt="" />
                      <h3 className="font-serif text-sm font-bold">{prod.name}</h3>
                      <p className="text-xs font-mono text-[#E5C158]">{prod.isOnSale ? prod.salePrice : prod.originalPrice} PKR</p>
                      
                      <div className="flex gap-2 pt-1">
                        <button 
                          onClick={() => setSelectedProductModal(prod)}
                          className="w-1/2 text-xs font-bold py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
                        >
                          👁️ View
                        </button>
                        <button 
                          onClick={() => addToCart(prod)} 
                          disabled={prod.stock <= 0}
                          className={`w-1/2 text-xs font-bold py-2 rounded-xl ${prod.stock <= 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#BA963E] text-black'}`}
                        >
                          {prod.stock <= 0 ? t('soldOut') : t('addToCart')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {customerTab === 'portal' && <CustomerPortal addNotification={addNotification} />}
        </div>
      )}

      {/* ==================== 2. ADMIN PORTAL ROUTE ("/admin") ==================== */}
      {isAdminRoute && (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {!isAdminAuthenticated ? (
            /* ADMIN LOGIN FORM */
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className="bg-[#121214] border border-[#BA963E]/40 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <img src={MA_LOGO_URL} alt="MA PRODUCTS LOGO" className="h-20 mx-auto object-contain drop-shadow-md rounded-lg" />
                  <h2 className="text-xl font-serif font-bold text-[#E5C158] uppercase tracking-widest">{t('adminTerminal')}</h2>
                  <p className="text-xs text-gray-400">{t('verifyIdentity')}</p>
                </div>
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-1">Admin Email:</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@maproducts.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-1">Password:</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black font-bold py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-all cursor-pointer"
                  >
                    Login to Console
                  </button>
                </form>
                <div className="text-center pt-2">
                  <button onClick={() => navigate('/')} className="text-xs text-gray-500 hover:text-gray-300 underline">
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#121214] p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <img src={MA_LOGO_URL} alt="MA PRODUCTS LOGO" className="h-12 w-auto object-contain rounded-lg" />
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#E5C158]">{t('masterConsole')}</h2>
                    <p className="text-xs text-gray-400">System Logged as: <span className="text-[#E5C158] font-bold">{adminEmail}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdminAuthenticated(false)}
                  className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  {t('exitTerminal')}
                </button>
              </div>

              {/* ADMIN OUT OF STOCK & LOW STOCK ALERT BANNER */}
              {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
                <div className="bg-gradient-to-r from-red-900/40 via-[#121214] to-amber-900/40 border border-red-500/40 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl animate-pulse">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚨</span>
                      <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">
                        Stock Warning: {outOfStockItems.length} Sold Out & {lowStockItems.length} Low Stock Items!
                      </h3>
                    </div>
                    <p className="text-xs text-gray-300">
                      Out of stock items are automatically marked as "OUT OF STOCK" on the customer panel.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRefillAllOutOfStock(15)}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      ⚡ Quick Restock All Low Items (+15)
                    </button>
                  </div>
                </div>
              )}

              {/* ADMIN SETTINGS SECTION: CHANGE LOGIN EMAIL & PASSWORD */}
              <div className="bg-[#121214] border border-[#BA963E]/30 p-6 rounded-3xl space-y-4 shadow-xl">
                <h3 className="text-sm font-serif font-bold text-[#E5C158] uppercase tracking-wider">🔑 Admin Security Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-1">Change Admin Login Email:</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        defaultValue={adminEmail}
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            setAdminEmail(e.target.value.trim());
                            logAudit(`Admin Email changed to ${e.target.value.trim()}`);
                            addNotification("📧 Admin Email Updated", `New email set: ${e.target.value.trim()}`, "info");
                          }
                        }}
                        className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">* Email update persists across all links & refreshes.</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-1">Change Admin Password:</label>
                    <input
                      type="text"
                      defaultValue={adminPassword}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          setAdminPassword(e.target.value.trim());
                          logAudit("Admin Password changed.");
                          addNotification("🔒 Admin Password Updated", "Password updated successfully!", "info");
                        }
                      }}
                      className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                    />
                  </div>
                </div>
              </div>

              {/* NEW DEDICATED ADMIN STOCK CONTROL TABLE SECTION */}
              <div className="bg-[#121214] border border-white/10 p-6 rounded-3xl space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-md font-serif font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                      <span>📦 Inventory Stock Management & Refill Hub</span>
                      <span className="text-xs bg-[#BA963E]/20 text-[#E5C158] px-2.5 py-0.5 rounded-full font-mono">
                        Total Items: {products.length}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Manage limits, increment/decrement, and restock products permanently.
                    </p>
                  </div>
                  
                  {/* STOCK FILTER BUTTONS */}
                  <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                    <button
                      onClick={() => setAdminStockTabFilter('all')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${adminStockTabFilter === 'all' ? 'bg-[#BA963E] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                      All ({products.length})
                    </button>
                    <button
                      onClick={() => setAdminStockTabFilter('low')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${adminStockTabFilter === 'low' ? 'bg-amber-500 text-black' : 'text-amber-400 hover:text-amber-300'}`}
                    >
                      ⚠️ Low ({lowStockItems.length})
                    </button>
                    <button
                      onClick={() => setAdminStockTabFilter('out')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${adminStockTabFilter === 'out' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300'}`}
                    >
                      🚫 Out of Stock ({outOfStockItems.length})
                    </button>
                  </div>
                </div>

                {/* DETAILED STOCK MANAGEMENT TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider bg-white/5">
                        <th className="p-3">Product Info</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Current Stock</th>
                        <th className="p-3">Min Alert Limit</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Quick Stock +/-</th>
                        <th className="p-3 text-center">Actions & Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products
                        .filter(p => {
                          if (adminStockTabFilter === 'low') return (p.stock || 0) <= (p.minStockAlert || 3);
                          if (adminStockTabFilter === 'out') return (p.stock || 0) <= 0;
                          return true;
                        })
                        .map(prod => {
                          const isZero = (prod.stock || 0) <= 0;
                          const isLow = (prod.stock || 0) <= (prod.minStockAlert || 3) && !isZero;
                          return (
                            <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img src={prod.image} onError={handleImageError} className="w-10 h-10 rounded-lg object-cover border border-white/10 cursor-pointer" onClick={() => setSelectedProductModal(prod)} alt="" />
                                  <div>
                                    <p className="font-bold text-white text-xs hover:text-[#E5C158] cursor-pointer" onClick={() => setSelectedProductModal(prod)}>{prod.name}</p>
                                    <p className="text-[10px] text-gray-500 font-mono">ID: #{prod.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-medium text-gray-400">{prod.category || 'General'}</td>
                              <td className="p-3">
                                <span className={`font-mono text-sm font-bold ${isZero ? 'text-red-500' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                                  {prod.stock || 0} units
                                </span>
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  min="1"
                                  value={prod.minStockAlert || 3}
                                  onChange={(e) => handleUpdateMinAlert(prod.id, e.target.value)}
                                  className="w-16 bg-[#1A1A1D] border border-white/10 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-[#BA963E]"
                                />
                              </td>
                              <td className="p-3">
                                {isZero ? (
                                  <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                    🚫 Sold Out
                                  </span>
                                ) : isLow ? (
                                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse">
                                    ⚡ Low Stock
                                  </span>
                                ) : (
                                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                    ✅ Available
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 w-max mx-auto">
                                  <button
                                    onClick={() => handleUpdateStock(prod.id, -1)}
                                    className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer"
                                    title="Decrease Stock"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 font-mono font-bold text-xs text-white">{prod.stock || 0}</span>
                                  <button
                                    onClick={() => handleUpdateStock(prod.id, 1)}
                                    className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer"
                                    title="Increase Stock"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleRestock(prod.id, 10)}
                                    className="bg-[#BA963E] text-black hover:bg-[#E5C158] font-bold px-3 py-1.5 rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-md"
                                  >
                                    🔄 Restock (+10)
                                  </button>
                                  <button
                                    onClick={() => {
                                      const amount = prompt(`Enter exact stock quantity for ${prod.name}:`, prod.stock || 0);
                                      if (amount !== null) handleSetStockExact(prod.id, amount);
                                    }}
                                    className="bg-white/10 hover:bg-white/20 text-gray-200 font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer"
                                  >
                                    ✏️ Set Exact
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <AdminDashboard
                products={products}
                setProducts={setProducts}
                handleUpdateStock={handleUpdateStock}
                handleRestock={handleRestock}
                flashSaleConfig={flashSaleConfig}
                updateFlashSaleTimer={updateFlashSaleTimer}
                auditLogs={auditLogs}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
                companyAddress={companyAddress}
                setCompanyAddress={setCompanyAddress}
                bankDetails={bankDetails}
                setBankDetails={setBankDetails}
              />
            </div>
          )}
        </div>
      )}

      {/* QUICK PRODUCT MODAL & REVIEWS */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121214] border border-[#BA963E]/40 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedProductModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg z-10 cursor-pointer">✕</button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Image Box */}
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-white/10 h-56 bg-black/40 relative">
                  {selectedProductModal.isOnSale && selectedProductModal.stock > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-md shadow-lg animate-pulse">
                      🔥 Flash Sale
                    </div>
                  )}
                  <img 
                    src={(selectedProductModal.images && selectedProductModal.images[activeImageIdx]) || selectedProductModal.image} 
                    onError={handleImageError} 
                    alt={selectedProductModal.name} 
                    className={`w-full h-full object-cover transition-all duration-300 ${selectedProductModal.stock <= 0 ? 'grayscale opacity-50' : ''}`} 
                  />
                </div>
                {selectedProductModal.images && selectedProductModal.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedProductModal.images.map((imgUrl, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer ${activeImageIdx === idx ? 'border-[#BA963E]' : 'border-white/10 opacity-60'}`}
                      >
                        <img src={imgUrl} onError={handleImageError} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details & Selection */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#E5C158] uppercase font-bold tracking-widest">{selectedProductModal.category}</span>
                    <h3 className="text-lg font-serif font-bold">{selectedProductModal.name}</h3>
                    <p className="text-amber-400 font-bold mt-1">⭐ {selectedProductModal.rating || 5.0} / 5.0 ({selectedProductModal.reviewsCount || 0} reviews)</p>
                  </div>
                  <button 
                    onClick={() => handleCopyProductLink(selectedProductModal)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs cursor-pointer"
                    title="Share Product Link"
                  >
                    🔗
                  </button>
                </div>
                
                <p className="text-gray-400 leading-relaxed line-clamp-3">{selectedProductModal.description}</p>
                
                {/* Color Selector */}
                {selectedProductModal.colors && selectedProductModal.colors.length > 0 && (
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Select Color:</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedProductModal.colors.map(col => (
                        <button
                          key={col}
                          onClick={() => setSelectedModalColor(col)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${selectedModalColor === col ? 'bg-[#BA963E] text-black border-[#BA963E]' : 'bg-white/5 border-white/10 text-gray-300'}`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {selectedProductModal.sizes && selectedProductModal.sizes.length > 0 && (
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Select Size:</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedProductModal.sizes.map(sz => (
                        <button
                          key={sz}
                          onClick={() => setSelectedModalSize(sz)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${selectedModalSize === sz ? 'bg-[#BA963E] text-black border-[#BA963E]' : 'bg-white/5 border-white/10 text-gray-300'}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price & Dynamic Stock Display */}
                <div className="flex justify-between items-center border-t border-white/10 pt-2">
                  <div className="text-base font-bold text-[#E5C158] font-mono">
                    {selectedProductModal.isOnSale ? `${selectedProductModal.salePrice} PKR` : `${selectedProductModal.originalPrice} PKR`}
                  </div>
                  <div className="text-[11px] font-semibold">
                    {selectedProductModal.stock <= 0 ? (
                      <span className="text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded">Out of Stock</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">In Stock ({selectedProductModal.stock} available)</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                {selectedProductModal.stock > 0 && (
                  <div className="flex items-center gap-3 my-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Quantity:</span>
                    <div className="flex items-center border border-white/10 bg-black/40 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setModalQuantity(prev => Math.max(1, prev - 1))}
                        disabled={modalQuantity <= 1}
                        className="px-3 py-1 font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-xs font-mono font-bold">{modalQuantity}</span>
                      <button
                        onClick={() => setModalQuantity(prev => Math.min(selectedProductModal.stock, prev + 1))}
                        disabled={modalQuantity >= selectedProductModal.stock}
                        className="px-3 py-1 font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {selectedProductModal.stock <= 0 ? (
                  <button 
                    disabled 
                    className="w-full py-3 bg-gray-800 text-gray-500 font-bold rounded-xl cursor-not-allowed border border-gray-700 uppercase tracking-wider text-xs"
                  >
                    🚫 OUT OF STOCK
                  </button>
                ) : (
                  <button 
                    onClick={() => addToCart(selectedProductModal, selectedModalColor, selectedModalSize, modalQuantity)}
                    className="w-full py-3 bg-[#BA963E] text-black font-bold rounded-xl hover:bg-[#E5C158] transition-colors shadow-lg uppercase tracking-wider text-xs cursor-pointer"
                  >
                    ADD TO CART ({modalQuantity})
                  </button>
                )}
              </div>
            </div>

            {/* PRODUCT REVIEWS SECTION */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-sm font-serif font-bold text-[#E5C158]">{t('reviews')}</h4>
              
              <form onSubmit={(e) => handleAddReview(e, selectedProductModal.id)} className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-xs font-bold text-gray-300">{t('writeReview')}</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="bg-[#1A1A1D] border border-white/10 text-xs px-3 py-1.5 rounded-lg text-white"
                  />
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(e.target.value)}
                    className="bg-[#1A1A1D] border border-white/10 text-xs px-3 py-1.5 rounded-lg text-amber-400 font-bold"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                  </select>
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-[#1A1A1D] border border-white/10 text-xs p-2 rounded-lg text-white h-16"
                ></textarea>
                <button type="submit" className="bg-[#BA963E] text-black font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer">Submit Review</button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedProductModal.userReviews && selectedProductModal.userReviews.length > 0 ? (
                  selectedProductModal.userReviews.map(rev => (
                    <div key={rev.id} className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-200">{rev.author}</span>
                        <span className="text-amber-400">{'⭐'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-gray-400">{rev.comment}</p>
                      <span className="text-[9px] text-gray-600 block">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No reviews yet for this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT COMPARISON MODAL */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-blue-500/40 rounded-3xl max-w-3xl w-full p-6 space-y-4 relative shadow-2xl text-white">
            <button onClick={() => setIsCompareModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg z-10 cursor-pointer">✕</button>
            <h3 className="text-lg font-serif font-bold text-blue-400">{t('compareProducts')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-4">
              {compareList.map(prod => (
                <div key={prod.id} className="bg-white/5 p-3 rounded-2xl space-y-2 border border-white/5 text-xs">
                  <img src={prod.image} onError={handleImageError} className="w-full h-28 object-cover rounded-xl cursor-pointer" onClick={() => setSelectedProductModal(prod)} alt="" />
                  <h4 className="font-bold text-sm truncate">{prod.name}</h4>
                  <p className="text-[#E5C158] font-bold font-mono">{prod.isOnSale ? prod.salePrice : prod.originalPrice} PKR</p>
                  <p><span className="text-gray-400">Stock:</span> {prod.stock} units</p>
                  <p><span className="text-gray-400">Category:</span> {prod.category}</p>
                  <p><span className="text-gray-400">Rating:</span> ⭐ {prod.rating}</p>
                  <button onClick={() => toggleCompare(prod)} className="text-red-400 text-[10px] block underline cursor-pointer">Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL */}
      {isTrackModalOpen && <TrackOrderModal onClose={() => setIsTrackModalOpen(false)} />}

      {/* LIVE CHAT SUPPORT */}
      <LiveChat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}