# SAT Store

## Current State
- Full-stack ecommerce app with Motoko backend and React frontend.
- Backend supports products, cart, orders, search, and category filtering.
- Only 3 seed products (Smartphone, Laptop, Headphones) initialized via admin `initialize()` call.
- Frontend has HomePage, ProductsPage, ProductDetailPage, CartPage, OrdersPage, OrderConfirmationPage.
- Categories shown: Electronics, Clothing, Books, Home & Kitchen, Sports, Toys.

## Requested Changes (Diff)

### Add
- More products in the backend seed data: at least 5 laptops and 5 mobiles/smartphones, plus a few accessories.
- Dedicated "Laptops" and "Mobiles" categories visible on the homepage category grid.
- Featured sections on the homepage specifically for Laptops and Mobiles.

### Modify
- Backend `initialize()` function: expand seed products to include ~15 products total, covering Laptops, Mobiles, Headphones, Tablets, and Accessories categories.
- Homepage category grid: replace or extend to include "Laptops" and "Mobiles" as prominent categories.
- ProductsPage: ensure "Laptops" and "Mobiles" appear in filter options.

### Remove
- Nothing removed — existing functionality preserved.

## Implementation Plan
1. Update `main.mo` to add ~15 seed products with proper Laptops and Mobiles categories and realistic names, prices, descriptions.
2. Update the frontend HomePage to add "Laptops" and "Mobiles" to the CATEGORIES array and add dedicated featured sections for each.
3. Ensure ProductsPage category filter includes Laptops and Mobiles.
4. Keep all existing pages and backend APIs intact.
