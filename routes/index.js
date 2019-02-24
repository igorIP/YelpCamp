//@ts-check
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//root Route
router.get("/", function (req, res) {
    res.render("landing");
});

//show register form
router.get("/register", function (req,res) {
    res.render("register")
})

//register(sign up) logic
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register"); 
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function (req,res) {
    res.render("login");
});

//login logic
router.post("/login",  
    passport.authenticate('local', 
    { 
        successRedirect: '/', 
        failureRedirect: '/login' 
    }), function(req, res) {} 
);

//logout
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

 

module.exports = router;