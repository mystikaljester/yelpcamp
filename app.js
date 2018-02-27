var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    pug         = require('pug'),
    request     = require('request'),
    seedDB      = require('./seeds'),
    /* models */
    Campground  = require('./models/campground'),
    Comment = require('./models/comment');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

//INDEX ROUTES
app.get("/", (req, res) => res.render('landing'));
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) =>{
    if(err) {
      console.log(err)
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// CREATE ROUTE
app.post("/campgrounds",(req, res) => {
  var name = req.body.name;
  var url = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: url, description: desc };
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW ROUTE
app.get("/campgrounds/new", (req, res) => res.render("campgrounds/new"));

// SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err) {
      console.log(req.params.id);
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});


/* ================
|| COMMENTS ROUTES ||
  ================ */
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) console.log(err + "\n" + req.params.id);
    else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log (err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});


app.listen(3000, () => console.log('YelpCamp started on localhost:3000'));
