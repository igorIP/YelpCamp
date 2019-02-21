var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require('mongoose');
// var mongo   = require("mongodb");
var assert     = require("assert");

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));

//SHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name  : String,
    image : String,
    description: String  
});

 var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function (req, res) {
   res.render("landing"); 
});


//INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req , res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE ROUTE - adds new camps to DB
app.post("/campgrounds", function(req, res){
     var name           = req.body.name;
     var image          = req.body.image;
     var description    = req.body.description;
     var newCampgrounds = {name: name, image: image, description: description};
     Campground.create(newCampgrounds, function (err, newlyCampgrounds) {
         if (err) {
             console.log(err);
         } else {
            res.redirect("/campgrounds");
         }
     })
});

//NEW ROUTE - display form to add new camp to DB
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
}); 

//SHOW ROUTE - display info about ONE camp with ID
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(3000 ,function () {
    console.log("App Server STARTED");
});

//  Campground.create(
//     {
//         name:"Bansko",
//         image:"",
//         description:"This is a beatifull place, on top of the mountain with beatiful view!"
//     }, function (err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(campground);
//         } 
//     });