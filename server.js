'use strict';
require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const helmet      = require('helmet');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const mongoose = require('mongoose');
const mongodb = require('mongodb');
const {MongoClient} = require('mongodb');
const ObjectID = require('mongodb').ObjectID;


const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//helmetJS security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "scriptSrc": ["'self'", "localhost", "'unsafe-inline'", "code.jquery.com"], //loading of script
      //self is required
      //localhost is required (same as self)
      //loading from jquery for code.jquery.com
      //unsafe-inline covers JS in script tags
      "styleSrc": ["'self'"] //loading of stylesheet
    }
  }
}))

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const Schema = mongoose.Schema;
const stockSchema = new Schema({
  stock: {type: String, required: true},
  price: {type: Number, required: true},
  likes: {type: Number, default: 0},
  rel_likes: {type: Number},
  ip: [{type: String}],
})

const Stock = mongoose.model('Stock', stockSchema);

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app, Stock);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
