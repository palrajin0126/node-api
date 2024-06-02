const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY;

// Sign Up Controller
exports.signup = async (req, res) => {
  const { firstName, lastName, mobile, email, password } = req.body;

  try {
    // Check if user already exists with the same mobile or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        mobile,
        email,
        password: hashedPassword
      }
    });

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

    res.cookie('jwt', token, { httpOnly: true });
    req.session.userId = user.id; // Set the session value
    req.session.email = user.email;

    // Find or create a cart for the user
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          products: [],
          totalCartValue: 0
        }
      });
    }

    req.session.cartId = cart.id; // Set the cartId in the session
    console.log(token)
    res.json({ message: 'Logged in successfully', cartId: cart.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in' });
  }
};

// Logout Controller
exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('jwt');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging out' });
  }
};

// Update User Controller
exports.updateUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'You must be logged in to perform this action.' });
  }

  const { email, mobile, password } = req.body;
  try {
    // Update the user's email and/or mobile number
    const data = {};
    if (email) data.email = email;
    if (mobile) data.mobile = mobile;

    // Update password only if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data
    });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating user' });
  }
};

// Check Auth Controller
exports.checkAuth = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ message: 'Authenticated', userId: decoded.userId });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
