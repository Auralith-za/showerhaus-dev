import { getPaginationVariables } from '@shopify/hydrogen';

const req = new Request('https://www.showerhaus.co.za/collections/all?direction=next&cursor=xyz');
const vars = getPaginationVariables(req, { pageBy: 12 });
console.log(vars);

const req2 = new Request('https://www.showerhaus.co.za/collections/all?direction=previous&cursor=abc');
const vars2 = getPaginationVariables(req2, { pageBy: 12 });
console.log(vars2);
