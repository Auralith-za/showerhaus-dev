import { getProductOptions } from '@shopify/hydrogen-react';
const product = {
  handle: 'test',
  options: [{ name: 'Size', optionValues: [] }],
  selectedOrFirstAvailableVariant: { id: '1', selectedOptions: [{name: 'Size', value: 'M'}] },
  adjacentVariants: [{ id: '1', selectedOptions: [{name: 'Size', value: 'M'}] }, { id: '2', selectedOptions: [{name: 'Size', value: 'L'}] }]
};
console.log(getProductOptions(product));
