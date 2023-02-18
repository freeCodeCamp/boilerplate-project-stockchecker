const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
        chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock: 'GOOG'})
            .end(function(err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isObject(res.body, 'Response body should be an object');
                assert.nestedPropertyVal(res.body, "stockData.stock", "GOOG", 'Response body should include {"stock": "GOOG"}');
                assert.property(res.body.stockData, 'price', 'Response body should include "price"');
                assert.property(res.body.stockData, 'likes', 'Response body should include "likes"');
                done();
            });
    });

    test("Viewing one stock and liking it: GET request to /api/stock-prices/", function(done) {
        chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock: 'GOOG', like: 'true'})
            .end(function(err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isObject(res.body, 'Response body should be an object');
                assert.nestedPropertyVal(res.body, "stockData.stock", "GOOG", 'Response body should include {"stock": "GOOG"}');
                assert.property(res.body.stockData, 'price', 'Response body should include "price"');
                assert.property(res.body.stockData, 'likes', 'Response body should include "likes"');
                done();
            });
    });

    test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function(done) {
        chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock: 'GOOG', like: 'true'})
            .end(function(err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isObject(res.body, 'Response body should be an object');
                assert.nestedPropertyVal(res.body, "stockData.stock", "GOOG", 'Response body should include {"stock": "GOOG"}');
                assert.property(res.body.stockData, 'price', 'Response body should include "price"');
                assert.property(res.body.stockData, 'likes', 'Response body should include "likes"');
                done();
            });
    });

    test("Viewing two stocks: GET request to /api/stock-prices/", function(done) {
        chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock: ['GOOG', 'MSFT']})
            .end(function(err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isObject(res.body, 'Response body should be an object');
                assert.isArray(res.body.stockData, '"stockData" should be an Array');
                assert.lengthOf(res.body.stockData, 2, '"stockData" should have length of 2');
                assert.propertyVal(res.body.stockData[0], 'stock', 'GOOG', 'First object in "stockData" should include {stock: "GOOG"}');
                assert.propertyVal(res.body.stockData[1], 'stock', 'MSFT', 'Second object in "stockData" should include {stock: "MSFT"}');
                assert.hasAllKeys(res.body.stockData[0], ['stock', 'price', 'rel_likes'], 'First object in "stockData" should have the keys "stock" "price" and "rel_likes"');
                assert.hasAllKeys(res.body.stockData[1], ['stock', 'price', 'rel_likes'], 'Second object in "stockData" should have the keys "stock" "price" and "rel_likes"');
                done();
            });
    });

    test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function(done) {
        chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock: ['GOOG', 'MSFT'], like: 'true'})
            .end(function(err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.isObject(res.body, 'Response body should be an object');
                assert.isArray(res.body.stockData, '"stockData" should be an Array');
                assert.lengthOf(res.body.stockData, 2, '"stockData" should have length of 2');
                assert.propertyVal(res.body.stockData[0], 'stock', 'GOOG', 'First object in "stockData" should include {stock: "GOOG"}');
                assert.propertyVal(res.body.stockData[1], 'stock', 'MSFT', 'Second object in "stockData" should include {stock: "MSFT"}');
                assert.hasAllKeys(res.body.stockData[0], ['stock', 'price', 'rel_likes'], 'First object in "stockData" should have the keys "stock" "price" and "rel_likes"');
                assert.hasAllKeys(res.body.stockData[1], ['stock', 'price', 'rel_likes'], 'Second object in "stockData" should have the keys "stock" "price" and "rel_likes"');
                done();
            });
    });
});
