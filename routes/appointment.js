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


//----------------------------REGISTRATION-BEGIN----------------------------------

// RENDER REGISTRATION VIEW
router.get('/appointment', async function(req, res){
  var { username } = req.session
  res.render('appointment', { title: 'Appointment', username, })
});

router.post('/appointment', async function(req, res){
  var { username } = req.session;


    /*var appointmentDate = req.body.appointment_Date; 
    var name = req.body.name; 
    var email = req.body.email;
    */
    var inputValue = req.body.submit;

    if( inputValue == "Schedule Appointment!"){

      var Full_Name = req.body.Full_Name;
      var Therapists_List = req.body.Therapists_List;
      var Appointment_Date = req.body.Appointment_Date;
      var Appointment_Time = req.body.Appointment_Time;
      
      await db.addAppointment(username, Full_Name, Therapists_List, Appointment_Date, Appointment_Time)

      res.render('appointment', { 
        title: 'Appointment', 
        username
        //mental_health_resource: await db.getMentalHealthResource(sentiment),
      
      });
  
      //console.log(metal_health_resources.text)
      
  
    }    
  
   
    //await db.insert_appointment(username, appointmentDate, name, email);
   
   /* therapist.addEventListener("change", function(){
      localStorage.setItem("Therapists_List", this.value);
    });
    */
    
    
});




  module.exports = router;