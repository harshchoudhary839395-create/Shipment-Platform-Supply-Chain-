const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['low_stock', 'out_of_stock', 'shipment_delayed', 'vendor_issue', 'general'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    message: {
      type: String,
      required: true,
    },
    relatedModel: {
      type: String,
      enum: ['Inventory', 'Shipment', 'Vendor', null],
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);