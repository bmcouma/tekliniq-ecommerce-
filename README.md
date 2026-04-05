# TEKLINIQ — Curated Luxury E-Commerce

> A production-grade, responsive e-commerce website built with vanilla HTML, CSS, and JavaScript.  
> Final project by **Teklini Technologies** for the SoftGrowTech internship program.

## 🏗 Architecture

```
TEKLINIQ/
├── index.html              # Home page — hero slider, featured products, values, newsletter
├── products.html           # Product listing — full catalog with category filters
├── contact.html            # Contact page — form with validation, info cards, map placeholder
├── css/
│   ├── style.css           # Full design system — tokens, components, responsive breakpoints
│   └── animations.css      # Scroll reveals, fade-ups, skeleton shimmer, cart pulse
├── js/
│   ├── TekliniqEngine.js   # Data/logic layer — zero DOM awareness, returns data only
│   └── main.js             # UI controller — only file that touches the DOM
└── README.md
```

## ✨ Features

- **3-page responsive layout** — Home, Products, Contact
- **Hero text slider** with auto-advance and dot navigation
- **Persistent cart** via localStorage — survives navigation and page refresh
- **Cart drawer** with quantity controls, remove items, and live total
- **Category filtering** on products page (All, Accessories, Apparel, Footwear, Bags)
- **Contact form** with real-time field validation and error states
- **Newsletter subscription** with toast confirmation
- **Scroll-triggered animations** via IntersectionObserver
- **Staggered product entrance** animations
- **Toast notification system** (success/error states)
- **Mobile-first responsive** — works on all screen sizes
- **Dark luxury aesthetic** — custom design token system

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Accent (Gold) | `#c9a96e` |
| Display Font | Cormorant Garamond |
| Body Font | Outfit |
| Border Radius | 4px–16px scale |

## 🚀 How to Run

1. Unzip `TEKLINIQ.zip`
2. Open `index.html` in any modern browser
3. No build tools, no server, no dependencies required

## 📝 Tech Stack

- HTML5 (semantic)
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (ES6+ classes, IntersectionObserver, localStorage)

## 👤 Author

**Teklini Technologies**  
SoftGrowTech Final Project — E-Commerce Website

---

© 2025 TEKLINIQ by Teklini Technologies. All rights reserved.
