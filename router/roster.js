const express = require('express');
const router = express.Router();
const dbm = require("../lib/dbmanager");

const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is authenticated, continue to next middleware
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to login page
    }
}

router.get('/getRoster', requireAuth, async function (req, res) {
    const data = await dbm.getRosterData();
    res.send(data);
});

router.post('/updateRoster', requireAuth, function (req, res) {
    res.send("roster updated");
});

router.post('/clearRoster', requireAuth, function (req, res) {
    res.send("roster clear");
});

module.exports = router;