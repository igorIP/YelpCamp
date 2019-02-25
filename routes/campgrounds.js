//@ts-check
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//INDEX ROUTE - show all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});

//CREATE ROUTE - adds new camps to DB
router.post("/", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampgrounds = { name: name, image: image, description: description,author:author };
    Campground.create(newCampgrounds, function (err, newlyCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});

//NEW ROUTE - display form to add new camp to DB
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW ROUTE - display info about ONE camp with ID
router.get("/:id", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
})

//EDIT Campground
router.get("/:id/edit", function (req, res){
    Campground.findById(req.params.id, function (err, campground) {
       if (err) {
           res.redirect("/campgrounds");
       } 
       else {
            res.render("campgrounds/edit", {campground: campground});        
       }
    });
});

//Update Campground
router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    
})

//Destroy campground
router.delete("/:id", function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds");
        }
    })
})


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;