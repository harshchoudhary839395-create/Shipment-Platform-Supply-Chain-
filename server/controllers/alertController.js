const asyncHandler = require('express-async-handler');
const Alert = require('../models/Alert');

// @desc    Get all alerts (newest first)
// @route   GET /api/alerts
// @access  Private
const getAlerts = asyncHandler(async (req, res) => {
  const { isRead, severity, type } = req.query;
  const query = {};

  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (severity) query.severity = severity;
  if (type) query.type = type;

  const alerts = await Alert.find(query).sort({ createdAt: -1 }).limit(100);
  const unreadCount = await Alert.countDocuments({ isRead: false });

  res.json({ success: true, count: alerts.length, unreadCount, data: alerts });
});

// @desc    Mark a single alert as read
// @route   PATCH /api/alerts/:id/read
// @access  Private
const markAlertRead = asyncHandler(async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!alert) {
    res.status(404);
    throw new Error('Alert not found');
  }

  res.json({ success: true, data: alert });
});

// @desc    Mark all alerts as read
// @route   PATCH /api/alerts/read-all
// @access  Private
const markAllAlertsRead = asyncHandler(async (req, res) => {
  await Alert.updateMany({ isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All alerts marked as read' });
});

// @desc    Delete an alert
// @route   DELETE /api/alerts/:id
// @access  Private
const deleteAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) {
    res.status(404);
    throw new Error('Alert not found');
  }
  await alert.deleteOne();
  res.json({ success: true, data: {} });
});

// @desc    Create a manual/general alert
// @route   POST /api/alerts
// @access  Private
const createAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.create(req.body);
  res.status(201).json({ success: true, data: alert });
});

module.exports = {
  getAlerts,
  markAlertRead,
  markAllAlertsRead,
  deleteAlert,
  createAlert,
};