const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', async function() {

  await suite('GET /api/stock-prices', async () =>{

    await test('Viewing one stock', done =>{
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG'})
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.hasAllKeys(res.body.stockData, [
            'price',
            'stock',
            'likes']);
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
          
          done();
        });
    });

    await test('Viewing one stock and liking it', done =>{
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG', like: true })
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.hasAllKeys(res.body.stockData, [
            'price',
            'stock',
            'likes']);
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
          
          done();
        });
    });

    await test('Viewing one stock and liking it again', done =>{
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG', like: true })
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.hasAllKeys(res.body.stockData, [
            'price',
            'stock',
            'likes']);
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
          
          done();
        });
    });

    await test('Viewing two stocks', done =>{
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG','MSFT'] })
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.hasAllKeys(res.body.stockData[0], [
            'price',
            'stock',
            'rel_likes']);
            assert.hasAllKeys(res.body.stockData[1], [
              'price',
              'stock',
              'rel_likes']);
          assert.equal(res.body.stockData[0].stock, 'GOOG');
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          assert.isNumber(res.body.stockData[0].price);
          assert.isNumber(res.body.stockData[1].price);
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          
          done();
        });
    });

    await test('Viewing two stocks and liking them', done =>{
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG','MSFT'], like: true })
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.hasAllKeys(res.body.stockData[0], [
            'price',
            'stock',
            'rel_likes']);
            assert.hasAllKeys(res.body.stockData[1], [
              'price',
              'stock',
              'rel_likes']);
          assert.equal(res.body.stockData[0].stock, 'GOOG');
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          assert.isNumber(res.body.stockData[0].price);
          assert.isNumber(res.body.stockData[1].price);
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          
          done();
        });
    });


  });

});
