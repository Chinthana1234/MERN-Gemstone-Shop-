import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        if (user) {
            // Filter out any null products (e.g. if a product was deleted)
            res.json(user.wishlist.filter(item => item != null));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Wishlist error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle product in wishlist
// @route   POST /api/auth/wishlist/:id
// @access  Private
export const toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.id;

        if (user) {
            const index = user.wishlist.findIndex(id => id && id.toString() === productId);
            if (index !== -1) {
                // Product exists in wishlist, remove it
                user.wishlist.splice(index, 1);
            } else {
                // Product doesn't exist, add it
                user.wishlist.push(productId);
            }

            await user.save();
            // populate to return the updated full wishlist products
            const updatedUser = await User.findById(req.user._id).populate('wishlist');
            res.json(updatedUser.wishlist.filter(item => item != null));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Toggle wishlist error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Google token is required' });
        }

        // Verify Google token with Google's API
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const googleData = await googleRes.json();

        if (!googleRes.ok || googleData.error) {
            return res.status(400).json({ message: 'Google authentication failed' });
        }

        // Validate that email is verified and audience matches
        const { email, email_verified, name, aud } = googleData;

        if (email_verified !== 'true' && email_verified !== true) {
            return res.status(400).json({ message: 'Google email is not verified' });
        }

        const clientID = process.env.GOOGLE_CLIENT_ID?.trim();
        if (aud?.trim() !== clientID) {
            console.error(`Audience mismatch! Token aud: "${aud?.trim()}", Config GOOGLE_CLIENT_ID: "${clientID}"`);
            return res.status(400).json({ 
                message: 'Token audience mismatch',
                debug: {
                    receivedAudience: aud?.trim(),
                    serverConfiguredClientID: clientID
                }
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create user with a secure random password since it is a required field
            const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            user = await User.create({
                name: name || 'Google User',
                email,
                password: randomPassword
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new user (Admin only)
// @route   POST /api/auth
// @access  Private/Admin
export const createUser = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            isAdmin: isAdmin === true || isAdmin === 'true'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/:id
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isAdmin = req.body.isAdmin === true || req.body.isAdmin === 'true';
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'You cannot delete your own admin account' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

