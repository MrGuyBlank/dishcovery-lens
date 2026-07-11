import { describe, it, expect } from 'vitest';
import { DISHES, DISH_BY_SLUG, costPerServing, recipeCost } from './dishes';
import { PHOTOS } from './photos';

describe('dish data integrity', () => {
  it('has at least 12 dishes, 8 with full recipe depth', () => {
    expect(DISHES.length).toBeGreaterThanOrEqual(12);
    expect(DISHES.filter((d) => d.full).length).toBeGreaterThanOrEqual(8);
  });

  it('binds every dish to a real photo with dimensions and LQIP', () => {
    for (const d of DISHES) {
      expect(d.photo, d.id).toBeTruthy();
      expect(d.photo.w).toBeGreaterThan(400);
      expect(d.photo.h).toBeGreaterThan(300);
      expect(d.photo.lqip.startsWith('data:image/jpeg;base64,')).toBe(true);
    }
  });

  it('keeps every Food Map pin inside the frame with honest confidence', () => {
    for (const d of DISHES) {
      expect(d.pins.length, d.id).toBeGreaterThanOrEqual(3);
      for (const p of d.pins) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(100);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(100);
        expect(p.conf).toBeGreaterThanOrEqual(50);
        expect(p.conf).toBeLessThanOrEqual(100);
      }
    }
  });

  it('publishes nutrition as ranges (low < high), never point estimates', () => {
    for (const d of DISHES) {
      for (const [lo, hi] of [d.kcal, d.protein, d.carbs, d.fat]) {
        expect(lo).toBeLessThan(hi);
      }
    }
  });

  it('has unique slugs and coherent cost math', () => {
    expect(new Set(DISHES.map((d) => d.slug)).size).toBe(DISHES.length);
    for (const d of DISHES) {
      expect(DISH_BY_SLUG[d.slug].id).toBe(d.id);
      expect(recipeCost(d)).toBeGreaterThan(0);
      expect(costPerServing(d)).toBeLessThan(20);
    }
  });

  it('references only photos that exist in the manifest', () => {
    const srcs = new Set(Object.values(PHOTOS).map((p) => p.src));
    for (const d of DISHES) expect(srcs.has(d.photo.src), d.id).toBe(true);
  });
});
