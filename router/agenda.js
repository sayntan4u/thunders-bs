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

router.get('/', requireAuth, async function (req, res) {
    res.render('agenda', { userName: req.session.userId, page: 'agenda' });
});

router.post('/getAgendas', requireAuth, async function (req, res) {
    const data = await dbm.getAgendas();
    res.send(data);
});

router.post('/addAgenda', requireAuth, async function (req, res) {
    const task = req.body.task;
    const id = req.body.id;
    dbm.addAgenda(task, id);
});

router.post('/updateAgenda', requireAuth, async function (req, res) {
    const task = req.body.task;
    const id = req.body.id;
    dbm.updateAgenda(task, id);
});

router.post('/updateConfirmAgenda', requireAuth, async function (req, res) {
    const time = req.body.time;
    const id = req.body.id;
    const isCompleted = req.body.isCompleted;
    
    dbm.updateAgenda("", id, isCompleted, time);
});

router.post('/deleteAgenda', requireAuth, async function (req, res) {
    const id = req.body.id;
    dbm.deleteAgenda(id);
});

module.exports = router;