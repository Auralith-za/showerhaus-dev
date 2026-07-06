import { getPaginationVariables } from '@shopify/hydrogen';

const req = new Request('https://www.showerhaus.co.za/collections/all?direction=next&cursor=xyz');
const vars = getPaginationVariables(req, { pageBy: 12 });
console.log(vars);
