const Branch = require('../models/Branch');
const Sale = require('../models/Sale');

// GET /api/dashboard/totals
// Returns: { totalOutlets, totalSales: { totalUnits, totalAmount } }
exports.totals = async (req, res) => {
  try {
    const totalOutlets = await Branch.countDocuments();

    const agg = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$units' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalSales = agg[0] || { totalUnits: 0, totalAmount: 0 };
    res.json({ totalOutlets, totalSales });
  } catch (error) {
    console.error('Dashboard totals error:', error);
    res.status(500).json({ message: 'Error fetching totals' });
  }
};

// GET /api/dashboard/top-flavor?city=CityName
exports.topFlavorByCity = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: 'city required' });
    }

    const agg = await Sale.aggregate([
      { $match: { city } },
      {
        $group: {
          _id: { city: '$city', flavor: '$flavor' },
          units: { $sum: '$units' },
        },
      },
      { $sort: { units: -1 } },
      { $limit: 1 },
    ]);

    res.json(agg[0] || null);
  } catch (error) {
    console.error('Top flavor by city error:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};

// GET /api/dashboard/top-flavors
exports.topFlavors = async (req, res) => {
  try {
    const agg = await Sale.aggregate([
      {
        $group: {
          _id: { city: '$city', flavor: '$flavor' },
          units: { $sum: '$units' },
        },
      },
      { $sort: { units: -1 } },
    ]);

    res.json(agg);
  } catch (error) {
    console.error('Top flavors error:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};
