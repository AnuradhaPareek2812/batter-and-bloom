import { useId } from 'react';
import { FROSTINGS } from '../data.js';
import { rng } from '../utils.js';

const CONFETTI = ['#E4405F', '#FFC93C', '#3AA9E0', '#6BC46D', '#9B59B6', '#FFFFFF'];

// Draws a cake as SVG from plain props, so the same component serves the builder,
// the menu cards and the cart thumbnails.
export default function Cake({
  tiers = 1,
  sponge = '#5A3524',
  frosting = 'cream',
  topping = 'none',
  drip = false,
  message = '',
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const f = FROSTINGS.find((x) => x.id === frosting) || FROSTINGS[0];
  const n = tiers;
  const widths = n === 1 ? [200] : n === 2 ? [224, 150] : [236, 172, 110];
  const h = n === 1 ? 86 : n === 2 ? 68 : 56;
  const cx = 160;
  const base = 262;
  const topY = base - n * h;
  const topW = widths[n - 1];
  const dripCol = '#3F2418';
  const dripLight = '#5A362A';

  const tierEls = widths.map((w, i) => {
    const bottom = base - i * h;
    const top = bottom - h;
    const x = cx - w / 2;
    const clipId = uid + 't' + i;

    // Ganache drips
    const drips = [];
    if (drip) {
      const count = Math.round(w / 26);
      const lens = [16, 30, 12, 24, 34, 14, 26, 20, 10, 28];
      for (let k = 0; k < count; k++) {
        const dx = x + ((k + 0.5) * w) / count;
        const len = lens[(k + i * 3) % lens.length];
        drips.push('M' + (dx - 5) + ' ' + (top + 4) + 'v' + len + 'a5 5 0 0 0 10 0v' + -len + 'z');
      }
    }

    // Sprinkles on the side of the tier
    const sprinkles = [];
    if (topping === 'sprinkles') {
      const r = rng(i + 5);
      const total = Math.round((14 * w) / 200);
      for (let k = 0; k < total; k++) {
        const sx = x + 8 + r() * (w - 22);
        const sy = top + 8 + r() * (h - 18);
        sprinkles.push(
          <rect
            key={k}
            x={sx}
            y={sy}
            width="7"
            height="2.6"
            rx="1.3"
            fill={CONFETTI[Math.floor(r() * CONFETTI.length)]}
            transform={'rotate(' + Math.round(r() * 180) + ' ' + (sx + 3.5) + ' ' + (sy + 1.3) + ')'}
          />
        );
      }
    }

    // Piped border along the bottom edge
    const dotCount = Math.floor(w / 15);
    const dots = Array.from({ length: dotCount }, (_, k) => (
      <circle
        key={k}
        cx={x + 10 + k * ((w - 20) / (dotCount - 1))}
        cy={bottom - 3}
        r="4"
        className="fillt"
        style={{ fill: f.light }}
        stroke="rgba(0,0,0,.08)"
        strokeWidth=".6"
      />
    ));

    return (
      <g key={i}>
        <clipPath id={clipId}>
          <rect x={x} y={top} width={w} height={h} rx="10" />
        </clipPath>
        <rect x={x} y={top} width={w} height={h} rx="10" className="fillt" style={{ fill: f.base }} />
        <g clipPath={'url(#' + clipId + ')'}>
          <rect x={x} y={top + h * 0.4} width={w} height={h * 0.22} className="fillt" style={{ fill: sponge }} />
          <rect x={x + w * 0.84} y={top} width={w * 0.16} height={h} fill="#000" opacity=".07" />
          {drip ? (
            <g>
              <rect x={x} y={top} width={w} height="9" fill={dripCol} />
              <path d={drips.join('')} fill={dripCol} />
            </g>
          ) : null}
          {sprinkles}
        </g>
        <ellipse cx={cx} cy={top} rx={w / 2} ry="9" className="fillt" style={{ fill: drip ? dripLight : f.light }} />
        {dots}
      </g>
    );
  });

  // Toppings on the top tier
  let toppingEls = null;
  if (topping === 'berries') {
    const xs = [-34, -16, 2, 20, 36].filter((d) => Math.abs(d) < topW / 2 - 14);
    toppingEls = (
      <g>
        {xs.map((d, k) => (
          <g key={k}>
            <circle cx={cx + d} cy={topY - 6 - (k % 2) * 3} r="9" fill={k % 2 ? '#3F4FA0' : '#D3254A'} />
            <circle cx={cx + d - 3} cy={topY - 9 - (k % 2) * 3} r="2.2" fill="#fff" opacity=".55" />
          </g>
        ))}
        <ellipse
          cx={cx + 8}
          cy={topY - 15}
          rx="7"
          ry="3.2"
          fill="#4F8A3C"
          transform={'rotate(-28 ' + (cx + 8) + ' ' + (topY - 15) + ')'}
        />
      </g>
    );
  } else if (topping === 'sprinkles') {
    const r = rng(11);
    const arr = [];
    for (let k = 0; k < 14; k++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r());
      const sx = cx + Math.cos(a) * d * (topW / 2 - 16);
      const sy = topY + Math.sin(a) * d * 5;
      arr.push(
        <rect
          key={k}
          x={sx}
          y={sy}
          width="7"
          height="2.6"
          rx="1.3"
          fill={CONFETTI[Math.floor(r() * CONFETTI.length)]}
          transform={'rotate(' + Math.round(r() * 180) + ' ' + (sx + 3.5) + ' ' + (sy + 1.3) + ')'}
        />
      );
    }
    toppingEls = <g>{arr}</g>;
  } else if (topping === 'flowers') {
    const spots = topW < 150 ? [-16, 16] : [-34, 0, 34];
    toppingEls = (
      <g>
        {spots.map((d, k) => {
          const col = ['#FFFFFF', '#F28DB2', '#C7A8F0'][k % 3];
          return (
            <g key={k} transform={'translate(' + (cx + d) + ' ' + (topY - 8 - (k % 2) * 4) + ')'}>
              <ellipse cx="-9" cy="3" rx="6" ry="2.6" fill="#4F8A3C" transform="rotate(-20 -9 3)" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="0"
                  cy="-7"
                  rx="4.8"
                  ry="6.6"
                  fill={col}
                  stroke="rgba(0,0,0,.14)"
                  strokeWidth=".6"
                  transform={'rotate(' + a + ')'}
                />
              ))}
              <circle r="3.4" fill="#F7C948" />
            </g>
          );
        })}
      </g>
    );
  } else if (topping === 'candles') {
    const cols = ['#F28DB2', '#7FC6E8', '#F7C948'];
    const spots = topW < 150 ? [-14, 14] : [-22, 0, 22];
    toppingEls = (
      <g>
        {spots.map((d, k) => (
          <g key={k}>
            <rect x={cx + d - 3} y={topY - 34} width="6" height="34" rx="2" fill={cols[k]} />
            <g className="flame">
              <ellipse cx={cx + d} cy={topY - 41} rx="3.6" ry="6" fill="#FFB020" />
              <ellipse cx={cx + d} cy={topY - 39.5} rx="1.7" ry="3.2" fill="#FFE9A0" />
            </g>
          </g>
        ))}
      </g>
    );
  }

  // Message piped on the bottom tier
  const msg = message.trim();
  const msgSize = (n === 1 ? 13 : 11) - (msg.length > 16 ? 1.5 : 0);
  const msgEl = msg ? (
    <text
      x={cx}
      y={base - (n === 1 ? 14 : 11)}
      textAnchor="middle"
      fontSize={msgSize}
      style={{ fill: f.ink, fontFamily: 'var(--font-display)' }}
    >
      {msg}
    </text>
  ) : null;

  return (
    <svg
      viewBox="0 0 320 290"
      className="cake"
      role="img"
      aria-label={n + '-tier cake' + (msg ? ' with the message ' + msg : '')}
    >
      <ellipse cx="160" cy="272" rx="146" ry="15" style={{ fill: 'var(--plate)' }} />
      <ellipse cx="160" cy="268" rx="134" ry="11" style={{ fill: 'var(--plate2)' }} />
      {tierEls}
      {toppingEls}
      {msgEl}
    </svg>
  );
}
