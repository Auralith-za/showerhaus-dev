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

  // We removed the early return so the Price Range filter always shows up even if Shopify returns no dynamic filters.
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 p-8 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
      
      {/* Price Slider Section */}
      <div className="md:col-span-2 lg:col-span-1">
        <h4 className="font-display text-sm text-primary mb-4 border-b border-gray-200 pb-2">Max Price (ZAR)</h4>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center font-sans text-xs text-gray-500">
            <span>R0</span>
            <span className="font-bold text-primary">R{localMaxPrice || 10000}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10000" 
            step="100"
            value={localMaxPrice || 10000}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <button 
          onClick={applyPrice}
          className="mt-6 w-full py-2 bg-primary text-white text-[10px] font-bold tracking-widest uppercase hover:bg-secondary transition-colors rounded"
        >
          Apply Price
        </button>
      </div>

      {/* Dynamic Shopify Filters */}
      {(filters || []).filter(f => f.type !== 'PRICE_RANGE').map(filter => (
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
