const Branch = require('../models/Branch');

exports.getAll = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branches' });
  }
};

exports.create = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Error creating branch' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByIdAndUpdate(id, req.body, { new: true });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Error updating branch' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByIdAndDelete(id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting branch' });
  }
};
