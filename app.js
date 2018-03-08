var express           = require('express'),
    app               = express(),
    bodyParser        = require('body-parser'),
    mongoose          = require("mongoose"),
    pug               = require('pug'),
    request           = require('request'),
    seedDB            = require('./seeds'),
    passport          = require('passport'),
    LocalStrategy     = require('passport-local'),
    methodOverride    = require('method-override'),
    /* models */
    Campground        = require('./models/campground'),
    Comment           = require('./models/comment'),
    User              = require('./models/user'),
    /* routes */
    campgroundRoutes  = require('./routes/campgrounds'),
    commentRoutes     = require("./routes/comments"),
    indexRoutes        = require('./routes/index');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'If woodchucks would chuck wood, how much wood could one chuck?',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware which passes user to every template;
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// this is how we call our routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


app.listen(3000, () => console.log('YelpCamp started on localhost:3000'));
