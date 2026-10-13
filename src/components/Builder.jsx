import { useState } from 'react';
import Cake from './Cake.jsx';
import Chip from './Chip.jsx';
import {
  FLAVOURS,
  FROSTINGS,
  TOPPINGS,
  WEIGHTS,
  TIER_MIN,
  TIER_EXTRA,
  DRIP_PRICE,
  EGGLESS_PER_KG,
} from '../data.js';
import { inr, priceOf } from '../utils.js';

export default function Builder({ onAdd }) {
  const [spec, setSpec] = useState({
    flavour: 'choc',
    frosting: 'cream',
    tiers: 2,
    weight: 1,
    topping: 'berries',
    drip: false,
    eggless: false,
    message: 'Happy Birthday',
  });
  const set = (patch) => setSpec((s) => ({ ...s, ...patch }));

  const flavour = FLAVOURS.find((f) => f.id === spec.flavour);
  const frosting = FROSTINGS.find((f) => f.id === spec.frosting);
  const topping = TOPPINGS.find((t) => t.id === spec.topping);
  const p = priceOf(spec);
  const serves = Math.round(spec.weight * 8) + ' to ' + Math.round(spec.weight * 10);

  // More tiers need more cake, so the weight is raised when it is too low.
  const setTiers = (t) => set({ tiers: t, weight: Math.max(spec.weight, TIER_MIN[t]) });

  const add = () => {
    const msg = spec.message.trim();
    const sub = [
      spec.weight + ' kg',
      spec.tiers + ' tier' + (spec.tiers > 1 ? 's' : ''),
      frosting.name.toLowerCase() + ' frosting',
      spec.topping !== 'none' ? topping.name.toLowerCase() : null,
      spec.drip ? 'ganache drip' : null,
      spec.eggless ? 'eggless' : null,
      msg ? 'message "' + msg + '"' : null,
    ]
      .filter(Boolean)
      .join(', ');

    onAdd({
      key: 'custom:' + JSON.stringify(spec),
      name: flavour.name + ' custom cake',
      sub,
      unit: p.total,
      qty: 1,
      cake: {
        tiers: spec.tiers,
        sponge: flavour.color,
        frosting: spec.frosting,
        topping: spec.topping,
        drip: spec.drip,
        message: msg,
      },
    });
  };

  return (
    <div className="builder">
      <div className="stage">
        <div className="stage-art">
          <span className="stage-tag">Serves about {serves}</span>
          <div className="cake-pop" key={spec.tiers}>
            <Cake
              tiers={spec.tiers}
              sponge={flavour.color}
              frosting={spec.frosting}
              topping={spec.topping}
              drip={spec.drip}
              message={spec.message}
            />
          </div>
        </div>

        <div className="buy">
          <div className="price-big">
            {inr(p.total)}
            <span className="price-note">
              {spec.weight} kg, {spec.tiers} tier{spec.tiers > 1 ? 's' : ''}
            </span>
          </div>
          <button type="button" className="btn" onClick={add}>
            Add to cart
          </button>
        </div>

        <div className="rows" aria-label="Price breakdown">
          <div>
            <span>
              {flavour.name}, {spec.weight} kg{spec.eggless ? ' (eggless)' : ''}
            </span>
            <span>{inr(p.cake)}</span>
          </div>
          {p.tiers > 0 ? (
            <div>
              <span>Extra tiers</span>
              <span>{inr(p.tiers)}</span>
            </div>
          ) : null}
          {p.top > 0 ? (
            <div>
              <span>{topping.name}</span>
              <span>{inr(p.top)}</span>
            </div>
          ) : null}
          {p.drip > 0 ? (
            <div>
              <span>Ganache drip</span>
              <span>{inr(p.drip)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="panel">
        <div className="group" role="group" aria-labelledby="l-flavour">
          <div className="lab" id="l-flavour">
            Flavour <span className="val">{flavour.name}</span>
          </div>
          <div className="flavs">
            {FLAVOURS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={'flav' + (f.id === spec.flavour ? ' on' : '')}
                aria-pressed={f.id === spec.flavour}
                onClick={() => set({ flavour: f.id })}
              >
                <span className="dot" style={{ background: f.color }}></span>
                <span>
                  <span className="nm">{f.name}</span>
                  <span className="pk">{inr(f.perKg)} per kg</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="group" role="group" aria-labelledby="l-frosting">
          <div className="lab" id="l-frosting">
            Frosting <span className="val">{frosting.name}</span>
          </div>
          <div className="swatches">
            {FROSTINGS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={'sw' + (f.id === spec.frosting ? ' on' : '')}
                style={{ background: f.base }}
                aria-label={f.name}
                title={f.name}
                aria-pressed={f.id === spec.frosting}
                onClick={() => set({ frosting: f.id })}
              ></button>
            ))}
          </div>
        </div>

        <div className="group" role="group" aria-labelledby="l-tiers">
          <div className="lab" id="l-tiers">
            Tiers
          </div>
          <div className="seg">
            {[1, 2, 3].map((t) => (
              <Chip key={t} active={spec.tiers === t} onClick={() => setTiers(t)}>
                {t === 1 ? 'Single' : t === 2 ? 'Two tiers' : 'Three tiers'}
                {TIER_EXTRA[t] ? ' (+' + inr(TIER_EXTRA[t]) + ')' : ''}
              </Chip>
            ))}
          </div>
        </div>

        <div className="group" role="group" aria-labelledby="l-weight">
          <div className="lab" id="l-weight">
            Weight
          </div>
          <div className="seg">
            {WEIGHTS.map((w) => (
              <Chip
                key={w}
                active={spec.weight === w}
                disabled={w < TIER_MIN[spec.tiers]}
                title={
                  w < TIER_MIN[spec.tiers]
                    ? spec.tiers + ' tiers need at least ' + TIER_MIN[spec.tiers] + ' kg'
                    : undefined
                }
                onClick={() => set({ weight: w })}
              >
                {w} kg
              </Chip>
            ))}
          </div>
        </div>

        <div className="group" role="group" aria-labelledby="l-top">
          <div className="lab" id="l-top">
            Topping
          </div>
          <div className="seg">
            {TOPPINGS.map((t) => (
              <Chip key={t.id} active={spec.topping === t.id} onClick={() => set({ topping: t.id })}>
                {t.name}
                {t.price ? ' (+' + inr(t.price) + ')' : ''}
              </Chip>
            ))}
          </div>
        </div>

        <div className="group">
          <div className="lab">Extras</div>
          <div className="checks">
            <label className="check" htmlFor="x-eggless">
              <input
                id="x-eggless"
                type="checkbox"
                checked={spec.eggless}
                onChange={(e) => set({ eggless: e.target.checked })}
              />
              <span>
                Eggless <small>(+{inr(EGGLESS_PER_KG)} per kg)</small>
              </span>
            </label>
            <label className="check" htmlFor="x-drip">
              <input
                id="x-drip"
                type="checkbox"
                checked={spec.drip}
                onChange={(e) => set({ drip: e.target.checked })}
              />
              <span>
                Chocolate ganache drip <small>(+{inr(DRIP_PRICE)})</small>
              </span>
            </label>
          </div>
        </div>

        <div className="group">
          <label className="lab" htmlFor="x-msg">
            Message on the cake
          </label>
          <input
            id="x-msg"
            className="input"
            type="text"
            maxLength={20}
            value={spec.message}
            placeholder="Happy Birthday"
            onChange={(e) => set({ message: e.target.value })}
          />
          <div className="hint">
            <span>Piped on the bottom tier.</span>
            <span>{spec.message.length} / 20</span>
          </div>
        </div>
      </div>
    </div>
  );
}
