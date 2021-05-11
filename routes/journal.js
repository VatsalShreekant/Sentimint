var express = require('express');
var router = express.Router();
var db = require("../db");

  //RETRIEVES CURRENT DATE
  // current timestamp in milliseconds
  let ts = Date.now();
  //Retrieve current data
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  //GET THE CURRENT DATE
  
  //Pad date string to match html date submission format
  if(month < 10 && date < 10){
    
    var today_date = (year + "-" + "0" + month + "-" + "0" + date);
  }
  if(month < 10 && date > 10){
    
    var today_date = (year + "-" + "0"+ month + "-" + date);
  }
  if(month > 10 && date < 10){

    var today_date = (year + "-"+ month + "-" + "0" + date);
  }
  if(month > 10 && date > 10){
  
    var today_date = (year + "-" + month + "-" + date);
  }
  // prints date & time in YYYY-MM-DD format
  //console.log(today_date);



//RENDER JOURNAL VIEW
router.get('/journal', async function(req, res){
  var { username } = req.session
  res.render('journal', { 
    title: 'Journal', 
    username,
  })
});


//GET JOURNAL ENTRY BY DATE 
router.post('/journal', async function(req, res) {
  
  var inputValue = req.body.submit;
  var { username } = req.session;
  
  if( inputValue == "Retrieve Journal Entry"){
    
    var journal_date = req.body.journal_date;
  
    res.render('journal', { 
      title: 'Journal', 
      username,
      journal_entry: await db.getJournalEntry(username,journal_date),
    });
  }
  if( inputValue == "sentiment_select"){

    var sentiment = req.body.sentiment_action;
    var new_journal_entry = req.body.new_journal_entry;
    var share_journal_entry = req.body.share_journal;

    
    await db.addJournalEntry(username, new_journal_entry, today_date, share_journal_entry)
    //res.redirect('/journal');
    //console.log(sentiment);
    //console.log(await db.getMentalHealthResource(sentiment));
    res.render('journal', { 
      title: 'Journal', 
      username,
      mental_health_resource: await db.getMentalHealthResource(sentiment),
    
    });

    //console.log(metal_health_resources.text)
    

  }
  if( inputValue == "Logout"){
    req.session.username = ' ';
    res.redirect('/login');
    console.log("test")
  }
    
});


function ensureLoggedIn(req, res, next) {
  if (!req.session.username) {
    res.redirect('/login');
  }
  else {
    next();
  }
}

router.use(ensureLoggedIn);


  module.exports = router;

