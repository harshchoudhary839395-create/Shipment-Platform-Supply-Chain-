const asyncHandler = require('express-async-handler');
const Vendor = require('../models/Vendor');
const Inventory = require('../models/Inventory');
const Shipment = require('../models/Shipment');
const Alert = require('../models/Alert');

// @desc    Get dashboard summary KPIs
// @route   GET /api/analytics/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
  const [totalVendors, activeVendors, totalInventoryItems, allItems, totalShipments, shipmentsByStatus, unreadAlerts] =
    await Promise.all([
      Vendor.countDocuments(),
      Vendor.countDocuments({ status: 'active' }),
      Inventory.countDocuments(),
      Inventory.find(),
      Shipment.countDocuments(),
      Shipment.aggregate([{ $group: { _id: '$currentStatus', count: { $sum: 1 } } }]),
      Alert.countDocuments({ isRead: false }),
    ]);

  const lowStockCount = allItems.filter((i) => i.quantityOnHand > 0 && i.quantityOnHand <= i.reorderLevel).length;
  const outOfStockCount = allItems.filter((i) => i.quantityOnHand <= 0).length;
  const inventoryValue = allItems.reduce((sum, i) => sum + i.quantityOnHand * i.unitPrice, 0);

  res.json({
    success: true,
    data: {
      vendors: { total: totalVendors, active: activeVendors },
      inventory: {
        total: totalInventoryItems,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        totalValue: Math.round(inventoryValue * 100) / 100,
      },
      shipments: {
        total: totalShipments,
        byStatus: shipmentsByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      },
      alerts: { unread: unreadAlerts },
    },
  });
});

// @desc    Get shipment trends over time (monthly count)
// @route   GET /api/analytics/shipment-trends
// @access  Private
const getShipmentTrends = asyncHandler(async (req, res) => {
  const trends = await Shipment.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        delivered: {
          $sum: { $cond: [{ $eq: ['$currentStatus', 'delivered'] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.json({ success: true, data: trends });
});

// @desc    Get top vendors by overall score
// @route   GET /api/analytics/top-vendors
// @access  Private
const getTopVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({ status: 'active' });
  const ranked = vendors
    .map((v) => ({
      _id: v._id,
      name: v.name,
      overallScore: v.overallScore,
      onTimeDeliveryRate: v.onTimeDeliveryRate,
      qualityRating: v.qualityRating,
    }))
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  res.json({ success: true, data: ranked });
});

module.exports = { getDashboardSummary, getShipmentTrends, getTopVendors };