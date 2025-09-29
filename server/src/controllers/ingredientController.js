const Req = require('../models/IngredientRequest');

// User creates a request
exports.request = async (req, res) => {
  try {
    const data = {
      branch: req.user?.branch || req.body.branch || '',
      city: req.body.city || '',
      flavor: req.body.flavor || '',
      ingredient: req.body.ingredient || '',
      qty: req.body.qty || 0,
      status: "pending",
      date: Date.now()
    };
    const request = new Req(data);
    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating ingredient request' });
  }
};

// List requests: admins see all, regular users see only approved items (or their branch's requests + approved)
exports.list = async (req, res) => {
  try {
    const user = req.user || {};
    if (user.role === 'admin') {
      const requests = await Req.find().sort({ date: -1 });
      return res.json(requests);
    } else {
      // show approved requests to all users; also allow branch users to see their own requests
      const query = { $or: [{ status: 'approved' }] };
      if (user.role === 'branch' && user.branch) {
        query.$or.push({ branch: user.branch });
      }
      const requests = await Req.find(query).sort({ date: -1 });
      return res.json(requests);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching ingredient requests' });
  }
};

// Admin updates status (approve/reject) and optional comment
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    if (!['approved','rejected','pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const request = await Req.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = status;
    if (adminComment !== undefined) request.adminComment = adminComment;
    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error);
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
