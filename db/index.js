const MongoClient= require('mongodb').MongoClient;

const CONNECTION_STRING = process.env.DB;

function getDb() {
  return MongoClient
    .connect(CONNECTION_STRING, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Database connected successfully.`);
        return client.db('stocks');
    })
    .catch(err => {
      console.log('Database error: ' + err);
  })
}

module.exports = getDb();