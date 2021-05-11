var express = require('express');
var router = express.Router();
var db = require("../db");

router.get('/therapist_registration', async function(req, res){
    //var { therapistUsername } = req.session
    res.render('therapist_registration', { title: 'therapist_registration' })
  });

router.post('/therapist_registration', async function(req, res){

    var therapistUsername = req.body.therapist_username; 
    var therapistFirstname = req.body.therapist_first_name; 
    var therapistLastname = req.body.therapist_last_name;
    var therapistPassword = req.body.therapist_password;
    var therapistEmail = req.body.therapist_email; 
    var therapistCompany = req.body.therapist_company; 
    
    
    //console.log('logging in...', username );
  
   
      await db.therapistRegister(therapistUsername, therapistFirstname, therapistLastname, therapistPassword, therapistEmail, therapistCompany);
    
  
    //stores the value we pulled out of submission into a session
    req.session.therapistUsername = therapistUsername;
    res.redirect('/login');
}); 
module.exports = router;
