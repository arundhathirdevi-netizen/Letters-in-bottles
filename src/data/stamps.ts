import { Stamp } from '../types';
import stampRose from '../assets/images/stamp_rose_pink_1789832801397.jpg';
import stampLighthouse from '../assets/images/stamp_lighthouse_mint_1789832812285.jpg';
import stampMoon from '../assets/images/stamp_peach_moon_1789832827305.jpg';
import stampCottage from '../assets/images/stamp_cottage_sage_1789832840644.jpg';
import stampSwan from '../assets/images/stamp_swan_peach_1789832896594.jpg';
import stampLavender from '../assets/images/stamp_lavender_mint_1789832911303.jpg';

export const STAMPS: Stamp[] = [
  {
    id: 'baby-rose',
    name: 'Wild Rose & Petals',
    theme: 'pink',
    imageUrl: stampRose,
    denomination: '12¢',
    postmarkText: 'PAR AVION • ROSA',
    description: 'Baby pink botanical wild rose engraving with delicate petals.',
  },
  {
    id: 'sea-lighthouse',
    name: 'Ocean Lighthouse',
    theme: 'mint',
    imageUrl: stampLighthouse,
    denomination: '25¢',
    postmarkText: 'DIGITAL OCEAN • MINT',
    description: 'Pastel mint sea foam lighthouse guiding wanderers across quiet waves.',
  },
  {
    id: 'celestial-moon',
    name: 'Crescent & Stars',
    theme: 'peach',
    imageUrl: stampMoon,
    denomination: '5¢',
    postmarkText: 'LUNAR POST • NOCTURNE',
    description: 'Soft peach celestial crescent moon with sprinkled fairytale stardust.',
  },
  {
    id: 'fairytale-cottage',
    name: 'Moss Cottage',
    theme: 'sage',
    imageUrl: stampCottage,
    denomination: '18¢',
    postmarkText: 'WOODLAND • VALE',
    description: 'Fairytale rustic stone cottage with garden lavender and smoke curls.',
  },
  {
    id: 'graceful-swan',
    name: 'Tranquil Swan',
    theme: 'peach',
    imageUrl: stampSwan,
    denomination: '30¢',
    postmarkText: 'LAKE OF DREAMS',
    description: 'Blush peach waters with an elegant white fairytale swan.',
  },
  {
    id: 'herb-lavender',
    name: 'Lavender & Chamomile',
    theme: 'mint',
    imageUrl: stampLavender,
    denomination: '15¢',
    postmarkText: 'SPRING AIRMAIL',
    description: 'Mint botanicals with dried lavender and a passing garden butterfly.',
  },
];
