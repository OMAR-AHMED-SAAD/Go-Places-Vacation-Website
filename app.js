const { Console } = require('console');
var express = require('express');
var path = require('path');
var app = express();
var MongoClient =require('mongodb').MongoClient;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    res.render('login');
});
app.post('/',function(req,res){
    var x = req.body.username;
    var y = req.body.password;
    console.log(x);
    console.log(y);
});

MongoClient.connect("mongodb://localhost:27017",function(err,client){
    if(err) throw err;
    var db=client.db('MyDB');
   // db.collection('FirstCollection').insertOne({id: 1,firstName: 'tyty', lastName: 'rtrt'});
    db.collection('FirstCollection').find().toArray(function(er,results){
        console.log(results);
    });
});
app.listen(3000);


