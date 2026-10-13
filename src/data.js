// All shop data and pricing rules live here, so prices are easy to change.

export const FLAVOURS = [
  { id: 'choc', name: 'Chocolate truffle', color: '#5A3524', perKg: 780 },
  { id: 'vanilla', name: 'Vanilla bean', color: '#F4E3B5', perKg: 620 },
  { id: 'velvet', name: 'Red velvet', color: '#A3202F', perKg: 900 },
  { id: 'butter', name: 'Butterscotch', color: '#D9A04F', perKg: 680 },
  { id: 'pine', name: 'Pineapple', color: '#F2D45A', perKg: 640 },
  { id: 'berry', name: 'Blueberry', color: '#6C5AA8', perKg: 860 },
];

export const FROSTINGS = [
  { id: 'cream', name: 'Whipped cream', base: '#FFF8F2', light: '#FFFFFF', ink: '#5B4650' },
  { id: 'rose', name: 'Rose pink', base: '#F6B6C8', light: '#FBD0DC', ink: '#6B2A3E' },
  { id: 'ganache', name: 'Chocolate ganache', base: '#4A2B20', light: '#5E3A2C', ink: '#F8E7DC' },
  { id: 'mint', name: 'Pistachio', base: '#B9D8A8', light: '#D1E7C4', ink: '#2F4A2A' },
  { id: 'lilac', name: 'Lilac', base: '#C9B6E8', light: '#DCCFF2', ink: '#3E2B66' },
  { id: 'butter', name: 'Butter yellow', base: '#F7E08A', light: '#FBEBAF', ink: '#5E4A10' },
];

export const TOPPINGS = [
  { id: 'none', name: 'None', price: 0 },
  { id: 'berries', name: 'Fresh berries', price: 180 },
  { id: 'sprinkles', name: 'Sprinkles', price: 60 },
  { id: 'flowers', name: 'Sugar flowers', price: 220 },
  { id: 'candles', name: 'Candles', price: 40 },
];

export const WEIGHTS = [0.5, 1, 1.5, 2, 3];
export const TIER_MIN = { 1: 0.5, 2: 1, 3: 2 }; // minimum kg for each tier count
export const TIER_EXTRA = { 1: 0, 2: 250, 3: 600 }; // extra price for each tier count
export const DRIP_PRICE = 150;
export const EGGLESS_PER_KG = 40;
export const FREE_DELIVERY_FROM = 1500;
export const DELIVERY_FEE = 80;
export const SLOTS = ['10 am to 1 pm', '1 pm to 4 pm', '4 pm to 7 pm', '7 pm to 9 pm'];

export const MENU = [
  { id: 'black-forest', name: 'Black Forest', blurb: 'Chocolate sponge, cherry compote and whipped cream.', cats: ['Chocolate', 'Classic'], perKg: 720, sponge: '#5A3524', frosting: 'cream', topping: 'berries', tiers: 1, drip: false, badge: 'Bestseller' },
  { id: 'dark-truffle', name: 'Dark Truffle', blurb: 'Dense cocoa sponge under a glossy ganache drip.', cats: ['Chocolate'], perKg: 880, sponge: '#46281C', frosting: 'ganache', topping: 'none', tiers: 1, drip: true },
  { id: 'red-velvet', name: 'Red Velvet', blurb: 'Buttermilk crumb with a tangy cream cheese frosting.', cats: ['Classic'], perKg: 960, sponge: '#A3202F', frosting: 'cream', topping: 'flowers', tiers: 2 },
  { id: 'pineapple', name: 'Pineapple Delight', blurb: 'Light vanilla sponge, fresh pineapple and cream.', cats: ['Fruit', 'Classic'], perKg: 640, sponge: '#F2D45A', frosting: 'cream', topping: 'none', tiers: 1 },
  { id: 'butterscotch', name: 'Butterscotch Crunch', blurb: 'Caramel sponge with praline crunch between the layers.', cats: ['Classic'], perKg: 700, sponge: '#D9A04F', frosting: 'butter', topping: 'sprinkles', tiers: 1 },
  { id: 'rasmalai', name: 'Rasmalai Cake', blurb: 'Cardamom sponge soaked in saffron milk, finished with pistachio.', cats: ['Indian'], perKg: 1100, sponge: '#EBD3A0', frosting: 'mint', topping: 'none', tiers: 1, badge: 'Festive' },
  { id: 'blueberry', name: 'Blueberry Cream', blurb: 'Blueberry sponge, jam and light mascarpone cream.', cats: ['Fruit'], perKg: 920, sponge: '#6C5AA8', frosting: 'lilac', topping: 'berries', tiers: 1 },
  { id: 'gateau', name: 'Fresh Fruit Gateau', blurb: 'Vanilla sponge layered with seasonal fruit and cream.', cats: ['Fruit'], perKg: 820, sponge: '#F4E3B5', frosting: 'rose', topping: 'berries', tiers: 2 },
];

export const CATS = ['All', 'Chocolate', 'Fruit', 'Classic', 'Indian'];
