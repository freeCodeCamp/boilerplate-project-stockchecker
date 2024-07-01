const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Viewing one stock: GET request to /api/stock-prices/', (done) => {
    chai.request(server)
        .get('/api/stock-prices?stock=GOOG')
        .end((err, res) => {
          assert.property(res.body, 'stockData', 'The response should have a stockData property.');
          assert.property(res.body.stockData, 'stock', 'The response should have a stock property stockData object.');
          assert.property(res.body.stockData, 'price', 'The response should have a price property stockData object.');
          assert.property(res.body.stockData, 'likes', 'The response should have a likes property stockData object.');
          assert.equal(res.body.stockData.stock, 'GOOG', 'The stock property should be the queried stock.');
          assert.isNumber(res.body.stockData.likes, 'The likes value should be of type Number.');
          assert.isNumber(res.body.stockData.price, 'The price value should be of type Number.');
          done()
        })
  })
  let likes = 0;
  test('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
    chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
          assert.property(res.body, 'stockData', 'The response should have a stockData property.');
          assert.property(res.body.stockData, 'stock', 'The response should have a stock property stockData object.');
          assert.property(res.body.stockData, 'price', 'The response should have a price property stockData object.');
          assert.property(res.body.stockData, 'likes', 'The response should have a likes property stockData object.');
          assert.equal(res.body.stockData.stock, 'GOOG', 'The stock property should be the queried stock.');
          assert.isNumber(res.body.stockData.likes, 'The likes value should be of type Number.');
          assert.isNumber(res.body.stockData.price, 'The price value should be of type Number.');
          assert.isAtLeast(res.body.stockData.likes, 1, 'The number of likes should be at least 1');
          likes = res.body.stockData.likes;
          done()
        })
  })
  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
    chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
          assert.property(res.body, 'stockData', 'The response should have a stockData property.');
          assert.property(res.body.stockData, 'stock', 'The response should have a stock property stockData object.');
          assert.property(res.body.stockData, 'price', 'The response should have a price property stockData object.');
          assert.property(res.body.stockData, 'likes', 'The response should have a likes property stockData object.');
          assert.equal(res.body.stockData.stock, 'GOOG', 'The stock property should be the queried stock.');
          assert.isNumber(res.body.stockData.likes, 'The likes value should be of type Number.');
          assert.isNumber(res.body.stockData.price, 'The price value should be of type Number.');
          assert.equal(res.body.stockData.likes, likes, 'Likes should only register once per IP.');
          done()
        })
  })
  test('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
    chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT')
        .end((err, res) => {
          assert.property(res.body, 'stockData', 'The response should have a stockData property.');
          assert.isArray(res.body.stockData, 'stockData should be of type Array.');
          res.body.stockData.forEach((stockData) => {
            assert.property(stockData, 'stock', 'Each object should have a stock property.');
            assert.property(stockData, 'price', 'Each object should have a price property.');
            assert.property(stockData, 'rel_likes', 'Each object should have a rel_likes property.');
          });
          done()
        });
  });
  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
    chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
        .end((err, res) => {
          assert.isNull(err, 'There should be no errors when querying 2 stocks and liking them.');
          assert.property(res.body, 'stockData', 'The response should have a stockData property.');
          assert.isArray(res.body.stockData, 'stockData should be of type Array.');
          res.body.stockData.forEach((stockData) => {
            assert.property(stockData, 'stock', 'Each object should have a stock property.');
            assert.property(stockData, 'price', 'Each object should have a price property.');
            assert.property(stockData, 'rel_likes', 'Each object should have a rel_likes property.');
          });
          done();
        });
  });
});