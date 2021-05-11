var express = require('express');
var router = express.Router();
var db = require("../db");


router.get('/therapist', async function(req, res){
  res.render('therapist', { title: 'Therapist' })
});

module.exports = router;
