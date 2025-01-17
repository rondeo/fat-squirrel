const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;
const dbName = 'fat_squirrel';
var db;
MongoClient.connect(url, function(err, dbase) {
    if (err === null) {
       db = dbase.db();
    } else {
        console.log('No connection to mongo!');
    }
});
router.get('/', function(req, res, next) {
    const dishCollection = db.collection('dishes');
    dishCollection.find({}).toArray((err, docs) => res.send(docs));
});

router.get('/search', function(req, res, next) {
    const dishCollection = db.collection('dishes');
    const terms = req.query.query;
    console.log(terms);
    if (terms === null || terms === '') {
        res.send({});
    } else {
        dishCollection.find(
            {
                $text: {
                    $search: terms
                }
            }
        ).toArray((err, docs) => res.send(docs));
    }
});

router.post('/upload', function(req, res, next) {
    const dishCollection = db.collection('dishes');
    dishCollection.insertMany(req.body);
    res.send('OK');
});

module.exports = router;
