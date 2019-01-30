const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');

// const morgan = require('morgan');

// router.use(morgan('tiny'));




module.exports = () => {

    router.get('/',(req,res) => {
        console.log(req.user);
        console.log(req.isAuthenticated());
        console.log('logging');
        res.render('home');
        
    });

    router.get('/login', (req,res) => {
        res.render('login');
    });

    router.post('/login',passport.authenticate('local',{
        successRedirect:'/profile',
        failureRedirect:'/login'
    }));

    router.get('/register',(req,res) => {
        res.render('register');
    });

    router.get('/profile',authenticationMiddleware(),(req,res) => {
        res.render('profile');
    });


    router.post('/register',(req,res) => {
        // console.log(req.body.userId);
        const db = require('../db');
        let password = req.body.passcode;
        bcrypt.hash(password, saltRounds, function(err, hash) {

            // Store hash in your password DB.
            db.query("INSERT INTO testusers values(NULL,'"+req.body.name+"', '"+req.body.userId+"', '"+hash+"',DEFAULT)", (err,rows,columns) => {
                if(err){
                    console.error(err);
                }
                else{
                    db.query("SELECT LAST_INSERT_ID() as user_id", (err,rows,columns) => {
                        if(err){
                            throw err;
                        }
                        const user_id = rows[0];
                        console.log(user_id);
                        req.login(user_id,(err) => {
                            res.redirect('/login');
                        });
                    });
    
                }
            });
          });
        
        
    });
    


    passport.serializeUser(function(user_id, done) {
        done(null, user_id);
      });
       
      passport.deserializeUser(function(user_id, done) {
          done(null, user_id);
    
      });

      function authenticationMiddleware () {  
        return (req, res, next) => {
            console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    
            if (req.isAuthenticated()) return next();
            res.redirect('/login')
        }
    }

    return router;
}
