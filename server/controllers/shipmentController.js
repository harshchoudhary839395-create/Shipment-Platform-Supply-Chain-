const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const Alert = require('../models/Alert');

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
const getShipments = asyncHandler(async (req, res) => {
  const { status, vendor, search } = req.query;
  const query = {};

  if (status) query.currentStatus = status;
  if (vendor) query.vendor = vendor;
  if (search) query.trackingNumber = { $regex: search, $options: 'i' };

  const shipments = await Shipment.find(query)
    .populate('vendor', 'name')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: shipments.length, data: shipments });
});

// @desc    Get single shipment (with full status history)
// @route   GET /api/shipments/:id
// @access  Private
const getShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id).populate('vendor', 'name email phone');
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }
  res.json({ success: true, data: shipment });
});

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private
// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private
const createShipment = asyncHandler(async (req, res) => {
  try {
    console.log("========== CREATE SHIPMENT ==========");
    console.log("Request Body:");
    console.log(req.body);

    const shipment = await Shipment.create(req.body);

    console.log("Shipment Created:");
    console.log(shipment);

    res.status(201).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    console.error("========== ERROR ==========");
    console.error(error);
    console.error(error.stack);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

// @desc    Update shipment details
// @route   PUT /api/shipments/:id
// @access  Private
const updateShipment = asyncHandler(async (req, res) => {
  let shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: shipment });
});

// @desc    Update shipment status (adds to status history automatically)
// @route   PATCH /api/shipments/:id/status
// @access  Private
const updateShipmentStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!status) {
    res.status(400);
    throw new Error('Status is required');
  }

  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  // Note: the model's pre-save hook automatically pushes a statusHistory
  // entry whenever currentStatus changes, so we only set the field here
  // (the note is attached after save to avoid a duplicate push).
  shipment.currentStatus = status;

  if (status === 'delivered') {
    shipment.actualDeliveryDate = new Date();
  }

  await shipment.save();

  if (note) {
    shipment.statusHistory[shipment.statusHistory.length - 1].note = note;
    await shipment.save();
  }

  if (status === 'delayed') {
    await Alert.create({
      type: 'shipment_delayed',
      severity: 'warning',
      message: `Shipment ${shipment.trackingNumber} is delayed`,
      relatedModel: 'Shipment',
      relatedId: shipment._id,
    });
  }

  const updated = await Shipment.findById(req.params.id).populate('vendor', 'name');
  res.json({ success: true, data: updated });
});

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Private
const deleteShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }
  await shipment.deleteOne();
  res.json({ success: true, data: {} });
});

module.exports = {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  deleteShipment,
};