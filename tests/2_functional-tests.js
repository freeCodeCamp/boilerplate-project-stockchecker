const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000)
 suite('Integration tests with chai-http', function(){
   
   test('1. Viewing one stock: GET request to /api/stock-prices', (done) =>{
     chai.request(server).get('/api/stock-prices?stock=GOOG&like=false').end(function(err, res){
       let stockData = res.body.stockData
       console.log('Test 1 response:', stockData)
       // assert.equal(stockData.stock, 'GOOG');
       assert.property(stockData, 'stock');
       assert.property(stockData, 'price');
       assert.property(stockData, 'likes');
       done()
     })
   });

   test('2. Viewing one stock and liking it: GET request to /api/stock-prices/', (done) =>{
     chai.request(server).get('/api/stock-prices?stock=GOOG&like=true').end(function(err, res){
       let stockData = res.body.stockData
       console.log('Test 2 response:', stockData);
       assert.property(stockData, 'stock');
       assert.property(stockData, 'price');
       assert.property(stockData, 'likes')
       done()
     })
   });

   test('3. Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) =>{
     chai.request(server).get('/api/stock-prices?stock=GOOG&like=true').end(function (err, res) {
       let stockData = res.body.stockData
       console.log('Test 3 response:', stockData)
       assert.property(stockData, 'stock');
       assert.property(stockData, 'price');
       assert.property(stockData, 'likes');
       done();
     });
   });

  test('4. Viewing two stocks: GET request to /api/stock-prices/', (done) =>{
    chai.request(server).get('/api/stock-prices?stock=GOOG&stock=MSFT&like=false').end(function (err, res) {
      let stockData = res.body.stockData
       console.log('Test 4 response:', stockData);
       assert.property(stockData[0], 'stock');
       assert.property(stockData[0], 'price');
       assert.property(stockData[0], 'rel_likes')
      done();
    });
  });

     test('5. Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) =>{
    chai.request(server).get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true').end(function (err, res) {
      let stockData = res.body.stockData
       console.log('Test 5 response:', stockData);
       assert.property(stockData[1], 'stock');
       assert.property(stockData[1], 'price');
       assert.property(stockData[1], 'rel_likes')
      done();
    });
  });
   
 });
});
