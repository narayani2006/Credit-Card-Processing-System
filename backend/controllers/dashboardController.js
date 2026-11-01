const Transaction = require('../models/Transaction');

// @route GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });

    const totalVolume = transactions
      .filter((t) => t.status === 'Approved' || t.status === 'Refunded' || t.status === 'Partially Refunded')
      .reduce((sum, t) => sum + t.amount, 0);

    const successfulPayments = transactions.filter(
      (t) => t.status === 'Approved' || t.status === 'Refunded' || t.status === 'Partially Refunded'
    ).length;

    const failedPayments = transactions.filter((t) => t.status === 'Declined').length;

    const totalRefunds = transactions
      .filter((t) => t.status === 'Refunded' || t.status === 'Partially Refunded')
      .reduce((sum, t) => sum + (t.refundInfo ? t.refundInfo.amount || t.amount : t.amount), 0);

    // Payment Methods breakdown
    const brandCounts = {};
    transactions.forEach((t) => {
      const brand = t.cardBrand || 'Visa';
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    const paymentMethods = Object.keys(brandCounts).map((brand) => ({
      brand,
      count: brandCounts[brand],
      percentage: transactions.length ? Math.round((brandCounts[brand] / transactions.length) * 100) : 0
    }));

    // Revenue over time (grouped by day for the last 30 days)
    const recentTransactions = transactions.slice(0, 5);

    return res.json({
      success: true,
      stats: {
        totalVolume,
        successfulPayments,
        failedPayments,
        totalRefunds,
        totalCount: transactions.length
      },
      paymentMethods,
      recentTransactions
    });
  } catch (error) {
    console.error('[Dashboard Stats Error]', error);
    return res.status(500).json({ success: false, message: 'Error fetching dashboard metrics' });
  }
};
