const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getShipmentTrends,
  getTopVendors,
} = require('../controllers/analyticscontroller');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/shipment-trends', getShipmentTrends);
router.get('/top-vendors', getTopVendors);

module.exports = router;