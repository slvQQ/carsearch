const express = require('express')
const app = express()
const port = 3000
const path = require("path")

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'results'
const dbNamePredict = 'predictedResults'
const client = new MongoClient(url);


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "views")))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/searchcars', (req, res) => {
  res.render('search')
})

app.get('/search-result', (req,res)=>{

  const db = client.db(dbName)
  const collection = db.collection('listings');

  collection.find({
    $and: [{ $or: [
      {Name: {
        '$regex': req.query.keyword,
        '$options': 'i'} },

      {Price: {
        '$regex': req.query.keyword,
        '$options': 'i'}},

      {Year: {
        '$regex': req.query.keyword,
        '$options': 'i'}},

      {Mileage: {
        '$regex': req.query.keyword,
        '$options': 'i'}},

      {AdditionalDetails: {
        '$regex': req.query.keyword,
        '$options': 'i'}},

      {Location: {
        '$regex': req.query.keyword,
        '$options': 'i'}},

      {Link: {
        '$regex': req.query.keyword,
        '$options': 'i'}},

      {Label: {
        '$regex': req.query.keyword,
        '$options': 'i'}}
    
    ]}]
  }).toArray(function(err, listing_list){
    if(err){
      res.redirect('./');
    } else
    assert.equal(err, null);
    res.render('list', {'listings': listing_list})
  });
});

app.get('/list',(req,res)=>{
  const db = client.db(dbName)
  const collection = db.collection('listings');
  // Find some documents
  collection.find({}).toArray(function(err, listing_list) {
    assert.equal(err, null);
    res.render('list', {'listings': listing_list})
  });
})

app.get('/predictedlist',(req,res)=>{
  const db = client.db(dbNamePredict)
  const collection = db.collection('predictedListings');
  // Find some documents
  collection.find({}).toArray(function(err, predicted_listing_list) {
    assert.equal(err, null);
    res.render('predictedlist', {'predictedListings': predicted_listing_list})
  });
})


// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to mongo database");

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
});