require('dotenv').config({ path: __dirname + '/../.env' }); // must be first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');   // ✅ CommonJS require
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Default admin creation
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      const hashed = await bcrypt.hash("admin111", 10);
      await User.create({
        username: "admin",
        password: hashed,
        role: "admin",
        branch: "HQ"
      });
      console.log("✅ Default admin created: admin / admin111");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Failed to create default admin:", err.message);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Connect DB and then create admin
connectDB().then(() => {
  createDefaultAdmin();
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log('🟢 Server running on', PORT));
