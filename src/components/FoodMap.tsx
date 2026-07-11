import { useEffect, useRef, useState } from 'react';
import type { Dish, Pin } from '../data/dishes';
import { PIN_COLORS } from '../data/dishes';
import Pic from './Pic';
import './foodmap.css';

/* ============================================================
   FoodMap — the signature interaction.
   A real photograph is "read": a scan sweep passes once, then
   annotation pins draw in over the exact things in the frame,
   each with an honest confidence.

   Pins are authored as % of the PHOTOGRAPH. The image renders
   with object-fit: cover, so we project photo-space → screen-
   space through the crop (scale + focal offset). Pins cropped
   out of frame are hidden rather than mispinned.

   Pure CSS animation — resilient in webviews; reduced-motion
   renders the final state instantly.
   ============================================================ */

interface Projected extends Pin {
  cx: number; // container %
  cy: number;
  visible: boolean;
}

function project(pins: Pin[], imgW: number, imgH: number, boxW: number, boxH: number, focus: [number, number]): Projected[] {
  if (!boxW || !boxH) return pins.map((p) => ({ ...p, cx: p.x, cy: p.y, visible: true }));
  const s = Math.max(boxW / imgW, boxH / imgH); // cover scale
  const dw = imgW * s;
  const dh = imgH * s;
  const ox = (boxW - dw) * (focus[0] / 100); // object-position offsets
  const oy = (boxH - dh) * (focus[1] / 100);
  return pins.map((p) => {
    const px = ox + (p.x / 100) * dw;
    const py = oy + (p.y / 100) * dh;
    const cx = (px / boxW) * 100;
    const cy = (py / boxH) * 100;
    return { ...p, cx, cy, visible: cx > 2 && cx < 98 && cy > 3 && cy < 97 };
  });
}

export default function FoodMap({
  dish,
  eager = false,
  editable = false,
  onEditPin,
  replayKey = 0,
  className,
}: {
  dish: Dish;
  eager?: boolean;
  editable?: boolean;
  onEditPin?: (index: number, pin: Pin) => void;
  replayKey?: number;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const boxRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState<[number, number]>([0, 0]);
  const focus = dish.focus ?? [50, 50];

  // Re-arm the sequence when the dish or replayKey changes.
  useEffect(() => {
    setArmed(false);
    const t = setTimeout(() => setArmed(true), 60);
    return () => clearTimeout(t);
  }, [dish.id, replayKey]);

  // Track container size so pin projection follows the crop.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setBox([el.clientWidth, el.clientHeight]);
    measure();
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const pins = project(dish.pins, dish.photo.w, dish.photo.h, box[0], box[1], focus);

  return (
    <figure ref={boxRef} className={`fmap ${armed ? 'is-armed' : ''} ${className ?? ''}`}>
      <Pic
        photo={dish.photo}
        alt={`${dish.title} — plated dish photograph`}
        eager={eager}
        objectPosition={`${focus[0]}% ${focus[1]}%`}
      />

      {/* one-pass scan sweep */}
      <div className="fmap__scan" aria-hidden="true" />

      {/* annotation layer */}
      <div className="fmap__pins" aria-hidden={!editable}>
        {pins.map((p, i) => {
          if (!p.visible) return null;
          const left = p.cx > 55;
          const Tag = editable ? 'button' : 'div';
          return (
            <Tag
              key={`${dish.id}-${i}`}
              className={`fpin ${left ? 'fpin--left' : ''}`}
              style={
                {
                  left: `${p.cx}%`,
                  top: `${p.cy}%`,
                  '--pin-c': PIN_COLORS[p.kind],
                  '--pin-delay': `${0.55 + i * 0.28}s`,
                } as React.CSSProperties
              }
              {...(editable
                ? { onClick: () => onEditPin?.(i, p), 'aria-label': `Edit detection: ${p.label}, ${p.conf}% confidence` }
                : {})}
            >
              <span className="fpin__dot" />
              <span className="fpin__line" />
              <span className="fpin__tag">
                <span className="fpin__label">{p.label}</span>
                <span className="fpin__conf num">{p.conf}%</span>
                {p.note && <span className="fpin__note">{p.note}</span>}
              </span>
            </Tag>
          );
        })}
      </div>

      {/* screen-reader narrative of the map */}
      <figcaption className="visually-hidden">
        Food Map of {dish.title}: {dish.pins.map((p) => `${p.label} (${p.conf}% confidence)`).join(', ')}. Sample analysis — simulated data.
      </figcaption>
    </figure>
  );
}
