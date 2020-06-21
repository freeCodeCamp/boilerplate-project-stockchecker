/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          
          //complete this one too
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'stockData is an object');
          assert.property(res.body, 'stock', 'stockData object contains stock ticker string');
          assert.property(res.body, 'price', 'stockData contains decimal price in string format');
          assert.property(res.body, 'likes', 'stockData object contains likes, which is an integer');
          assert.isString(res.body.stock, 'stock is a string');
          assert.isString(res.body.price, 'price is a string');
          assert.isNumber(res.body.likes, 'likes is a number');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        
      });
      
      test('2 stocks', function(done) {
        
      });
      
      test('2 stocks with like', function(done) {
        
      });
      
    });

});
