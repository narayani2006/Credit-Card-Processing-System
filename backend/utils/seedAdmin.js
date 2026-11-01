const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdminAccount = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    // Check if initial admin account already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log(`[Admin Seed] Creating initial system admin account (${adminEmail})...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      });
      console.log(`[Admin Seed] Initial Admin account created successfully! Credentials: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`[Admin Seed] Initial Admin account (${adminEmail}) is present.`);
    }
  } catch (error) {
    console.error('[Admin Seed Error]', error.message);
  }
};

module.exports = seedAdminAccount;
