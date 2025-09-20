require('dotenv').config();
const connectDB = require('./config/db');
const Branch = require('./models/Branch');
const Sale = require('./models/Sale');
const Req = require('./models/IngredientRequest');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

connectDB().then(async () => {
  console.log('🌱 Starting database seeding...');
  
  // Clear existing data
  await Branch.deleteMany();
  await Sale.deleteMany();
  await Req.deleteMany();
  await User.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Create branches
  const branches = [
    { name: 'Hasthampatti', city: 'Salem', area: 'Hasthampatti' },
    { name: 'New Bus Stand', city: 'Salem', area: 'Bus Stand' },
    { name: 'Chennai Central', city: 'Chennai', area: 'Central' },
    { name: 'Bangalore Mall', city: 'Bangalore', area: 'Mall Road' }
  ];
  await Branch.insertMany(branches);
  console.log('🏪 Created branches');

  // Create sales data
  const sales = [
    { branch: 'Hasthampatti', city: 'Salem', flavor: 'Vanilla', units: 500, amount: 5000, date: new Date() },
    { branch: 'Hasthampatti', city: 'Salem', flavor: 'Chocolate', units: 200, amount: 3000, date: new Date() },
    { branch: 'New Bus Stand', city: 'Salem', flavor: 'Strawberry', units: 150, amount: 2250, date: new Date() },
    { branch: 'Chennai Central', city: 'Chennai', flavor: 'Mint', units: 300, amount: 4500, date: new Date() },
    { branch: 'Bangalore Mall', city: 'Bangalore', flavor: 'Cookies & Cream', units: 400, amount: 6000, date: new Date() }
  ];
  await Sale.insertMany(sales);
  console.log('💰 Created sales data');

  // Create ingredient requests
  const requests = [
    { branch: 'New Bus Stand', city: 'Salem', flavor: 'Chocolate', ingredient: 'Cocoa powder', qty: 10, status: 'pending', date: new Date() },
    { branch: 'Hasthampatti', city: 'Salem', flavor: 'Vanilla', ingredient: 'Vanilla extract', qty: 5, status: 'approved', date: new Date() },
    { branch: 'Chennai Central', city: 'Chennai', flavor: 'Strawberry', ingredient: 'Strawberry flavor', qty: 8, status: 'pending', date: new Date() }
  ];
  await Req.insertMany(requests);
  console.log('🥛 Created ingredient requests');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 8);
  const userPassword = await bcrypt.hash('user123', 8);

  const users = [
    { username: 'admin', password: adminPassword, role: 'admin', branch: 'Head Office' },
    { username: 'hasthampatti', password: userPassword, role: 'branch', branch: 'Hasthampatti' },
    { username: 'busstand', password: userPassword, role: 'branch', branch: 'New Bus Stand' },
    { username: 'chennai', password: userPassword, role: 'branch', branch: 'Chennai Central' },
    { username: 'bangalore', password: userPassword, role: 'branch', branch: 'Bangalore Mall' }
  ];
  await User.insertMany(users);
  console.log('👥 Created users');

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: username=admin, password=admin123');
  console.log('Branch Users: username=hasthampatti/busstand/chennai/bangalore, password=user123');
  
  process.exit();
}).catch(e => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
