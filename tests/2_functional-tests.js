const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  //viewing one stock: GET request to /api/stock-prices/
  test ('Test GET request to /api/stock-prices/ to view one stock', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=goog')
      .set({'x-forwarded-for': '130.211.2.256'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(typeof(res.body), 'object');
        assert.property(res.body, 'stockData', 'return object contains stockData');
        assert.equal(res.body.stockData.stock, 'GOOG')
        assert.property(res.body.stockData, 'stock')
        done();
      })

  })

  //viewing one stock and liking it: GET request to /api/stock-prices/
  test ('Test GET request to /api/stock-prices/ to view one stock and like it', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=BIIB&like=true')
      .set({'x-forwarded-for': '130.211.2.256'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(typeof(res.body), 'object');
        assert.property(res.body, 'stockData', 'return object contains stockData');
        assert.equal(res.body.stockData.stock, 'BIIB')
        assert.property(res.body.stockData, 'stock')
        assert.property(res.body.stockData, 'likes')
        assert.equal(res.body.stockData.likes, 1);
        done();
      })
  })

  //viewing the same stock and liking it again: GET request to /api/stock-prices/
  test ('Test GET request to /api/stock-prices/ to view same stock and like it again', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=BIIB&like=true')
      .set({'x-forwarded-for': '130.211.2.256'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(typeof(res.body), 'object');
        assert.property(res.body, 'stockData', 'return object contains stockData');
        assert.equal(res.body.stockData.stock, 'BIIB')
        assert.property(res.body.stockData, 'stock')
        assert.property(res.body.stockData, 'likes')
        assert.equal(res.body.stockData.likes, 1);
        done();
      })
  })

  //viewing two stocks: GET request to /api/stock-prices/
  test ('Test GET request to /api/stock-prices/ to view two stocks', function(done) {
      chai.request(server)
      .get('/api/stock-prices?stock=BIIB&stock=ADBE')
      .set({'x-forwarded-for': '130.211.2.256'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(typeof(res.body), 'object');
        assert.property(res.body, 'stockData', 'return object contains stockData');
        assert.equal(res.body.stockData[0].stock, 'BIIB')
        assert.equal(res.body.stockData[0].rel_likes, 1)
        assert.property(res.body.stockData[0], 'stock')
        assert.property(res.body.stockData[0], 'rel_likes')
        assert.equal(res.body.stockData[1].stock, 'ADBE')
        assert.equal(res.body.stockData[1].rel_likes, -1)
        assert.property(res.body.stockData[1], 'stock')
        assert.property(res.body.stockData[1], 'rel_likes')
        done();
      })
  })

  //viewing two stocks and liking them: GET request to /api/stock-prices/
  test ('Test GET request to /api/stock-prices/ to view two stocks and like them', function(done) {
     chai.request(server)
      .get('/api/stock-prices?stock=BIIB&stock=ADBE&like=true')
      .set({'x-forwarded-for': '130.211.2.258'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(typeof(res.body), 'object');
        assert.property(res.body, 'stockData', 'return object contains stockData');
        assert.equal(res.body.stockData[0].stock, 'BIIB')
        assert.equal(res.body.stockData[0].rel_likes, 1)
        assert.property(res.body.stockData[0], 'stock')
        assert.property(res.body.stockData[0], 'rel_likes')
        assert.equal(res.body.stockData[1].stock, 'ADBE')
        assert.equal(res.body.stockData[1].rel_likes, -1)
        assert.property(res.body.stockData[1], 'stock')
        assert.property(res.body.stockData[1], 'rel_likes')
        done();
      })
  })
 

});
