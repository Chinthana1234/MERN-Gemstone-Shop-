import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'dzdhkmytt', 
  api_key: '477222653143859', 
  api_secret: 'P-IokWUSh0CsD8uj7XjeSwfdmlw' 
});

async function run() {
    try {
        const result = await cloudinary.uploader.upload(
            '../frontend/public/favicon.svg', 
            { folder: 'test' }
        );
        console.log("Success:", result.secure_url);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
