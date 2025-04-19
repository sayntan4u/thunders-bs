const express = require('express');

const router = express.router();

router.get('/', function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.render('login');
    }

});

router.post('/', function (req, res) {

    if (req.body.userID == "Admin" && req.body.pass == "123") {
        req.session.userId = req.body.userID; // Set session identifier
        res.redirect('/');
    } else {
        res.render('login');
    }

});


router.get('/logout', requireAuth, function (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });


module.exports = router;