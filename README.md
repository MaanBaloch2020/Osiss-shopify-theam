# OSISS™ Shopify Theme — OS 2.0

A professional, SEO-optimized Shopify Online Store 2.0 theme converted from your custom HTML.

---

## 📁 File Structure

```
osiss-theme/
├── layout/
│   └── theme.liquid           ← Master layout: SEO tags, JSON-LD, asset linking
├── sections/
│   ├── header.liquid          ← Sale strip, ticker, sticky header, drawer nav
│   ├── hero.liquid            ← Hero banner + trust bar (fully customizable)
│   ├── product-grid.liquid    ← Reusable product grid (Featured / Best Sellers / New)
│   ├── routine-steps.liquid   ← 3-step routine section
│   ├── reviews.liquid         ← Customer reviews carousel
│   └── footer.liquid          ← Full footer with newsletter, social, payments
├── templates/
│   └── index.json             ← Homepage section configuration
├── assets/
│   ├── theme.css              ← All styles (extracted & organized)
│   └── theme.js               ← All JavaScript + Shopify AJAX cart
└── config/
    └── settings_schema.json   ← Theme Editor settings (colors, fonts, SEO, etc.)
```

---

## 🚀 Installation Steps

### 1. Upload to Shopify
- Go to **Online Store → Themes → Add theme → Upload zip file**
- Zip this entire folder and upload it

### 2. Configure Collections
In the **Theme Editor**, assign these collections to the product grid sections:
- **Featured Products** → your "featured" collection handle
- **Best Sellers** → your "bestseller" collection handle
- **New Arrivals** → your "new-arrivals" collection handle

Tag your products:
- `featured` — shows Featured badge
- `bestseller` — shows Best Seller badge
- `new` — shows New Arrival badge

### 3. Upload Product Images
Replace the inline SVG illustrations by uploading real product photos. In each product-grid section, images will automatically render from Shopify's CDN with proper `img_url` filters.

### 4. Configure the Theme Editor
Open **Theme Editor** and customize:

| Section | Key Settings |
|---|---|
| Header | Sale strip text & timer, ticker items, logo image, nav links |
| Hero | Headline, sub-headline, CTA buttons, trust badges, product image |
| Product Grid | Assign collection, products to show, section title |
| Routine Steps | Step titles, descriptions, icons, Shop Now URLs |
| Reviews | Rating summary, individual review cards |
| Footer | Tagline, social links, WhatsApp number, newsletter toggle |
| Theme Settings | Brand colors, fonts, SEO defaults, shipping threshold |

### 5. SEO Checklist
- ✅ Dynamic `<title>` and `<meta name="description">` per page
- ✅ JSON-LD Organization + WebSite schema for OSISS™
- ✅ Open Graph + Twitter Card meta tags
- ✅ Canonical URLs
- ✅ Semantic HTML5 landmarks (header, main, footer, nav)
- ✅ ARIA labels on all interactive elements
- ✅ Alt text on all images via Liquid filters

### 6. Shopify Cart
`theme.js` uses the Shopify AJAX Cart API (`/cart/add.js`, `/cart/change.js`, `/cart.js`) so add-to-cart works without page reloads. No extra apps needed.

---

## 🎨 Key Design Tokens

| Token | Value | Usage |
|---|---|---|
| Gold | `#c8a951` | Primary accent, CTA buttons |
| Dark | `#080808` | Hero background |
| Off-white | `#FAFAFA` | Page background |
| Free ship | PKR 2,000 | Progress bar threshold |
| Std ship | PKR 250 | Default shipping fee |

---

## ⚠️ Notes

1. **SVG Product Illustrations** — The hero section includes inline SVG bottle illustrations. Replace these with real product photography by uploading images and setting them in the Hero section's "Hero product image" setting.

2. **Fonts** — Montserrat is loaded from Google Fonts in `theme.liquid`. You can override with Shopify's font picker in Theme Settings.

3. **WhatsApp Float** — Set your WhatsApp number in Theme Settings → Brand Settings (format: `923021345111` — country code + number, no spaces or `+`).

4. **Promo Codes** — For production, use Shopify's native Discount system at checkout rather than the client-side PROMOS object.

© 2024 OSISS Enterprises (Pvt) Ltd. — Lahore, Pakistan
