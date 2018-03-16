var express           = require('express'),
    app               = express(),
    bodyParser        = require('body-parser'), //to pull information from forms
    mongoose          = require("mongoose"), //because mongodb
    pug               = require('pug'), //our html preprocessor
    request           = require('request'), //lets us submit http requests
    seedDB            = require('./seeds'), //allows database seeding
    flash             = require('connect-flash'), //allows for flash messages (err handling)
    passport          = require('passport'), //authentication woo!
    LocalStrategy     = require('passport-local'), //allows only local un/pw
    methodOverride    = require('method-override'), //lets us override PUT because unsupport.
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
app.use(flash());

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');

  next();
});

// this is how we call our routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


app.listen(3000, () => console.log('YelpCamp started on localhost:3000'));
