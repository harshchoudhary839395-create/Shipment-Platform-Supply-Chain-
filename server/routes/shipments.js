const express = require('express');
const router = express.Router();
const {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  deleteShipment,
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getShipments).post(authorize('admin', 'manager'), createShipment);

router
  .route('/:id')
  .get(getShipment)
  .put(authorize('admin', 'manager'), updateShipment)
  .delete(authorize('admin'), deleteShipment);

router.patch('/:id/status', updateShipmentStatus);

module.exports = router;