
import React from 'react';
import { ProductType } from '../types';
import { PRODUCTS } from '../constants';

interface ProductSelectorProps {
  onSelect: (product: ProductType) => void;
  selectedId: string | undefined;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {PRODUCTS.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
            selectedId === product.id
              ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
          }`}
        >
          <i className={`fa-solid ${product.icon} text-2xl mb-2`}></i>
          <span className="text-sm font-medium">{product.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ProductSelector;
