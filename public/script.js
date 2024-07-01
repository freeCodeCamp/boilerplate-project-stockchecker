'use strict';

require("dotenv").config();
const Stocks  = require('../models');
const fetch = require('node-fetch');

const saveStock = (symbol, like, ip) =>
  Stocks.findOne({ symbol }).then((res) => {
    if (!res) {
      const newStock = new Stocks({ symbol, likes: like ? [ip] : [] });
      return newStock.save();
    }
    if (like && res.likes.indexOf(ip) === -1) {
      res.likes.push(ip);
    }
    return res.save();
  });

const getStockPrice = (stockSymbol) =>
  fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol}/quote`
  )
    .then((response) => response.json())
    .then((data) => ({
      stock: data.symbol,
      price: data.latestPrice,
    }));

const parseData = (data) => {
  let stockData = [];
  let i = 0;
  const likes = [];
  while (i < data.length) {
    const stock = {
      stock: data[i + 1].stock,
      price: data[i + 1].price,
    };
    likes.push(data[i].likes.length);
    stockData.push(stock);
    i += 2;
  }

  if (stockData.length === 2) {
    stockData[0].rel_likes = likes[0] - likes[1];
    stockData[1].rel_likes = likes[1] - likes[0];
  } else {
    stockData = stockData[0];
    stockData.likes = likes[0];
  }
  return { stockData };
};

module.exports = function (app) {
  app.route('/api/stock-prices').get(function (req, res) {
    let { stock, like } = req.query;

    if (!Array.isArray(stock)) {
      stock = [stock];
    }

    const promises = [];
    stock.forEach((symbol) => {
      promises.push(saveStock(symbol.toLowerCase(), like, req.ip));

      promises.push(getStockPrice(symbol));
    });

    Promise.all(promises)
      .then((data) => {
        const parsedData = parseData(data);
        res.json(parsedData);
      })
      .catch((err) => {
        if (err) return console.log(err);
        res.send(err);
      });
  });
};