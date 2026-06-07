import express from 'express';
import Review from '../models/Review.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all general site reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching general reviews:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a general site review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const review = new Review({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating general review:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a general site review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    console.error('Error deleting general review:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
