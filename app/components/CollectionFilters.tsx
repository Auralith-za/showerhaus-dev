import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';

export function CollectionFilters({ filters }: { filters: any[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Get active filters
  const activeFilters = searchParams.getAll('filter');
  
  // Get price filters
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const toggleFilter = (inputString: string) => {
    const params = new URLSearchParams(location.search);
    const existing = params.getAll('filter');
    
    // Remove all filters to recreate them
    params.delete('filter');
    
    if (existing.includes(inputString)) {
      // Remove it
      existing.filter(e => e !== inputString).forEach(e => params.append('filter', e));
    } else {
      // Add it
      existing.push(inputString);
      existing.forEach(e => params.append('filter', e));
    }
    
    navigate(`${location.pathname}?${params.toString()}`, { preventScrollReset: true });
  };

  const applyPrice = () => {
    const params = new URLSearchParams(location.search);
    if (localMinPrice) params.set('minPrice', localMinPrice);
    else params.delete('minPrice');
    
    if (localMaxPrice) params.set('maxPrice', localMaxPrice);
    else params.delete('maxPrice');
    
    navigate(`${location.pathname}?${params.toString()}`, { preventScrollReset: true });
  };

  if (!filters || filters.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 p-8 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
      
      {/* Price Slider Section */}
      <div>
        <h4 className="font-display text-sm text-primary mb-4 border-b border-gray-200 pb-2">Price Range (ZAR)</h4>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded p-2 text-xs focus:border-primary focus:ring-0 outline-none"
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded p-2 text-xs focus:border-primary focus:ring-0 outline-none"
          />
        </div>
        <button 
          onClick={applyPrice}
          className="mt-3 w-full py-2 bg-gray-200 text-primary text-[10px] font-bold tracking-widest uppercase hover:bg-gray-300 transition-colors rounded"
        >
          Apply Price
        </button>
      </div>

      {/* Dynamic Shopify Filters */}
      {filters.filter(f => f.type !== 'PRICE_RANGE').map(filter => (
        <div key={filter.id}>
          <h4 className="font-display text-sm text-primary mb-4 border-b border-gray-200 pb-2">{filter.label}</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {filter.values.map((value: any) => {
              const inputString = JSON.stringify(value.input);
              const isActive = activeFilters.includes(inputString);
              
              return (
                <label key={value.id} className="flex items-center gap-2 font-sans text-xs text-gray-600 cursor-pointer hover:text-primary transition-colors">
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={() => toggleFilter(inputString)}
                    className="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  {value.label} ({value.count})
                </label>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}
