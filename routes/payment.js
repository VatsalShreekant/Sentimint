
var express = require('express');
var router = express.Router();
var db = require("../db");

router.get('/payment', async function(req, res){
    var { username } = req.session
    res.render('payment', { title: 'Payment', username })
    //let Therapists_List = (localStorage.getItem("Therapists_List")) ? localStorage.getItem("Therapists_List") : null;

  });


  
  module.exports = router;