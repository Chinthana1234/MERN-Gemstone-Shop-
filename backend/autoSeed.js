import Product from './models/Product.js';
import { clearProductCache } from './utils/redis.js';

const jewelryProducts = [
  // Rings (8)
  {
    name: '18K White Gold Sapphire Halo Ring',
    description: 'An exquisite 18K white gold ring featuring a brilliant blue sapphire surrounded by a halo of micro-pave diamonds. Elegant and timeless design.',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 3,
    rating: 4.8,
    numReviews: 12,
    carat: 0,
    origin: 'Ceylon (Sri Lanka)'
  },
  {
    name: '18K Yellow Gold Ruby Solitaire Ring',
    description: 'A classic solitaire ring in rich 18K yellow gold, showcasing a stunning oval-cut natural ruby. A perfect statement piece.',
    price: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 2,
    rating: 4.9,
    numReviews: 8,
    carat: 0,
    origin: 'Myanmar'
  },
  {
    name: 'Platinum Emerald and Diamond Three-Stone Ring',
    description: 'A majestic three-stone ring crafted in pure platinum, featuring a vibrant emerald-cut emerald flanked by two brilliant round diamonds.',
    price: 5800,
    imageUrl: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 4,
    rating: 4.7,
    numReviews: 15,
    carat: 0,
    origin: 'Colombia'
  },
  {
    name: '18K Rose Gold Morganite & Diamond Ring',
    description: 'A romantic 18K rose gold ring featuring a cushion-cut morganite gemstone flanked by sparkling brilliant-cut diamonds.',
    price: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1605100821699-56b7f7c513f5?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 4,
    rating: 4.8,
    numReviews: 6,
    carat: 0,
    origin: 'Madagascar'
  },
  {
    name: 'Classic Emerald Cut Diamond Solitaire Ring',
    description: 'A timeless solitaire engagement ring in platinum showcasing a spectacular emerald-cut diamond of exceptional clarity.',
    price: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 2,
    rating: 4.9,
    numReviews: 11,
    carat: 0,
    origin: 'Belgium'
  },
  {
    name: '14K Yellow Gold Vintage Opal Ring',
    description: 'A gorgeous vintage-style ring featuring an oval natural Ethiopian opal that displays a vibrant play of color, set in yellow gold.',
    price: 1950,
    imageUrl: 'https://images.unsplash.com/photo-1627293509201-d027cf829244?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 3,
    rating: 4.6,
    numReviews: 9,
    carat: 0,
    origin: 'Ethiopia'
  },
  {
    name: 'Art Deco Aquamarine and Diamond Ring',
    description: 'An Art Deco-inspired ring in 18K white gold, featuring an emerald-cut aquamarine surrounded by a geometric halo of diamonds.',
    price: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 2,
    rating: 4.7,
    numReviews: 7,
    carat: 0,
    origin: 'Brazil'
  },
  {
    name: 'Royal Blue Sapphire Band Ring',
    description: 'A luxurious stackable band ring in 18K white gold set with alternating blue sapphires and brilliant round diamonds.',
    price: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=600&q=80',
    category: 'Rings',
    stock: 5,
    rating: 4.8,
    numReviews: 13,
    carat: 0,
    origin: 'Ceylon (Sri Lanka)'
  },

  // Necklaces (8)
  {
    name: 'Vintage Ruby & Diamond Pendant Necklace',
    description: 'A gorgeous vintage-inspired pendant necklace featuring a pear-shaped natural ruby suspended from a delicate 18K white gold chain studded with diamonds.',
    price: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 5,
    rating: 4.6,
    numReviews: 9,
    carat: 0,
    origin: 'Madagascar'
  },
  {
    name: 'Classic Emerald Pendant in 18K Gold',
    description: 'An elegant round-cut emerald solitaire pendant in 18K yellow gold. Simple, sophisticated, and perfect for everyday luxury.',
    price: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 3,
    rating: 4.5,
    numReviews: 7,
    carat: 0,
    origin: 'Colombia'
  },
  {
    name: '18K White Gold Diamond Tennis Necklace',
    description: 'An breathtaking tennis necklace featuring a continuous line of individually set brilliant-cut diamonds in 18K white gold.',
    price: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 1,
    rating: 5.0,
    numReviews: 4,
    carat: 0,
    origin: 'Belgium'
  },
  {
    name: 'South Sea Pearl Pendant Necklace',
    description: 'A perfectly round, lustrous white South Sea cultured pearl suspended from an 18K yellow gold bail with a diamond accent.',
    price: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 3,
    rating: 4.7,
    numReviews: 5,
    carat: 0,
    origin: 'Australia'
  },
  {
    name: 'Delicate Diamond Starburst Pendant',
    description: 'A modern and delicate starburst pendant necklace in 14K rose gold, set with pave diamonds on an adjustable chain.',
    price: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 6,
    rating: 4.5,
    numReviews: 8,
    carat: 0,
    origin: 'India'
  },
  {
    name: '18K Yellow Gold Emerald Halo Necklace',
    description: 'A magnificent pear-shaped natural emerald surrounded by a halo of pave diamonds, suspended on an 18K yellow gold chain.',
    price: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a308c02f?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 2,
    rating: 4.8,
    numReviews: 10,
    carat: 0,
    origin: 'Colombia'
  },
  {
    name: 'Aura Gemstone Multi-Color Pendant',
    description: 'A vibrant pendant featuring a collection of multi-colored gemstones (sapphire, garnet, and amethyst) in a floral setting.',
    price: 3600,
    imageUrl: 'https://images.unsplash.com/photo-1590548784585-645d8b7f4e2e?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 4,
    rating: 4.9,
    numReviews: 12,
    carat: 0,
    origin: 'Ceylon (Sri Lanka)'
  },
  {
    name: '14K Rose Gold Diamond Heart Necklace',
    description: 'An elegant heart-shaped pendant in 14K rose gold, beautifully paved with brilliant round diamonds. Symbol of pure love.',
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1569397240129-2788e0f3bb06?auto=format&fit=crop&w=600&q=80',
    category: 'Necklaces',
    stock: 5,
    rating: 4.6,
    numReviews: 7,
    carat: 0,
    origin: 'Italy'
  },

  // Earrings (7)
  {
    name: 'Emerald Cut Sapphire Drop Earrings',
    description: 'Stunning drop earrings featuring two matching emerald-cut blue sapphires hanging from 18K white gold diamond-encrusted hoops.',
    price: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80',
    category: 'Earrings',
    stock: 2,
    rating: 4.8,
    numReviews: 14,
    carat: 0,
    origin: 'Ceylon (Sri Lanka)'
  },
  {
    name: 'Natural Ruby Halo Stud Earrings',
    description: 'Dazzling stud earrings with round-cut rubies encircled by halos of brilliant round diamonds, set in 18K yellow gold.',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    category: 'Earrings',
    stock: 6,
    rating: 4.7,
    numReviews: 11,
    carat: 0,
    origin: 'Myanmar'
  },
  {
    name: '18K White Gold Diamond Hoop Earrings',
    description: 'Elegant inside-out diamond hoop earrings crafted in 18K white gold, featuring brilliant round diamonds on both sides.',
    price: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    category: 'Earrings',
    stock: 3,
    rating: 4.7,
    numReviews: 9,
    carat: 0,
    origin: 'Belgium'
  },
  {
    name: 'Tahitian Black Pearl Drop Earrings',
    description: 'Lustrous exotic Tahitian black pearls with peacock overtones, dropping from 14K white gold diamond-accented bars.',
    price: 1900,
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80',
    category: 'Earrings',
    stock: 4,
    rating: 4.8,
    numReviews: 5,
    carat: 0,
    origin: 'Tahiti'
  },
  {
    name: '18K Rose Gold Morganite Drop Earrings',
    description: 'Stunning drop earrings featuring oval-cut morganite gemstones surrounded by halos of brilliant round diamonds in rose gold.',
    price: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-537ef8347f7e?auto=format&fit=crop&w=600&q=80',
    category: 'Earrings',
    stock: 2,
    rating: 4.6,
    numReviews: 7,
    carat: 0,
    origin: 'Madagascar'
  },
  {
    name: 'Classic Platinum Diamond Stud Earrings',
    description: 'Classic four-prong diamond stud earrings set in pure platinum. A staple of any luxury jewelry collection.',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1576016770956-debb63d900ad?auto=format&fit=crop&w=600&q=80',
    category: 'Earrings',
    stock: 4,
    rating: 4.9,
    numReviews: 15,
    carat: 0,
    origin: 'Canada'
  },
  {
    name: '18K Yellow Gold Emerald Studs',
    description: 'Elegant round-cut natural green emerald stud earrings in simple four-prong 18K yellow gold settings.',
    price: 3300,
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
    category: 'Earrings',
    stock: 3,
    rating: 4.7,
    numReviews: 8,
    carat: 0,
    origin: 'Colombia'
  },

  // Bracelets (7)
  {
    name: 'Sapphire & Diamond Line Tennis Bracelet',
    description: 'A breathtaking tennis bracelet featuring alternating deep blue sapphires and brilliant round diamonds, set in 18K white gold.',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
    category: 'Bracelets',
    stock: 1,
    rating: 5.0,
    numReviews: 18,
    carat: 0,
    origin: 'Ceylon (Sri Lanka)'
  },
  {
    name: 'Classic Ruby & Gold Link Bracelet',
    description: 'An exquisite link bracelet in 18K yellow gold, set with brilliant cut oval rubies. Secure clasp and luxury finish.',
    price: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    category: 'Bracelets',
    stock: 3,
    rating: 4.9,
    numReviews: 10,
    carat: 0,
    origin: 'Madagascar'
  },
  {
    name: '18K Yellow Gold Ruby Tennis Bracelet',
    description: 'A stunning line bracelet set with matching vibrant red rubies in a secure 18K yellow gold four-prong setting.',
    price: 8200,
    imageUrl: 'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=600&q=80',
    category: 'Bracelets',
    stock: 2,
    rating: 4.8,
    numReviews: 10,
    carat: 0,
    origin: 'Myanmar'
  },
  {
    name: 'Diamond & White Gold Bangle',
    description: 'A classic stackable bangle in 18K white gold, featuring pave-set brilliant round diamonds across the top half.',
    price: 5100,
    imageUrl: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=600&q=80',
    category: 'Bracelets',
    stock: 3,
    rating: 4.9,
    numReviews: 12,
    carat: 0,
    origin: 'Belgium'
  },
  {
    name: 'Multi-Gemstone Charm Bracelet',
    description: 'An elegant link bracelet in 14K yellow gold featuring charms set with sapphire, emerald, garnet, and ruby gems.',
    price: 3900,
    imageUrl: 'https://images.unsplash.com/photo-1596944210900-34d31d1e996a?auto=format&fit=crop&w=600&q=80',
    category: 'Bracelets',
    stock: 4,
    rating: 4.7,
    numReviews: 6,
    carat: 0,
    origin: 'Ceylon (Sri Lanka)'
  },
  {
    name: '18K Rose Gold Diamond Chain Bracelet',
    description: 'A delicate rose gold chain bracelet featuring a circular diamond-pave disc. Perfect for layering.',
    price: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=600&q=80',
    category: 'Bracelets',
    stock: 5,
    rating: 4.6,
    numReviews: 9,
    carat: 0,
    origin: 'Italy'
  },
  {
    name: 'Platinum Emerald Tennis Bracelet',
    description: 'An incredibly luxurious platinum tennis bracelet set with high-grade emerald-cut Colombian emeralds.',
    price: 9500,
    imageUrl: 'https://images.unsplash.com/photo-1626784215021-2e39cb79e115?auto=format&fit=crop&w=600&q=80',
    category: 'Bracelets',
    stock: 1,
    rating: 5.0,
    numReviews: 14,
    carat: 0,
    origin: 'Colombia'
  }
];

let isSeeding = false;

export const autoSeedJewelry = async () => {
  if (isSeeding) return;
  isSeeding = true;
  try {
    const count = await Product.countDocuments({ category: { $in: ['Rings', 'Necklaces', 'Earrings', 'Bracelets'] } });
    if (count === 0) {
      console.log(`[Auto-Seed] No jewelry items found. Seeding 30 jewelry products...`);
      // Insert exactly 30 items
      await Product.insertMany(jewelryProducts);
      console.log('[Auto-Seed] Successfully seeded exactly 30 jewelry products!');
      await clearProductCache();
    } else {
      console.log(`[Auto-Seed] Jewelry items already present (${count} items). Skipping auto-seed.`);
    }
  } catch (err) {
    console.error('[Auto-Seed Error] Failed to seed jewelry:', err.message);
  } finally {
    isSeeding = false;
  }
};
