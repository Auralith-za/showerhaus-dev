async function run() {
  console.log('Fetching page 1...');
  const res1 = await fetch('https://www.showerhaus.co.za/collections/all?_data=routes%2F(%24locale).collections.all');
  const data1 = await res1.json();
  const page1Nodes = data1.products.nodes.map(n => n.title);
  console.log('Page 1 items:', page1Nodes.length, page1Nodes.slice(0, 3));
  
  const cursor = data1.products.pageInfo.endCursor;
  console.log('Cursor:', cursor);

  console.log('Fetching page 2...');
  const url2 = `https://www.showerhaus.co.za/collections/all?direction=next&cursor=${encodeURIComponent(cursor)}&_data=routes%2F(%24locale).collections.all`;
  const res2 = await fetch(url2);
  const data2 = await res2.json();
  const page2Nodes = data2.products.nodes.map(n => n.title);
  console.log('Page 2 items:', page2Nodes.length, page2Nodes.slice(0, 3));
  
  const overlap = page1Nodes.filter(title => page2Nodes.includes(title));
  console.log('Duplicates between page 1 and 2:', overlap.length);
  if (overlap.length > 0) {
    console.log('Duplicate items:', overlap.slice(0, 5));
  }
}
run();
