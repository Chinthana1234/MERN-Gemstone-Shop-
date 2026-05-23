import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/Coupon.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://chinthanasandeepa123_db_user:Gemstone2026@cluster0.jhweeby.mongodb.net/MERN-Gemstone-Shop-?retryWrites=true&w=majority";

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // 1. Clear previous test coupons
    console.log('\nCleaning existing test coupons...');
    await Coupon.deleteMany({ code: { $in: ['TEST50', 'PERCENT10', 'EXPIRED'] } });

    // 2. Create test coupons
    console.log('Creating fresh test coupons...');
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const coupons = [
      {
        code: 'TEST50',
        discountType: 'flat',
        discountValue: 50,
        minPurchaseAmount: 100,
        expiryDate: futureDate,
        isActive: true
      },
      {
        code: 'PERCENT10',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 50,
        expiryDate: futureDate,
        isActive: true
      },
      {
        code: 'EXPIRED',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 10,
        expiryDate: pastDate,
        isActive: true
      }
    ];

    await Coupon.insertMany(coupons);
    console.log('Test coupons created successfully!');

    // 3. Test verification helper
    const testApply = async (code, itemsPrice) => {
      console.log(`\nTesting coupon: [${code}] with Cart Subtotal: $${itemsPrice}`);
      
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        console.log(`❌ FAILED: Coupon ${code} not found in database.`);
        return;
      }

      // Check active
      if (!coupon.isActive) {
        console.log(`❌ FAILED: Coupon is inactive.`);
        return;
      }

      // Check expiry date
      const currentDate = new Date();
      if (new Date(coupon.expiryDate) < currentDate) {
        console.log(`❌ FAILED: Coupon has expired (Expiry: ${coupon.expiryDate.toISOString()}).`);
        return;
      }

      // Check minimum purchase amount
      if (itemsPrice < coupon.minPurchaseAmount) {
        console.log(`❌ FAILED: Min purchase requirement of $${coupon.minPurchaseAmount} not met.`);
        return;
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = itemsPrice * (coupon.discountValue / 100);
      } else if (coupon.discountType === 'flat') {
        discountAmount = coupon.discountValue;
      }

      if (discountAmount > itemsPrice) {
        discountAmount = itemsPrice;
      }

      discountAmount = Math.round(discountAmount * 100) / 100;
      console.log(`✅ SUCCESS: Applied! Discount Amount: $${discountAmount}, Final Total: $${itemsPrice - discountAmount}`);
    };

    // Run programmatic tests
    await testApply('TEST50', 150);     // Should apply: $50 discount
    await testApply('TEST50', 80);      // Should fail: min spend
    await testApply('PERCENT10', 120);  // Should apply: $12 discount
    await testApply('EXPIRED', 30);     // Should fail: expired

    // 4. Print current active coupons in the system
    const allCoupons = await Coupon.find({});
    console.log('\n--- All coupons in DB ---');
    allCoupons.forEach(c => {
      console.log(`- Code: ${c.code} | Type: ${c.discountType} | Value: ${c.discountValue} | Active: ${c.isActive} | Expires: ${c.expiryDate.toLocaleDateString()}`);
    });

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

run();
