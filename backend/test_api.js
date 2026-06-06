import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Testing / ...');
    const resRoot = await get('http://localhost:5050/');
    console.log('Root response:', JSON.stringify(resRoot).substring(0, 500));
    
    console.log('Testing /api/products...');
    const res1 = await get('http://localhost:5050/api/products');
    const products = res1.products || [];
    const jewelry = products.find(p => p.carat === 0);
    if (jewelry) {
      console.log('Found jewelry:', jewelry.name);
      console.log('Testing single product detail...');
      const detail = await get(`http://localhost:5050/api/products/${jewelry._id}`);
      console.log('Product detail response:', JSON.stringify(detail, null, 2));
    } else {
      console.log('No jewelry items found in the product listing.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
