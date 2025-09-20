const Branch = require('../models/Branch');
const Sale = require('../models/Sale');
exports.totals = async (req,res)=>{
  const totalOutlets = await Branch.countDocuments();
  const agg = await Sale.aggregate([{ $group:{ _id:null, totalUnits:{$sum:'$units'}, totalAmount:{$sum:'$amount'} } }]);
  res.json({ totalOutlets, totalSales: agg[0] || { totalUnits:0, totalAmount:0 } });
};
exports.topFlavorByCity = async (req,res)=>{
  const city = req.query.city; if(!city) return res.status(400).json({message:'city required'});
  const agg = await Sale.aggregate([ { $match:{ city } }, { $group:{ _id:'$flavor', units:{$sum:'$units'} } }, { $sort:{ units:-1 } }, { $limit:1 } ]);
  res.json(agg[0] || null);
};
exports.topFlavors = async (req,res)=>{
  const agg = await Sale.aggregate([ { $group:{ _id:{ city:'$city', flavor:'$flavor' }, units:{$sum:'$units'} } }, { $sort:{ units:-1 } } ]);
  res.json(agg);
};
