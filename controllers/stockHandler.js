const https = require('https');

function stockHandler (req, res) {
    const stock = req.query.stock;

    let options = {
        hostname: 'https://repeated-alpaca.glitch.me/v1/',
        port: 443,
        path: '/v1/stock/' + stock + '/quote',
        method: 'GET'
    }

    console.log(`req.query.stock is ${JSON.stringify(req.query.stock)}`);



}

module.exports = stockHandler;