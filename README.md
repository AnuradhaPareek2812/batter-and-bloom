# Batter & Bloom

A small cake shop website built with React and Vite. It has a live cake builder, a filterable menu and a cart with a delivery form.

## Run it

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

To make a production build:

```bash
npm run build
npm run preview
```

## Where things are

- `src/data.js` has the flavours, frostings, toppings, menu cakes and all prices. Change prices here.
- `src/utils.js` has the price calculation and small helpers.
- `src/components/Cake.jsx` draws the cake as SVG from props. It is used in the builder, the menu and the cart.
- `src/components/Builder.jsx` is the cake builder.
- `src/components/Menu.jsx` is the menu with category, search and sort.
- `src/components/Drawer.jsx` is the cart, delivery form and order confirmation.
- `src/styles.css` has all the styling. Colours are CSS variables at the top, with a dark theme that follows the system setting.

## Notes

- The cart is saved in the browser's localStorage.
- Checkout is a demo. No order is sent and no payment is taken. To make it real, send the order from `submit` in `Drawer.jsx` to your backend.
