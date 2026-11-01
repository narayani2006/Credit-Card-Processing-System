const User = require('../models/User');

// @route GET /api/users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching users list' });
  }
};

// @route PUT /api/users/:id/status (Admin only)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not allow deactivating the main initial Admin account
    if (user.role === 'admin' && user.email === (process.env.ADMIN_EMAIL || 'admin@example.com')) {
      return res.status(400).json({ success: false, message: 'The primary system administrator account cannot be deactivated' });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    return res.json({
      success: true,
      message: `User account is now ${user.status}`,
      user: { id: user._id, status: user.status }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating user status' });
  }
};

// @route DELETE /api/users/:id (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not allow deleting the main initial Admin account
    if (user.role === 'admin' && user.email === (process.env.ADMIN_EMAIL || 'admin@example.com')) {
      return res.status(400).json({ success: false, message: 'The primary system administrator account cannot be deleted' });
    }

    await User.findByIdAndDelete(id);

    return res.json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting user account' });
  }
};
