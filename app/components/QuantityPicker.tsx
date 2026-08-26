import React from 'react';

interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number | null;
  disabled?: boolean;
}

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = null,
  disabled = false,
}: QuantityPickerProps) {
  const isMin = value <= min;
  const isMax = max !== null && max !== undefined && value >= max;

  const handleDecrement = () => {
    if (!disabled && !isMin) {
      onChange(Math.max(min, value - 1));
    }
  };

  const handleIncrement = () => {
    if (!disabled && !isMax) {
      const nextVal = value + 1;
      if (max !== null && max !== undefined) {
        onChange(Math.min(max, nextVal));
      } else {
        onChange(nextVal);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      onChange(min);
      return;
    }
    let parsed = parseInt(rawValue, 10);
    if (isNaN(parsed)) {
      parsed = min;
    }
    if (parsed < min) {
      parsed = min;
    }
    if (max !== null && max !== undefined && parsed > max) {
      parsed = max;
    }
    onChange(parsed);
  };

  return (
    <div className="inline-flex items-center border border-gray-200 bg-white rounded-sm overflow-hidden select-none">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || isMin}
        aria-label="Decrease quantity"
        className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors font-medium text-base border-r border-gray-100"
      >
        &#8722;
      </button>
      <input
        type="number"
        min={min}
        max={max ?? undefined}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-14 h-10 text-center text-sm text-gray-900 font-medium border-0 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || isMax}
        aria-label="Increase quantity"
        className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors font-medium text-base border-l border-gray-100"
      >
        &#43;
      </button>
    </div>
  );
}
