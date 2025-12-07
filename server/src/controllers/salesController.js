const Sale = require('../models/Sale');

// POST /api/sales
exports.create = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.json(sale);
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ message: 'Error creating sale' });
  }
};

// GET /api/sales
// Optional query params: city, branch
exports.list = async (req, res) => {
  try {
    const q = {};
    if (req.query.city) q.city = req.query.city;
    if (req.query.branch) q.branch = req.query.branch;

    const sales = await Sale.find(q).sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    console.error('List sales error:', error);
    res.status(500).json({ message: 'Error fetching sales' });
  }
};

// PUT /api/sales/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndUpdate(id, req.body, { new: true });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    console.error('Update sale error:', error);
    res.status(500).json({ message: 'Error updating sale' });
  }
};

// DELETE /api/sales/:id
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Delete sale error:', error);
    res.status(500).json({ message: 'Error deleting sale' });
  }
};
