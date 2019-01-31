const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const session = require('express-session');
// const morgan = require('morgan');
// const users = require('../db');
// console.log(users);
// router.use(morgan('tiny'));
// console.log(users.rows[0]);
// const currentUser = require('../db').currentUser;

// console.log(currentUser);

module.exports = () => {

    router.get('/',(req,res) => {
        // console.log(req.user);
        // console.log(req.isAuthenticated());
        // console.log('logging');
        res.render('home');
        
    });

    router.get('/login', (req,res) => {
        res.render('login');
    });

    router.post('/login',passport.authenticate('local',{
        successRedirect:`/profile`,
        failureRedirect:'/login'
    }));


    // router.post('/login', async (req,res) => {

    //     return new Promise((reject,resolve) => {
    //         passport.authenticate('local',{
    //             successRedirect:`/profile`,
    //             failureRedirect:'/login'
    //         })
    //     });
        
    // })


    // router.post('/login', (req,res) => {
    //     console.log(req.body);
    //     passport.authenticate('local',{
    //         successRedirect:`/profile/${req.body.username}`,
    //         failureRedirect:'/login'
    //     });
    //     // res.redirect(`/profile/${req.body.username}`);
    // });

    // console.log();

    router.get('/register',(req,res) => {
        res.render('register');
    });
    // console.log(session);
   

    router.get(`/profile`,authenticationMiddleware(),(req,res) => {
        console.log(`in the profile api `);
        console.log(req.session.passport.user);
        console.log(req.params.id);
        // let currentLoggedinUser = req.session.passport.user.username;
        // console.log(passport);
        res.render('profile', {userName : req.session.passport.user.username});
    });

    router.post('/profile', (req,res) => {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    })

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
    
            if (req.isAuthenticated()) return req.session.passport.user,next();
            res.redirect('/login')
        }
    }

    return router;
}
