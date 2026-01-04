
import { ProductType } from './types';

export const PRODUCTS: ProductType[] = [
  { id: 'tshirt', name: 'T-Shirt', category: 'Apparel', icon: 'fa-shirt', promptHint: 'a premium cotton oversized t-shirt' },
  { id: 'hoodie', name: 'Hoodie', category: 'Apparel', icon: 'fa-vest', promptHint: 'a cozy heavy-duty hoodie with drawstring' },
  { id: 'cap', name: 'Baseball Cap', category: 'Accessories', icon: 'fa-hat-cowboy', promptHint: 'a classic 6-panel baseball cap' },
  { id: 'tote', name: 'Tote Bag', category: 'Accessories', icon: 'fa-bag-shopping', promptHint: 'a durable canvas tote bag' },
  { id: 'mug', name: 'Ceramic Mug', category: 'Home', icon: 'fa-mug-hot', promptHint: 'a minimalist 11oz ceramic mug' },
  { id: 'iphone', name: 'iPhone Case', category: 'Accessories', icon: 'fa-mobile-screen', promptHint: 'a sleek matte finish smartphone case' },
];

export const SYSTEM_PROMPT = `You are an expert product photographer and merchandise designer.
When given a logo, your goal is to place it realistically onto the specified product.
Ensure lighting, shadows, and fabric texture interact naturally with the logo graphics.
The logo should be sharp, properly oriented, and look like a high-quality screen print or embroidery.`;
