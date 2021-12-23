const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/index', (req, res) => {
    // res.send('GET request to the homepage');
    res.sendFile(path.join(__dirname,'..','views','subdir','index.html'));
})

router.get('/test', (req, res) => {
    // res.send('GET request to the homepage');
    res.sendFile(path.join(__dirname,'..','views','subdir','test.html'));
})

// sdfsd

module.exports = router;