
const asyncHandler = require('express-async-handler');
const Vendor = require('../models/Vendor');

// @desc    Get all vendors (supports search & filter)
// @route   GET /api/vendors
// @access  Private
const getVendors = asyncHandler(async (req, res) => {
  const { search, category, status } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (category) query.category = category;
  if (status) query.status = status;

  const vendors = await Vendor.find(query).sort({ createdAt: -1 });
  res.json({ success: true, count: vendors.length, data: vendors });
});

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Private
const getVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }
  res.json({ success: true, data: vendor });
});

// @desc    Create new vendor
// @route   POST /api/vendors
// @access  Private
const createVendor = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;
  const vendor = await Vendor.create(req.body);
  res.status(201).json({ success: true, data: vendor });
});

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private
const updateVendor = asyncHandler(async (req, res) => {
  let vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: vendor });
});

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private
const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  await vendor.deleteOne();
  res.json({ success: true, data: {} });
});

// @desc    Get vendor scorecard (performance metrics)
// @route   GET /api/vendors/:id/scorecard
// @access  Private
const getVendorScorecard = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  res.json({
    success: true,
    data: {
      vendorId: vendor._id,
      name: vendor.name,
      onTimeDeliveryRate: vendor.onTimeDeliveryRate,
      qualityRating: vendor.qualityRating,
      totalOrders: vendor.totalOrders,
      leadTimeDays: vendor.leadTimeDays,
      overallScore: vendor.overallScore,
    },
  });
});

module.exports = {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorScorecard,
};