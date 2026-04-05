# TEKLINIQ — Elite Multi-Vendor Marketplace (Django Production Edition)

> **A professional, scalable, and sellable multi-vendor e-commerce platform built for the African market (Kenya-First).**  
> Inspired by Jumia, Kilimall, and Jiji. Designed for premium luxury branding.

## 🚀 Vision
TEKLINIQ is no longer just a project; it is a **production-grade marketplace solution**. It features separate Buyer and Seller ecosystems, a robust product catalog with advanced filtering, and a modern, high-performance frontend using HTMX and Alpine.js.

## 🏗 Tech Stack
- **Backend**: Python 3.12 + Django 5.x + Django REST Framework (DRF)
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Frontend**: Django Templates + Tailwind CSS + HTMX + Alpine.js
- **Auth**: Django Allauth (Email-based, custom roles)
- **Infrastructure**: Docker + Docker Compose + Redis + Celery

## ✨ Real-World Features
- **Multi-Vendor Ecosystem**: Specialized onboarding and dashboards for Sellers.
- **Elite UI/UX**: Dark Luxury theme with Gold accents and glassmorphism.
- **Advanced Search & Filter**: Real-time filtering by Category, Price, and Condition.
- **Persistent Cart & Wishlist**: Database-backed shopping experience for logged-in users.
- **Secure Checkout**: Support for M-Pesa (Placeholder) and Stripe integration.
- **Marketplace Trust**: Built-in Ratings & Reviews system with automatic score calculation.
- **Order Tracking**: Stage-by-stage tracking for both buyers and vendors.

## 📂 Project Structure
```text
TEKLINIQ/
├── teklinq/                  # Core Project Configuration
├── accounts/                 # Custom User, Roles (Buyer, Seller, Admin)
├── products/                 # Products, Categories, Search, Management Commands
├── cart/                     # Cart, Wishlist Logic
├── orders/                   # Checkout flow, Tracking, Payments
├── sellers/                  # Multi-vendor Dashboard & Onboarding
├── reviews/                  # Ratings & Feedback System
├── static/                   # Global Assets (Tailwind CSS, Icons)
├── templates/                # Professional Django Templates (Base, Dashboard, Shop)
├── media/                    # Local Storage for Product/Seller assets
├── Dockerfile                # Production Containerization
└── docker-compose.yml        # Orchestration (DB, Cache, Worker, Web)
```

## 🛠 Setup & Launch

### 1. Local Setup (Standard)
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/bmcouma/tekliniq-ecommerce-.git
    cd TEKLINIQ
    ```
2.  **Create Virtual Environment**:
    ```bash
    python -m venv .venv
    .venv\Scripts\activate
    ```
3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Database Migration**:
    ```bash
    python manage.py migrate
    ```
5.  **Seed Marketplace Data**:
    ```bash
    python manage.py seed_data
    ```
6.  **Run Development Server**:
    ```bash
    python manage.py runserver
    ```

### 2. Docker Setup (Recommended for Production)
```bash
docker-compose up --build
```
*The app will be available at `http://localhost:8000` with PostgreSQL and Redis pre-configured.*

---

© 2025 TEKLINIQ by Teklini Technologies. All rights reserved.  
**Engineered for Elite Commerce.**
