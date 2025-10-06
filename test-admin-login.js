const bcrypt = require('bcrypt');

async function testAdminLogin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('Hashed password:', hashedPassword);
    
    // Test verification
    const isValid = await bcrypt.compare('admin123', hashedPassword);
    console.log('Password verification:', isValid);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAdminLogin();
