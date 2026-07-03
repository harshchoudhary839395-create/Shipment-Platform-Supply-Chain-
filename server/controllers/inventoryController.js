const asyncHandler = require('express-async-handler');
const Inventory = require('../models/Inventory');
const Alert = require('../models/Alert');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getInventoryItems = asyncHandler(async (req, res) => {
  const { search, category, stockStatus } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;

  let items = await Inventory.find(query).populate('vendor', 'name').sort({ createdAt: -1 });

  // Filter by virtual stockStatus in-memory since it's not a real DB field
  if (stockStatus) {
    items = items.filter((item) => item.stockStatus === stockStatus);
  }

  res.json({ success: true, count: items.length, data: items });
});

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id).populate('vendor', 'name email');
  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private
const createInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update inventory item details (not stock quantity directly)
// @route   PUT /api/inventory/:id
// @access  Private
const updateInventoryItem = asyncHandler(async (req, res) => {
  let item = await Inventory.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: item });
});

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});

// @desc    Record a stock movement (in / out / adjustment)
// @route   POST /api/inventory/:id/movement
// @access  Private
const recordMovement = asyncHandler(async (req, res) => {
  const { type, quantity, reason } = req.body;

  if (!type || quantity === undefined) {
    res.status(400);
    throw new Error('Movement type and quantity are required');
  }

  const item = await Inventory.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  // Apply the movement to the quantity on hand
  if (type === 'in') {
    item.quantityOnHand += Number(quantity);
  } else if (type === 'out') {
    if (item.quantityOnHand < quantity) {
      res.status(400);
      throw new Error('Insufficient stock for this movement');
    }
    item.quantityOnHand -= Number(quantity);
  } else if (type === 'adjustment') {
    item.quantityOnHand = Number(quantity);
  }

  item.movements.push({
    type,
    quantity,
    reason,
    performedBy: req.user._id,
  });

  await item.save();

  // Auto-create alert if stock is low or out
  if (item.quantityOnHand <= 0) {
    await Alert.create({
      type: 'out_of_stock',
      severity: 'critical',
      message: `${item.name} (${item.sku}) is out of stock`,
      relatedModel: 'Inventory',
      relatedId: item._id,
    });
  } else if (item.quantityOnHand <= item.reorderLevel) {
    await Alert.create({
      type: 'low_stock',
      severity: 'warning',
      message: `${item.name} (${item.sku}) is below reorder level (${item.quantityOnHand} left)`,
      relatedModel: 'Inventory',
      relatedId: item._id,
    });
  }

  res.json({ success: true, data: item });
});

module.exports = {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  recordMovement,
};