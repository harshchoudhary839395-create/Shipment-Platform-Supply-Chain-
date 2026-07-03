const express = require('express');
const router = express.Router();
const {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  recordMovement,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getInventoryItems).post(authorize('admin', 'manager'), createInventoryItem);

router
  .route('/:id')
  .get(getInventoryItem)
  .put(authorize('admin', 'manager'), updateInventoryItem)
  .delete(authorize('admin'), deleteInventoryItem);

router.post('/:id/movement', recordMovement);

module.exports = router;