
async function fetchStockData(stockSymbol, like, clientIP) {
    // Fetch stock data from an external API (you can replace this URL with the actual API you want to use)
  //   const apiUrl = `https://stock-price-checker-proxy.freecodecamp.rocks/${stockSymbol}/quote`;
  let data;
  await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol}/quote`).then(async res=>{
   data = await res.json()
  return data})
  
    return data
  
  
  
  
  
    // TODO: Implement logic to handle likes
      //   if (like) {
      //     // Example: Implement a function to add a like for a stock based on clientIP
      //     stockData.likes = addLike(stockSymbol, clientIP);
      //   }
  
      //   return stockData;
      // }
  
      // // Example function to add a like for a stock based on clientIP
      // function addLike(stockSymbol, clientIP) {
      //   // TODO: Implement your logic to add a like for a stock based on the clientIP
      //   // Make sure to track unique likes per IP
      //   // You can use a database or an in-memory data structure for this purpose
      //   return 1; // Return the updated likes count
      // }
  
  }
  module.exports = fetchStockData;
  