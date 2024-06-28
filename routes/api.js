'use strict';
require('isomorphic-fetch')
require('dotenv').config();

const likes = {};

function getLikes(data = {}) {
  return Object.values(data).reduce((sum, item) => sum + (item ?? 0), 0);
}

module.exports = function (app) {
  const router = app.route('/api/stock-prices');

  router.get(async function (req, res) {
    const ipAddr = req.headers['x-forwarded-for'];
    const { stock, like } = req.query;

    if (!stock) {
      res.status(400).end();
    }

    try {
      let response = {}
      if (Array.isArray(stock) && stock.length === 2) {
        const result_1 = await fetch(`${process.env.HOST_STOCK}${stock[0]}/quote`);
        const result_2 = await fetch(`${process.env.HOST_STOCK}${stock[1]}/quote`);

        const data_1 = await result_1.json();
        const data_2 = await result_2.json();

        if (like === 'true') {
          likes[stock[0]] = likes[stock[0]] ? likes[stock[0]] : {};
          likes[stock[1]] = likes[stock[1]] ? likes[stock[1]] : {};
          if (!likes[stock[0]][ipAddr] && !likes[stock[1]][ipAddr]) {
            likes[stock[0]][ipAddr] = 1
            likes[stock[1]][ipAddr] = 1
          }
        }

        response = {
          stockData: [
            {
              stock: data_1.symbol,
              price: data_1.latestPrice,
              rel_likes: getLikes(likes[stock[0]]) - getLikes(likes[stock[1]]),
            },
            {
              stock: data_2.symbol,
              price: data_2.latestPrice,
              rel_likes: getLikes(likes[stock[1]]) - getLikes(likes[stock[0]]),
            }
          ]
        }
      } else {
        const result = await fetch(`${process.env.HOST_STOCK}${stock}/quote`);
        const data = await result.json();

        if (like === "true") {
          likes[stock] = likes[stock] ? likes[stock] : {};
          if (!likes[stock][ipAddr]) {
            likes[stock][ipAddr] = 1
          }
        }

        response = {
          stockData: {
            stock: data.symbol,
            price: data.latestPrice,
            likes: getLikes(likes[stock]),
          }
        }
      }

      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

};
