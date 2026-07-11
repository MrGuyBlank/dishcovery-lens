import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DISHES, DISH_BY_ID, type Pin } from './dishes';

/* App state: everything the Lens→Map→Recreate→Plan→Kitchen→Cookspace
   journey needs to feel connected. Persisted locally. */

export interface KitchenItem {
  name: string;
  from: 'map' | 'manual';
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

interface State {
  saved: string[]; // dish ids
  toggleSaved: (id: string) => void;

  plan: Record<string, string>; // day -> dish id
  assign: (day: string, id: string) => void;
  unassign: (day: string) => void;
  autoPlan: () => void;

  kitchen: KitchenItem[];
  addKitchen: (names: string[], from: KitchenItem['from']) => void;
  removeKitchen: (name: string) => void;

  /* honest editing: user corrections to Food Map pins, per dish */
  pinEdits: Record<string, Record<number, Partial<Pin>>>;
  editPin: (dishId: string, index: number, patch: Partial<Pin>) => void;

  portion: Record<string, number>; // dish id -> multiplier
  setPortion: (dishId: string, v: number) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      saved: [],
      toggleSaved: (id) =>
        set((s) => ({
          saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved],
        })),

      plan: {},
      assign: (day, id) => set((s) => ({ plan: { ...s.plan, [day]: id } })),
      unassign: (day) =>
        set((s) => {
          const p = { ...s.plan };
          delete p[day];
          return { plan: p };
        }),
      autoPlan: () => {
        const pool = DISHES.filter((x) => x.full);
        const plan: Record<string, string> = {};
        DAYS.forEach((day, i) => {
          plan[day] = pool[(i * 3 + 1) % pool.length].id;
        });
        set({ plan });
      },

      kitchen: [],
      addKitchen: (names, from) =>
        set((s) => {
          const have = new Set(s.kitchen.map((k) => k.name.toLowerCase()));
          const fresh: KitchenItem[] = [];
          for (const name of names) {
            const key = name.toLowerCase();
            if (have.has(key)) continue; // dedupe across state AND batch
            have.add(key);
            fresh.push({ name, from });
          }
          return { kitchen: [...fresh, ...s.kitchen] };
        }),
      removeKitchen: (name) =>
        set((s) => ({ kitchen: s.kitchen.filter((k) => k.name !== name) })),

      pinEdits: {},
      editPin: (dishId, index, patch) =>
        set((s) => ({
          pinEdits: {
            ...s.pinEdits,
            [dishId]: { ...(s.pinEdits[dishId] ?? {}), [index]: { ...(s.pinEdits[dishId]?.[index] ?? {}), ...patch } },
          },
        })),

      portion: {},
      setPortion: (dishId, v) => set((s) => ({ portion: { ...s.portion, [dishId]: v } })),
    }),
    { name: 'dishcovery-lens-v1', version: 1 }
  )
);

/** Dish with the user's pin corrections applied. */
export function correctedDish(id: string) {
  const dish = DISH_BY_ID[id];
  const edits = useStore.getState().pinEdits[id];
  if (!dish || !edits) return dish;
  return {
    ...dish,
    pins: dish.pins.map((p, i) => (edits[i] ? { ...p, ...edits[i], conf: 100 } : p)),
  };
}

/** Meaningful word tokens for loose ingredient matching. */
const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 3 && !['with', 'fresh', 'sliced', 'ground'].includes(t));

/** How much of a dish's shopping list the kitchen already covers.
    Token-overlap matching so "Beef & pork ragù" (from a map pin)
    satisfies "Ground beef & pork" (an ingredient line). */
export function kitchenMatch(id: string, kitchen: KitchenItem[]) {
  const dish = DISH_BY_ID[id];
  if (!dish) return { pct: 0, missing: [] as string[] };
  const haveTokens = new Set(kitchen.flatMap((k) => tokens(k.name)));
  const need = dish.ingredients.filter((i) => !i.staple);
  const missing = need
    .filter((i) => !tokens(i.name).some((t) => haveTokens.has(t)))
    .map((i) => i.name);
  const pct = need.length === 0 ? 100 : Math.round(((need.length - missing.length) / need.length) * 100);
  return { pct, missing };
}

export { DAYS };
