var express = require('express');
var router = express.Router();
var db = require("../db");


//---------------------------GROUP LOGIN-BEGIN------------------------------------

// RENDER LOGIN
router.get('/group_login', async function(req, res){
    res.render('group_login', { title: 'Group Login' })
  });
  
  // LOGIN FUNCTIONS
  router.post('/group_login', async function(req, res){
    
    var institution_name = req.body.institution_name;
    var institution_password = req.body.institution_password;
    console.log(institution_name);
    console.log(institution_password);
    await db.group_login(institution_name, institution_password);
      
    //stores the value we pulled out of submission into a session
    req.session.institution_name = institution_name;
    res.redirect('/HR_view');


});
//---------------------------GROUP LOGIN-END------------------------------------


//-------------------------GROUP-REGISTRATION-BEGIN-------------------------------

// RENDER GROUP REGISTRATION
router.get('/group_registration', async function(req, res){
    res.render('group_registration', { title: 'Group Registration' })
  });
  
  
  
router.post('/group_registration', async function(req, res){
    
    var institution_name = req.body.institution_name;
    var institution_password = req.body.institution_password;
   
    await db.register_Institution(institution_name , institution_password );
      
    //stores the value we pulled out of submission into a session
    req.session.institution_name = institution_name ;
    res.redirect('/group_login')
    
  });
  
  //-------------------------GROUP-REGISTRATION-ENDS--------------------------------

//Ensure user is logged in --- Goes in each node.js file

function ensureLoggedIn(req, res, next) {
    if (!req.session.institution_name) {
      res.redirect('/group_login');
    }
    else {
      next();
    }
  }
  
  router.use(ensureLoggedIn);       // Perform user login check. 





  module.exports = router;
