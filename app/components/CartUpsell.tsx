import { AddToCartButton } from './AddToCartButton';
import { MOCK_PRODUCTS } from '~/lib/mockData';
import { Image, Money } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { useAside } from './Aside';

export function CartUpsell() {
  const { close } = useAside();
  
  // Just grab some specific mock products for upsells (e.g. accessories / spares)
  const upsells = MOCK_PRODUCTS.filter(p => p.collection === 'spares-accessories' || p.id === 'mock-3').slice(0, 3);

  if (upsells.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-gray-100">
      <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-400 mb-6">
        You May Also Like
      </h4>
      <div className="grid grid-cols-1 gap-4">
        {upsells.map((product) => {
          const variantId = `${product.id}-variant`; // Mock variant ID format used in products route
          
          return (
            <div key={product.id} className="flex gap-4 items-center bg-gray-50/50 p-2 rounded-sm group hover:bg-gray-50 transition-colors">
              <Link 
                to={`/products/${product.handle}`} 
                onClick={close}
                className="w-16 h-20 shrink-0 bg-white overflow-hidden shadow-sm flex items-center justify-center p-1"
              >
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </Link>
              
              <div className="flex-1 min-w-0 py-1 flex flex-col justify-between h-full">
                <div>
                  <Link to={`/products/${product.handle}`} onClick={close}>
                    <h5 className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest truncate group-hover:text-secondary transition-colors">
                      {product.title}
                    </h5>
                  </Link>
                  <p className="font-sans text-[11px] text-gray-500 font-light mt-1">
                    ZAR {product.price}
                  </p>
                </div>
                
                <div className="mt-2" style={{ maxWidth: '100px' }}>
                  <AddToCartButton
                    lines={[{
                      merchandiseId: variantId,
                      quantity: 1,
                    }]}
                  >
                    <span className="text-[9px] py-1 block">Quick Add</span>
                  </AddToCartButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
