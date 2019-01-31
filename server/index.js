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
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

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

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    // console.log(res.locals.userId = req.session.passport.user);
    
    next();
});
app.use('/',route());

//passport local strategy

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log(password);
        const db = require('./db');
        db.query('SELECT id,username, password  FROM testusers WHERE username = ?',[username], (err,rows,columns) => {
            if(err){
                done(null,err)
            }
            if(rows.length === 0){
                done(null,false);
            }else{
                const hash = rows[0].password;
                // console.log(hash);
                // console.log(`the password in the local strategy is ${rows[0].password} and ${unHashedPassword}`);
                bcrypt.compare(password,hash,(err, response) => {
                    console.log(password);
                    console.log(`the response is : ${response}`);
                    if(response === true){
                        return done(null, {username : rows[0].username});
                    }
                    else if(response === false){
                        return done(null, false);
                    }
                    
                });
            }
            // console.log(rows);
            // return done(null,rows);
           
        });
        
    }
  ));





app.listen(3000, () => {

    console.log('listening to the port 3000');

});

