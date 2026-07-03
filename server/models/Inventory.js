const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const inventorySchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    quantityOnHand: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    warehouseLocation: {
      type: String,
      trim: true,
    },
    movements: [movementSchema],
  },
  { timestamps: true }
);

// Virtual: stock status
inventorySchema.virtual('stockStatus').get(function () {
  if (this.quantityOnHand <= 0) return 'out_of_stock';
  if (this.quantityOnHand <= this.reorderLevel) return 'low_stock';
  return 'in_stock';
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);