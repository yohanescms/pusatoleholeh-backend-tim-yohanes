import Cart from '../models/cart.js';
import Product from '../models/product.js';

// ADD PRODUCT
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Cek apakah produk tersedia
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Cek stok produk
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock.` });
    }

    // Cek apakah produk sudah berada di Cart
    const existingCartItem = await Cart.findOne({ userId: req.user._id, productId });
    if (existingCartItem) {

      var convertedStock1 = Number(quantity);
      var convertedStock2 = Number(existingCartItem.quantity);

      const newQuantity = convertedStock1 + convertedStock2;

      if (newQuantity > product.stock) {
        return res.status(400).json({ message: `Adding exceeds stock. Only ${product.stock} items available.` });
      }

      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();

      return res.status(200).json({ message: 'Cart updated.', cart: existingCartItem });
    }

    // Tambah item baru di dalam Cart
    const cartItem = new Cart({
      userId: req.user._id,
      productId,
      quantity,
    });

    await cartItem.save();
    res.status(201).json({ message: 'Product added to cart.', cart: cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// UPDATE CART QUANTITY
export const updateCartQuantity = async (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    // Cari item dalam cart
    const cartItem = await Cart.findById(cartId).populate('productId');
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    // Cek stok produk
    const product = cartItem.productId;
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock.` });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cart quantity updated.', cart: cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// REMOVE ITEM FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    // Menghapus item dalam Cart
    await Cart.findByIdAndDelete(cartId);
    res.status(200).json({ message: 'Product removed from cart.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// REMOVE ALL ITEMS FROM CART
export const clearCart = async (req, res) => {
  try {
    const result = await Cart.deleteMany({ userId: req.user._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cart is already empty.' });
    }

    res.status(200).json({ message: 'All items removed from cart.' });
  } catch (error) {
    console.error('Error in clearCart:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


// GET CART ITEMS
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user._id }).populate('productId', 'name price stock');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
