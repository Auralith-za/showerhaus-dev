async function run() {
  console.log('Fetching page 1...');
  const res1 = await fetch('https://www.showerhaus.co.za/collections/all', {
    headers: { 'accept': 'text/html' }
  });
  const text1 = await res1.text();
  
  // Extract cursor from the Load More link
  const cursorMatch = text1.match(/cursor=([^&"']+)/);
  if (!cursorMatch) {
    console.log('Could not find cursor in HTML');
    return;
  }
  const cursor = cursorMatch[1];
  console.log('Found cursor:', cursor);

  // Look for product titles in HTML
  const titles1 = [...text1.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(m => m[1]);
  console.log('Page 1 items:', titles1.length, titles1.slice(0, 3));

  console.log('\nFetching page 2 via Remix data request...');
  // Remix data request URL
  const url2 = `https://www.showerhaus.co.za/collections/all?_data=routes%2F%28%24locale%29.collections.all&direction=next&cursor=${cursor}`;
  const res2 = await fetch(url2, {
    headers: {
      'accept': '*/*'
    }
  });
  const text2 = await res2.text();
  try {
    const data2 = JSON.parse(text2);
    const page2Nodes = data2.products.nodes.map(n => n.title);
    console.log('Page 2 items:', page2Nodes.length, page2Nodes.slice(0, 3));
    
    const overlap = titles1.filter(title => page2Nodes.includes(title));
    console.log('Duplicates between page 1 and 2:', overlap.length);
  } catch (e) {
    console.log('Failed to parse page 2 JSON:', text2.substring(0, 200));
  }
}
run();
