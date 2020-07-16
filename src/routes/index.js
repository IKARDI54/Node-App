const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('Index');
});
router.get('/about', (req, res) =>{
    res.render('about');
});

module.exports = router;