import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'dzdhkmytt', 
  api_key: 'dummy', 
  api_secret: 'dummy' 
});

async function run() {
    try {
        const result = await cloudinary.uploader.unsigned_upload(
            '../frontend/public/favicon.svg', 
            'gemstone_shop_preset'
        );
        console.log("Success:", result.secure_url);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
