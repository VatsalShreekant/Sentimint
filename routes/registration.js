var express = require('express');
var router = express.Router();
var db = require("../db");
//----------------------------REGISTRATION-BEGIN----------------------------------

// RENDER REGISTRATION VIEW
router.get('/registration', async function(req, res){
  res.render('registration', { title: 'Registration' })
});

// REGISTRATION FUNCTIONS
router.post('/registration', async function(req, res){

  var username = req.body.user_name; 
  var firstname = req.body.first_name; 
  var lastname = req.body.last_name;
  var identification_number = req.body.student_company_id;
  var password = req.body.password;
  var email = req.body.email; 
  
  //console.log('logging in...', username );

 
    await db.register(username, firstname, lastname, password, identification_number, email);
  

  //stores the value we pulled out of submission into a session
  req.session.username = username;
  res.redirect('/login');
});

//----------------------------REGISTRATION--END-----------------------------------
//-------------------------------LOGIN-BEGIN--------------------------------------

// RENDER LOGIN
router.get('/login', async function(req, res){
  res.render('login', { title: 'Login' })
});

// LOGIN FUNCTIONS
router.post('/login', async function(req, res){
  
  var { username, password, register } = req.body;
  //console.log('logging in...', username );

  if (register) {
    await db.register(username, password);
  }
  
  else {
    
    await db.login(username, password);
    
  }
  //stores the value we pulled out of submission into a session
  req.session.username = username;
  res.redirect('/journal')
  
  

});

//------------------------------LOGIN--END----------------------------------------


//Ensure user is logged in --- Goes in each node.js file

function ensureLoggedIn(req, res, next) {
  if (!req.session.username) {
    res.redirect('/login');
  }
  else {
    next();
  }
}

router.use(ensureLoggedIn);       // Perform user login check. 



module.exports = router;
