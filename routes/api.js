/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const getDb = require('../db');
const stockHandler = require('../controllers/stockHandler');
var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    // .get(function (req, res){

    // });
    
    .get(stockHandler);
};
