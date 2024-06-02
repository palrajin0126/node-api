const express  = require('express');
const cookieSession = require('cookie-session');
const app      = express();
const productRoutes  = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const User = require('./models/userModel');
const orderRoutes = require('./routes/orderRoutes');
const mongoose =  require('mongoose')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());

// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);


// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use(cookieSession({
  keys: [process.env.SECRET_KEY],
  maxAge: 3600000 // 1 hour in milliseconds
}));

app.use(async (req, res, next) => {
  const session = req.session;
  if (session && session.userId) {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (user) {
      req.user = user;
    }
  }
  next();
});

app.use('/api/product', productRoutes);
app.use('/api/user', authRoutes)
app.use('/api/property', propertyRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});