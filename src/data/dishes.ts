import { PHOTOS, type Photo } from './photos';

/* ============================================================
   Dish data — every entry is bound to a real photograph and its
   Food Map: annotation pins whose x/y coordinates were placed by
   a human looking at that exact photo. All analysis figures are
   SAMPLE data (simulated) and labeled as such in the UI.
   ============================================================ */

export type PinKind = 'protein' | 'produce' | 'carb' | 'sauce' | 'garnish' | 'dairy';
export type Conf = 'high' | 'medium' | 'low';

export interface Pin {
  x: number; // % from left
  y: number; // % from top
  label: string;
  kind: PinKind;
  conf: number; // 0-100
  note?: string;
}

export interface IngredientLine {
  name: string;
  qty: string;
  cost: number; // USD for recipe quantity
  staple?: boolean; // likely already in the kitchen
}

export interface Step {
  text: string;
  min?: number; // timer minutes
  label?: string;
  tip?: string;
}

export interface Dish {
  id: string;
  slug: string;
  title: string;
  cuisine: string;
  story: string; // one editorial line
  photo: Photo;
  /** focal point (% of image) the crop should keep in frame */
  focus?: [number, number];
  pins: Pin[];
  conf: Conf;
  confPct: number;
  kcal: [number, number]; // honest range
  protein: [number, number];
  carbs: [number, number];
  fat: [number, number];
  glycemicNote?: string;
  servings: number;
  minutes: number;
  ingredients: IngredientLine[];
  steps: Step[];
  tags: string[];
  full: boolean; // has complete recipe depth
}

const d = (x: Omit<Dish, 'photo'> & { photoKey: string }): Dish => {
  const { photoKey, ...rest } = x;
  return { ...rest, photo: PHOTOS[photoKey] };
};

export const DISHES: Dish[] = [
  d({
    id: 'lasagna',
    slug: 'sunday-lasagna',
    title: 'Sunday Lasagna al Forno',
    cuisine: 'Italian',
    story: 'Nine layers, one hour of patience, zero regrets.',
    photoKey: 'lasagna',
    focus: [50, 44],
    conf: 'high',
    confPct: 93,
    kcal: [520, 610],
    protein: [28, 34],
    carbs: [42, 50],
    fat: [26, 33],
    glycemicNote: 'Moderate glycemic load — the protein and fat slow the curve.',
    servings: 6,
    minutes: 85,
    tags: ['comfort', 'bake', 'make-ahead'],
    pins: [
      { x: 64, y: 30, label: 'Fresh basil', kind: 'garnish', conf: 97 },
      { x: 55, y: 42, label: 'Mozzarella, molten', kind: 'dairy', conf: 91 },
      { x: 60, y: 56, label: 'Beef & pork ragù', kind: 'protein', conf: 88, note: 'could be beef-only' },
      { x: 33, y: 48, label: 'Pasta sheets ×9', kind: 'carb', conf: 94 },
      { x: 22, y: 66, label: 'Matte black plate', kind: 'garnish', conf: 99 },
    ],
    ingredients: [
      { name: 'Lasagna sheets', qty: '12', cost: 2.4 },
      { name: 'Ground beef & pork', qty: '1.5 lb', cost: 8.9 },
      { name: 'Crushed tomatoes', qty: '2 cans', cost: 2.6 },
      { name: 'Mozzarella', qty: '1 lb', cost: 4.8 },
      { name: 'Parmesan', qty: '4 oz', cost: 3.2 },
      { name: 'Whole milk', qty: '2 cups', cost: 0.7, staple: true },
      { name: 'Butter & flour', qty: 'for béchamel', cost: 0.6, staple: true },
      { name: 'Onion, garlic, basil', qty: '', cost: 1.4, staple: true },
    ],
    steps: [
      { text: 'Brown the meat hard; let it crust before stirring.', min: 8, label: 'Brown' },
      { text: 'Add tomatoes, onion, garlic; simmer the ragù low and slow.', min: 30, label: 'Ragù', tip: 'A splash of milk in the ragù is the old Bologna trick — it softens the acidity.' },
      { text: 'Whisk butter, flour, then milk into a silky béchamel.', min: 8, label: 'Béchamel' },
      { text: 'Layer: ragù, sheets, béchamel, mozzarella — three rounds.' },
      { text: 'Bake at 400°F until bronzed and bubbling at the edges.', min: 35, label: 'Bake' },
      { text: 'Rest 15 minutes before cutting — the layers need to set.', min: 15, label: 'Rest' },
    ],
    full: true,
  }),
  d({
    id: 'burger',
    slug: 'smash-stack-burger',
    title: 'The Smash-Stack Burger',
    cuisine: 'American',
    story: 'A steakhouse burger that never saw a drive-through.',
    photoKey: 'burger',
    focus: [50, 48],
    conf: 'high',
    confPct: 95,
    kcal: [680, 790],
    protein: [38, 45],
    carbs: [40, 47],
    fat: [38, 46],
    servings: 2,
    minutes: 25,
    tags: ['grill', 'fast', 'crowd-pleaser'],
    pins: [
      { x: 50, y: 18, label: 'Brioche crown', kind: 'carb', conf: 96 },
      { x: 52, y: 40, label: 'Beefsteak tomato', kind: 'produce', conf: 93 },
      { x: 43, y: 51, label: 'Iceberg, shaved', kind: 'produce', conf: 90 },
      { x: 51, y: 58, label: 'Double smashed patty', kind: 'protein', conf: 92, note: 'cheddar between' },
      { x: 63, y: 88, label: "Bird's-eye chili", kind: 'garnish', conf: 85 },
    ],
    ingredients: [
      { name: 'Ground chuck 80/20', qty: '14 oz', cost: 6.2 },
      { name: 'Brioche buns', qty: '2', cost: 2.0 },
      { name: 'Cheddar slices', qty: '4', cost: 1.4 },
      { name: 'Beefsteak tomato', qty: '1', cost: 1.1 },
      { name: 'Iceberg lettuce', qty: '¼ head', cost: 0.7 },
      { name: 'Mayo, mustard, pickle brine', qty: '', cost: 0.5, staple: true },
    ],
    steps: [
      { text: 'Loosely form four 3.5 oz pucks. Salt only the outside.' },
      { text: 'Smash each puck hard on a ripping pan; do not move it.', min: 2, label: 'Smash' },
      { text: 'Flip once, lace with cheddar, stack in pairs.', min: 2, label: 'Flip' },
      { text: 'Toast buns in the beef fat; sauce, stack, and eat standing up.', tip: 'The lacy brown edge is the whole point — scrape it off the pan and onto the bun.' },
    ],
    full: true,
  }),
  d({
    id: 'pomodoro',
    slug: 'weeknight-pomodoro',
    title: 'Weeknight Pomodoro',
    cuisine: 'Italian',
    story: 'Six ingredients. Twenty minutes. The fork does the talking.',
    photoKey: 'pomodoro',
    conf: 'high',
    confPct: 91,
    kcal: [430, 510],
    protein: [14, 18],
    carbs: [62, 72],
    fat: [12, 16],
    glycemicNote: 'Cook the pasta truly al dente to keep the glycemic load in check.',
    servings: 3,
    minutes: 20,
    tags: ['fast', 'vegetarian', 'pantry'],
    pins: [
      { x: 48, y: 26, label: 'Spaghetti, al dente', kind: 'carb', conf: 95 },
      { x: 55, y: 18, label: 'Baby spinach', kind: 'produce', conf: 89 },
      { x: 26, y: 64, label: 'Cherry tomatoes, burst', kind: 'produce', conf: 92 },
      { x: 31, y: 45, label: 'Fresh mozzarella', kind: 'dairy', conf: 84, note: 'or burrata' },
      { x: 70, y: 56, label: 'Cracked pepper & oil', kind: 'sauce', conf: 88 },
    ],
    ingredients: [
      { name: 'Spaghetti', qty: '10 oz', cost: 1.3 },
      { name: 'Cherry tomatoes', qty: '1 pint', cost: 2.4 },
      { name: 'Fresh mozzarella', qty: '4 oz', cost: 2.6 },
      { name: 'Baby spinach', qty: '2 cups', cost: 1.2 },
      { name: 'Garlic & chili flake', qty: '', cost: 0.3, staple: true },
      { name: 'Good olive oil', qty: '3 tbsp', cost: 0.5, staple: true },
    ],
    steps: [
      { text: 'Boil spaghetti in violently salted water; save a cup of the water.', min: 9, label: 'Boil' },
      { text: 'Burst tomatoes in olive oil with garlic until they collapse into sauce.', min: 6, label: 'Burst' },
      { text: 'Toss pasta with splashes of pasta water until glossy; fold in spinach.', tip: 'The starch in the water is the sauce — add it a splash at a time.' },
      { text: 'Tear mozzarella over the top off the heat.' },
    ],
    full: true,
  }),
  d({
    id: 'bulgogi',
    slug: 'seoul-bulgogi-skillet',
    title: 'Seoul Bulgogi Skillet',
    cuisine: 'Korean',
    story: 'Sweet soy, char, and a cast-iron pan doing its loudest work.',
    photoKey: 'bulgogi',
    conf: 'medium',
    confPct: 78,
    kcal: [540, 660],
    protein: [34, 42],
    carbs: [28, 38],
    fat: [28, 36],
    servings: 3,
    minutes: 30,
    tags: ['skillet', 'marinade', 'high-protein'],
    pins: [
      { x: 50, y: 50, label: 'Marinated ribeye', kind: 'protein', conf: 82, note: 'possibly brisket cut' },
      { x: 52, y: 28, label: 'Scallion & sesame', kind: 'garnish', conf: 90 },
      { x: 86, y: 72, label: 'Kimchi, aged', kind: 'produce', conf: 76 },
      { x: 12, y: 78, label: 'Pickled greens', kind: 'produce', conf: 71 },
      { x: 30, y: 62, label: 'Pan glaze', kind: 'sauce', conf: 80, note: 'soy · pear · garlic' },
    ],
    ingredients: [
      { name: 'Ribeye, shaved thin', qty: '1 lb', cost: 9.8 },
      { name: 'Soy sauce & sesame oil', qty: '', cost: 0.6, staple: true },
      { name: 'Asian pear (or apple)', qty: '½', cost: 0.9 },
      { name: 'Garlic & ginger', qty: '', cost: 0.5, staple: true },
      { name: 'Scallions', qty: '3', cost: 0.6 },
      { name: 'Steamed rice', qty: 'to serve', cost: 0.8, staple: true },
      { name: 'Kimchi', qty: 'to serve', cost: 1.5 },
    ],
    steps: [
      { text: 'Blitz pear, soy, sesame, garlic, ginger; marinate the beef.', min: 15, label: 'Marinate' },
      { text: 'Sear in a screaming cast iron in single layers — char is flavor.', min: 6, label: 'Sear' },
      { text: 'Rest a moment, shower with scallion and sesame, serve over rice.', tip: 'Crowd the pan and it steams; work in two rounds instead.' },
    ],
    full: true,
  }),
  d({
    id: 'tacos',
    slug: 'street-tacos-al-pastor',
    title: 'Street Tacos al Pastor',
    cuisine: 'Mexican',
    story: 'Marinated, charred, and gone in three bites.',
    photoKey: 'tacos',
    focus: [48, 58],
    conf: 'medium',
    confPct: 74,
    kcal: [380, 470],
    protein: [24, 30],
    carbs: [34, 42],
    fat: [16, 22],
    glycemicNote: 'Corn tortillas keep this friendlier than flour — good fiber-to-carb ratio.',
    servings: 4,
    minutes: 35,
    tags: ['street-food', 'char', 'weekend'],
    pins: [
      { x: 50, y: 46, label: 'Guacamole', kind: 'sauce', conf: 88 },
      { x: 44, y: 60, label: 'Chicken al pastor', kind: 'protein', conf: 72, note: 'pork traditional' },
      { x: 59, y: 64, label: 'Shaved cabbage', kind: 'produce', conf: 81 },
      { x: 34, y: 76, label: 'Corn tortilla ×2', kind: 'carb', conf: 90 },
      { x: 16, y: 48, label: 'Lime, fresh cut', kind: 'garnish', conf: 93 },
    ],
    ingredients: [
      { name: 'Chicken thighs', qty: '1.25 lb', cost: 5.6 },
      { name: 'Achiote + chipotle marinade', qty: '', cost: 1.8 },
      { name: 'Corn tortillas', qty: '12', cost: 1.6 },
      { name: 'Pineapple', qty: '½ cup', cost: 1.0 },
      { name: 'Avocados', qty: '2', cost: 2.4 },
      { name: 'Cabbage, lime, cilantro', qty: '', cost: 1.7 },
    ],
    steps: [
      { text: 'Marinate chicken in achiote, chipotle, pineapple juice.', min: 20, label: 'Marinate' },
      { text: 'Char hard on a grill or skillet with pineapple pieces.', min: 8, label: 'Char' },
      { text: 'Rest, chop, and pile onto doubled warm tortillas.', tip: 'Warm tortillas over open flame until they just blister.' },
      { text: 'Guacamole, cabbage, lime. No cheese — this one doesn’t need it.' },
    ],
    full: true,
  }),
  d({
    id: 'teriyaki',
    slug: 'sesame-teriyaki-bowl',
    title: 'Sesame Teriyaki Bowl',
    cuisine: 'Japanese-inspired',
    story: 'Lacquered chicken over the crunchiest slaw in the building.',
    photoKey: 'teriyaki',
    conf: 'high',
    confPct: 89,
    kcal: [510, 590],
    protein: [36, 42],
    carbs: [46, 54],
    fat: [18, 24],
    servings: 2,
    minutes: 25,
    tags: ['bowl', 'glaze', 'high-protein'],
    pins: [
      { x: 38, y: 64, label: 'Glazed chicken thigh', kind: 'protein', conf: 92 },
      { x: 56, y: 34, label: 'Carrot ribbon slaw', kind: 'produce', conf: 88 },
      { x: 47, y: 22, label: 'Baby greens', kind: 'produce', conf: 85 },
      { x: 69, y: 55, label: 'Lemon, charred', kind: 'garnish', conf: 80 },
      { x: 45, y: 78, label: 'Toasted sesame', kind: 'garnish', conf: 94 },
    ],
    ingredients: [
      { name: 'Chicken thighs', qty: '1 lb', cost: 4.8 },
      { name: 'Soy, mirin, honey', qty: '', cost: 1.1, staple: true },
      { name: 'Carrots', qty: '2', cost: 0.6 },
      { name: 'Cabbage & greens', qty: '2 cups', cost: 1.4 },
      { name: 'Rice', qty: '1.5 cups', cost: 0.7, staple: true },
      { name: 'Sesame seeds', qty: '', cost: 0.2, staple: true },
    ],
    steps: [
      { text: 'Sear thighs skin-down until deeply golden.', min: 7, label: 'Sear' },
      { text: 'Reduce soy, mirin, honey to a lacquer; glaze the chicken.', min: 5, label: 'Glaze' },
      { text: 'Build bowls: rice, slaw, sliced chicken, sesame everywhere.' },
    ],
    full: true,
  }),
  d({
    id: 'lomein',
    slug: 'wok-tossed-lo-mein',
    title: 'Wok-Tossed Lo Mein',
    cuisine: 'Chinese',
    story: 'Fifteen minutes, one wok, and takeout loses a customer.',
    photoKey: 'lomein',
    conf: 'medium',
    confPct: 81,
    kcal: [460, 550],
    protein: [16, 22],
    carbs: [64, 74],
    fat: [14, 19],
    servings: 3,
    minutes: 15,
    tags: ['wok', 'fast', 'vegetarian-option'],
    pins: [
      { x: 50, y: 44, label: 'Fresh lo mein noodles', kind: 'carb', conf: 87 },
      { x: 29, y: 55, label: 'Bamboo chopsticks', kind: 'garnish', conf: 96 },
      { x: 65, y: 40, label: 'Red pepper, flash-fried', kind: 'produce', conf: 84 },
      { x: 76, y: 61, label: 'Bok choy', kind: 'produce', conf: 79 },
      { x: 42, y: 68, label: 'Soy-oyster gloss', kind: 'sauce', conf: 82 },
    ],
    ingredients: [
      { name: 'Fresh lo mein noodles', qty: '12 oz', cost: 2.8 },
      { name: 'Bok choy & peppers', qty: '3 cups', cost: 2.6 },
      { name: 'Soy + oyster sauce', qty: '', cost: 0.7, staple: true },
      { name: 'Garlic & ginger', qty: '', cost: 0.4, staple: true },
      { name: 'Sesame oil', qty: '1 tbsp', cost: 0.3, staple: true },
    ],
    steps: [
      { text: 'Blanch noodles 60 seconds; drain and oil them.', min: 1, label: 'Blanch' },
      { text: 'Flash-fry vegetables in a smoking wok.', min: 3, label: 'Wok' },
      { text: 'Noodles in, sauce around the rim, toss violently.', min: 2, label: 'Toss', tip: 'Sauce down the hot wok wall — it caramelizes on the way to the noodles.' },
    ],
    full: true,
  }),
  d({
    id: 'greek-salad',
    slug: 'midnight-greek-salad',
    title: 'Midnight Greek Salad',
    cuisine: 'Greek',
    story: 'Feta like marble, tomatoes like stained glass.',
    photoKey: 'greek-salad',
    focus: [50, 50],
    conf: 'high',
    confPct: 90,
    kcal: [280, 340],
    protein: [9, 13],
    carbs: [14, 19],
    fat: [21, 27],
    glycemicNote: 'Very low glycemic load — an easy yes for blood-sugar-conscious eating.',
    servings: 2,
    minutes: 10,
    tags: ['no-cook', 'low-carb', 'fresh'],
    pins: [
      { x: 52, y: 41, label: 'Feta, barrel-aged', kind: 'dairy', conf: 91 },
      { x: 61, y: 55, label: 'Cherry tomatoes', kind: 'produce', conf: 94 },
      { x: 44, y: 61, label: 'Kalamata olives', kind: 'produce', conf: 86 },
      { x: 40, y: 34, label: 'Frisée & cucumber', kind: 'produce', conf: 83 },
      { x: 50, y: 84, label: 'Oregano oil', kind: 'sauce', conf: 78 },
    ],
    ingredients: [
      { name: 'Feta block', qty: '6 oz', cost: 3.9 },
      { name: 'Cherry tomatoes', qty: '1 pint', cost: 2.4 },
      { name: 'Kalamata olives', qty: '½ cup', cost: 1.8 },
      { name: 'Cucumber & frisée', qty: '', cost: 1.9 },
      { name: 'Olive oil & oregano', qty: '', cost: 0.5, staple: true },
    ],
    steps: [
      { text: 'Cut everything big — this is a knife salad, not a toss salad.' },
      { text: 'Lay feta in slabs, never crumbles.' },
      { text: 'Oil, oregano, flaky salt. Serve within ten minutes.' },
    ],
    full: true,
  }),

  /* Gallery-depth dishes (photographed, mapped lightly) */
  d({
    id: 'pizza-fire', slug: 'fire-blistered-margherita', title: 'Fire-Blistered Margherita', cuisine: 'Italian',
    story: 'Ninety seconds in front of live flame.', photoKey: 'pizza-fire', conf: 'medium', confPct: 77,
    kcal: [540, 640], protein: [20, 26], carbs: [64, 74], fat: [20, 27], servings: 2, minutes: 90,
    tags: ['wood-fire', 'weekend'], pins: [
      { x: 30, y: 60, label: 'Leopard-spotted crust', kind: 'carb', conf: 85 },
      { x: 12, y: 30, label: 'Live oak fire', kind: 'garnish', conf: 98 },
      { x: 55, y: 45, label: 'Buffalo mozzarella', kind: 'dairy', conf: 74 },
    ],
    ingredients: [{ name: '00 flour dough', qty: '2 balls', cost: 2.2 }, { name: 'San Marzano tomatoes', qty: '1 can', cost: 2.8 }, { name: 'Buffalo mozzarella', qty: '8 oz', cost: 5.4 }, { name: 'Basil & oil', qty: '', cost: 0.8, staple: true }],
    steps: [{ text: 'Cold-ferment the dough 48 hours.', min: 2880, label: 'Ferment' }, { text: 'Stretch, sauce sparingly, fire at max heat.', min: 2, label: 'Fire' }],
    full: false,
  }),
  d({
    id: 'noodle-soup', slug: 'saigon-noodle-soup', title: 'Saigon Noodle Soup', cuisine: 'Vietnamese',
    story: 'A broth that took its time, noodles that didn’t.', photoKey: 'noodle-soup', conf: 'medium', confPct: 72,
    kcal: [390, 470], protein: [22, 28], carbs: [52, 60], fat: [8, 13], servings: 2, minutes: 40,
    tags: ['broth', 'fresh-herbs'], pins: [
      { x: 50, y: 55, label: 'Rice noodles', kind: 'carb', conf: 88 },
      { x: 40, y: 35, label: 'Poached shrimp', kind: 'protein', conf: 70, note: 'or chicken' },
      { x: 68, y: 30, label: 'Mint & chili', kind: 'garnish', conf: 90 },
    ],
    ingredients: [{ name: 'Rice noodles', qty: '8 oz', cost: 1.9 }, { name: 'Shrimp', qty: '½ lb', cost: 5.5 }, { name: 'Aromatics + fish sauce', qty: '', cost: 1.8 }, { name: 'Herbs & lime', qty: '', cost: 1.6 }],
    steps: [{ text: 'Simmer aromatic broth.', min: 25, label: 'Broth' }, { text: 'Poach shrimp gently; assemble over noodles.', min: 4, label: 'Poach' }],
    full: false,
  }),
  d({
    id: 'pav-bhaji', slug: 'mumbai-pav-bhaji', title: 'Mumbai Pav Bhaji', cuisine: 'Indian',
    story: 'Butter-griddled rolls and a curry that eats like a hug.', photoKey: 'pav-bhaji', conf: 'medium', confPct: 76,
    kcal: [470, 560], protein: [12, 16], carbs: [58, 68], fat: [20, 26], servings: 4, minutes: 45,
    tags: ['street-food', 'vegetarian'], pins: [
      { x: 38, y: 62, label: 'Mashed vegetable bhaji', kind: 'produce', conf: 84 },
      { x: 42, y: 25, label: 'Pav rolls, buttered', kind: 'carb', conf: 92 },
      { x: 55, y: 72, label: 'Raw onion & lime', kind: 'garnish', conf: 89 },
    ],
    ingredients: [{ name: 'Potatoes, peas, peppers', qty: '4 cups', cost: 3.2 }, { name: 'Pav bhaji masala', qty: '2 tbsp', cost: 0.9 }, { name: 'Soft rolls', qty: '8', cost: 2.4 }, { name: 'Butter', qty: 'plenty', cost: 1.2, staple: true }],
    steps: [{ text: 'Boil and mash the vegetables into the spiced butter.', min: 20, label: 'Bhaji' }, { text: 'Griddle rolls in butter until gold.', min: 3, label: 'Griddle' }],
    full: false,
  }),
  d({
    id: 'pancakes', slug: 'salted-caramel-pancakes', title: 'Salted-Caramel Stack', cuisine: 'Breakfast',
    story: 'Sunday morning, stacked seven high.', photoKey: 'pancakes', conf: 'high', confPct: 92,
    kcal: [610, 720], protein: [12, 16], carbs: [88, 98], fat: [22, 28], servings: 2, minutes: 25,
    tags: ['sweet', 'weekend'], pins: [
      { x: 45, y: 45, label: 'Buttermilk stack ×7', kind: 'carb', conf: 95 },
      { x: 50, y: 22, label: 'Strawberries & blueberries', kind: 'produce', conf: 93 },
      { x: 60, y: 60, label: 'Salted caramel', kind: 'sauce', conf: 87 },
      { x: 82, y: 35, label: 'Chantilly', kind: 'dairy', conf: 81 },
    ],
    ingredients: [{ name: 'Buttermilk pancake batter', qty: '', cost: 2.1 }, { name: 'Berries', qty: '1 cup', cost: 3.4 }, { name: 'Caramel + flaky salt', qty: '', cost: 1.3 }],
    steps: [{ text: 'Ladle, wait for bubbles, flip once.', min: 3, label: 'Griddle' }, { text: 'Stack tall; caramel over the edge.', tip: 'First pancake is the cook’s tax. Eat it.' }],
    full: false,
  }),
  d({
    id: 'sushi', slug: 'garden-maki', title: 'Garden Maki Board', cuisine: 'Japanese',
    story: 'Cucumber-cool, rolled tight, cut clean.', photoKey: 'sushi', conf: 'high', confPct: 88,
    kcal: [310, 380], protein: [7, 10], carbs: [58, 66], fat: [4, 7], servings: 2, minutes: 40,
    tags: ['no-cook', 'light'], pins: [
      { x: 45, y: 50, label: 'Cucumber-avocado maki', kind: 'produce', conf: 90 },
      { x: 84, y: 30, label: 'Chopsticks', kind: 'garnish', conf: 97 },
      { x: 68, y: 18, label: 'Carrot rose', kind: 'garnish', conf: 86 },
    ],
    ingredients: [{ name: 'Sushi rice', qty: '2 cups', cost: 1.8 }, { name: 'Nori', qty: '4 sheets', cost: 1.6 }, { name: 'Cucumber, avocado, carrot', qty: '', cost: 2.9 }],
    steps: [{ text: 'Season warm rice with vinegar; fan it glossy.', min: 5, label: 'Rice' }, { text: 'Roll firm, wet the knife, cut in one motion.', label: 'Roll' }],
    full: false,
  }),
  d({
    id: 'veggie-bowl', slug: 'market-harvest-bowl', title: 'Market Harvest Bowl', cuisine: 'Californian',
    story: 'Whatever the market had, roasted until sweet.', photoKey: 'veggie-bowl', conf: 'high', confPct: 87,
    kcal: [420, 500], protein: [13, 17], carbs: [52, 62], fat: [16, 22],
    glycemicNote: 'High fiber, high color — gentle glycemic profile.',
    servings: 2, minutes: 35,
    tags: ['vegan', 'meal-prep'], pins: [
      { x: 50, y: 52, label: 'Charred brussels & squash', kind: 'produce', conf: 89 },
      { x: 40, y: 38, label: 'Herbed quinoa', kind: 'carb', conf: 85 },
      { x: 14, y: 20, label: 'Zucchini, raw-shaved', kind: 'produce', conf: 82 },
      { x: 12, y: 62, label: 'Lime & tomato mise', kind: 'garnish', conf: 91 },
    ],
    ingredients: [{ name: 'Seasonal vegetables', qty: '5 cups', cost: 5.4 }, { name: 'Quinoa', qty: '1 cup', cost: 1.7 }, { name: 'Tahini-lime dressing', qty: '', cost: 1.1 }],
    steps: [{ text: 'Roast vegetables hot until edges char.', min: 22, label: 'Roast' }, { text: 'Bowl over quinoa; dress at the table.' }],
    full: false,
  }),
];

export const DISH_BY_SLUG = Object.fromEntries(DISHES.map((x) => [x.slug, x]));
export const DISH_BY_ID = Object.fromEntries(DISHES.map((x) => [x.id, x]));
export const FULL_DISHES = DISHES.filter((x) => x.full);

export const recipeCost = (x: Dish) => x.ingredients.reduce((s, i) => s + i.cost, 0);
export const costPerServing = (x: Dish) => recipeCost(x) / x.servings;
export const kcalLabel = (x: Dish) => `${x.kcal[0]}–${x.kcal[1]}`;

export const PIN_COLORS: Record<PinKind, string> = {
  protein: '#ff5c38',
  produce: '#9dc86c',
  carb: '#eab04c',
  sauce: '#e8875a',
  garnish: '#c9c2b4',
  dairy: '#f2ede3',
};
