const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_payflow_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact Administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CRITICAL: Normal registered users MUST always have role = 'user'
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || '',
      role: 'user',
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('[Signup Error]', error);
    return res.status(500).json({ success: false, message: 'Server error during account registration' });
  }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching user profile' });
  }
};

// @route PUT /api/auth/security-settings
exports.updateSecuritySettings = async (req, res) => {
  try {
    const { twoFactorEnabled, loginAlerts, emailNotifications, apiAccess } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.settings = {
      ...user.settings,
      twoFactorEnabled: twoFactorEnabled !== undefined ? twoFactorEnabled : user.settings.twoFactorEnabled,
      loginAlerts: loginAlerts !== undefined ? loginAlerts : user.settings.loginAlerts,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.settings.emailNotifications,
      apiAccess: apiAccess !== undefined ? apiAccess : user.settings.apiAccess
    };

    await user.save();

    return res.json({
      success: true,
      message: 'Security settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating security settings' });
  }
};
