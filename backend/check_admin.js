import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://chinthanasandeepa123_db_user:Gemstone2026@cluster0.jhweeby.mongodb.net/MERN-Gemstone-Shop-?retryWrites=true&w=majority";

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const email = 'admin@auragems.com';
    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`Admin user found: ${admin.email}`);
      console.log(`Resetting admin password to 'adminpassword123'...`);
      admin.password = 'adminpassword123';
      admin.isAdmin = true;
      await admin.save();
      console.log('Admin password updated successfully!');
    } else {
      console.log(`Admin user '${email}' not found. Creating one...`);
      admin = await User.create({
        name: 'System Admin',
        email,
        password: 'adminpassword123',
        isAdmin: true
      });
      console.log('Admin user created successfully!');
    }

    // Also let's check if there are other admins
    const allAdmins = await User.find({ isAdmin: true });
    console.log('\nAll registered admins:');
    allAdmins.forEach(u => {
      console.log(`- ${u.name} (${u.email})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
