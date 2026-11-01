const Transaction = require('../models/Transaction');

// Helper to determine card brand from card number
const detectCardBrand = (cardNumber) => {
  const clean = cardNumber.replace(/\s+/g, '');
  if (/^4/.test(clean)) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'Amex';
  if (/^6(?:011|5)/.test(clean)) return 'Discover';
  if (/^60|^6521/.test(clean)) return 'RuPay';
  return 'Visa';
};

// Helper to generate unique transaction ID (e.g., TXN-894201)
const generateTxnId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TXN-${num}`;
};

// @route POST /api/transactions
exports.createPayment = async (req, res) => {
  try {
    const {
      amount,
      currency = 'USD',
      customerName,
      customerEmail,
      cardNumber,
      expDate,
      cvv,
      cardholderName,
      billingAddress,
      description
    } = req.body;

    // Basic Validations
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid payment amount' });
    }
    if (!customerName || !customerEmail) {
      return res.status(400).json({ success: false, message: 'Customer name and email are required' });
    }
    if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 13) {
      return res.status(400).json({ success: false, message: 'Please enter a valid card number' });
    }
    if (!expDate || !expDate.includes('/')) {
      return res.status(400).json({ success: false, message: 'Expiry date must be in MM/YY format' });
    }
    if (!cvv || cvv.length < 3) {
      return res.status(400).json({ success: false, message: 'CVV must be 3 or 4 digits' });
    }

    const cleanCard = cardNumber.replace(/\s+/g, '');
    const last4 = cleanCard.slice(-4);
    const cardBrand = detectCardBrand(cleanCard);
    const [expMonth, expYear] = expDate.split('/');
    const transactionId = generateTxnId();
    const authCode = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;

    const now = new Date();
    const timeline = [
      {
        stage: 'Authorized',
        timestamp: new Date(now.getTime() - 120000),
        detail: 'Card authorization approved',
        completed: true
      },
      {
        stage: 'Captured',
        timestamp: new Date(now.getTime() - 60000),
        detail: `Payment captured for $${Number(amount).toFixed(2)}`,
        completed: true
      },
      {
        stage: 'Settled',
        timestamp: now,
        detail: 'Funds queued for payout',
        completed: true
      }
    ];

    // Simulated PayFlow Radar assessment score
    const cvvMatch = cvv.length >= 3;
    const zipMatch = Boolean(billingAddress && billingAddress.zip);
    const riskScore = cvvMatch && zipMatch ? 12 : 28;
    const fraudRisk = {
      score: riskScore,
      level: riskScore < 20 ? 'LOW RISK' : 'MODERATE RISK',
      signals: [
        cvvMatch ? 'CVV verification matched' : 'CVV unverified',
        zipMatch ? 'ZIP code matched billing record' : 'ZIP unverified',
        'Known customer device & IP matched'
      ]
    };

    const activityLog = [
      {
        action: 'Payment created',
        performedBy: req.user ? req.user.name : customerName,
        timestamp: now,
        details: `Virtual terminal charge for $${Number(amount).toFixed(2)}`
      }
    ];

    const transaction = await Transaction.create({
      transactionId,
      amount: Number(amount),
      currency: currency.toUpperCase(),
      customerName,
      customerEmail: customerEmail.toLowerCase().trim(),
      cardBrand,
      last4,
      expMonth,
      expYear,
      cardholderName: cardholderName || customerName,
      billingAddress: billingAddress || {},
      description: description || '',
      status: 'Approved',
      authCode,
      timeline,
      fraudRisk,
      activityLog,
      createdBy: req.user ? req.user._id : null
    });

    return res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      transaction
    });
  } catch (error) {
    console.error('[Create Payment Error]', error);
    return res.status(500).json({ success: false, message: 'Error processing payment transaction' });
  }
};

// @route GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { search, status, cardType, startDate, endDate, minAmount, maxAmount, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { last4: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All statuses' && status !== 'all') {
      query.status = status;
    }

    if (cardType && cardType !== 'All card types' && cardType !== 'all') {
      query.cardBrand = { $regex: new RegExp(`^${cardType}$`, 'i') };
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      transactions
    });
  } catch (error) {
    console.error('[Get Transactions Error]', error);
    return res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
};

// @route GET /api/transactions/:id
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    let transaction;

    if (id.startsWith('TXN-')) {
      transaction = await Transaction.findOne({ transactionId: id });
    } else {
      transaction = await Transaction.findById(id);
    }

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.json({ success: true, transaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching transaction details' });
  }
};

// @route POST /api/transactions/:id/refund
exports.issueRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundType = 'full', refundAmount, reason, emailReceipt } = req.body;

    let transaction = await Transaction.findOne({
      $or: [{ transactionId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status === 'Refunded') {
      return res.status(400).json({ success: false, message: 'Transaction has already been fully refunded' });
    }

    let actualRefund = transaction.amount;
    if (refundType === 'partial') {
      if (!refundAmount || isNaN(refundAmount) || Number(refundAmount) <= 0 || Number(refundAmount) > transaction.amount) {
        return res.status(400).json({ success: false, message: `Invalid refund amount. Max allowed is $${transaction.amount}` });
      }
      actualRefund = Number(refundAmount);
    }

    const isFullRefund = actualRefund >= transaction.amount;
    transaction.status = isFullRefund ? 'Refunded' : 'Partially Refunded';
    transaction.refundInfo = {
      amount: actualRefund,
      reason: reason || 'Requested by customer',
      refundedAt: new Date(),
      refundedBy: req.user ? req.user.name : 'System Admin'
    };

    transaction.activityLog.push({
      action: 'Refund issued',
      performedBy: req.user ? req.user.name : 'System Admin',
      timestamp: new Date(),
      details: `${isFullRefund ? 'Full' : 'Partial'} refund of $${actualRefund.toFixed(2)} (${reason || 'Requested by customer'})`
    });

    await transaction.save();

    return res.json({
      success: true,
      message: `Refund of $${actualRefund.toFixed(2)} processed successfully.`,
      transaction
    });
  } catch (error) {
    console.error('[Refund Error]', error);
    return res.status(500).json({ success: false, message: 'Error processing refund' });
  }
};

// @route GET /api/transactions/export/csv
exports.exportCsv = async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });

    let csvHeader = 'Transaction ID,Customer Name,Customer Email,Amount,Currency,Card Brand,Last 4,Status,Date\n';
    let csvRows = transactions
      .map((t) => {
        const date = new Date(t.createdAt).toISOString();
        return `"${t.transactionId}","${t.customerName}","${t.customerEmail}",${t.amount},"${t.currency}","${t.cardBrand}","${t.last4}","${t.status}","${date}"`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="payflow_transactions.csv"');
    return res.send(csvHeader + csvRows);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error exporting CSV' });
  }
};
