const express = require('express');
const router = express.Router();
const {
  createPayment,
  getTransactions,
  getTransactionById,
  issueRefund,
  exportCsv
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPayment);
router.get('/', protect, getTransactions);
router.get('/export/csv', protect, exportCsv);
router.get('/:id', protect, getTransactionById);
router.post('/:id/refund', protect, issueRefund);

module.exports = router;
