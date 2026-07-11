import { useEffect, useRef, useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  Navigate,
} from 'react-router-dom';
import {
  DISHES,
  DISH_BY_SLUG,
  DISH_BY_ID,
  FULL_DISHES,
  costPerServing,
  recipeCost,
  type Pin,
} from '../data/dishes';
import { useStore, kitchenMatch, DAYS } from '../data/store';
import FoodMap from '../components/FoodMap';
import Pic from '../components/Pic';
import '../styles/product.css';

/* ================= Shell ================= */
export function ProductShell() {
  return (
    <div className="pshell">
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="pbar" aria-label="Product">
        <Link to="/" className="wordmark" style={{ fontSize: '1.2rem' }}>Dish<i>covery</i></Link>
        <div className="pbar__links">
          <NavLink to="/lens">Lens</NavLink>
          <NavLink to="/plan">Plan</NavLink>
          <NavLink to="/kitchen">Kitchen</NavLink>
        </div>
      </nav>
      <main className="pmain frame" id="main" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}

/* ================= Lens ================= */
export function Lens() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Honest demo behavior: uploads route to a sample map, clearly labeled.
    const pick = DISHES[f.size % DISHES.length];
    navigate(`/map/${pick.slug}?from=upload`);
  };

  return (
    <div>
      <div className="phead">
        <p className="sample-tag">Demo lens — analysis is simulated on sample plates</p>
        <h1 className="serif" style={{ marginTop: '0.7rem' }}>Point the Lens.</h1>
        <p>
          Pick a plate to map it. Uploads are matched to the nearest sample in
          this demo — live camera analysis ships with the app.
        </p>
      </div>
      <div className="lens-grid">
        <button className="lens-upload" onClick={() => fileRef.current?.click()}>
          <span>
            <span className="caps" style={{ display: 'block', marginBottom: '0.5rem' }}>Upload a photo</span>
            <span style={{ fontSize: 'var(--small)' }}>matched to a sample map</span>
          </span>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} aria-label="Upload a food photo" />
        </button>
        {DISHES.map((x) => (
          <Link key={x.id} to={`/map/${x.slug}`} className="lens-card" aria-label={`Map ${x.title}`}>
            <Pic photo={x.photo} alt="" />
            <span className="lens-card__veil" />
            <span className="lens-card__name">{x.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= Map ================= */
export function MapPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const base = slug ? DISH_BY_SLUG[slug] : undefined;
  const pinEdits = useStore((s) => s.pinEdits);
  const portionMap = useStore((s) => s.portion);
  const setPortion = useStore((s) => s.setPortion);
  const editPin = useStore((s) => s.editPin);
  const addKitchen = useStore((s) => s.addKitchen);
  const assign = useStore((s) => s.assign);
  const saved = useStore((s) => s.saved);
  const toggleSaved = useStore((s) => s.toggleSaved);
  const [editing, setEditing] = useState<{ i: number; pin: Pin } | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [replay, setReplay] = useState(0);

  if (!base) return <Navigate to="/lens" replace />;

  const edits = pinEdits[base.id] ?? {};
  const dish = {
    ...base,
    pins: base.pins.map((p, i) => (edits[i] ? { ...p, ...edits[i], conf: 100 } : p)),
  };
  const portion = portionMap[base.id] ?? 1;
  const r = (a: number, b: number) => `${Math.round(a * portion)}–${Math.round(b * portion)}`;
  const isSaved = saved.includes(base.id);

  return (
    <div>
      <div className="phead" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p className="sample-tag">Food Map — simulated sample analysis · every pin editable</p>
          <h1 className="serif" style={{ marginTop: '0.7rem' }}>{dish.title}</h1>
          <p>{dish.story}</p>
        </div>
        <button className="act act--bare" onClick={() => setReplay((x) => x + 1)}>↻ Replay scan</button>
      </div>

      <div className="map-layout">
        <div className="map-stage">
          <FoodMap dish={dish} eager editable replayKey={replay} onEditPin={(i, pin) => setEditing({ i, pin })} />
        </div>

        <aside className="map-rail" aria-label="Dish data">
          <div className="datacard">
            <div className="portion">
              <div className="portion__row">
                <span>My portion</span>
                <b className="num">{portion.toFixed(2)}×</b>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={portion}
                aria-label="Adjust portion size"
                aria-valuetext={`${portion.toFixed(2)} times the pictured portion`}
                onChange={(e) => setPortion(base.id, +e.target.value)}
              />
            </div>
            <dl className="dl" style={{ marginTop: '0.9rem' }}>
              <dt>Energy</dt>
              <dd>{r(...dish.kcal)} kcal</dd>
              <dt>Protein</dt>
              <dd>{r(...dish.protein)} g</dd>
              <dt>Carbs</dt>
              <dd>{r(...dish.carbs)} g</dd>
              <dt>Fat</dt>
              <dd>{r(...dish.fat)} g</dd>
              <dt>Confidence</dt>
              <dd style={{ color: dish.conf === 'high' ? 'var(--leaf)' : 'var(--amber)' }}>
                {dish.confPct}% · {dish.conf}
              </dd>
              <dt>Cost</dt>
              <dd>${costPerServing(dish).toFixed(2)} / serving</dd>
              <dt>Time</dt>
              <dd>{dish.minutes} min</dd>
            </dl>
            {dish.glycemicNote && (
              <p style={{ marginTop: '0.8rem', fontSize: 'var(--micro)', color: 'var(--leaf)' }}>{dish.glycemicNote}</p>
            )}
            <p style={{ marginTop: '0.8rem', fontSize: 'var(--micro)', color: 'var(--bone-40)' }}>
              Ranges, not false precision — portion is the biggest unknown in any photo.
            </p>
          </div>

          <div className="acts-col">
            <Link to={`/cookspace/${dish.slug}`} className="act act--signal">Cook it now</Link>
            <button
              className="act"
              onClick={() => {
                addKitchen(dish.pins.filter((p) => p.kind !== 'garnish').map((p) => p.label.split(',')[0]), 'map');
                navigate('/kitchen');
              }}
            >
              Use what I have
            </button>
            <button className="act" onClick={() => setPlanOpen((v) => !v)} aria-expanded={planOpen}>
              Add to weekly plan
            </button>
            {planOpen && (
              <div className="datacard" role="group" aria-label="Pick a day">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      className="act"
                      style={{ padding: '0.5rem 0.8rem' }}
                      onClick={() => {
                        assign(day, base.id);
                        setPlanOpen(false);
                        navigate('/plan');
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button className="act" aria-pressed={isSaved} onClick={() => toggleSaved(base.id)}>
              {isSaved ? '✓ Saved' : 'Save to archive'}
            </button>
          </div>
        </aside>
      </div>

      {/* Recreate */}
      <section style={{ marginTop: 'clamp(2.5rem,6vh,4rem)', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
        <div>
          <h2 className="serif" style={{ fontSize: 'var(--h2)' }}>Recreate it — ${recipeCost(dish).toFixed(2)} all in</h2>
          <table className="itable" style={{ marginTop: '1rem' }}>
            <tbody>
              {dish.ingredients.map((i) => (
                <tr key={i.name}>
                  <td>
                    {i.name} {i.qty && <span style={{ color: 'var(--bone-40)' }}>· {i.qty}</span>}{' '}
                    {i.staple && <span className="staple">pantry staple</span>}
                  </td>
                  <td className="num">${i.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="serif" style={{ fontSize: 'var(--h2)' }}>{dish.steps.length} movements</h2>
          <ol className="steps" style={{ marginTop: '1rem' }}>
            {dish.steps.map((s, i) => (
              <li key={i}>
                <span className="n num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  {s.text} {s.min ? <span style={{ color: 'var(--bone-40)', fontFamily: 'var(--mono)', fontSize: 'var(--micro)' }}> · {s.min}m</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {editing && (
        <PinEditor
          pin={editing.pin}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            editPin(base.id, editing.i, patch);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function PinEditor({ pin, onClose, onSave }: { pin: Pin; onClose: () => void; onSave: (p: Partial<Pin>) => void }) {
  const [label, setLabel] = useState(pin.label);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current?.querySelector<HTMLElement>('input');
    el?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="pedit" role="dialog" aria-modal="true" aria-label={`Correct detection: ${pin.label}`} onClick={onClose}>
      <div className="pedit__panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <h2 className="serif">Correct this detection</h2>
        <p style={{ color: 'var(--bone-60)', fontSize: 'var(--small)', marginTop: '0.4rem' }}>
          We scored this {pin.conf}%. You know your plate better than we do.
        </p>
        <label htmlFor="pin-label">What is it really?</label>
        <input id="pin-label" type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
        <div className="pedit__row">
          <button className="act act--signal" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onSave({ label })}>
            Save correction
          </button>
          <button className="act" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ================= Plan ================= */
export function PlanPage() {
  const plan = useStore((s) => s.plan);
  const assign = useStore((s) => s.assign);
  const unassign = useStore((s) => s.unassign);
  const autoPlan = useStore((s) => s.autoPlan);
  const days = DAYS;
  const total = days.reduce((sum, day) => {
    const dish = plan[day] ? DISH_BY_ID[plan[day]] : null;
    return sum + (dish ? costPerServing(dish) * 2 : 0);
  }, 0);

  return (
    <div>
      <div className="phead">
        <h1 className="serif">The week, plated.</h1>
        <p>Assign a mapped dish to each night. Costs assume two at the table.</p>
      </div>
      <button className="act act--signal" style={{ marginBottom: '1.1rem' }} onClick={autoPlan}>
        Auto-plan my week
      </button>
      <div className="week">
        {days.map((day) => {
          const dish = plan[day] ? DISH_BY_ID[plan[day]] : null;
          return (
            <div key={day} className="dayrow">
              <span className="dayrow__day">{day}</span>
              <span className="dayrow__thumb">{dish ? <Pic photo={dish.photo} alt="" /> : null}</span>
              <span>
                {dish ? (
                  <Link to={`/map/${dish.slug}`} style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem' }}>
                    {dish.title}
                  </Link>
                ) : (
                  <select
                    className="dayrow__pick"
                    aria-label={`Pick dinner for ${day}`}
                    defaultValue=""
                    onChange={(e) => e.target.value && assign(day, e.target.value)}
                  >
                    <option value="" disabled>Pick a dish…</option>
                    {FULL_DISHES.map((x) => (
                      <option key={x.id} value={x.id}>{x.title}</option>
                    ))}
                  </select>
                )}
              </span>
              <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {dish && (
                  <>
                    <span className="num" style={{ fontFamily: 'var(--mono)', color: 'var(--bone-40)', fontSize: 'var(--micro)' }}>
                      ${(costPerServing(dish) * 2).toFixed(2)}
                    </span>
                    <Link className="act act--bare" to={`/cookspace/${dish.slug}`}>Cook</Link>
                    <button className="act act--bare" aria-label={`Clear ${day}`} onClick={() => unassign(day)}>✕</button>
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <div className="plan-total">
        <span>WEEK TOTAL <b className="num" style={{ color: 'var(--signal)' }}>${total.toFixed(2)}</b></span>
        <span style={{ color: 'var(--bone-40)' }}>estimates from sample maps · 2 servings a night</span>
      </div>
    </div>
  );
}

/* ================= Kitchen ================= */
export function KitchenPage() {
  const kitchen = useStore((s) => s.kitchen);
  const addKitchen = useStore((s) => s.addKitchen);
  const removeKitchen = useStore((s) => s.removeKitchen);
  const [draft, setDraft] = useState('');
  const matches = FULL_DISHES
    .map((x) => ({ dish: x, ...kitchenMatch(x.id, kitchen) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  return (
    <div>
      <div className="phead">
        <h1 className="serif">What the kitchen holds.</h1>
        <p>Send ingredients here from any Food Map, or add them by hand. We rank tonight’s best matches.</p>
      </div>
      <div className="kitchen-grid">
        <div>
          <h2 className="caps caps--dim">Inventory · {kitchen.length}</h2>
          <ul>
            {kitchen.map((k) => (
              <li key={k.name} className="kitem">
                <span>
                  {k.name} <small>{k.from === 'map' ? 'from a map' : 'added by you'}</small>
                </span>
                <button className="act act--bare" aria-label={`Remove ${k.name}`} onClick={() => removeKitchen(k.name)}>✕</button>
              </li>
            ))}
            {kitchen.length === 0 && <li style={{ color: 'var(--bone-40)', paddingBlock: '0.6rem' }}>Empty — map a dish and tap “Use what I have.”</li>}
          </ul>
          <form
            className="kadd"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) addKitchen([draft.trim()], 'manual');
              setDraft('');
            }}
          >
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add an ingredient…" aria-label="Add an ingredient" />
            <button className="act" type="submit">Add</button>
          </form>
        </div>
        <div>
          <h2 className="caps caps--dim" style={{ marginBottom: '0.8rem' }}>Cook tonight</h2>
          {matches.map(({ dish, pct, missing }) => (
            <Link key={dish.id} to={`/map/${dish.slug}`} className="match">
              <span className="match__thumb"><Pic photo={dish.photo} alt="" /></span>
              <span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', display: 'block' }}>{dish.title}</span>
                <span style={{ color: 'var(--bone-40)', fontSize: 'var(--micro)', fontFamily: 'var(--mono)' }}>
                  {missing.length === 0 ? 'you have everything' : `missing: ${missing.slice(0, 3).join(', ')}`}
                </span>
              </span>
              <span className="match__pct num">{pct}%</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Cookspace ================= */
export function Cookspace() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dish = slug ? DISH_BY_SLUG[slug] : undefined;
  const [i, setI] = useState(0);
  const [secs, setSecs] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  const steps = dish?.steps ?? [];
  const step = steps[i];

  useEffect(() => {
    setSecs(step?.min ? Math.min(step.min, 99) * 60 : null);
    setRunning(false);
  }, [i, step?.min]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => (s === null ? s : Math.max(0, s - 1))), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (secs === 0 && running) setRunning(false);
  }, [secs, running]);

  // Screen wake lock — greasy hands, long simmers.
  useEffect(() => {
    let active = true;
    let lock: { release?: () => Promise<void> } | undefined;
    (async () => {
      try {
        const l = await (navigator as Navigator & { wakeLock?: { request: (t: string) => Promise<never> } }).wakeLock?.request('screen');
        if (active) lock = l ?? undefined;
        else (l as { release?: () => Promise<void> } | undefined)?.release?.();
      } catch { /* fine without it */ }
    })();
    return () => {
      active = false;
      lock?.release?.().catch(() => {});
    };
  }, []);

  // Kitchen keys: ← → step, T timer, Esc out.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'ArrowRight') setI((x) => Math.min(x + 1, steps.length - 1));
      else if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
      else if (e.key.toLowerCase() === 't' && step?.min) setRunning((r) => !r);
      else if (e.key === 'Escape' && dish) navigate(`/map/${dish.slug}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length, step?.min, dish, navigate]);

  if (!dish || steps.length === 0) return <Navigate to="/lens" replace />;

  const last = i === steps.length - 1;
  const mmss = secs !== null ? `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}` : null;

  return (
    <div className="cookspace">
      <div className="cookspace__bar">
        <button className="act act--bare" onClick={() => navigate(`/map/${dish.slug}`)}>✕ Exit</button>
        <span className="caps caps--dim">{dish.title}</span>
        <span className="caps num" style={{ color: 'var(--signal)' }}>
          {i + 1} / {steps.length}
        </span>
      </div>
      <div className="cookspace__progress"><i style={{ width: `${((i + 1) / steps.length) * 100}%` }} /></div>
      <div className="visually-hidden" role="status" aria-live="polite">
        Step {i + 1} of {steps.length}: {step.text}
      </div>
      <div className="cookspace__body">
        <p className="cookspace__step">{step.text}</p>
        {mmss && (
          <>
            <div className="cookspace__timer" aria-label={`Timer: ${mmss} remaining`}>{mmss}</div>
            <button
              className="act"
              style={{ marginTop: '0.9rem' }}
              onClick={() => {
                if (secs === 0 && step.min) {
                  setSecs(Math.min(step.min, 99) * 60);
                  setRunning(true);
                } else setRunning((r) => !r);
              }}
            >
              {running ? 'Pause' : secs === 0 ? 'Restart timer' : `Start ${step.label ?? 'timer'}`}
            </button>
          </>
        )}
        {step.tip && <p className="cookspace__tip">{step.tip}</p>}
      </div>
      <div className="cookspace__nav">
        <button className="act" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>← Back</button>
        {last ? (
          <Link to={`/map/${dish.slug}`} className="act act--signal">Plated — finish</Link>
        ) : (
          <button className="act act--signal" onClick={() => setI((x) => x + 1)}>Next step →</button>
        )}
      </div>
    </div>
  );
}
