const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'cancelled'],
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const shipmentItemSchema = new mongoose.Schema(
  {
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    items: [shipmentItemSchema],
    currentStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    origin: {
      type: String,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    carrier: {
      type: String,
      trim: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save: push to status history when currentStatus changes
shipmentSchema.pre('save', function (next) {
  if (this.isModified('currentStatus') || this.isNew) {
    this.statusHistory.push({ status: this.currentStatus });
  }
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);