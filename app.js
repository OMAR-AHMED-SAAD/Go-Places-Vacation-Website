var express = require('express');
var path = require('path');
var app = express();
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://localhost:27017"); // Define my MongoDB cluster "NEEDS UPDATE IF HOSTED"
client.connect(); // Connect to the MongoDB cluster
const db = client.db('myDB');

const session = require('express-session');

app.use(session({
    secret: 'thisismysecretdonttellanyone!',
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: 'strict'}
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    if (req.session.authorized)
        res.redirect('/home');
    else
        res.redirect('/login');
});
app.get('/login', function (req, res) {
    if (req.session.authorized)
        res.redirect('/home');
    else
        res.render('login');
});
app.post('/login', function (req, res) { //NEEDS MESSAGE UPDATE
    var user = req.body.username;
    var pass = req.body.password;
    //verification(user,pass)
    if (user == 'admin' && pass == 'admin') {
        req.session.user = user;
        req.session.authorized = true;
        return res.redirect('/home');
    }
    else {
        db.collection('myCollection').findOne({ username: user, password: pass }, function (er, result) {
            if (result != null) {
                req.session.user = user;
                req.session.authorized = true;
                return res.redirect('/home');
            }
            else
                res.send({ 'error': "PLEASE ENTER A VALID USERNAME AND PASSWORD" });
            //res.redirect('/login');
        });
    }
});
app.get('/home', function (req, res) {
    if (req.session.authorized)
        res.render('home');
    else
        res.redirect('/');
});
app.get('/registration', function (req, res) {
    if (req.session.authorized)
        res.redirect('/home');
    else
        res.render('registration');
});
app.post('/register', function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    if (pass == "" || user == "")
        return res.send({ 'error': "CAN NOT HAVE EMPTY USERNAME OR PASSWORD" });
    db.collection('myCollection').findOne({ username: user }, function (er, result) {
        if (result != null) {
            return res.send({ 'error': "SOMEONE ELSE HAS the same USERNAME" });
        }
        else {
            db.collection('myCollection').insertOne({ username: user, password: pass });
            //message of success
            return res.redirect('/');
        }
    });

});
app.get('/hiking', function (req, res) {
    if (req.session.authorized)
        res.render('hiking');
    else
        return res.redirect('/');

});
app.get('/cities', function (req, res) {
    if (req.session.authorized)
        res.render('cities');
    else
        return res.redirect('/');
});
app.get('/islands', function (req, res) {
    if (req.session.authorized)
        res.render('islands');
    else
        return res.redirect('/');
});
app.get('/wanttogo', function (req, res) {
    if (req.session.authorized)
        res.render('wanttogo');
    else
        return res.redirect('/');
});

app.get('/inca', function (req, res) {
    if (req.session.authorized)
        res.render('inca');
    else
        return res.redirect('/');
});
app.get('/annapurna', function (req, res) {
    if (req.session.authorized)
        res.render('annapurna');
    else
        return res.redirect('/');
});
app.get('/paris', function (req, res) {
    if (req.session.authorized)
        res.render('paris');
    else
        return res.redirect('/');
});
app.get('/rome', function (req, res) {
    if (req.session.authorized)
        res.render('rome');
    else
        return res.redirect('/');
});
app.get('/bali', function (req, res) {
    if (req.session.authorized)
        res.render('bali');
    else
        return res.redirect('/');
});
app.get('/santorini', function (req, res) {
    if (req.session.authorized)
        res.render('santorini');
    else
        return res.redirect('/');
});

var searched_destiantions = [];
app.get('/search', function (req, res) {
    if (req.session.authorized)
        res.render('searchresults', { data: searched_destiantions });
    else
        return res.redirect('/');
});
const mydestinations = ["Inca Trail to Machu Picchu", "Annapurna Circuit", "Paris", "Rome", "Bali Island", "Santorini Island"];
app.post('/search', function (req, res) {
    var search_value = req.body.Search;
    var search_value_regular = new RegExp(search_value, "i");
    var result = [];
    mydestinations.forEach(element => {
        var y = element.match(search_value_regular);
        if (y != null)
            result.push({ 'destination': y.input });
    });
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
app.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect('/login');
});

app.listen(3000);


// need to manage all message of failure and success with their redirections
//logout button(done)
//need to manage empty search //done
//empty login creditionals remove them from db(done)