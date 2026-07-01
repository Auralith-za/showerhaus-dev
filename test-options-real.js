import { getProductOptions } from '@shopify/hydrogen-react';

const product = {
  handle: 'test-product',
  encodedVariantExistence: 'encoded-string',
  encodedVariantAvailability: 'encoded-string',
  options: [
    {
      name: 'Size',
      optionValues: [
        { name: 'Small', firstSelectableVariant: { id: '1', selectedOptions: [{ name: 'Size', value: 'Small' }], product: { handle: 'test-product' } } },
        { name: 'Large', firstSelectableVariant: { id: '2', selectedOptions: [{ name: 'Size', value: 'Large' }], product: { handle: 'test-product' } } }
      ]
    }
  ],
  selectedOrFirstAvailableVariant: {
    id: '1',
    selectedOptions: [{ name: 'Size', value: 'Small' }],
    product: { handle: 'test-product' }
  },
  adjacentVariants: [
    {
      id: '2',
      selectedOptions: [{ name: 'Size', value: 'Large' }],
      product: { handle: 'test-product' }
    }
  ]
};

const options = getProductOptions(product);
console.log(JSON.stringify(options, null, 2));
