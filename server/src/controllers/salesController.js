const Sale = require('../models/Sale');

exports.create = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale' });
  }
};

exports.list = async (req, res) => {
  try {
    const q = {};
    if (req.query.city) q.city = req.query.city;
    if (req.query.branch) q.branch = req.query.branch;
    const sales = await Sale.find(q);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndUpdate(id, req.body, { new: true });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sale' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale' });
  }
};
