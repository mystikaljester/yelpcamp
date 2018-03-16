var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    Campground  = require('../models/campground'),
    middleware  = require('../middleware');

// show all campgrounds
router.get('/', (req, res) => {
  Campground.find({}, (err, allCampgrounds) =>{
    if(err) {
      console.log(err)
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

// CREATE - Add new campground to DB
router.post('/', middleware.isLoggedIn,(req, res) => {
  var name = req.body.name;
  var url = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: url, description: desc, author: author };
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => res.render('campgrounds/new'));

// SHOW ROUTE
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err) {
      console.log(req.params.id);
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
    if(err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground:foundCampground});
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Campground removed successfully');
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
