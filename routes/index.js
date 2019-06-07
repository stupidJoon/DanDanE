const express = require('express');
const passport = require('passport');
const path = require('path');
const bcyrpt = require('bcrypt');
const Users = require('../passport/user.js')

const router = express.Router();
const bcryptSettings = {
  saltRounds: 10
};

/* GET home page. */
router.get('/', (req, res) => {
  res.json({'status': 'live'});
});

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/status',
  failureRedirect: '/status'
}));

router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/status');
});

router.post('/idcheck', (req, res) => {
  Users.idCheck(req.body['id'], (result) => {
    if (result == true) {
      res.status(res.statusCode).json({ idCheck: true });
    }
    else {
      res.status(res.statusCode).json({ idCheck: false });
    }
  });
});

router.post('/signup', (req, res) => {
  bcyrpt.hash(req.body['pw'], bcryptSettings.saltRounds, (err, hash) => {
    Users.signUp(req.body['id'], hash);
    res.status(res.statusCode).json({'test': 'test'});
  });
});

router.get('/status', (req, res) => {
  console.log({'isAuthenticated': req.isAuthenticated(), 'id': (req.isAuthenticated() ? req.user['id'] : null)});
  res.status(res.statusCode).json({'isAuthenticated': req.isAuthenticated(), 'id': (req.isAuthenticated() ? req.user['id'] : null)});
});

module.exports = router;
