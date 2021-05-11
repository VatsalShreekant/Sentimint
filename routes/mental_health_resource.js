var express = require('express');
var router = express.Router();
var db = require("../db");


router.get('/mental_health_resource', async function(req, res) {

  res.render('mental_health_resource', { 
    title: 'mental_health_resource', 
    items: await db.getAllListItem(),
  
})

});

router.post('/mental_health_resource', async function(req, res){    
  var inputValue = req.body.submit;
  
  if( inputValue == "Add"){                                         // Add a new mental health resource to the database. 
  await db.insert_article(req.body.article_name, req.body.sentiment_name, req.body.text_name);
  //console.log(req.body.article_name, req.body.sentiment_name, req.body.text_name)
  //console.log("Update")
  res.redirect(req.originalUrl)                                     // commands refreshes page
} 
  
  if( inputValue == "Select"){                                     // Select a mental health resource article to read.
    
    //console.log(req.body.article_being_selected);
    //console.log("Choose")
    res.render('mental_health_resource', { 
      title: 'mental_health_resource', 
      items: await db.getAllListItem(),
      selected_item: await db.getListItem(req.body.article_being_selected),
    })
   
}  

});






module.exports = router;
