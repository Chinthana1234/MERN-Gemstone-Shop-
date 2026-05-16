import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const gemstones = [
  {
    name: 'Ceylon Blue Sapphire',
    description: 'A mesmerizing royal blue sapphire sourced from the legendary mines of Sri Lanka. This exceptional stone features an intense, velvety blue hue with excellent clarity and a brilliant, lively cut.',
    price: 2450,
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=2080&auto=format&fit=crop',
    category: 'Sapphire',
    stock: 5,
    rating: 4.8,
    numReviews: 12,
    carat: 3.2,
    origin: 'Sri Lanka'
  },
  {
    name: 'Pigeon Blood Ruby',
    description: 'An extraordinarily rare Burmese ruby exhibiting the coveted "pigeon blood" red — a deep, vibrant crimson with a subtle fluorescent glow. Considered the pinnacle of ruby collecting.',
    price: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1601121853354-e6e866bd2aca?q=80&w=1974&auto=format&fit=crop',
    category: 'Ruby',
    stock: 3,
    rating: 4.9,
    numReviews: 8,
    carat: 2.8,
    origin: 'Myanmar'
  },
  {
    name: 'Colombian Emerald',
    description: 'A stunning Colombian emerald with a rich, verdant green color and remarkable transparency. The stone features the characteristic jardin inclusions that authenticate its natural origin.',
    price: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=2070&auto=format&fit=crop',
    category: 'Emerald',
    stock: 4,
    rating: 4.7,
    numReviews: 15,
    carat: 4.1,
    origin: 'Colombia'
  },
  {
    name: 'Padparadscha Sapphire',
    description: 'One of the world\'s rarest gemstones — a delicate blend of pink and orange reminiscent of a lotus blossom at sunset. This unheated Padparadscha is a true collector\'s dream.',
    price: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1583937443573-bf382b52be17?q=80&w=2000&auto=format&fit=crop',
    category: 'Sapphire',
    stock: 2,
    rating: 5.0,
    numReviews: 6,
    carat: 2.1,
    origin: 'Sri Lanka'
  },
  {
    name: 'Star Sapphire',
    description: 'A magnificent star sapphire displaying a perfectly centered six-rayed star that glides gracefully across its silky blue dome. This phenomenon, known as asterism, makes each stone unique.',
    price: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=2000&auto=format&fit=crop',
    category: 'Sapphire',
    stock: 7,
    rating: 4.5,
    numReviews: 20,
    carat: 5.6,
    origin: 'Sri Lanka'
  },
  {
    name: 'Zambian Emerald',
    description: 'A deeply saturated Zambian emerald with a slightly bluish-green tone that sets it apart from its Colombian counterparts. Known for superior clarity and a vivid, electric color.',
    price: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1584347526972-2292f7041a87?q=80&w=2000&auto=format&fit=crop',
    category: 'Emerald',
    stock: 6,
    rating: 4.6,
    numReviews: 11,
    carat: 3.5,
    origin: 'Zambia'
  },
  {
    name: 'Mozambique Ruby',
    description: 'A brilliant, highly saturated ruby from the newly discovered Mozambique deposits. This stone rivals the finest Burmese rubies with its exceptional color and remarkable brilliance.',
    price: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=2000&auto=format&fit=crop',
    category: 'Ruby',
    stock: 8,
    rating: 4.4,
    numReviews: 18,
    carat: 2.3,
    origin: 'Mozambique'
  },
  {
    name: 'Kashmir Blue Sapphire',
    description: 'The ultimate sapphire — from the legendary Kashmir mines, now closed. This stone exhibits a velvety "cornflower blue" with a soft, sleepy quality that no other sapphire can match.',
    price: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop',
    category: 'Sapphire',
    stock: 1,
    rating: 5.0,
    numReviews: 3,
    carat: 4.7,
    origin: 'Kashmir'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    await Product.deleteMany({});
    console.log('Existing products cleared.');

    await Product.insertMany(gemstones);
    console.log(`${gemstones.length} gemstones seeded successfully! 💎`);

    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
