var express = require('express');
var router = express.Router();
var db = require("../db");


//RENDER HR VIEW
router.get('/HR_view', async function(req, res){
    var { institution_name } = req.session
    res.render('HR_view', { 
      title: 'HR_view',
      institution_name,
      items: await db.get_All_Users(),
    })
  });



router.post('/HR_view', async function(req, res){
  var { institution_name } = req.session
  var inputValue = req.body.submit;
 
  var identification_number = req.body.identification_number;
  var user_selection = req.body.user_being_selected;


  //console.log(inputValue);
  //console.log(institution_name);
  //console.log(identification_number);

  if( inputValue == "Submit Identification" ){
    
    db.add_identification_Number(institution_name,identification_number)
    res.redirect(req.originalUrl);
  }


  if ( inputValue == "Select"){
    //console.log(user_selection)
    res.render('HR_view', { 
      title: 'HR_view',
      institution_name,
      items: await db.get_All_Users(),
      selected_item : await db.get_Shared_Journal(user_selection),
    })
  }
  if( inputValue == "Logout"){
    req.session.institution_name = ' ';
    res.redirect('/group_login');

  }


});






  module.exports = router;
