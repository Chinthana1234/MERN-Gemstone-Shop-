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
    console.log('No filters response:', JSON.stringify(res1).substring(0, 500));
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
