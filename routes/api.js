"use strict";
const axios = require("axios");
const mongoose = require("mongoose");
const anonymize = require("ip-anonymize");

const stockDetails = new mongoose.Schema({
  stock: String,
  price: Number,
  likes: Number,
  reqIP: Array,
});

const StockDetails = new mongoose.model("StockDetails", stockDetails);

module.exports = function (app) {
  app.route("/api/stock-prices").get(function (req, res) {
    const { stock, like } = req.query;

    let reqIP = anonymize(req.ip, 16, 16);

    console.log("stock:", stock, "like:", like, "reqIP:", reqIP, "(1)");

    async function updateOrCreateNewStock(stock, like, reqIP) {
      // console.log('checking for stock details ....')
      console.log("stock:", stock, "like:", like, "reqIP:", reqIP, "(2)");
      const existingStockDetails = await StockDetails.findOne({ stock: stock });

      if (!existingStockDetails) {
        // console.log('There is no similar existingStock');
        const newStockDetails = await StockDetails.create({
          stock: "",
          price: "",
          likes: "",
          reqIP: [],
        });

        await newStockDetails.save();

        let price = await axios
          .get(
            `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
          )
          .then((response) => {
            return response.data.close;
          })
          .catch((error) => {
            // console.log('error:', error)
            return error;
          });
        // console.log("newStockDetails' price:", price)

        if (price != null) {
          newStockDetails.stock = stock;
          newStockDetails.price = price;
          if (like === "true") {
            newStockDetails.likes = 1;
            newStockDetails.reqIP = newStockDetails.reqIP.push(reqIP);
          } else {
            newStockDetails.likes = 0;
          }
        } else {
          if (like === "true") {
            newStockDetails.likes = 1;
            newStockDetails.reqIP = newStockDetails.reqIP.push(reqIP);
          } else {
            newStockDetails.likes = 0;
          }
        }

        await newStockDetails.save();
        console.log("newStockDetails: ", newStockDetails);
        return {
          stock: newStockDetails.stock,
          price: newStockDetails.price,
          likes: newStockDetails.likes,
        };
      } else {
        // console.log('There is similar existingStock');
        // console.log('1. existingStockDetails before:', existingStockDetails)

        let price = await axios
          .get(
            `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
          )
          .then((response) => {
            return response.data.close;
          })
          .catch((error) => {
            // console.log('price error:', error)
            return error;
          });
        existingStockDetails.price === price
          ? (existingStockDetails.price = price)
          : (existingStockDetails.price = existingStockDetails.price);

        await existingStockDetails.save();

        if (
          existingStockDetails.reqIP.includes(reqIP) === false &&
          like === "true"
        ) {
          existingStockDetails.likes = existingStockDetails.likes += 1;
          existingStockDetails.reqIP = existingStockDetails.reqIP.push(reqIP);

          console.log("existingStockDetails 1. :", existingStockDetails);
          return {
            stock: existingStockDetails.stock,
            price: existingStockDetails.price,
            likes: existingStockDetails.likes,
          };
        } else {
          console.log("existingStockDetails 2. :", existingStockDetails);

          return {
            stock: existingStockDetails.stock,
            price: existingStockDetails.price,
            likes: existingStockDetails.likes,
          };
        }
      }
    }

    async function collectstocks(stock) {
      let stocks = [];
      if (Array.isArray(stock)) {
        for (let i = 0; i < stock.length; i++) {
          stocks.push(await stock[i]);
        }
      } else {
        stocks.push(await stock);
      }
      return stocks;
    }

    async function getStockData(stock, like, reqIP) {
      let stocks = await collectstocks(stock);
      if (stock) {
        console.log("Number of stock items:", stock.length);
        console.log("Is type of stock an array:", Array.isArray(stock));
        if (stocks.length > 1) {
          let stockData1 = await updateOrCreateNewStock(stocks[0], like, reqIP);

          let stockData2 = await updateOrCreateNewStock(stocks[1], like, reqIP);

          Promise.all([stockData1, stockData2]).then((values) => {
            let data = [];
            values.map((value) => {
              data.push(value);
            });
            res.json({
              stockData: [
                {
                  stock: data[0].stock,
                  price: data[0].price,
                  rel_likes: data[0].likes - data[1].likes,
                },
                {
                  stock: data[1].stock,
                  price: data[1].price,
                  rel_likes: data[1].likes - data[0].likes,
                },
              ],
            });
          });
        } else if (!Array.isArray(stock) && stock.length > 0) {
          let stockData = updateOrCreateNewStock(stocks[0], like, reqIP);
          stockData.then((data) => {
            if (data.stock && data.price) {
              res.json({
                stockData: {
                  stock: data.stock,
                  price: data.price,
                  likes: data.likes,
                },
              });
            } else {
              res.json({
                stockData: {
                  likes: data.likes,
                },
              });
            }
          });
        } else {
          res.json({
            stockData: {
              likes: like === true ? 1 : 0,
            },
          });
        }
      } else {
        res.json({
          stockData: {
            error: "external source error",
            likes: like === true ? 1 : 0,
          },
        });
      }
    }
    getStockData(stock, like, reqIP);
  });
};
