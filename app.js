var express = require('express');
var path = require('path');
var app = express();
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://localhost:27017"); // Define my MongoDB cluster "NEEDS UPDATE WHEN HOSTED"
client.connect(); // Connect to the MongoDB cluster
const db = client.db('MyDB');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.redirect('/login');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/login', function (req, res) { //NEEDS MESSAGE UPDATE
    var user = req.body.username;
    var pass = req.body.password;
    //verification(user, pass)
    db.collection('User&Pass').findOne({ username: user, password: pass }, function (er, result) {
        if (result != null)
            return res.redirect('/home');
        else
            res.send({ 'error': "PLEASE ENTER A VALID USERNAME AND PASSWORD" });
        //res.redirect('/login');
    });
});
app.get('/home', function (req, res) {
    res.render('home');
});
app.get('/registration', function (req, res) {
    res.render('registration');
});
app.post('/register', function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    if (pass == "" || user == "")
        return res.send({ 'error': "CAN NOT HAVE EMPTY USERNAME OR PASSWORD" });
    db.collection('User&Pass').findOne({ username: user }, function (er, result) {
        if (result != null) {
            return res.send({ 'error': "SOMEONE ELSE HAS the same USERNAME" });
        }
        else {
            db.collection('User&Pass').insertOne({ username: user, password: pass });
            //message of success
            return res.redirect('/login');
        }
    });

});
app.get('/hiking', function (req, res) {
    res.render('hiking');
});
app.get('/cities', function (req, res) {
    res.render('cities');
});
app.get('/islands', function (req, res) {
    res.render('islands');
});
app.get('/wanttogo', function (req, res) {
    res.render('wanttogo');
});

app.get('/inca', function (req, res) {
    res.render('inca');
});
app.get('/annapurna', function (req, res) {
    res.render('annapurna');
});
app.get('/paris', function (req, res) {
    res.render('paris');
});
app.get('/rome', function (req, res) {
    res.render('rome');
});
app.get('/bali', function (req, res) {
    res.render('bali');
});
app.get('/santorini', function (req, res) {
    res.render('santorini');
});
app.get('/wanttogo', function (req, res) {
    res.render('wanttogo');
});

var searched_destiantions = [];
app.get('/search', function (req, res) {
    res.render('searchresults', { data: searched_destiantions });
});

app.post('/search', function (req, res) {
    var search_value = req.body.Search;
    var search_value_regular = new RegExp(search_value, "i");
    db.collection('Destinations').find({ destination: search_value_regular }).toArray(function (er, result) {
        if (result.length == 0) {
            return res.send({ 'error': "Destination not Found" })
        }
        else {
            //message of sucess
            //manage empty search case with a message too
            searched_destiantions = result;
            return res.redirect('/search');
        }

    });
});

app.listen(8080);







// need to manage all message of failure and success with their redirections
//need to manage empty search 
//empty login creditionals remove them from db