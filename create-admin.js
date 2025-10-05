const bcrypt = require('bcrypt');

async function createAdmin() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('Admin credentials:');
  console.log('Email: admin@engracedsmile.com');
  console.log('Password: admin123');
  console.log('Hashed password:', hashedPassword);
}

createAdmin().catch(console.error);
