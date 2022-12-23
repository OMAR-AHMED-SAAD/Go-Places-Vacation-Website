var express = require('express');
var path = require('path');
var app = express();
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://localhost:27017"); // Define my MongoDB cluster "NEEDS UPDATE IF HOSTED"
client.connect(); // Connect to the MongoDB cluster
const db = client.db('myDB');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
app.use(session({
    secret: 'thisismysecretdonttellanyone!',
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: 'strict' }
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
var logfail = 0;
app.get('/login', function (req, res) {/*******************************************************************************/
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (req.session.authorized)
        res.redirect('/home');
    else {
        res.render('login', { showmsg: logfail });
        logfail = 0;
    }
});

app.post('/login', function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    //verification(user,pass)
    if (user == 'admin' && pass == 'admin') {
        req.session.user = user;
        req.session.authorized = true;
        res.redirect('/home');
    }
    else {
        db.collection('myCollection').findOne({ username: user, password: pass }, function (er, result) {
            if (result != null) {
                req.session.user = user;
                req.session.authorized = true;
                res.redirect('/home');
            }
            else {
                logfail = 1;
                res.redirect('/login');
            }
        });
    }
});
app.get('/home', function (req, res) { /*******************************************************************************/
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (req.session.authorized)
        res.render('home');
    else
        res.redirect('/login');
});
var resgisterfail = 0;
app.get('/registration', function (req, res) {
    if (req.session.authorized)
        res.redirect('/home');
    else {
        res.render('registration', { showmsg: resgisterfail });
        resgisterfail = 0;
    }
});
app.post('/register', function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    if (pass == "" || user == "") {
        resgisterfail = 1;
        res.redirect('/registration');
    }
    else {
        db.collection('myCollection').findOne({ username: user }, function (er, result) {
            if (result != null) {
                resgisterfail = 2;
                res.redirect('/registration');
            }
            else {
                logfail = 2;
                db.collection('myCollection').insertOne({ username: user, password: pass, wanttogolist: [] });
                res.redirect('/login');
            }
        });
    }

});
app.get('/hiking', function (req, res) {
    if (req.session.authorized)
        res.render('hiking');
    else
        res.redirect('/login');

});
app.get('/cities', function (req, res) {
    if (req.session.authorized)
        res.render('cities');
    else
        res.redirect('/login');;
});
app.get('/islands', function (req, res) {
    if (req.session.authorized)
        res.render('islands');
    else
        res.redirect('/login');;
});
var wanttogodestiantions = [];
app.get('/wanttogo', function (req, res) {
    if (req.session.authorized) {
        var user = req.session.user;
        db.collection('myCollection').findOne({ username: user }, function (er, result) {
            wanttogodestiantions = result.wanttogolist;
            res.render('wanttogo', { data: wanttogodestiantions });
        });
    }
    else
        res.redirect('/login');;
});

app.get('/inca', function (req, res) {
    if (req.session.authorized)
        res.render('inca');
    else
        res.redirect('/login');;
});
app.get('/annapurna', function (req, res) {
    if (req.session.authorized)
        res.render('annapurna');
    else
        res.redirect('/login');;
});
app.get('/paris', function (req, res) {
    if (req.session.authorized)
        res.render('paris');
    else
        res.redirect('/login');;
});
app.get('/rome', function (req, res) {
    if (req.session.authorized)
        res.render('rome');
    else
        res.redirect('/login');;
});
app.get('/bali', function (req, res) {
    if (req.session.authorized)
        res.render('bali');
    else
        res.redirect('/login');;
});
app.get('/santorini', function (req, res) {
    if (req.session.authorized)
        res.render('santorini');
    else
        res.redirect('/login');;
});

var searched_destiantions = [];
app.get('/search', function (req, res) {
    if (req.session.authorized)
        res.render('searchresults', { data: searched_destiantions });
    else
        res.redirect('/login');;
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
    searched_destiantions = result;
    res.redirect('/search');

});
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.post('/addwanttogo', function (req, res) {
    var destination = req.body.destination;
    var user = req.session.user;
    db.collection('myCollection').findOne({ username: user }, function (er, result) {
        var flag = 1;
        result.wanttogolist.forEach(element => {
            if (element == destination)
                flag = 0;
        });
        if (flag == 0)
            res.send('0');
        else {
            res.send('1');
            db.collection('myCollection').updateOne({ username: user }, { $push: { wanttogolist: destination } });
        }
    });
})

//app.listen(3000);
