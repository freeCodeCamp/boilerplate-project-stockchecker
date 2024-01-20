'use sctrict'
const fetchStockData = require('../controllers/convertHandler');
const mongoose = require('mongoose')

require('dotenv').config();

mongoose.connect(process.env.DB).then(() => console.log('database well connected')).catch(err => console.log(err))


const stockSchema = new mongoose.Schema({
  name: { type: String, require: true },
  likes: {
    type: Number, default: 0
  },
  ips: [String]
})

const Stock =   mongoose.model("Stock", stockSchema);


module.exports = function (app) {
  app.route('/api/stock-prices').get(async function (req, res) {
    const stockSymbol = req.query.stock;
    const like = req.query.like === 'true';
    const ipAddress = req.headers['x-forwarded-for'];
    console.log(req.headers['x-forwarded-for'])
    try {
      // Fetch stock data and handle likes
      const stockData = await fetchStockData(stockSymbol, like, ipAddress);
      console.log(stockData);

      // Send the response
      res.json({ stockData, });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
