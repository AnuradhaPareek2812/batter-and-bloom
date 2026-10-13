import { useState, useEffect, useRef } from 'react';
import Builder from './components/Builder.jsx';
import Menu from './components/Menu.jsx';
import Drawer from './components/Drawer.jsx';
import { DELIVERY_FEE, FREE_DELIVERY_FROM, EGGLESS_PER_KG } from './data.js';
import { inr, loadCart } from './utils.js';

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const timer = useRef(null);

  // Keep the cart between visits.
  useEffect(() => {
    try {
      localStorage.setItem('bb-cart', JSON.stringify(cart));
    } catch (e) {
      /* storage can be blocked, the cart still works for this visit */
    }
  }, [cart]);

  const say = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2200);
  };

  const add = (item) => {
    setCart((c) => {
      const hit = c.find((x) => x.key === item.key);
      return hit ? c.map((x) => (x.key === item.key ? { ...x, qty: x.qty + 1 } : x)) : [...c, item];
    });
    say(item.name + ' added to your cart');
  };
  const changeQty = (key, d) =>
    setCart((c) => c.map((x) => (x.key === key ? { ...x, qty: Math.max(1, x.qty + d) } : x)));
  const remove = (key) => setCart((c) => c.filter((x) => x.key !== key));
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div>
      <header className="top">
        <div className="wrap">
          <a className="brand" href="#top">
            Batter <b>&amp;</b> Bloom
          </a>
          <nav className="nav" aria-label="Sections">
            <a href="#build">Build a cake</a>
            <a href="#menu">Menu</a>
            <a href="#info">How it works</a>
          </nav>
          <button
            type="button"
            className="cart-btn"
            onClick={() => setOpen(true)}
            aria-label={'Open cart, ' + count + ' items'}
          >
            Cart <span className="count">{count}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section id="build" className="wrap">
          <div className="hero">
            <span className="eyebrow">Custom cakes, baked to order</span>
            <h1>Design your cake. We bake it fresh.</h1>
            <p>Pick a flavour, stack up to three tiers and write your message. The price updates as you build.</p>
          </div>
          <Builder onAdd={add} />
        </section>

        <Menu onAdd={add} />

        <section id="info" className="info">
          <div className="wrap">
            <dl>
              <div>
                <dt>24 hours' notice</dt>
                <dd>Every cake is baked after you order. Pick any delivery date from tomorrow.</dd>
              </div>
              <div>
                <dt>Delivery in four slots</dt>
                <dd>
                  Morning to evening. Delivery is free above {inr(FREE_DELIVERY_FROM)}, otherwise {inr(DELIVERY_FEE)}.
                </dd>
              </div>
              <div>
                <dt>Eggless on request</dt>
                <dd>Any flavour can be made without eggs for {inr(EGGLESS_PER_KG)} extra per kg.</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className="wrap foot">
        <span>Batter &amp; Bloom. Open daily, 9 am to 9 pm.</span>
        <span>Messages on cakes can be up to 20 characters.</span>
      </footer>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        cart={cart}
        onQty={changeQty}
        onRemove={remove}
        onPlaced={() => setCart([])}
      />
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
