//@ts-check
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
// var mongo   = require("mongodb");
var assert = require("assert");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
seedDB = require("./seeds");



mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});


//INDEX ROUTE - show all campgrounds

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

//CREATE ROUTE - adds new camps to DB

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampgrounds = { name: name, image: image, description: description };
    Campground.create(newCampgrounds, function (err, newlyCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});

//NEW ROUTE - display form to add new camp to DB

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

//SHOW ROUTE - display info about ONE camp with ID

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
})

//==========================
//COMMENTS Routes
//=========================

app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    })
})

app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});

//=========================
app.listen(3000, function () {
    console.log("App Server STARTED");
});
