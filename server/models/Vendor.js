const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Electronics', 'Components', 'Packaging', 'Raw Materials', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blacklisted'],
      default: 'active',
    },
    // Scorecard metrics (0-100 scale)
    onTimeDeliveryRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    qualityRating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    leadTimeDays: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Virtual: overall vendor score (simple weighted formula)
vendorSchema.virtual('overallScore').get(function () {
  const deliveryScore = this.onTimeDeliveryRate; // already 0-100
  const qualityScore = (this.qualityRating / 5) * 100;
  return Math.round(deliveryScore * 0.5 + qualityScore * 0.5);
});

vendorSchema.set('toJSON', { virtuals: true });
vendorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Vendor', vendorSchema);