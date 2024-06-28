const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

describe('Functional Tests', function () {
    it('should return the stock data', done => {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG')
            .end((err, res) => {
                assert.isString(res.body.stockData.stock);
                assert.isNumber(res.body.stockData.price);
                assert.isNumber(res.body.stockData.likes);
                assert.strictEqual(res.body.stockData.likes, 0);
                done();
            });
    });

    it('should return the stock data when liked', done => {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                assert.isString(res.body.stockData.stock);
                assert.isNumber(res.body.stockData.price);
                assert.isNumber(res.body.stockData.likes);
                assert.strictEqual(res.body.stockData.likes, 1);
                done();
            });
    });

    it('viewing the same stock and liking it again', done => {
        const requester = chai.request(server);

        requester.get('/api/stock-prices?stock=MSFT&like=true')
            .end()
        requester.get('/api/stock-prices?stock=MSFT&like=true')
            .end((err, res) => {
                assert.isString(res.body.stockData.stock);
                assert.isNumber(res.body.stockData.price);
                assert.isNumber(res.body.stockData.likes);
                assert.strictEqual(res.body.stockData.likes, 1);
                done();
            });
    });

    it('viewing two stocks', done => {
        chai.request(server)
            .get('/api/stock-prices?stock=MSFT&stock=GOOG')
            .end((err, res) => {
                assert.isArray(res.body.stockData)
                assert.isString(res.body.stockData[0].stock);
                assert.isNumber(res.body.stockData[0].price);
                assert.isNumber(res.body.stockData[0].rel_likes);
                assert.strictEqual(res.body.stockData[0].rel_likes, 0);

                assert.isString(res.body.stockData[1].stock);
                assert.isNumber(res.body.stockData[1].price);
                assert.isNumber(res.body.stockData[1].rel_likes);
                assert.strictEqual(res.body.stockData[1].rel_likes, 0);
                done();
            });
    });

    it('viewing two stocks and liking them', done => {
        chai.request(server)
            .get('/api/stock-prices?stock=MSFT&stock=GOOG&like=true')
            .end((err, res) => {
                assert.isArray(res.body.stockData)
                assert.isString(res.body.stockData[0].stock);
                assert.isNumber(res.body.stockData[0].price);
                assert.isNumber(res.body.stockData[0].rel_likes);
                assert.strictEqual(res.body.stockData[0].rel_likes, 0);

                assert.isString(res.body.stockData[1].stock);
                assert.isNumber(res.body.stockData[1].price);
                assert.isNumber(res.body.stockData[1].rel_likes);
                assert.strictEqual(res.body.stockData[1].rel_likes, 0);
                done();
            });
    });
});
