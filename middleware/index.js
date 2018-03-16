// all the middlewares go here
var Campground  = require('../models/campground'),
    Comment     = require('../models/comment');
var middlewareObj = {};


  middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
      Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
          req.flash('error', 'Campground not found');
          res.redirect('back');
        } else {
          if (!foundCampground) {
            req.flash('error', 'Item not found');
            res.redirect('back');
          }
          if(foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash('error', "Hey...you there...that's not yours!");
            res.redirect('back');
          }
        }
      });
    } else {
      req.flash('error', 'Please log in first');
      res.redirect('back');
    }
  }

  middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
          res.redirect('back');
        } else {
          if (!foundCampground) {
            req.flash('error', 'Item not found');
            res.redirect('back');
          }
          if(foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash('error', "Whoah now.  That's not yours!");
            res.redirect('back');
          }
        }
      });
    } else {
      res.redirect('back');
    }
  }

  middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please login first!');
    res.redirect('/login');
  }

module.exports = middlewareObj;
