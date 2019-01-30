const express = require('express');
const route = require('./routes/routes');
const app = express();
const morgan = require('morgan');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//authentication packages
// const session = require('express-session');
const passport = require('passport');
 var LocalStrategy = require('passport-local').Strategy;

var MySQLStore = require('express-mysql-session')(session);

app.use(morgan('tiny'));
app.use(validator());

console.log(__dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(cookieParser());
// console.log(cookieParser);

app.set('views', __dirname + '/views');


const options = {
    host:'127.0.0.1',
    port:3306,
    user:'root',
    password:'ethanHunt@123',
    database: 'usersdata'
};


var sessionStore = new MySQLStore(options);


app.use(session({
    secret: 'iovskjbafg',
    store: sessionStore,
    resave: false,  
    saveUninitialized: false,
    // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',route());

//passport local strategy

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log(password);
        return done(null, 'successful');
    }
  ));





app.listen(3000, () => {

    console.log('listening to the port 3000');

});

