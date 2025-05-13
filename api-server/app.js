// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/mydatabase';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define the product schema and explicitly set the collection name to 'products'
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  imageName: String,
  category: String,
  price: Number,
  discount: Number,
}, { collection: 'products' });

// Define the cart item schema and explicitly set the collection name to 'cartitems'
const cartItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  imageName: String,
  category: String,
  price: Number,
  discount: Number,
  quantity: { type: Number, default: 1 }, // Add quantity field
}, { collection: 'cartitems' });

// Create models
const Product = mongoose.model('Product', productSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Routes

// Root route with redirect logic
app.get('/', (req, res) => {
  const type = req.query.type;

  if (type === 'cart') {
    res.redirect('/api/cart');
  } else if (type === 'products') {
    res.redirect('/api/products');
  } else {
    res.json({
      message: 'Welcome to the API',
      usage: 'Use /?type=cart or /?type=products',
      endpoints: {
        cart: '/api/cart',
        products: '/api/products',
      },
    });
  }
});

// Get all cart items
app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart data' });
  }
});

// Update cart
app.post('/api/cart', async (req, res) => {
  try {
    await CartItem.deleteMany();
    await CartItem.insertMany(req.body);
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save cart data' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Buy a product and add it to the cart
/*app.post('/api/buy/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id); // Convert string to number
    console.log('Product ID received in backend:', productId); // Debugging log

    const product = await Product.findOne({ id: productId });

    if (!product) {
      console.log('Product not found in database'); // Debugging log
      return res.status(404).json({ error: 'Product not found' });
    }

   /* const existingCartItem = await CartItem.findOne({ id: product.id });

    if (existingCartItem) {
      console.log('Product already in cart'); // Debugging log
      return res.status(400).json({ error: 'Product is already in the cart' });
    }

    const cartItem = new CartItem(product.toObject());
    await cartItem.save();

    console.log('Product added to cart:', cartItem); // Debugging log
    res.status(200).json({ message: 'Product added to cart', cartItem });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});*/

app.post('/api/buy/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id); // Convert string to number
    console.log('Product ID received in backend:', productId); // Debugging log

    if (isNaN(productId)) {
      console.error('Invalid product ID'); // Debugging log
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
      console.log('Product not found in database'); // Debugging log
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product is already in the cart
    const existingCartItem = await CartItem.findOne({ id: product.id });

    if (existingCartItem) {
      console.log('Product already in cart, updating quantity'); // Debugging log
      // Update the quantity (if you have a quantity field)
      existingCartItem.quantity = (existingCartItem.quantity || 1) + 1;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Product quantity updated in cart', cartItem: existingCartItem });
    }

    // Add the product to the cart if it doesn't exist
    const cartItem = new CartItem({ ...product.toObject(), quantity: 1 });
    await cartItem.save();

    console.log('Product added to cart:', cartItem); // Debugging log
    res.status(200).json({ message: 'Product added to cart', cartItem });
  } catch (err) {
    console.error('Error adding to cart:', err); // Debugging log
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

// Remove a product from the cart or reduce its quantity
app.post('/api/remove/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id); // Convert string to number
    console.log('Product ID received for removal:', productId); // Debugging log

    if (isNaN(productId)) {
      console.error('Invalid product ID'); // Debugging log
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Find the product in the cart
    const existingCartItem = await CartItem.findOne({ id: productId });

    if (!existingCartItem) {
      console.log('Product not found in cart'); // Debugging log
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (existingCartItem.quantity > 1) {
      // Reduce the quantity by 1
      existingCartItem.quantity -= 1;
      await existingCartItem.save();
      console.log('Reduced quantity of product in cart:', existingCartItem); // Debugging log
      return res.status(200).json({ message: 'Product quantity reduced in cart', cartItem: existingCartItem });
    } else {
      // Remove the product from the cart if quantity is 1
      await CartItem.deleteOne({ id: productId });
      console.log('Product removed from cart'); // Debugging log
      return res.status(200).json({ message: 'Product removed from cart' });
    }
  } catch (err) {
    console.error('Error removing product from cart:', err); // Debugging log
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 API server running at http://localhost:${port}`);
});