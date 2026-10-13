import { useState } from 'react';
import Cake from './Cake.jsx';
import Chip from './Chip.jsx';
import { MENU, CATS, EGGLESS_PER_KG } from '../data.js';
import { inr } from '../utils.js';

function MenuCard({ item, index, eggless, onAdd }) {
  const [weight, setWeight] = useState(1);
  const unit = (item.perKg + (eggless ? EGGLESS_PER_KG : 0)) * weight;

  const add = () =>
    onAdd({
      key: 'menu:' + item.id + ':' + weight + ':' + (eggless ? 'e' : 'x'),
      name: item.name,
      sub: weight + ' kg' + (eggless ? ', eggless' : ''),
      unit,
      qty: 1,
      cake: {
        tiers: item.tiers,
        sponge: item.sponge,
        frosting: item.frosting,
        topping: item.topping,
        drip: item.drip,
        message: '',
      },
    });

  return (
    <article className="card">
      <div className="thumb" style={{ background: 'var(--tint' + ((index % 3) + 1) + ')' }}>
        {item.badge ? <span className="badge">{item.badge}</span> : null}
        <Cake
          tiers={item.tiers}
          sponge={item.sponge}
          frosting={item.frosting}
          topping={item.topping}
          drip={item.drip}
        />
      </div>
      <div className="card-body">
        <h3>{item.name}</h3>
        <p className="blurb">{item.blurb}</p>
        <div className="card-foot">
          <div className="seg" role="group" aria-label={'Weight for ' + item.name}>
            {[0.5, 1, 2].map((w) => (
              <Chip key={w} small active={weight === w} onClick={() => setWeight(w)}>
                {w} kg
              </Chip>
            ))}
          </div>
          <div className="row">
            <span className="p">
              {inr(unit)} <small>for {weight} kg</small>
            </span>
            <button type="button" className="btn sm" onClick={add}>
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Menu({ onAdd }) {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('popular');
  const [eggless, setEggless] = useState(false);

  let list = MENU.filter(
    (m) =>
      (cat === 'All' || m.cats.includes(cat)) &&
      (m.name + ' ' + m.blurb).toLowerCase().includes(q.trim().toLowerCase())
  );
  if (sort === 'low') list = list.slice().sort((a, b) => a.perKg - b.perKg);
  if (sort === 'high') list = list.slice().sort((a, b) => b.perKg - a.perKg);

  return (
    <section id="menu" className="menu-sec">
      <div className="wrap">
        <div className="sec-head">
          <h2>Ready to order</h2>
          <p>Bakery classics from half a kilo up. Every cake can be made eggless.</p>
        </div>

        <div className="filters">
          <div className="seg" role="group" aria-label="Category">
            {CATS.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <div className="grow">
            <input
              id="m-search"
              className="input"
              type="search"
              placeholder="Search cakes"
              aria-label="Search cakes"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select id="m-sort" aria-label="Sort cakes" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Our order</option>
            <option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option>
          </select>
          <label className="check" htmlFor="m-eggless">
            <input
              id="m-eggless"
              type="checkbox"
              checked={eggless}
              onChange={(e) => setEggless(e.target.checked)}
            />
            <span>
              Eggless <small>(+{inr(EGGLESS_PER_KG)} per kg)</small>
            </span>
          </label>
        </div>

        {list.length === 0 ? (
          <p className="none">No cakes match that search. Try another word or pick All.</p>
        ) : (
          <div className="grid">
            {list.map((m, i) => (
              <MenuCard key={m.id} item={m} index={i} eggless={eggless} onAdd={onAdd} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
