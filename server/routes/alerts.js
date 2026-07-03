const express = require('express');
const router = express.Router();
const {
  getAlerts,
  markAlertRead,
  markAllAlertsRead,
  deleteAlert,
  createAlert,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getAlerts).post(createAlert);
router.patch('/read-all', markAllAlertsRead);
router.patch('/:id/read', markAlertRead);
router.delete('/:id', deleteAlert);

module.exports = router;