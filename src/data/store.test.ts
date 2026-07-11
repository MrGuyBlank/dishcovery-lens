import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, kitchenMatch, DAYS } from './store';
import { FULL_DISHES } from './dishes';

beforeEach(() => {
  useStore.setState({ saved: [], plan: {}, kitchen: [], pinEdits: {}, portion: {} });
});

describe('store', () => {
  it('auto-plans all seven nights from full-depth dishes', () => {
    useStore.getState().autoPlan();
    const plan = useStore.getState().plan;
    expect(Object.keys(plan)).toHaveLength(7);
    for (const day of DAYS) expect(FULL_DISHES.some((d) => d.id === plan[day])).toBe(true);
  });

  it('dedupes kitchen items case-insensitively', () => {
    const { addKitchen } = useStore.getState();
    addKitchen(['Feta', 'feta', 'Basil'], 'map');
    addKitchen(['FETA'], 'manual');
    expect(useStore.getState().kitchen).toHaveLength(2);
  });

  it('kitchen match rises as ingredients are added', () => {
    const dish = FULL_DISHES[0];
    const empty = kitchenMatch(dish.id, []);
    useStore.getState().addKitchen(dish.ingredients.filter((i) => !i.staple).map((i) => i.name), 'map');
    const stocked = kitchenMatch(dish.id, useStore.getState().kitchen);
    expect(stocked.pct).toBeGreaterThan(empty.pct);
    expect(stocked.missing).toHaveLength(0);
  });

  it('pin edits are stored per dish and marked user-certain on read', () => {
    useStore.getState().editPin('burger', 0, { label: 'Sesame crown' });
    expect(useStore.getState().pinEdits.burger[0].label).toBe('Sesame crown');
  });
});
