const Req = require('../models/IngredientRequest');

exports.request = async (req, res) => {
  try {
    const request = new Req(req.body);
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ingredient request' });
  }
};

exports.list = async (req, res) => {
  try {
    const requests = await Req.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ingredient requests' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Req.findByIdAndUpdate(id, req.body, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Ingredient request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ingredient request' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Req.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: 'Ingredient request not found' });
    }
    res.json({ message: 'Ingredient request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ingredient request' });
  }
};
