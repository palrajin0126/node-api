const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderController {
  async placeOrder(req, res) {
    const {
      orderNumber,
      customerName,
      email,
      mobile,
      apartment,
      block,
      locality,
      city,
      state,
      pincode,
      seller,
      merchantId,
      transactionId,
      providerId,
      responseCode,
      providerReferenceId
    } = req.body;

    const { userId } = req.session;

    try {
      // Fetch the user's cart
      const cart = await prisma.cart.findFirst({
        where: { userId: parseInt(userId) }
      });

      if (!cart) {
        return res.status(400).send({ message: 'Cart not found' });
      }

      const orderItems = cart.products;
      const orderTotal = cart.totalCartValue;
      const quantity = orderItems.reduce((total, item) => total + item.quantity, 0);
      const amount = orderTotal * 100;

      const order = await prisma.CustomerOrder.create({
        data: {
          orderNumber,
          orderItems,
          orderTotal,
          customerName,
          email,
          mobile,
          apartment,
          block,
          locality,
          city,
          state,
          pincode,
          seller,
          quantity,
          merchantId,
          transactionId,
          providerId,
          responseCode,
          amount,
          providerReferenceId,
          userId: parseInt(userId)
        }
      });

      res.status(201).send(order);
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).send({ message: 'Error placing order', error });
    }
  }

  async getOrderById(req, res) {
    const { id } = req.params;

    try {
      const order = await prisma.CustomerOrder.findUnique({
        where: { id: parseInt(id) }
      });

      if (!order) {
        return res.status(404).send({ message: 'Order not found' });
      }

      res.send(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).send({ message: 'Error fetching order', error });
    }
  }

  async deleteOrder(req, res) {
    const { id } = req.params;

    try {
      await prisma.CustomerOrder.delete({
        where: { id: parseInt(id) }
      });

      res.send({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).send({ message: 'Error deleting order', error });
    }
  }

  async getOrdersByUserId(req, res) {
    const { userId } = req.params;

    try {
      const orders = await prisma.CustomerOrder.findMany({
        where: { userId: parseInt(userId) }
      });

      if (!orders.length) {
        return res.status(404).send({ message: 'No orders found for this user' });
      }

      res.send(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).send({ message: 'Error fetching orders', error });
    }
  }
}

module.exports = new OrderController();
