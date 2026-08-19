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
    myOrders: '📦 My Orders & Return Requests',
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
    myOrders: '📦 میرے آرڈرز اور واپسی کی درخواستیں',
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

// PAYMENT VERIFICATION / CUSTOMER DELIVERY MESSAGE ENGINE
const PAYMENT_VERIFICATION_STATUSES = {
  PENDING: 'Pending Verification',
  APPROVED: 'Payment Verified',
  REJECTED: 'Payment Rejected'
};

const CUSTOMER_PAYMENT_MESSAGES = {
  pending: 'Your advance payment screenshot has been received and is waiting for admin verification.',
  approved: 'Your advance payment has been verified successfully. Your order is confirmed.',
  rejected: 'Your payment screenshot could not be verified. Your order has been cancelled. Please submit a valid payment screenshot and place a new order.',
  freeDelivery: 'Your free delivery charges have been adjusted in your order by MA Products.',
  deliveryCharge: 'Free delivery is not applied to this order. Standard delivery charges have been added.'
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
      { id: 101, author: "Ali R.", rating: 5, comment: "Premium quality jacket! Super warm.", date: "2026-08-01", image: null },
      { id: 102, author: "Usman K.", rating: 4, comment: "Leather smells genuine. Fitting is nice.", date: "2026-08-05", image: null }
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
      { id: 103, author: "Hamza S.", rating: 5, comment: "Very stylish and original look.", date: "2026-08-02", image: null }
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
      { id: 104, author: "Bilal A.", rating: 5, comment: "Royalty on wrist. Loved it!", date: "2026-08-10", image: null }
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

// HELPER: Calculate if delivery date is within 5 working days
const isWithinWorkingDays = (deliveredTimestamp, maxWorkingDays = 5) => {
  if (!deliveredTimestamp) return false;
  let count = 0;
  let cur = new Date(deliveredTimestamp);
  const now = new Date();
  
  if (cur > now) return false;
  while (cur < now) {
    cur.setDate(cur.getDate() + 1);
    const day = cur.getDay();
    // Exclude Saturday (6) and Sunday (0)
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return count <= maxWorkingDays;
};

// LIVE TIMER COMPONENT FOR ORDER CANCELLATION & RETURNS
const LiveOrderTimer = ({ createdAt, deliveredAt, status }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [timerType, setTimerType] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();

      // 1-Hour Cancellation Window
      if (status === 'Processing' || status === 'Pending') {
        const cancelExpiry = createdAt + (60 * 60 * 1000);
        const diff = cancelExpiry - now;
        if (diff > 0) {
          const mins = Math.floor(diff / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${mins}m ${secs}s`);
          setTimerType('cancel');
        } else {
          setTimeLeft('Cancellation Window Expired');
          setTimerType('cancel-expired');
        }
      } 
      // 5-Working-Days Return Window
      else if (status === 'Delivered' && deliveredAt) {
        if (isWithinWorkingDays(deliveredAt, 5)) {
          const returnExpiry = deliveredAt + (5 * 24 * 60 * 60 * 1000);
          const diff = returnExpiry - now;
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${days}d ${hours}h ${mins}m`);
            setTimerType('return');
          } else {
            setTimeLeft('Return Window Expired');
            setTimerType('return-expired');
          }
        } else {
          setTimeLeft('Return Window Expired');
          setTimerType('return-expired');
        }
      } else {
        setTimeLeft('');
        setTimerType('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [createdAt, deliveredAt, status]);

  if (!timeLeft) return null;

  return (
    <div className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border mt-1 flex items-center gap-1.5 w-max ${
      timerType === 'cancel' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse' :
      timerType === 'return' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 animate-pulse' :
      'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      <span>⏱️</span>
      {timerType === 'cancel' && <span>Cancel time left: {timeLeft}</span>}
      {timerType === 'cancel-expired' && <span className="text-gray-400">Cancel Window Closed</span>}
      {timerType === 'return' && <span>Return window active: {timeLeft} remaining</span>}
      {timerType === 'return-expired' && <span className="text-gray-400">5-Day Return Window Closed</span>}
    </div>
  );
};

const FlashSaleCountdown = ({ endTime, enabled }) => {
  const [display, setDisplay] = useState('SALE ENDED');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let frameId;

    const update = () => {
      if (!enabled) {
        setDisplay('SALE ENDED');
        setExpired(false);
        frameId = null;
        return;
      }

      const diff = Number(endTime || 0) - Date.now();
      if (diff <= 0) {
        setDisplay('EXPIRED');
        setExpired(true);
        frameId = null;
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setDisplay(
        `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`
      );
      frameId = window.setTimeout(update, 1000);
    };

    update();
    return () => {
      if (frameId) window.clearTimeout(frameId);
    };
  }, [enabled, endTime]);

  return (
    <span className={`font-bold ${expired ? 'text-red-500' : 'text-[#E5C158]'}`}>
      {display}
    </span>
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ma_theme_mode') !== 'light');
  
  useEffect(() => {
    localStorage.setItem('ma_theme_mode', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  // AUDIT LOGS
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

  // ADMIN STOCK MANAGEMENT
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
  const handleUpdateMinAlert = (productId, minAlert) => {
    const val = Math.max(1, parseInt(minAlert) || 1);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, minStockAlert: val } : p));
    logAudit(`Updated stock alert limit for product ID ${productId} to ${val}`);
  };
  const handleToggleProductFlashSale = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newSaleState = !p.isOnSale;
        logAudit(`Toggled sale status for ${p.name} -> ${newSaleState ? 'ON SALE' : 'REGULAR'}`);
        return { ...p, isOnSale: newSaleState };
      }
      return p;
    }));
  };

  const lowStockItems = useMemo(() => {
    return products.filter(p => (p.stock || 0) <= (p.minStockAlert || 3));
  }, [products]);
  const outOfStockItems = useMemo(() => {
    return products.filter(p => (p.stock || 0) <= 0);
  }, [products]);

  // ORDERS & NOTIFICATIONS MANAGEMENT (REAL-TIME CANCEL/RETURN/ADMIN ALERTS)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ma_customer_orders');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('ma_customer_orders', JSON.stringify(orders));
  }, [orders]);

  // Completed orders are moved out of the live queue automatically. They remain
  // permanently available in History so the active screen stays clean.
  useEffect(() => {
    const completed = orders.filter(order => COMPLETED_ORDER_STATUSES.includes(order.status));
    if (completed.length === 0) return;
    setOrderHistory(prev => {
      const existingIds = new Set(prev.map(order => order.id));
      const additions = completed.filter(order => !existingIds.has(order.id));
      return additions.length ? [...additions, ...prev] : prev;
    });
    setOrders(prev => prev.filter(order => !COMPLETED_ORDER_STATUSES.includes(order.status)));
  }, [orders]);

  const handlePlaceOrder = (newOrder) => {
    const paymentScreenshot =
      newOrder.paymentScreenshot ||
      newOrder.advancePaymentScreenshot ||
      newOrder.paymentProof ||
      null;

    const createdOrder = {
      ...newOrder,
      id: `MA-ORD-${Date.now().toString().slice(-6)}`,
      createdAt: Date.now(),
      status: paymentScreenshot ? 'Processing' : 'Payment Verification Required',
      paymentVerificationStatus: paymentScreenshot
        ? PAYMENT_VERIFICATION_STATUSES.PENDING
        : PAYMENT_VERIFICATION_STATUSES.REJECTED,
      paymentScreenshot,
      paymentProofReceivedAt: paymentScreenshot ? Date.now() : null,
      paymentVerifiedAt: null,
      paymentRejectedAt: null,
      customerMessage: paymentScreenshot
        ? CUSTOMER_PAYMENT_MESSAGES.pending
        : 'Your order was not accepted because an advance payment screenshot was not provided.',
      deliveredAt: null,
      freeDelivery: Boolean(newOrder.freeDelivery && freeDeliveryAuthorityEnabled),
      standardDeliveryFee: Number(newOrder.standardDeliveryFee ?? newOrder.deliveryFee ?? 250),
      deliveryFee: Boolean(newOrder.freeDelivery && freeDeliveryAuthorityEnabled)
        ? 0
        : Number(newOrder.deliveryFee ?? newOrder.standardDeliveryFee ?? 250),
      deliveryAdjustmentNote: Boolean(newOrder.freeDelivery && freeDeliveryAuthorityEnabled)
        ? CUSTOMER_PAYMENT_MESSAGES.freeDelivery
        : CUSTOMER_PAYMENT_MESSAGES.deliveryCharge,
      trackingTimeline: [{
        status: paymentScreenshot ? 'Processing' : 'Payment Verification Required',
        at: Date.now(),
        note: paymentScreenshot
          ? 'Order received. Advance payment proof is awaiting verification.'
          : 'Order blocked because payment proof was not supplied.'
      }]
    };

    setOrders(prev => [createdOrder, ...prev]);

    if (createdOrder.items && Array.isArray(createdOrder.items)) {
      setProducts(prevProds => prevProds.map(p => {
        const orderedItem = createdOrder.items.find(item => item.id === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - (orderedItem.quantity || 1)) };
        }
        return p;
      }));
    }

    logAudit(`New Order Placed: ${createdOrder.id} by ${createdOrder.customerName || 'Customer'}`);
    addNotification(
      "🔔 Admin Alert",
      paymentScreenshot
        ? `New Order ${createdOrder.id} received • Delivery: PKR ${Number(createdOrder.deliveryFee || 0).toLocaleString()} • ${createdOrder.freeDelivery ? 'FREE DELIVERY' : 'STANDARD DELIVERY'} • Verification required.`
        : `Order ${createdOrder.id} is blocked because no payment screenshot was provided.`,
      "order"
    );
  };

  // A screenshot alone cannot reliably prove that money was actually transferred.
  // For true automatic verification, connect this handler to your payment gateway/bank API.
  const handlePaymentVerification = (orderId, approved, note = '') => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (approved) {
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'Processing',
        paymentVerificationStatus: PAYMENT_VERIFICATION_STATUSES.APPROVED,
        paymentVerifiedAt: Date.now(),
        paymentVerificationNote: note || 'Payment screenshot approved by Admin.',
        customerMessage: CUSTOMER_PAYMENT_MESSAGES.approved,
        trackingTimeline: [
          ...(o.trackingTimeline || []),
          { status: 'Payment Verified', at: Date.now(), note: note || 'Advance payment verified by Admin.' }
        ]
      } : o));
      logAudit(`Advance payment verified for ${orderId}.`);
      addNotification("✅ Payment Verified", `${orderId} payment proof approved. Customer notified.`, "order");
      return;
    }

    if (targetOrder.items && Array.isArray(targetOrder.items)) {
      setProducts(prevProds => prevProds.map(p => {
        const itemToRestore = targetOrder.items.find(item => item.id === p.id);
        if (itemToRestore) {
          return { ...p, stock: (p.stock || 0) + (itemToRestore.quantity || 1) };
        }
        return p;
      }));
    }

    const nextMessage = note
      ? `${CUSTOMER_PAYMENT_MESSAGES.rejected} Admin note: ${note}`
      : CUSTOMER_PAYMENT_MESSAGES.rejected;

    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'Cancelled',
      paymentVerificationStatus: PAYMENT_VERIFICATION_STATUSES.REJECTED,
      paymentRejectedAt: Date.now(),
      paymentVerificationNote: note || 'Payment screenshot rejected by Admin.',
      customerMessage: nextMessage,
      cancelledAt: Date.now(),
      trackingTimeline: [
        ...(o.trackingTimeline || []),
        { status: 'Cancelled', at: Date.now(), note: 'Order cancelled because payment proof was rejected.' }
      ]
    } : o));

    logAudit(`Advance payment rejected for ${orderId}; order cancelled and stock restored.`);
    addNotification("❌ Payment Rejected", `${orderId} cancelled and customer notified.`, "order");
  };

  // Admin-only per-order delivery override. Delivery is NOT free by default.
  const handleToggleOrderFreeDelivery = (orderId) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (!freeDeliveryAuthorityEnabled && !targetOrder.freeDelivery) {
      addNotification(
        '🚚 Free Delivery Blocked',
        'Global free-delivery authority is OFF. Enable it first before granting free delivery to an order.',
        'info'
      );
      return;
    }

    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const free = !o.freeDelivery;
      return {
        ...o,
        freeDelivery: free,
        deliveryFee: free ? 0 : Number(o.standardDeliveryFee || 250),
        deliveryAdjustmentNote: free
          ? CUSTOMER_PAYMENT_MESSAGES.freeDelivery
          : CUSTOMER_PAYMENT_MESSAGES.deliveryCharge,
        customerMessage: free
          ? CUSTOMER_PAYMENT_MESSAGES.freeDelivery
          : CUSTOMER_PAYMENT_MESSAGES.deliveryCharge,
        trackingTimeline: [
          ...(o.trackingTimeline || []),
          {
            status: free ? 'Free Delivery Granted' : 'Standard Delivery Applied',
            at: Date.now(),
            note: free
              ? 'Admin granted free delivery. Delivery charges adjusted in the order.'
              : 'Admin removed free delivery. Standard delivery charges restored.'
          }
        ]
      };
    }));
    logAudit(`Admin changed free-delivery authority for ${orderId}.`);
    addNotification("🚚 Delivery Authority", `${orderId} delivery setting changed.`, "info");
  };

  const handleCancelOrder = (orderId) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;
    // Check 1-hour window
    const elapsedMinutes = (Date.now() - targetOrder.createdAt) / (1000 * 60);
    if (elapsedMinutes > 60) {
      alert("Cancellation period (1 hour) has expired for this order.");
      return;
    }
    // Restore Stock
    if (targetOrder.items && Array.isArray(targetOrder.items)) {
      setProducts(prevProds => prevProds.map(p => {
        const itemToRestore = targetOrder.items.find(item => item.id === p.id);
        if (itemToRestore) {
          return { ...p, stock: p.stock + (itemToRestore.quantity || 1) };
        }
        return p;
      }));
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled', cancelledAt: Date.now() } : o));
    logAudit(`Order ${orderId} was cancelled by customer within 1 hour window.`);
    addNotification("⚠️ Order Cancelled", `Order ${orderId} has been cancelled!`, "info");
  };

  const handleReturnOrder = (orderId, reason) => {
    // Delivered orders are archived immediately, so check both the live queue
    // and the history archive. This keeps the customer return action usable
    // after Admin marks the order as Delivered.
    const liveOrder = orders.find(o => o.id === orderId);
    const archivedOrder = orderHistory.find(o => o.id === orderId);
    const targetOrder = liveOrder || archivedOrder;

    if (!targetOrder) return;
    if (targetOrder.status !== 'Delivered') {
      alert("Returns are only available once the order is delivered.");
      return;
    }
    if (!isWithinWorkingDays(targetOrder.deliveredAt, 5)) {
      alert("The 5 working days return window has expired.");
      return;
    }

    const updatedOrder = {
      ...targetOrder,
      status: 'Return Requested',
      returnReason: reason,
      returnRequestedAt: Date.now(),
      trackingTimeline: [
        ...(targetOrder.trackingTimeline || []),
        {
          status: 'Return Requested',
          at: Date.now(),
          note: `Customer requested a return. Reason: ${reason}`
        }
      ]
    };

    if (liveOrder) {
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    } else {
      setOrderHistory(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    }

    logAudit(`Return requested for Order ${orderId}. Reason: ${reason}`);
    addNotification("📦 Return Requested", `Return request for ${orderId} sent to Admin.`, "info");
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const isDelivered = newStatus === 'Delivered';
        const nextTimeline = [
          ...(o.trackingTimeline || []),
          { status: newStatus, at: Date.now(), note: `Status changed to ${newStatus}.` }
        ];
        return {
          ...o,
          status: newStatus,
          deliveredAt: isDelivered ? (o.deliveredAt || Date.now()) : o.deliveredAt,
          trackingTimeline: nextTimeline
        };
      }
      return o;
    }));
    logAudit(`Order ${orderId} status changed to ${newStatus}`);
    addNotification("🔄 Status Sync", `Order ${orderId} updated to ${newStatus}`, "info");
  };

  const downloadOrderHistoryCSV = () => {
    const rows = orderHistory.map(o => [
      o.id, o.customerName || 'Customer', o.status, o.total || 0,
      o.deliveryFee || 0, o.trackingCode || '', o.createdAt ? new Date(o.createdAt).toISOString() : ''
    ].map(value => `\"${String(value).replace(/\"/g, '\"\"')}\"`).join(','));
    const csv = ['Order ID,Customer,Status,Total,Delivery Fee,Tracking Code,Created At', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ma_order_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // STOREFRONT STATES
  const [customerTab, setCustomerTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [wishlist, setWishlist] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [adminStockTabFilter, setAdminStockTabFilter] = useState('all');
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

  // FLASH SALE ENGINE & ADMIN CONTROL SYSTEM
  const [flashSaleConfig, setFlashSaleConfig] = useState(() => {
    const saved = localStorage.getItem('ma_flash_sale_config');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      title: "🔥 MA LUXURY FLASH SALE IS LIVE!",
      subTitle: "Get flat discounts on high-end luxury items before stock runs out.",
      endTime: Date.now() + (5 * 3600 * 1000 + 35 * 60 * 1000 + 38 * 1000)
    };
  });
  const [customHoursInput, setCustomHoursInput] = useState('5');

  useEffect(() => {
    localStorage.setItem('ma_flash_sale_config', JSON.stringify(flashSaleConfig));
  }, [flashSaleConfig]);

  const toggleFlashSaleActive = () => {
    const nextStatus = !flashSaleConfig.enabled;
    let newEndTime = flashSaleConfig.endTime;
    if (nextStatus && Date.now() >= flashSaleConfig.endTime) {
      newEndTime = Date.now() + (5 * 3600 * 1000);
    }
    setFlashSaleConfig(prev => ({
      ...prev,
      enabled: nextStatus,
      endTime: newEndTime
    }));
    logAudit(`Admin ${nextStatus ? 'STARTED' : 'ENDED'} the Flash Sale.`);
    addNotification("🔥 Flash Sale Status", `Flash sale is now ${nextStatus ? 'ACTIVE' : 'DISABLED'}`, "info");
  };

  const updateFlashSaleTimer = (hoursToAdd) => {
    const newEndTime = Date.now() + (parseFloat(hoursToAdd) * 3600 * 1000);
    setFlashSaleConfig(prev => ({ ...prev, endTime: newEndTime, enabled: true }));
    logAudit(`Flash sale duration updated to ${hoursToAdd} hours.`);
    addNotification("⏱️ Timer Updated", `Flash sale set to end in ${hoursToAdd} hours!`, "info");
  };

  const updateFlashSaleContent = (title, subTitle) => {
    setFlashSaleConfig(prev => ({ ...prev, title, subTitle }));
    logAudit("Flash sale banner texts updated.");
    addNotification("✏️ Banner Updated", "Flash sale text modified successfully!", "info");
  };

  // BROADCAST ANNOUNCEMENT BANNER & FREE SHIPPING THRESHOLD
  const [announcementText, setAnnouncementText] = useState(() => localStorage.getItem('ma_announcement_text') || '🚚 SPECIAL DELIVERY OFFERS AVAILABLE ON SELECTED ORDERS!');
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(() => localStorage.getItem('ma_announcement_vis') !== 'false');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(() => Number(localStorage.getItem('ma_free_shipping_limit')) || 10000);
  const [freeDeliveryAuthorityEnabled, setFreeDeliveryAuthorityEnabled] = useState(
    () => localStorage.getItem('ma_free_delivery_authority') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('ma_announcement_text', announcementText);
    localStorage.setItem('ma_announcement_vis', isAnnouncementVisible);
    localStorage.setItem('ma_free_shipping_limit', freeDeliveryThreshold);
    localStorage.setItem('ma_free_delivery_authority', String(freeDeliveryAuthorityEnabled));
  }, [announcementText, isAnnouncementVisible, freeDeliveryThreshold, freeDeliveryAuthorityEnabled]);

  const toggleFreeDeliveryAuthority = () => {
    const next = !freeDeliveryAuthorityEnabled;
    setFreeDeliveryAuthorityEnabled(next);
    logAudit(`Admin ${next ? 'ENABLED' : 'DISABLED'} global free-delivery authority.`);
    addNotification(
      next ? '🚚 Free Delivery Enabled' : '🚚 Free Delivery Disabled',
      next
        ? `Customers can receive free delivery when the checkout eligibility rule is met.`
        : `Free delivery is disabled globally. Standard delivery charges will apply.`,
      'info'
    );
  };

  const handleFreeShippingPriceChange = (newPrice) => {
    const num = Math.max(0, parseInt(newPrice) || 0);
    setFreeDeliveryThreshold(num);
    const updatedText = `🚚 DELIVERY OFFER: FREE SHIPPING AVAILABLE ON ELIGIBLE ORDERS OVER ${num.toLocaleString()} PKR!`;
    setAnnouncementText(updatedText);
    logAudit(`Admin changed Free Delivery Threshold to ${num} PKR`);
    addNotification("🚚 Free Delivery Updated", `Threshold set to ${num} PKR`, "info");
  };

  // CART, COUPONS & MODAL STATES
  const [cart, setCart] = useState([]);
  const [advancePaymentScreenshot, setAdvancePaymentScreenshot] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ma_notification_history') || '[]');
    } catch {
      return [];
    }
  });
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatFaqAnswer, setChatFaqAnswer] = useState('');
  const [chatFaqOpen, setChatFaqOpen] = useState(true);

  // ==================== NEW FEATURE: PERSISTENT CHAT ENGINE ====================
  // Every customer gets a stable browser-side conversation id. The chat component
  // uses the same storage key so messages remain available after refresh.
  const [chatCustomerId] = useState(() => {
    const saved = localStorage.getItem('ma_chat_customer_id');
    if (saved) return saved;
    const id = `CUS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('ma_chat_customer_id', id);
    return id;
  });

  // Admin dashboard shortcut can open the same floating chat window.
  useEffect(() => {
    const openChatFromAdmin = () => setIsChatOpen(true);
    window.addEventListener('ma-open-live-chat', openChatFromAdmin);
    return () => window.removeEventListener('ma-open-live-chat', openChatFromAdmin);
  }, []);

  // ==================== NEW FEATURE: ORDER HISTORY / ARCHIVE ENGINE ====================
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ma_order_history') || '[]');
    } catch {
      return [];
    }
  });

  const COMPLETED_ORDER_STATUSES = ['Delivered', 'Cancelled', 'Return Accepted', 'Completed'];

  // Keep customer/admin tabs synchronized when they are opened at the same time.
  useEffect(() => {
    const syncStoreData = (event) => {
      if (event.key === 'ma_customer_orders' && event.newValue) {
        try {
          setOrders(JSON.parse(event.newValue));
        } catch {}
      }
      if (event.key === 'ma_order_history' && event.newValue) {
        try {
          setOrderHistory(JSON.parse(event.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', syncStoreData);
    return () => window.removeEventListener('storage', syncStoreData);
  }, []);

  useEffect(() => {
    localStorage.setItem('ma_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

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

  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedModalSize, setSelectedModalSize] = useState('');
  const [selectedModalColor, setSelectedModalColor] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewImages, setNewReviewImages] = useState([]);

  useEffect(() => {
    localStorage.setItem('ma_notification_history', JSON.stringify(notificationHistory.slice(0, 200)));
  }, [notificationHistory]);

  const addNotification = (title, message, type = 'info') => {
    const newNote = {
      id: Date.now(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now()
    };
    setNotifications(prev => [newNote, ...prev]);
    setNotificationHistory(prev => [newNote, ...prev].slice(0, 200));
    setTimeout(() => clearNotification(newNote.id), 5000);
  };
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAdvancePaymentScreenshotUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image screenshot of your actual advance payment.');
      e.target.value = '';
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Payment screenshot must be 4MB or smaller.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAdvancePaymentScreenshot(String(reader.result || ''));
    reader.onerror = () => alert('Could not read the payment screenshot. Please try again.');
    reader.readAsDataURL(file);
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
      
      let matchesCategory = true;
      if (selectedCategory === 'On Sale') {
        matchesCategory = prod.isOnSale;
      } else if (selectedCategory !== 'All') {
        matchesCategory = prod.category === selectedCategory;
      }
      
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

  const categories = ['All', 'On Sale', ...new Set(products.map(p => p.category || 'General'))];

  const handleReviewImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const selected = files.slice(0, 6);
    if (files.length > 6) alert("Only the first 6 photos were selected.");
    const oversized = selected.find(file => file.size > 2 * 1024 * 1024);
    if (oversized) {
      alert("Each review photo must be 2MB or smaller.");
      e.target.value = '';
      return;
    }
    try {
      const dataUrls = await Promise.all(selected.map(file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));
      setNewReviewImages(dataUrls);
    } catch {
      alert("Could not read one or more review photos. Please try again.");
    } finally {
      e.target.value = '';
    }
  };

  const handleAddReview = (e, productId) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      alert("Please enter your name and review comment.");
      return;
    }
    const reviewObj = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      rating: Number(newReviewRating),
      comment: newReviewComment.trim(),
      images: newReviewImages,
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
    setNewReviewImages([]);
    addNotification("⭐ Review Added", "Thank you for your feedback!", "info");
  };

  const handleAdminAccountUpdate = (e) => {
    e.preventDefault();

    const email = newAdminEmail.trim().toLowerCase();
    const password = newAdminPassword.trim();

    if (!email && !password) {
      alert('Enter a new email or new password.');
      return;
    }

    if (email) {
      if (!email.includes('@')) {
        alert('Enter a valid admin email address.');
        return;
      }
      setAdminEmail(email);
      setInputEmail('');
    }

    if (password) {
      if (password.length < 6) {
        alert('Admin password must be at least 6 characters.');
        return;
      }
      setAdminPassword(password);
      setInputPassword('');
    }

    setNewAdminEmail('');
    setNewAdminPassword('');
    logAudit('Admin account credentials permanently updated.');
    addNotification('🔐 Admin Account Updated', 'New admin credentials have been saved.', 'info');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const requestedEmail = forgotEmail.trim().toLowerCase();

    if (!requestedEmail) {
      setForgotMessage("Enter your current admin email first.");
      return;
    }

    if (requestedEmail !== adminEmail.trim().toLowerCase()) {
      setForgotMessage("No admin account was found for this email.");
      return;
    }

    setForgotMessage(
      "Password reset requested. Connect this action to your email/backend service to send a secure one-time reset link."
    );
    logAudit("Admin requested a password reset.");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (inputEmail.trim().toLowerCase() === adminEmail.trim().toLowerCase() && inputPassword === adminPassword) {
      setIsAdminAuthenticated(true);
      setInputEmail('');
      setInputPassword('');
      setShowForgotPassword(false);
      setForgotMessage('');
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

  // ==================== ADMIN CONTROL TABLE + SAFE RESET TOOLS ====================
  // These controls reset only admin views/settings. They never delete permanent
  // customer orders, payment proofs, order history, products, or audit records.
  const scrollToAdminBox = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetAdminOrdersView = () => {
    setAdminStockTabFilter('all');
    scrollToAdminBox('admin-orders-box');
    addNotification('🔄 Orders View Reset', 'Order view controls were reset. Customer order data was not deleted.', 'info');
  };

  const resetAdminFlashSale = () => {
    const defaultConfig = {
      enabled: true,
      title: '🔥 MA LUXURY FLASH SALE IS LIVE!',
      subTitle: 'Get flat discounts on high-end luxury items before stock runs out.',
      endTime: Date.now() + (5 * 3600 * 1000)
    };
    setFlashSaleConfig(defaultConfig);
    setCustomHoursInput('5');
    localStorage.setItem('ma_flash_sale_config', JSON.stringify(defaultConfig));
    logAudit('Admin reset Flash Sale controls to default values.');
    addNotification('🔄 Flash Sale Reset', 'Flash Sale controls restored to defaults.', 'info');
  };

  const resetAdminAnnouncement = () => {
    const defaultText = '🚚 SPECIAL DELIVERY OFFERS AVAILABLE ON SELECTED ORDERS!';
    const defaultLimit = 10000;
    setAnnouncementText(defaultText);
    setIsAnnouncementVisible(true);
    setFreeDeliveryThreshold(defaultLimit);
    setFreeDeliveryAuthorityEnabled(false);
    localStorage.setItem('ma_announcement_text', defaultText);
    localStorage.setItem('ma_announcement_vis', 'true');
    localStorage.setItem('ma_free_shipping_limit', String(defaultLimit));
    localStorage.setItem('ma_free_delivery_authority', 'false');
    logAudit('Admin reset announcement and delivery controls to defaults.');
    addNotification('🔄 Delivery Controls Reset', 'Announcement and free-delivery authority were reset.', 'info');
  };

  const resetAdminStockView = () => {
    setAdminStockTabFilter('all');
    scrollToAdminBox('admin-stock-box');
    addNotification('🔄 Stock View Reset', 'Stock filter returned to All Products.', 'info');
  };

  const resetAdminNotificationHistory = () => {
    if (!window.confirm('Clear notification history? Orders and order history will stay safe.')) return;
    setNotifications([]);
    setNotificationHistory([]);
    localStorage.removeItem('ma_notification_history');
    logAudit('Admin cleared notification history from the Control Table.');
  };

  const resetAdminSettingsForm = () => {
    setNewAdminEmail('');
    setNewAdminPassword('');
    setForgotEmail('');
    setForgotMessage('');
    setShowForgotPassword(false);
    setInputEmail('');
    setInputPassword('');
    addNotification('🔄 Settings Form Reset', 'Settings fields were cleared. Saved credentials were not changed.', 'info');
  };

  const resetAdminChatView = () => {
    setIsChatOpen(false);
    setChatFaqAnswer('');
    setChatFaqOpen(true);
    addNotification('🔄 Chat View Reset', 'Live chat view was reset.', 'info');
  };

  const resetAdminControlTable = () => {
    setAdminStockTabFilter('all');
    setCustomHoursInput('5');
    setNewAdminEmail('');
    setNewAdminPassword('');
    setForgotEmail('');
    setForgotMessage('');
    setShowForgotPassword(false);
    setChatFaqAnswer('');
    setChatFaqOpen(true);
    addNotification('🔄 Control Table Reset', 'Admin controls were reset. No permanent records were deleted.', 'info');
  };

  const handleCopyProductLink = async (product) => {
    const productUrl = `${window.location.origin}/product/${encodeURIComponent(product.id)}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(productUrl);
      } else {
        const helper = document.createElement('textarea');
        helper.value = productUrl;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.focus();
        helper.select();
        document.execCommand('copy');
        helper.remove();
      }
      addNotification("🔗 Link Copied", `${product.name} link copied to clipboard!`, "info");
    } catch {
      alert(`Copy this product link:\n${productUrl}`);
    }
  };

  return (
    <div className={`ma-app-root ${darkMode ? 'ma-theme-dark min-h-screen font-sans transition-colors duration-300 bg-[#0D0D0E] text-white' : 'ma-theme-light min-h-screen font-sans transition-colors duration-300 bg-[#F4F4F7] text-gray-900'}`}>
      <style>{`
        /* MA Products theme readability layer:
           dark surfaces/text stay unchanged; light mode converts dark cards,
           inputs and muted text to readable light-theme equivalents. */
        .ma-theme-light [class~="bg-[#0D0D0E]"],
        .ma-theme-light [class~="bg-[#121214]"],
        .ma-theme-light [class~="bg-[#101011]"],
        .ma-theme-light [class~="bg-[#1A1A1D]"],
        .ma-theme-light [class~="bg-[#171719]"],
        .ma-theme-light [class~="bg-[#0C0C0D]"] {
          background-color: #ffffff !important;
          color: #171717 !important;
          border-color: #e5e7eb !important;
        }
        .ma-theme-light [class~="bg-black/40"],
        .ma-theme-light [class~="bg-black/30"],
        .ma-theme-light [class~="bg-black/20"] {
          background-color: rgba(248, 248, 250, 0.96) !important;
          color: #171717 !important;
        }
        .ma-theme-light [class~="text-white"],
        .ma-theme-light [class~="text-gray-100"],
        .ma-theme-light [class~="text-gray-200"],
        .ma-theme-light [class~="text-gray-300"] {
          color: #171717 !important;
        }
        .ma-theme-light [class~="text-gray-400"] {
          color: #4b5563 !important;
        }
        .ma-theme-light [class~="text-gray-500"] {
          color: #6b7280 !important;
        }
        .ma-theme-light [class~="border-white/5"],
        .ma-theme-light [class~="border-white/10"] {
          border-color: #e5e7eb !important;
        }
        .ma-theme-light [class~="placeholder:text-gray-500"]::placeholder {
          color: #6b7280 !important;
          opacity: 1 !important;
        }
      `}</style>

      
      <NotificationBanner notifications={notifications} clearNotification={clearNotification} />
      
      {/* GLOBAL BROADCAST ANNOUNCEMENT BANNER */}
      {isAnnouncementVisible && announcementText.trim() && (
        <div className="bg-gradient-to-r from-[#BA963E] via-[#E5C158] to-[#BA963E] text-black text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex justify-between items-center shadow-md">
          <span className="mx-auto">{announcementText}</span>
          <button onClick={() => setIsAnnouncementVisible(false)} className="text-black hover:opacity-70 text-xs cursor-pointer">✕</button>
        </div>
      )}

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

      {/* STOREFRONT ROUTE ("/") */}
      {!isAdminRoute && (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-24">
          
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700/20 pb-4 gap-4">
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
                {t('myOrders')} ({orders.length})
              </button>
              <button onClick={() => setIsTrackModalOpen(true)} className="bg-[#BA963E]/10 border border-[#BA963E]/30 text-[#E5C158] px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer">
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
              {flashSaleConfig.enabled && (
                <div className="bg-gradient-to-r from-[#BA963E]/20 via-[#121214] to-[#BA963E]/20 border border-[#BA963E]/40 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left shadow-lg relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl animate-bounce">🔥</span>
                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#E5C158] uppercase tracking-wider">{flashSaleConfig.title}</h3>
                      <p className="text-xs text-gray-400">{flashSaleConfig.subTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-black/70 px-4 py-2 rounded-xl border border-[#BA963E]/30 shadow-inner">
                    <span className="text-gray-400">Ends In:</span>
                    <FlashSaleCountdown endTime={flashSaleConfig.endTime} enabled={flashSaleConfig.enabled} />
                  </div>
                </div>
              )}

              {/* SEARCH & SORT */}
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
                      {cat === 'On Sale' ? '🔥 Flash Sales' : cat}
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
                          <button onClick={() => toggleCompare(prod)} className={`p-2 rounded-full border text-xs cursor-pointer ${isComparing ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black/40 border-white/10'}`} title="Compare Product">
                            秤
                          </button>
                          <button onClick={() => toggleWishlist(prod)} className="bg-black/40 p-2 rounded-full border border-white/10 text-xs cursor-pointer">
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

                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => {
                                setSelectedProductModal(prod);
                                addToRecentlyViewed(prod);
                                setActiveImageIdx(0);
                                setSelectedModalSize((prod.sizes && prod.sizes[0]) || '');
                                setSelectedModalColor((prod.colors && prod.colors[0]) || '');
                                setModalQuantity(1);
                              }}
                              className="font-bold py-2.5 rounded-xl uppercase tracking-wider text-[10px] bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => handleCopyProductLink(prod)}
                              className="font-bold py-2.5 rounded-xl uppercase tracking-wider text-[10px] bg-white/5 text-gray-200 hover:bg-white/15 transition-all cursor-pointer border border-white/10"
                            >
                              🔗 Copy Link
                            </button>
                            <button
                              onClick={() => addToCart(prod)}
                              disabled={isSoldOut}
                              className={`font-bold py-2.5 rounded-xl uppercase tracking-wider text-[10px] transition-all ${
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
                      {/* FREE DELIVERY STATUS */}
                      <div className="bg-[#1A1A1D] p-3 rounded-xl border border-[#BA963E]/30 text-xs text-center space-y-1">
                        {subTotalBudget >= freeDeliveryThreshold ? (
                          <span className="text-emerald-400 font-bold block">🎉 YOU QUALIFY FOR FREE EXPRESS SHIPPING!</span>
                        ) : (
                          <span className="text-amber-400 font-medium block">
                            Add <strong className="text-white font-mono">{freeDeliveryThreshold - subTotalBudget} PKR</strong> more for Free Shipping!
                          </span>
                        )}
                      </div>

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
                              <button onClick={() => updateQuantity(item.cartId, -1)} className="text-xs font-bold cursor-pointer">-</button>
                              <span className="text-[11px] font-bold font-mono">{item.quantity || 1}</span>
                              <button onClick={() => updateQuantity(item.cartId, 1)} className="text-xs font-bold cursor-pointer">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 text-[10px] cursor-pointer">Remove</button>
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
                        <button type="submit" className="bg-[#BA963E] text-black font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-[#E5C158] cursor-pointer">
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
                <div id="checkout-section" className="pt-6 scroll-mt-6 space-y-4">
                  <div className="bg-[#121214] border border-[#BA963E]/40 rounded-3xl p-5 space-y-4 shadow-xl">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#E5C158] uppercase tracking-wider">
                        💳 Advance Payment Verification
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Upload a clear screenshot of your real advance payment. Admin will verify it before the order is confirmed.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4 items-center">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">
                          Payment Screenshot <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAdvancePaymentScreenshotUpload}
                          className="w-full text-xs text-gray-300 file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border-0 file:bg-[#BA963E] file:text-black file:font-bold file:cursor-pointer"
                        />
                        <p className="text-[10px] text-gray-500">
                          Max 4MB. Do not upload an edited/fake/generated payment proof.
                        </p>
                      </div>

                      {advancePaymentScreenshot ? (
                        <img
                          src={advancePaymentScreenshot}
                          alt="Advance payment preview"
                          className="w-full h-32 object-contain rounded-xl bg-black border border-emerald-500/30"
                        />
                      ) : (
                        <div className="w-full h-32 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-[10px] text-gray-500">
                          Screenshot Preview
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                      <p className="text-[10px] text-amber-300">
                        🚚 Free delivery is controlled by Admin. If Admin grants free delivery, your delivery charges will be adjusted in the order and you will receive a message.
                      </p>
                    </div>
                  </div>

                  <Checkout
                    darkMode={darkMode}
                    cartItems={cart}
                    totalBudget={subTotalBudget}
                    bankDetails={bankDetails}
                    companyAddress={companyAddress}
                    freeDeliveryThreshold={freeDeliveryThreshold}
                    freeDeliveryDefault={false}
                    freeDeliveryAuthorityEnabled={freeDeliveryAuthorityEnabled}
                    paymentProofRequired={true}
                    paymentProofMessage="Upload your real advance-payment screenshot. Your order will remain pending until Admin verifies the payment."
                    deliveryNote="If Admin grants free delivery, the delivery charges will be adjusted in your order."
                    onOrderPlaced={(newOrderDetails) => {
                      const paymentScreenshot =
                        newOrderDetails?.paymentScreenshot ||
                        newOrderDetails?.advancePaymentScreenshot ||
                        newOrderDetails?.paymentProof ||
                        advancePaymentScreenshot;

                      if (!paymentScreenshot) {
                        addNotification(
                          "💳 Payment Screenshot Required",
                          "Please upload your advance payment screenshot before placing the order.",
                          "info"
                        );
                        return false;
                      }

                      handlePlaceOrder({
                        ...newOrderDetails,
                        paymentScreenshot,
                        items: cart,
                        total: subTotalBudget
                      });
                      setCart([]);
                      setAdvancePaymentScreenshot('');
                      return true;
                    }}
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
                          className="w-1/2 text-xs font-bold py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 cursor-pointer"
                        >
                          👁️ View
                        </button>
                        <button 
                          onClick={() => addToCart(prod)} 
                          disabled={prod.stock <= 0}
                          className={`w-1/2 text-xs font-bold py-2 rounded-xl cursor-pointer ${prod.stock <= 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#BA963E] text-black'}`}
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

          {/* CUSTOMER PORTAL ORDER HISTORY SECTION WITH TIME-SENSITIVE ACTIONS */}
          {customerTab === 'portal' && (
            <>
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#121214] p-4 rounded-2xl border border-white/5">
                <h2 className="text-lg font-serif font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                  <span>📜 Order History & Return Requests Portal</span>
                  <span className="text-xs bg-[#BA963E]/20 text-[#E5C158] px-2 py-0.5 rounded-full font-mono">{orders.length} Orders</span>
                  <button onClick={downloadOrderHistoryCSV} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300 hover:bg-white/10 cursor-pointer">📥 History CSV</button>
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="bg-[#121214] border border-white/5 p-8 rounded-3xl text-center space-y-3">
                  <p className="text-sm text-gray-400">No previous order history found.</p>
                  <button onClick={() => setCustomerTab('catalog')} className="px-4 py-2 bg-[#BA963E] text-black font-bold text-xs rounded-xl hover:bg-[#E5C158]">
                    Explore Store Catalogue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const elapsedMinutes = (Date.now() - ord.createdAt) / (1000 * 60);
                    const canCancel = (ord.status === 'Processing' || ord.status === 'Pending') && elapsedMinutes <= 60;
                    const canReturn = ord.status === 'Delivered' && isWithinWorkingDays(ord.deliveredAt, 5);

                    return (
                      <div key={ord.id} className="bg-[#121214] border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-3 gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono font-bold text-white">{ord.id}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                ord.status === 'Cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                ord.status === 'Return Requested' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {ord.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">Placed on: {new Date(ord.createdAt).toLocaleString()}</p>
                            
                            {/* REAL-TIME DYNAMIC TIMER FOR CANCEL & RETURN ELIGIBILITY */}
                            <LiveOrderTimer createdAt={ord.createdAt} deliveredAt={ord.deliveredAt} status={ord.status} />
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block">Total Amount:</span>
                            <span className="text-base font-mono font-bold text-[#E5C158]">{ord.total || 0} PKR</span>
                          </div>
                        </div>

                        {/* ITEMS LIST */}
                        <div className="space-y-2">
                          {ord.items && ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[#1A1A1D] p-2.5 rounded-xl text-xs">
                              <div className="flex items-center gap-3">
                                <img src={it.image} onError={handleImageError} className="w-10 h-10 object-cover rounded-lg" alt="" />
                                <div>
                                  <p className="font-bold text-white">{it.name}</p>
                                  <p className="text-[10px] text-gray-400">Qty: {it.quantity || 1} {it.selectedColor ? `| ${it.selectedColor}` : ''} {it.selectedSize ? `| ${it.selectedSize}` : ''}</p>
                                </div>
                              </div>
                              <span className="font-mono text-[#E5C158] font-bold">{(it.finalPrice || it.originalPrice) * (it.quantity || 1)} PKR</span>
                            </div>
                          ))}
                        </div>

                        {/* ORDER ACTION BUTTONS AUTOMATICALLY REMOVED WHEN TIME EXPIRES */}
                        <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                          {canCancel && (
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/40 font-bold text-xs rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            >
                              🛑 Cancel Order (1-Hr Limit)
                            </button>
                          )}
                          {canReturn && (
                            <button
                              onClick={() => {
                                const reason = prompt("Please enter the reason for your return request:");
                                if (reason) handleReturnOrder(ord.id, reason);
                              }}
                              className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold text-xs rounded-xl hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                            >
                              📦 Request Return (5-Day Limit)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* NEW FEATURE: CUSTOMER ORDER HISTORY */}
            <div className="bg-[#121214] border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#E5C158] uppercase tracking-wider">📜 Completed Order History</h3>
                  <p className="text-[10px] text-gray-500 mt-1">Completed orders leave the live queue automatically but remain stored here.</p>
                </div>
                <button onClick={downloadOrderHistoryCSV} className="px-3 py-2 rounded-xl bg-[#BA963E]/10 border border-[#BA963E]/30 text-[#E5C158] text-[10px] font-bold cursor-pointer">📥 Download History</button>
              </div>
              {orderHistory.length === 0 ? (
                <p className="text-xs text-gray-500">No completed orders yet.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {orderHistory.map(historyOrder => {
                    const historyCanReturn =
                      historyOrder.status === 'Delivered' &&
                      isWithinWorkingDays(historyOrder.deliveredAt, 5);

                    return (
                      <div key={historyOrder.id} className="flex flex-col gap-3 bg-[#1A1A1D] border border-white/5 p-3 rounded-xl">
                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                          <div>
                            <p className="font-mono font-bold text-white">{historyOrder.id}</p>
                            <p className="text-[10px] text-gray-500">{historyOrder.customerName || 'Customer'} • {historyOrder.status}</p>
                            {historyOrder.status === 'Delivered' && historyOrder.deliveredAt && (
                              <LiveOrderTimer
                                createdAt={historyOrder.createdAt}
                                deliveredAt={historyOrder.deliveredAt}
                                status={historyOrder.status}
                              />
                            )}
                            {historyOrder.customerMessage && (
                              <p className="text-[10px] text-amber-300 mt-1 max-w-xl">{historyOrder.customerMessage}</p>
                            )}
                          </div>
                          <span className="font-mono text-[#E5C158] font-bold">PKR {Number(historyOrder.total || 0).toLocaleString()}</span>
                        </div>

                        {historyCanReturn && (
                          <div className="pt-2 border-t border-white/5 flex justify-end">
                            <button
                              onClick={() => {
                                const reason = prompt("Please enter the reason for your return request:");
                                if (reason) handleReturnOrder(historyOrder.id, reason);
                              }}
                              className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold text-xs rounded-xl hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                            >
                              📦 Return Order (5-Day Limit)
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {orders.some(o => o.customerMessage) && (
                <div className="space-y-2 pt-3">
                  <h3 className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">Order Messages</h3>
                  {orders.filter(o => o.customerMessage).map(order => (
                    <div key={`msg-${order.id}`} className="bg-[#121214] border border-[#BA963E]/30 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 font-mono mb-1">{order.id}</p>
                      <p className="text-xs text-gray-200">{order.customerMessage}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
          )}
        </div>
      )}

      {/* ADMIN PORTAL ROUTE ("/admin") */}
      {isAdminRoute && (
        <div className={`max-w-7xl mx-auto p-4 md:p-6 space-y-6 rounded-3xl min-h-[85vh] transition-colors duration-300 ${darkMode ? 'bg-[#0D0D0E] text-white' : 'bg-[#F4F4F7] text-gray-900'}`}>
          {!isAdminAuthenticated ? (
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className={`border border-[#BA963E]/50 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-[#121214] text-white' : 'bg-white text-gray-900'}`}>
                <div className="text-center space-y-2">
                  <img src={MA_LOGO_URL} alt="MA PRODUCTS LOGO" className="h-20 mx-auto object-contain drop-shadow-md rounded-lg" />
                  <h2 className="text-xl font-serif font-bold text-[#E5C158] uppercase tracking-widest">{t('adminTerminal')}</h2>
                  <p className="text-xs text-gray-400">{t('verifyIdentity')}</p>
                </div>
                
                <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off">
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Admin Email:</label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#BA963E] ${darkMode ? 'bg-[#0F0F10] border-white/10 text-white' : 'bg-[#F4F4F7] border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Password:</label>
                    <input
                      type="password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#BA963E] ${darkMode ? 'bg-[#0F0F10] border-white/10 text-white' : 'bg-[#F4F4F7] border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black font-bold py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-all cursor-pointer"
                  >
                    Login to Console
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(v => !v);
                      setForgotEmail(inputEmail);
                      setForgotMessage('');
                    }}
                    className="text-xs text-[#BA963E] hover:text-[#E5C158] underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {showForgotPassword && (
                  <form onSubmit={handleForgotPassword} className={`border border-[#BA963E]/30 rounded-2xl p-4 space-y-3 ${darkMode ? 'bg-[#1A1A1D]' : 'bg-gray-50'}`}>
                    <p className="text-[11px] text-gray-400">
                      Enter your admin email to request a secure password-reset link.
                    </p>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Admin email"
                      className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#BA963E] ${darkMode ? 'bg-[#0F0F10] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                    <button
                      type="submit"
                      className="w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Send Reset Request
                    </button>
                    {forgotMessage && (
                      <p className="text-[10px] text-amber-300 leading-relaxed">{forgotMessage}</p>
                    )}
                  </form>
                )}

                <div className="text-center pt-2">
                  <button onClick={() => navigate('/')} className={`text-xs underline cursor-pointer ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
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

              {/* ==================== COMPACT ADMIN CONTROL TABLE ==================== */}
              <div id="admin-control-table" className="bg-[#121214] border border-[#BA963E]/40 rounded-3xl shadow-2xl overflow-hidden scroll-mt-6">
                <div className="px-5 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#E5C158] uppercase tracking-wider">⚡ Admin Control Table</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Open a section quickly or reset only its view/settings. Permanent records stay safe.</p>
                  </div>
                  <button type="button" onClick={resetAdminControlTable} className="px-3 py-1.5 rounded-xl bg-[#BA963E] text-black text-[10px] font-bold hover:bg-[#E5C158] cursor-pointer">↻ Reset Controls</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 divide-x divide-y divide-white/5">
                  {[
                    ['admin-orders-box','📦','Orders',resetAdminOrdersView],
                    ['admin-history-box','📜','History',() => scrollToAdminBox('admin-history-box')],
                    ['admin-payment-box','💳','Payments',() => scrollToAdminBox('admin-payment-box')],
                    ['admin-flash-sale-box','⚡','Flash Sale',resetAdminFlashSale],
                    ['admin-announcement-box','🚚','Delivery',resetAdminAnnouncement],
                    ['admin-stock-box','📦','Stock',resetAdminStockView],
                    ['admin-settings-box','⚙️','Settings',resetAdminSettingsForm]
                  ].map(([id, icon, label, resetFn]) => (
                    <div key={id} className="min-h-[74px] p-2.5 bg-[#121214] hover:bg-white/5 transition-colors">
                      <button type="button" onClick={() => scrollToAdminBox(id)} className="w-full text-left cursor-pointer">
                        <span className="text-sm">{icon}</span>
                        <p className="text-[10px] font-bold text-gray-200 uppercase mt-1">{label}</p>
                      </button>
                      <button type="button" onClick={resetFn} className="mt-1 text-[8px] font-bold text-gray-500 hover:text-[#E5C158] cursor-pointer">↻ reset</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 -mt-3">
                <button type="button" onClick={resetAdminNotificationHistory} className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[9px] font-bold hover:bg-red-500 hover:text-white cursor-pointer">🔔 Clear Notifications</button>
                <button type="button" onClick={resetAdminChatView} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-[9px] font-bold hover:bg-[#BA963E] hover:text-black cursor-pointer">💬 Reset Chat View</button>
              </div>

              {/* REAL-TIME ORDER TRACKING AND STATUS MANAGEMENT CONSOLE */}
              <div id="admin-orders-box" className="bg-[#121214] border border-[#BA963E]/40 p-6 rounded-3xl space-y-4 shadow-2xl scroll-mt-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-md font-serif font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                    <span>📦 Real-Time Customer Orders & Returns Sync</span>
                    <span className="text-xs bg-[#BA963E]/20 text-[#E5C158] px-2.5 py-0.5 rounded-full font-mono">
                      {orders.length} Total
                    </span>
                  </h3>
                  <button type="button" onClick={resetAdminOrdersView} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-gray-300 hover:bg-[#BA963E] hover:text-black cursor-pointer">↻ Reset</button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No customer orders placed yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300 border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider bg-white/5">
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Current Status</th>
                          <th className="p-3">Real-Time Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map(ord => (
                          <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-mono font-bold text-white">{ord.id}</td>
                            <td className="p-3">{ord.customerName || 'Customer'}</td>
                            <td className="p-3 font-mono text-[#E5C158] font-bold">{ord.total || 0} PKR</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                                ord.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                ord.status === 'Return Requested' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="bg-[#1A1A1D] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Return Accepted">Return Accepted</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Dynamic Flash Sale Control Console */}
              <div id="admin-flash-sale-box" className="bg-[#121214] border border-[#BA963E]/40 p-6 rounded-3xl space-y-4 shadow-2xl scroll-mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-3">
                  <div>
                    <h3 className="text-md font-serif font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                      <span>⚡ Flash Sale Admin Control Center</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${flashSaleConfig.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {flashSaleConfig.enabled ? 'ACTIVE ON SITE' : 'DISABLED / ENDED'}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Control when sales start/end, configure timers, and change banner text live.</p>
                    <button type="button" onClick={resetAdminFlashSale} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-gray-300 hover:bg-[#BA963E] hover:text-black cursor-pointer">↻ Reset</button>
                  </div>
                  <button
                    onClick={toggleFlashSaleActive}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                      flashSaleConfig.enabled 
                        ? 'bg-red-600 hover:bg-red-500 text-white' 
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    }`}
                  >
                    {flashSaleConfig.enabled ? '🛑 End Flash Sale Now' : '🚀 Start Flash Sale Now'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <label className="text-xs text-gray-400 font-bold block">⏱️ Set Sale Duration / Reset Timer:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => updateFlashSaleTimer(2)} className="bg-white/5 hover:bg-[#BA963E] hover:text-black text-xs font-mono py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer">2 Hours</button>
                      <button onClick={() => updateFlashSaleTimer(5)} className="bg-white/5 hover:bg-[#BA963E] hover:text-black text-xs font-mono py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer">5 Hours</button>
                      <button onClick={() => updateFlashSaleTimer(24)} className="bg-white/5 hover:bg-[#BA963E] hover:text-black text-xs font-mono py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer">24 Hours</button>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <input
                        type="number"
                        placeholder="Hours"
                        value={customHoursInput}
                        onChange={(e) => setCustomHoursInput(e.target.value)}
                        className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-1 text-xs text-white"
                      />
                      <button
                        onClick={() => updateFlashSaleTimer(parseFloat(customHoursInput) || 1)}
                        className="bg-[#BA963E] text-black font-bold text-xs px-3 py-1 rounded-xl hover:bg-[#E5C158] whitespace-nowrap cursor-pointer"
                      >
                        Set Hours
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <label className="text-xs text-gray-400 font-bold block">✏️ Banner Text Customizer:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        defaultValue={flashSaleConfig.title}
                        placeholder="Sale Title Banner"
                        onBlur={(e) => updateFlashSaleContent(e.target.value, flashSaleConfig.subTitle)}
                        className="bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        defaultValue={flashSaleConfig.subTitle}
                        placeholder="Sub-description"
                        onBlur={(e) => updateFlashSaleContent(flashSaleConfig.title, e.target.value)}
                        className="bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP ANNOUNCEMENT BANNER & FREE DELIVERY THRESHOLD */}
              <div id="admin-announcement-box" className="bg-[#121214] border border-[#BA963E]/40 p-5 rounded-3xl space-y-4 shadow-xl scroll-mt-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-xs font-serif font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                    <span>📢 TOP SITE ANNOUNCEMENT BANNER</span>
                  </h3>
                  <button
                    onClick={() => {
                      const nextVis = !isAnnouncementVisible;
                      setIsAnnouncementVisible(nextVis);
                      logAudit(`Admin updated Announcement Banner visibility to: ${nextVis ? 'Visible' : 'Hidden'}`);
                      addNotification("📢 Banner Authority", `Top Banner is now ${nextVis ? 'Visible' : 'Hidden'}`, "info");
                    }}
                    className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                      isAnnouncementVisible 
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600 hover:text-white' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    {isAnnouncementVisible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={toggleFreeDeliveryAuthority}
                    className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                      freeDeliveryAuthorityEnabled
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600 hover:text-white'
                        : 'bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white'
                    }`}
                    title="Admin authority to enable/disable free delivery"
                  >
                    {freeDeliveryAuthorityEnabled ? '🚚 Free Delivery: ON' : '🚚 Free Delivery: OFF'}
                  </button>
                  <button type="button" onClick={resetAdminAnnouncement} className="text-xs px-3 py-1.5 rounded-full font-bold bg-white/5 text-gray-300 border border-white/10 hover:bg-[#BA963E] hover:text-black cursor-pointer">↻ Reset</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Banner Custom Announcement Message:</label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="Enter custom announcement message..."
                      className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Free Delivery Limit (PKR):</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={freeDeliveryThreshold}
                        onChange={(e) => handleFreeShippingPriceChange(e.target.value)}
                        className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#E5C158] focus:outline-none focus:border-[#BA963E]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STOCK & REFILL CONTROL HUB */}
              <div id="admin-stock-box" className="bg-[#121214] border border-white/10 p-6 rounded-3xl space-y-6 shadow-2xl scroll-mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-md font-serif font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                      <span>📦 Inventory Stock & Flash Sale Items Hub</span>
                      <span className="text-xs bg-[#BA963E]/20 text-[#E5C158] px-2.5 py-0.5 rounded-full font-mono">
                        Total Items: {products.length}
                      </span>
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                    <button
                      onClick={() => setAdminStockTabFilter('all')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${adminStockTabFilter === 'all' ? 'bg-[#BA963E] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                      All ({products.length})
                    </button>
                    <button
                      onClick={() => setAdminStockTabFilter('low')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${adminStockTabFilter === 'low' ? 'bg-amber-500 text-black' : 'text-amber-400 hover:text-amber-300'}`}
                    >
                      ⚠️ Low ({lowStockItems.length})
                    </button>
                    <button
                      onClick={() => setAdminStockTabFilter('out')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${adminStockTabFilter === 'out' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300'}`}
                    >
                      🚫 Out ({outOfStockItems.length})
                    </button>
                  </div>
                  <button type="button" onClick={resetAdminStockView} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-gray-300 hover:bg-[#BA963E] hover:text-black cursor-pointer">↻ Reset</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider bg-white/5">
                        <th className="p-3">Product Info</th>
                        <th className="p-3">Flash Sale Toggle</th>
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
                              <td className="p-3">
                                <button
                                  onClick={() => handleToggleProductFlashSale(prod.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                    prod.isOnSale 
                                      ? 'bg-red-600/20 text-red-400 border border-red-500/40' 
                                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30'
                                  }`}
                                >
                                  {prod.isOnSale ? '🔥 On Sale' : '⚪ Regular'}
                                </button>
                              </td>
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
                                  >
                                    -
                                  </button>
                                  <span className="px-2 font-mono font-bold text-xs text-white">{prod.stock || 0}</span>
                                  <button
                                    onClick={() => handleUpdateStock(prod.id, 1)}
                                    className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer"
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

              {/* ADMIN NOTIFICATION + DELIVERY AUDIT HISTORY */}
              <div id="admin-notifications-box" className="bg-[#121214] border border-[#BA963E]/40 p-5 rounded-3xl shadow-xl space-y-4 scroll-mt-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-md font-serif font-bold text-[#E5C158] uppercase tracking-wider">
                      🔔 Admin Notification History & Delivery Audit
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Notifications stay here after the popup disappears. Delivery charges remain visible per order.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all notification history?')) {
                        setNotificationHistory([]);
                        logAudit('Admin cleared notification history.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[10px] font-bold cursor-pointer hover:bg-red-500 hover:text-white"
                  >
                    Clear History
                  </button>
                  <button type="button" onClick={resetAdminNotificationHistory} className="px-2.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[9px] font-bold cursor-pointer hover:bg-red-500 hover:text-white">↻ Reset</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-bold uppercase text-[#E5C158]">Notification History</p>
                      <span className="text-[9px] opacity-60">{notificationHistory.length} saved</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {notificationHistory.length === 0 ? (
                        <p className="text-[10px] text-gray-500 py-5 text-center">No notifications recorded yet.</p>
                      ) : notificationHistory.map(note => (
                        <div key={note.id} className="rounded-xl border border-white/10 bg-black/20 p-2.5">
                          <div className="flex justify-between gap-2">
                            <p className="text-[10px] font-bold text-white">{note.title}</p>
                            <span className="text-[8px] text-gray-500 shrink-0">{note.time}</span>
                          </div>
                          <p className="text-[9px] text-gray-300 mt-1">{note.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-bold uppercase text-[#E5C158]">Order Delivery Audit</p>
                      <span className={`text-[9px] font-bold ${freeDeliveryAuthorityEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                        Authority {freeDeliveryAuthorityEnabled ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {[...orders, ...orderHistory].map(order => (
                        <div key={`delivery-${order.id}`} className="rounded-xl border border-white/10 bg-black/20 p-2.5">
                          <div className="flex justify-between gap-2">
                            <span className="font-mono text-[9px] font-bold text-white">{order.id}</span>
                            <span className={`text-[9px] font-bold ${order.freeDelivery ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {order.freeDelivery ? 'FREE' : 'CHARGED'}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2 mt-1 text-[9px]">
                            <span className="text-gray-400">{order.status || 'Unknown'}</span>
                            <span className="font-mono text-[#E5C158]">
                              Delivery: PKR {Number(order.deliveryFee || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && orderHistory.length === 0 && (
                        <p className="text-[10px] text-gray-500 py-5 text-center">No orders recorded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div id="admin-history-box" className="scroll-mt-6">
              <AdminDashboard
                onOrdersChanged={(nextOrders) => setOrders(nextOrders)}
                products={products}
                setProducts={setProducts}
                handleUpdateStock={handleUpdateStock}
                handleRestock={handleRestock}
                flashSaleConfig={flashSaleConfig}
                updateFlashSaleTimer={updateFlashSaleTimer}
                auditLogs={auditLogs}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                addNotification={addNotification}
                notificationHistory={notificationHistory}
                freeDeliveryAuthorityEnabled={freeDeliveryAuthorityEnabled}
                onToggleFreeDeliveryAuthority={toggleFreeDeliveryAuthority}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
                companyAddress={companyAddress}
                setCompanyAddress={setCompanyAddress}
                bankDetails={bankDetails}
                setBankDetails={setBankDetails}
                orders={orders}
                orderHistory={orderHistory}
                onPaymentVerification={handlePaymentVerification}
                onToggleOrderFreeDelivery={handleToggleOrderFreeDelivery}
                paymentVerificationStatuses={PAYMENT_VERIFICATION_STATUSES}
                forceLightMode={!darkMode}
                onOpenLiveChat={() => {
                  setIsChatOpen(true);
                  window.dispatchEvent(new Event('ma-open-live-chat'));
                }}
              />
              </div>

              <div id="admin-payment-box" className="bg-white border border-[#BA963E]/40 p-5 rounded-3xl shadow-xl space-y-5 scroll-mt-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#9A761F] uppercase tracking-wider">
                      💳 Live Order & Advance Payment Verification
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Customer orders and payment proofs appear here live. Admin has final approval authority.
                    </p>
                  </div>
                  <button type="button" onClick={() => scrollToAdminBox('admin-payment-box')} className="px-2.5 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 text-[9px] font-bold cursor-pointer hover:bg-[#BA963E] hover:text-black">↻ Reset View</button>
                  <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                    {orders.filter(o => o.paymentVerificationStatus === PAYMENT_VERIFICATION_STATUSES.PENDING).length} PAYMENT CHECKS PENDING
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No live customer orders yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-2xl p-4 bg-[#FAFAFB] space-y-4">
                        <div className="flex flex-col lg:flex-row justify-between gap-3">
                          <div>
                            <p className="font-mono font-bold text-gray-900">{order.id}</p>
                            <p className="text-xs text-gray-500">
                              {order.customerName || 'Customer'} • {order.customerPhone || order.phone || 'No phone'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                            </p>
                          </div>
                          <div className="text-left lg:text-right">
                            <p className="text-xs text-gray-500">Order Total</p>
                            <p className="font-mono font-bold text-[#9A761F]">
                              PKR {Number(order.total || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">
                              Delivery: PKR {Number(order.deliveryFee || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {order.paymentScreenshot ? (
                          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-start">
                            <a href={order.paymentScreenshot} target="_blank" rel="noreferrer" className="block">
                              <img
                                src={order.paymentScreenshot}
                                alt={`Advance payment proof for ${order.id}`}
                                className="w-full h-44 object-contain bg-white rounded-xl border border-gray-200 cursor-zoom-in"
                              />
                            </a>
                            <div className="space-y-3">
                              <div className="rounded-xl bg-white border border-gray-200 p-3">
                                <p className="text-[10px] uppercase font-bold text-gray-500">Payment Verification</p>
                                <p className="text-sm font-bold text-gray-900 mt-1">
                                  {order.paymentVerificationStatus || 'Pending Verification'}
                                </p>
                                {order.paymentVerificationNote && (
                                  <p className="text-xs text-gray-500 mt-1">{order.paymentVerificationNote}</p>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {order.paymentVerificationStatus !== PAYMENT_VERIFICATION_STATUSES.APPROVED && (
                                  <button
                                    onClick={() => {
                                      const note = prompt('Optional verification note:', 'Payment proof checked and approved.');
                                      handlePaymentVerification(order.id, true, note || '');
                                    }}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-500"
                                  >
                                    ✅ Verify Real Payment
                                  </button>
                                )}
                                {order.paymentVerificationStatus !== PAYMENT_VERIFICATION_STATUSES.REJECTED && (
                                  <button
                                    onClick={() => {
                                      const note = prompt('Why is this payment proof fake/invalid?', 'Payment proof could not be verified.');
                                      handlePaymentVerification(order.id, false, note || '');
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-red-500"
                                  >
                                    ❌ Reject / Cancel Order
                                  </button>
                                )}
                                <button
                                  onClick={() => handleToggleOrderFreeDelivery(order.id)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                                    order.freeDelivery
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                                  }`}
                                >
                                  {order.freeDelivery ? '🚚 Remove Free Delivery' : '🚚 Grant Free Delivery'}
                                </button>
                              </div>

                              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                                <p className="text-[10px] uppercase font-bold text-amber-700">Customer Delivery Note</p>
                                <p className="text-xs text-amber-900 mt-1">
                                  {order.freeDelivery
                                    ? CUSTOMER_PAYMENT_MESSAGES.freeDelivery
                                    : CUSTOMER_PAYMENT_MESSAGES.deliveryCharge}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                            <p className="text-xs font-bold text-red-700">⚠️ No advance payment screenshot attached.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form id="admin-settings-box" onSubmit={handleAdminAccountUpdate} className="bg-white border border-[#BA963E]/40 p-5 rounded-3xl shadow-xl space-y-4 scroll-mt-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-serif font-bold text-[#9A761F] uppercase tracking-wider">
                      🔐 Permanent Admin Account Settings
                    </h3>
                    <button type="button" onClick={resetAdminSettingsForm} className="px-2.5 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 text-[9px] font-bold cursor-pointer hover:bg-[#BA963E] hover:text-black">↻ Reset</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Change the admin email and/or password. The values are persisted in this browser.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Current Admin Email</label>
                    <input
                      value={adminEmail}
                      readOnly
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">New Admin Email</label>
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="Enter new permanent admin email"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#BA963E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#BA963E]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#BA963E] hover:bg-[#E5C158] text-black font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Save Permanent Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* QUICK PRODUCT MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121214] border border-[#BA963E]/40 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedProductModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg z-10 cursor-pointer">✕</button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#E5C158] uppercase font-bold tracking-widest">{selectedProductModal.category}</span>
                    <h3 className="text-lg font-serif font-bold">{selectedProductModal.name}</h3>
                    <p className="text-amber-400 font-bold mt-1">⭐ {selectedProductModal.rating || 5.0} / 5.0 ({selectedProductModal.reviewsCount || 0} reviews)</p>
                  </div>
                  <button 
                    onClick={() => handleCopyProductLink(selectedProductModal)}
                    className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold cursor-pointer border border-white/10"
                  >
                    🔗 Copy Link
                  </button>
                </div>
                
                <p className="text-gray-400 leading-relaxed line-clamp-3">{selectedProductModal.description}</p>
                
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

                {selectedProductModal.stock <= 0 ? (
                  <button disabled className="w-full py-3 bg-gray-800 text-gray-500 font-bold rounded-xl cursor-not-allowed border border-gray-700 uppercase tracking-wider text-xs">
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

            {/* CUSTOMER REVIEWS + GALLERY IMAGE UPLOAD SECTION */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-sm font-serif font-bold text-[#E5C158]">{t('reviews')}</h4>
              
              <form onSubmit={(e) => handleAddReview(e, selectedProductModal.id)} className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/5">
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
                
                {/* MULTI-PHOTO REVIEW GALLERY UPLOAD */}
                <div className="space-y-2 bg-black/40 p-2 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-[11px] text-gray-300 font-bold flex items-center gap-1 cursor-pointer hover:text-[#E5C158]">
                      📷 Add Photos (up to 6)
                      <input type="file" accept="image/*" multiple onChange={handleReviewImageUpload} className="hidden" />
                    </label>
                    <span className="text-[9px] text-gray-500">2MB max each</span>
                  </div>
                  {newReviewImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {newReviewImages.map((image, idx) => (
                        <div key={`${image.slice(0, 20)}-${idx}`} className="relative">
                          <img src={image} alt={`Review preview ${idx + 1}`} className="w-full aspect-square object-cover rounded-md border border-[#BA963E]/50" />
                          <button type="button" onClick={() => setNewReviewImages(prev => prev.filter((_, imageIndex) => imageIndex !== idx))} className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center cursor-pointer">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" className="px-4 py-2 bg-[#BA963E] text-black font-bold text-xs rounded-xl hover:bg-[#E5C158]">
                  Submit Review
                </button>
              </form>

              {/* LIST OF REVIEWS */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedProductModal.userReviews && selectedProductModal.userReviews.length > 0 ? (
                  selectedProductModal.userReviews.map((rev) => (
                    <div key={rev.id} className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{rev.author}</span>
                        <span className="text-amber-400 font-bold">{'⭐'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-gray-300">{rev.comment}</p>
                      {(rev.images?.length > 0 || rev.image) && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mt-1">
                          {(rev.images?.length ? rev.images : [rev.image]).map((image, imageIndex) => (
                            <img key={imageIndex} src={image} alt={`User Review Attachment ${imageIndex + 1}`} className="w-full aspect-square object-cover rounded-lg border border-white/10" />
                          ))}
                        </div>
                      )}
                      <span className="text-[9px] text-gray-500 block">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No reviews yet. Be the first to leave one!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL */}
      <TrackOrderModal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} orders={orders} />
      
      {/* ==================== NEW FEATURE: FLOATING SIDE CHAT BUTTON ==================== */}
      <div className="fixed right-5 bottom-5 z-[80] flex flex-col items-end gap-3">
        {isChatOpen && (
          <div className="w-[min(94vw,390px)] shadow-2xl">
            {!isAdminRoute && (
              <div className="mb-2 bg-[#121214] border border-[#BA963E]/40 rounded-2xl p-3 text-white">
                <div className="flex justify-between items-center gap-2 mb-2">
                  <p className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">🤖 Quick Robot Help</p>
                  <button
                    onClick={() => setChatFaqOpen(v => !v)}
                    className="text-[10px] text-gray-400 hover:text-white cursor-pointer"
                  >
                    {chatFaqOpen ? 'Hide' : 'Show'}
                  </button>
                </div>
                {chatFaqOpen && (
                  <div className="space-y-1.5">
                    {[
                      ["What is my order status?", "Open My Orders to see the latest live status."],
                      ["How do I upload advance payment proof?", "Upload a clear screenshot of your actual advance payment at checkout."],
                      ["When will my payment be verified?", "Your payment remains pending until Admin verifies the submitted proof."],
                      ["How does free delivery work?", "Free delivery is controlled by Admin. If granted, the delivery charges are adjusted in your order."],
                      ["How can I contact Admin?", "Send a message below. Admin can see the same support conversation."]
                    ].map(([question, answer]) => (
                      <button
                        key={question}
                        onClick={() => setChatFaqAnswer(answer)}
                        className="w-full text-left px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-gray-300 cursor-pointer"
                      >
                        {question}
                      </button>
                    ))}
                    {chatFaqAnswer && (
                      <div className="mt-2 bg-[#BA963E]/10 border border-[#BA963E]/30 rounded-xl p-2.5 text-[10px] text-gray-200">
                        🤖 {chatFaqAnswer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <LiveChat
              isOpen={isChatOpen}
              isAdmin={isAdminRoute && isAdminAuthenticated}
              darkMode={darkMode}
              products={products}
              customerId={chatCustomerId}
              roboticQuestions={[
                "What is my order status?",
                "How do I upload advance payment proof?",
                "When will my payment be verified?",
                "How does free delivery work?",
                "How can I contact Admin?"
              ]}
              roboticAnswers={{
                "What is my order status?": "Open My Orders to see the latest live status.",
                "How do I upload advance payment proof?": "Upload a clear screenshot of your actual advance payment at checkout.",
                "When will my payment be verified?": "Your payment remains pending until Admin verifies the submitted proof.",
                "How does free delivery work?": "Free delivery is controlled by Admin. If granted, the delivery charges are adjusted in your order.",
                "How can I contact Admin?": "Send a message here. Admin can see the same support conversation."
              }}
              orders={orders}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        )}
        <button
          onClick={() => setIsChatOpen(open => !open)}
          className="bg-[#BA963E] hover:bg-[#E5C158] text-black font-bold px-5 py-3.5 rounded-full shadow-2xl transition-all flex items-center gap-2 text-xs uppercase tracking-wider border border-[#BA963E]/40 cursor-pointer"
          aria-label="Open customer support chat"
        >
          <span className="text-base">💬</span> {isChatOpen ? 'Close Chat' : 'Live Support'}
        </button>
      </div>
    </div>
  );
}