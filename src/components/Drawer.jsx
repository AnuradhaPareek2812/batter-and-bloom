import { useState, useEffect, useRef } from 'react';
import Cake from './Cake.jsx';
import { SLOTS, DELIVERY_FEE, FREE_DELIVERY_FROM } from '../data.js';
import { inr, tomorrowISO, prettyDate } from '../utils.js';

export default function Drawer({ open, onClose, cart, onQty, onRemove, onPlaced }) {
  const [view, setView] = useState('cart'); // 'cart' | 'checkout' | 'done'
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    date: tomorrowISO(),
    slot: SLOTS[1],
  });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const closeRef = useRef(null);
  const minDate = tomorrowISO();

  const subtotal = cart.reduce((s, i) => s + i.unit * i.qty, 0);
  const delivery = cart.length === 0 ? 0 : subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const close = () => {
    if (view === 'done') {
      setView('cart');
      setOrder(null);
    }
    onClose();
  };

  // Close on Escape, lock page scroll while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    if (closeRef.current) closeRef.current.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, view]);

  if (!open) return null;

  const upd = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Enter the name for the delivery.';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) errs.phone = 'Enter a 10 digit mobile number.';
    if (form.address.trim().length < 10) errs.address = 'Add the full delivery address.';
    if (!form.date || form.date < minDate) errs.date = 'Pick a date from tomorrow onwards.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setOrder({
      no: 'BB-' + (1000 + Math.floor(Math.random() * 9000)),
      date: form.date,
      slot: form.slot,
      total,
      name: form.name.trim().split(' ')[0],
    });
    onPlaced();
    setView('done');
  };

  const title = view === 'cart' ? 'Your cart' : view === 'checkout' ? 'Delivery details' : 'Order placed';

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="d-head">
          <h2>{title}</h2>
          <button type="button" className="x" ref={closeRef} onClick={close} aria-label="Close cart">
            ×
          </button>
        </div>

        {view === 'cart' ? (
          <>
            <div className="d-body">
              {cart.length === 0 ? (
                <div className="empty">
                  <Cake tiers={1} sponge="#F4E3B5" frosting="cream" />
                  <p>Your cart is empty. Build a cake or pick one from the menu.</p>
                  <button type="button" className="btn" onClick={close}>
                    Keep browsing
                  </button>
                </div>
              ) : (
                cart.map((it) => (
                  <div className="line" key={it.key}>
                    <div className="th">
                      <Cake
                        tiers={it.cake.tiers}
                        sponge={it.cake.sponge}
                        frosting={it.cake.frosting}
                        topping={it.cake.topping}
                        drip={it.cake.drip}
                        message=""
                      />
                    </div>
                    <div>
                      <h3>{it.name}</h3>
                      <p className="sub">{it.sub}</p>
                      <div className="ctl">
                        <div className="qty">
                          <button type="button" aria-label={'One less ' + it.name} onClick={() => onQty(it.key, -1)}>
                            −
                          </button>
                          <span aria-live="polite">{it.qty}</span>
                          <button type="button" aria-label={'One more ' + it.name} onClick={() => onQty(it.key, 1)}>
                            +
                          </button>
                        </div>
                        <span className="amt">{inr(it.unit * it.qty)}</span>
                      </div>
                      <button type="button" className="link" onClick={() => onRemove(it.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 ? (
              <div className="d-foot">
                <div className="sum">
                  <div>
                    <span>Subtotal</span>
                    <span>{inr(subtotal)}</span>
                  </div>
                  <div>
                    <span>Delivery {delivery === 0 ? '' : '(free from ' + inr(FREE_DELIVERY_FROM) + ')'}</span>
                    <span>{delivery === 0 ? 'Free' : inr(delivery)}</span>
                  </div>
                  <div className="tot">
                    <span>Total</span>
                    <span>{inr(total)}</span>
                  </div>
                </div>
                <button type="button" className="btn block" onClick={() => setView('checkout')}>
                  Continue to delivery
                </button>
              </div>
            ) : null}
          </>
        ) : null}

        {view === 'checkout' ? (
          <form className="d-body" onSubmit={submit} noValidate>
            <button type="button" className="link" onClick={() => setView('cart')}>
              ← Back to cart
            </button>

            <div className="field">
              <label htmlFor="f-name">Name</label>
              <input
                id="f-name"
                className="input"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => upd({ name: e.target.value })}
              />
              {errors.name ? <span className="err">{errors.name}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="f-phone">Mobile number</label>
              <input
                id="f-phone"
                className="input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98xxxxxxxx"
                value={form.phone}
                onChange={(e) => upd({ phone: e.target.value })}
              />
              {errors.phone ? <span className="err">{errors.phone}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="f-address">Delivery address</label>
              <textarea
                id="f-address"
                className="input"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => upd({ address: e.target.value })}
              ></textarea>
              {errors.address ? <span className="err">{errors.address}</span> : null}
            </div>

            <div className="two">
              <div className="field">
                <label htmlFor="f-date">Delivery date</label>
                <input
                  id="f-date"
                  className="input"
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={(e) => upd({ date: e.target.value })}
                />
                {errors.date ? <span className="err">{errors.date}</span> : null}
              </div>
              <div className="field">
                <label htmlFor="f-slot">Time slot</label>
                <select
                  id="f-slot"
                  className="input"
                  value={form.slot}
                  onChange={(e) => upd({ slot: e.target.value })}
                >
                  {SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sum">
              <div>
                <span>Subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>
              <div>
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : inr(delivery)}</span>
              </div>
              <div className="tot">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
            </div>

            <button type="submit" className="btn block">
              Place order, {inr(total)}
            </button>
            <p className="demo">This is a demo storefront. No payment is taken and nothing is sent to a bakery.</p>
          </form>
        ) : null}

        {view === 'done' && order ? (
          <div className="d-body done">
            <h3>Thanks, {order.name}</h3>
            <p>
              Order <b>{order.no}</b> is lined up for <b>{prettyDate(order.date)}</b>, {order.slot}. Total{' '}
              {inr(order.total)}.
            </p>
            <p className="demo">This is a demo storefront, so no order was sent and no payment was taken.</p>
            <button type="button" className="btn" onClick={close}>
              Back to the shop
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
