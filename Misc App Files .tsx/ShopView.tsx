import React from 'react';
import { Product } from '../types';
import { getEmoji } from '../utils/emoji';

// Data from Product Ecosystem example
const PRODUCTS: Product[] = [
  { id: 1, name: 'Weighted Blanket', price: '$79.99', imageColor: 'from-pe-indigo-400 to-pe-purple-500' },
  { id: 2, name: 'Mindfulness Journal', price: '$19.99', imageColor: 'from-pe-teal-500 to-pe-green-500' },
  { id: 3, name: 'Noise-Cancelling Headphones', price: '$129.99', imageColor: 'from-pe-blue-500 to-pe-indigo-500' },
  { id: 4, name: 'Stress Ball Set', price: '$9.99', imageColor: 'from-pe-orange-500 to-pe-red-500' },
  { id: 5, name: 'Aromatherapy Diffuser', price: '$34.99', imageColor: 'from-pe-pink-500 to-pe-purple-600' },
  { id: 6, name: 'Herbal Tea Variety Pack', price: '$14.99', imageColor: 'from-pe-yellow-500 to-pe-amber-500' }
];

interface ShopViewProps {
  onBack: () => void;
}

const ShopView: React.FC<ShopViewProps> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-bold text-primary-brand mb-4">{getEmoji('Shop')} Wellness Shop</h2>
    <button
          className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
          onClick={onBack}
          aria-label="Back to resources menu"
        >
          {getEmoji('Back')} Back to Resources
        </button>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {PRODUCTS.map(p => (
        <div key={p.id} className="bg-bg-card rounded-xl shadow-card-light border border-border-light overflow-hidden transform hover:-translate-y-1 transition-transform duration-200">
          <div className={`h-32 ${p.imageColor} bg-gradient-to-br flex items-center justify-center text-5xl text-white`}>
            {getEmoji('Shop')} {/* Generic shop icon */}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-text-primary mb-2 text-lg">{p.name}</h3>
            <p className="text-xl font-bold text-coral-400">{p.price}</p>
            <button className="mt-3 w-full btn btn-primary py-2 px-4 rounded-lg text-sm bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="text-center text-text-secondary text-sm pt-4">
      <p>More wellness products coming soon!</p>
    </div>
  </div>
);

export default ShopView;