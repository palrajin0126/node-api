const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Product = require('../models/productModel');

class CartController {
  async addProductToCart(req, res) {
    const { productId } = req.body;
    const { cartId, userId } = req.session;

    if (!cartId) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }

      let cart = await prisma.cart.findUnique({ where: { id: parseInt(cartId) } });
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: parseInt(userId),
            products: [],
            totalCartValue: 0
          }
        });
      }

      const products = cart.products || [];
      const productInCart = products.find((p) => p.productId === productId);
      if (productInCart) {
        productInCart.quantity++;
      } else {
        products.push({ productId, quantity: 1 });
      }

      const updatedCart = await prisma.cart.update({
        where: { id: parseInt(cartId) },
        data: {
          products: products,
          totalCartValue: await this.calculateTotalValue(products)
        }
      });

      res.send({ message: 'Product added to cart successfully', cart: updatedCart });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error adding product to cart' });
    }
  }

  async removeProductFromCart(req, res) {
    const { productId } = req.body;
    const { cartId } = req.session;

    if (!cartId) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
      const cart = await prisma.cart.findUnique({ where: { id: parseInt(cartId) } });
      if (!cart) {
        return res.status(404).send({ message: 'Cart not found' });
      }

      const products = cart.products || [];
      const productIndex = products.findIndex((p) => p.productId === productId);
      if (productIndex >= 0) {
        const productInCart = products[productIndex];
        productInCart.quantity--;
        if (productInCart.quantity <= 0) {
          products.splice(productIndex, 1);
        }

        const updatedCart = await prisma.cart.update({
          where: { id: parseInt(cartId) },
          data: {
            products: products,
            totalCartValue: await this.calculateTotalValue(products)
          }
        });

        res.send({ message: 'Product removed from cart successfully', cart: updatedCart });
      } else {
        res.status(404).send({ message: 'Product not found in cart' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error removing product from cart' });
    }
  }

  async updateCartQuantity(req, res) {
    const { productId, quantity } = req.body;
    const { cartId } = req.session;

    if (!cartId) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }

      const cart = await prisma.cart.findUnique({ where: { id: parseInt(cartId) } });
      if (!cart) {
        return res.status(404).send({ message: 'Cart not found' });
      }

      const products = cart.products || [];
      const productInCart = products.find((p) => p.productId === productId);
      if (productInCart) {
        productInCart.quantity = quantity;

        const updatedCart = await prisma.cart.update({
          where: { id: parseInt(cartId) },
          data: {
            products: products,
            totalCartValue: await this.calculateTotalValue(products)
          }
        });

        res.send({ message: 'Cart updated successfully', cart: updatedCart });
      } else {
        res.status(404).send({ message: 'Product not found in cart' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error updating cart' });
    }
  }

  async calculateTotalValue(products) {
    let total = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      total += product.price * item.quantity;
    }
    return total;
  }
}

module.exports = new CartController();
