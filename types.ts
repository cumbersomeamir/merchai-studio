
export interface ProductType {
  id: string;
  name: string;
  category: 'Apparel' | 'Accessories' | 'Home';
  icon: string;
  promptHint: string;
}

export interface MockupResult {
  id: string;
  url: string;
  timestamp: number;
  prompt: string;
  productType: string;
}

export interface AppState {
  logo: string | null;
  selectedProduct: ProductType | null;
  results: MockupResult[];
  isGenerating: boolean;
  error: string | null;
}
