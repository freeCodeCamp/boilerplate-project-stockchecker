'use strict';
const mongoose = require ('mongoose');
const {ObjectID} = require ('mongodb');
const fetch = require('node-fetch');

module.exports = function (app, model) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      //create a handler and a controller
      //find stock from query line
      let stock = req.query.stock;
      let like = req.query.like;
      let ip = (req.headers['x-forwarded-for']).toString();
      console.log(like);

      //searching the database
      async function searchDatabase(data){
          let {symbol, latestPrice} = data;

          return await model.findOne({stock: symbol}, async function(err, document){
            if (err) return (err);
            if (!document){ //if there is no document
              console.log('there is no stock in db')
              let increment=0;
              if (like){ //if like exists
                increment=1;
              }
              console.log(like);
              //create new document
              const newDoc = new model({
                stock:symbol,
                price: latestPrice,
                likes: increment
              })
              console.log(newDoc.likes)
              //add ip data for verifying future likes
              newDoc.ip.push(ip);
              //save into database
              console.log(newDoc)
              //it's not awaiting for this second promise
              return await newDoc.save(async function(err, data){
                if (err) return (err);
                console.log('saving new doc')
                return newDoc;
              })
            }
            else { //if there is document in db
              console.log('there is stock in db')
              console.log(like)
              if(like){ //if like exists, check if previous ip had already liked it
                if(document.ip.includes(!ip)){ //if this is a new ip, and log does not have ip
                  document.likes = document.likes + 1; //increment document.like
                  document.ip.push(ip); //add ip to the database 
                }                
              }
              console.log(document.likes)
              //update price
              document.price = latestPrice;
              //save document
              console.log(document)

              //it's not waiting for this second promise
              return await document.save(async function(err, data){
                if(err) return err;
                console.log('updating doc in database')
                return document;
              })
            }
          })


        }


      console.log(typeof(stock));
      //stock input is an array, with two objects

      //if there are two stocks
      if (typeof(stock)=='object' && stock.length <= 2){
        
        

        //looping async calls
        async function findStockData(list){
          
          console.log('start')
          //ultimately, this is what we wll respond with after we get all the information
          let stockData = await list.map(async element => {
             const stockUrl= `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${element}/quote`;
             console.log(element);
             try{
                const response = await fetch(stockUrl);
                const data = await response.json();
                //try catch error 
                if (data === 'Unknown symbol'){
                  console.log('unknown stock or error')
                  return ({
                    "error": "external source error",
                    "likes":0
                  })
                }
                else {              
                  console.log('found stock')
                  //
                  const result = await searchDatabase(data); //send database to other function
                  console.log('result')
                  return result;
                }
             } catch (err) {
               return ({
                 "error": "external source error",
                 "likes":0
               })
             }
             
          })
          const final = await Promise.all(stockData); //only execute this once all promises executed
          console.log(final);

          //rel_likes logic here
          let firstRelLikes = final[0].likes - final[1].likes;
          let secondRelLikes = final[1].likes - final[0].likes;

          final[0].rel_likes = firstRelLikes;
          final[1].rel_likes = secondRelLikes;

          //reinitialize the object
          const filteredObj = final.map(element => {
            return (
              {
                stock: element.stock,
                price: element.price,
                rel_likes: element.rel_likes
              }
            )
          })

          return res.json({"stockData":filteredObj})
          //the basis of rel_likes is low-high, and high-low
          //if there is an error, then only rel_likes
        //need to determine rel-likes afterwards
        
        }
        findStockData(stock);

      }
      else {
        console.log('activates here')
        //this is a single stock
         //same procedures, but you need to check ip again
        //just need to add a 'for each loop for each one'
        //but the response object connects the two...somehow
      
      //if stock is a single, then..
      //ip in string format
      
      //get stock price information
      //this is only for one stock
      const stockUrl = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;

      await fetch(stockUrl)
        .then(response => response.json())
        .then(async data => {
          if(data === 'Unknown symbol'){
            res.json({
              "stockData": {
                "error": "external source error",
                "likes": 0
              }
            })
          } else {
            const result = await searchDatabase(data);
            const filtered = {
              stock: result.stock,
              price: result.price,
              likes: result.likes
            }
            res.json({"stockData": filtered})

          }  
        })
        .catch(err => {
          console.log('Err'+ err);
          res.json({
            "stockData": {
              "error": "external source error",
              "likes":0
            }
          })
        })

      };
    






    })
       
};

//should there be a mongoose component?
