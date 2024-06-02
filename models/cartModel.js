const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalCartValue: { type: Number, default: 0 }
});

cartSchema.methods.calculateTotalValue = async function() {
  let total = 0;
  for (const item of this.products) {
    const product = await mongoose.model('Product').findById(item.productId);
    total += product.price * item.quantity;
  }
  this.totalCartValue = total;
  await this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
