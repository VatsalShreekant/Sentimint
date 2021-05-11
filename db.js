var { MongoClient } = require("mongodb");
//password authentication
var bcrypt = require("bcrypt");
//Added Myself as dbuser3
var url = 'mongodb+srv://dbuser_3:RGZILI0tf3AQU9Mo@cluster0.au01a.mongodb.net/sentimint?retryWrites=true&w=majority';


//CONNECT TO MONGODB
var db = null;
async function connect() {
    if (db==null) {
        var options = {
            useUnifiedTopology: true,
        };
    
        var connection = await MongoClient.connect(url, options);
        db = await connection.db("sentimint");
    }    
    return db;
}

//-------------------------------------REGISTER-BEGINS---------------------------------------------------
//REGISTER NEW USER
async function register(username, firstname, lastname, password, identification_number, email){
    var conn = await connect();
    var existingUser = await conn.collection('users').findOne({ username });

    if(existingUser !=null){
        throw new Error('User already exists!');
    }

    var SALT_ROUNDS = 10;
    var passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await conn.collection('users').insertOne({ username,firstname,lastname, passwordHash,identification_number, email});
}

//register("WEBTEST","john", "doe","1234","something@gmail.com");
//-------------------------------------REGISTER-ENDS-----------------------------------------------------

//-------------------------------------THERAPIST REGISTER-BEGINS---------------------------------------------------
//REGISTER NEW USER
async function therapistRegister(therapistUsername, therapistFirstname, therapistLastname, therapistPassword, therapistEmail, therapistCompany){
    var conn = await connect();
    var existingUser = await conn.collection('users').findOne({ therapistUsername });

    if(existingUser !=null){
        throw new Error('User already exists!');
    }

    //var SALT_ROUNDS = 10;
    //var passwordHash = await bcrypt.hash(therapistPassword, SALT_ROUNDS);

    await conn.collection('users').insertOne({therapistUsername, therapistFirstname, therapistLastname, therapistPassword, therapistEmail, therapistCompany});
}

//register("WEBTEST","john", "doe","1234","something@gmail.com");
//-------------------------------------THERAPIST REGISTER-ENDS-----------------------------------------------------

//-------------------------------------LOGIN-BEGINS------------------------------------------------------

//LOGIN 
async function login(username, password){
    var conn = await connect();
    var user = await conn.collection('users').findOne({username});
    
    if (user == null) {
        throw new Error('User does not exist!');
    }

    //console.log(user.passwordHash)
    var valid = await bcrypt.compare(password, user.passwordHash);

    if(!valid){
        throw new Error("Invalid Password!");
    }
}
//--------------------------------------LOGIN-ENDS-------------------------------------------------------
//-------------------------------------JOURNAL-BEGIN-----------------------------------------------------

async function addJournalEntry(username, entry, date, share){
    var conn = await connect();

    await conn.collection('users').updateOne(
        { username },
        {
            $push: {
                "journal.journal": entry,
                "journal.journal_date": date,
                "journal.journal_share": share

            }
        }
    )
}



//addJournalEntry("mr.bean","some journal entry","2021:01:02");


async function getJournalEntry(username,date){
    var conn = await connect();
    var user = await conn.collection('users').findOne({username});
    
    //get journal date array
    var journal_date_array = user.journal.journal_date; 
    //get index position   
    var journal_date_index = journal_date_array.lastIndexOf(date);
    //get journal array
    var journal_array = user.journal.journal;
    //get journal 
    var journal_selection = journal_array[journal_date_index]; 
    
    //console.log("journal index postion:", journal_date_index );
    console.log("journal entry:", journal_selection)
    //console.log(journal_date_array);
    
    return journal_selection
}


async function getMentalHealthResource(sentiment){

    var conn = await connect();
    var sentiment = await conn.collection('mentalhealthresources').find({sentiment}).toArray();
    //console.log(" List Articles:", sentiment);
    //console.log(sentiment)
    let sentiment_text =[];
    for (let text in sentiment){
        sentiment_text.push(sentiment[text].text);
      }
   
    return sentiment_text; 
}

//getMentalHealthResource("Joy")



//getJournalEntry("mr.bean","2021-01-03");

//--------------------------------------JOURNAL-END------------------------------------------------------
//-----------------------------MENTAL HEALTH RESOURCES-BEGIN---------------------------------------------

async function insert_article(article,sentiment,text){
    
    var conn = await connect(); 
    var existingArticle= await conn.collection("mentalhealthresources").findOne({article});
    
    if (existingArticle !=null){
        throw new Error("Mental Health Resource Article already exists!"); 
    }
    
    await conn.collection('mentalhealthresources').insertOne({article, sentiment, text});   
}



async function delete_article(article){
    
    var conn = await connect(); 
    var existingArticle= await conn.collection('mentalhealthresources').findOne({article});
    
    if (existingArticle == null){
        throw new Error("Mental Health Resource Article doesn't exist!"); 
    }
    
    await conn.collection('mentalhealthresources').deleteOne({"article" : article} );   
}


async function getListItem(article) {

    var conn = await connect();
    var article = await conn.collection('mentalhealthresources').findOne({article});
    console.log(" List Articles:", article);

    return article;
}

async function getAllListItem() {

    var conn = await connect();
    var article = await conn.collection('mentalhealthresources').distinct("article");
   
    //console.log(" List Articles:", article );

    return article
}

//-----------------------------MENTAL HEALTH RESOURCES-END---------------------------------------------

//-----------------------------APPOINTMENT SCHEDULING---------------------------------------------
async function addAppointment(username, Full_Name, Therapists_List, Appointment_Date, Appointment_Time){
    var conn = await connect();

    await conn.collection('users').updateOne(
        { username },
        {
            $push: {
                "schedule.Patient_Name": Full_Name,
                "schedule.Therapist_Name": Therapists_List,
                "schedule.Appointment_Date": Appointment_Date,
                "schedule.Appointment_Time": Appointment_Time,

            }
        }
    )
}


async function insert_appointment(appointmentDate, name, email){
    
    var conn = await connect(); 
    var existingAppointment= await conn.collection("appointments").findOne({appointmentDate});
    
    if (!appointmentDate || !name || !email){
        throw new Error("Appointment Date, Name and email are required"); 
    }
    
    await conn.collection('appointments').insertOne({appointmentDate, name, email});   
}


async function delete_appointment(appointmentDate, name, email){
    
    var conn = await connect(); 
    var existingAppointmentDate= await conn.collection('appointments').findOne({appointmentDate});
    var existingName= await conn.collection('appointments').findOne({name});
    var existingEmail= await conn.collection('appointments').findOne({email});

    if (existingAppointmentDate == null || existingName == null || existingEmail == null){
        throw new Error("Appointment Date, Name and email do not exist!"); 
    }
    
    await conn.collection('appointments').deleteOne({"appointmentDate" : appointmentDate} );   
    await conn.collection('appointments').deleteOne({"name" : name} );   
    await conn.collection('appointments').deleteOne({"email" : email} );   

}
//-----------------------------APPOINTMENT SCHEDULING END---------------------------------------------
//------------------------------GROUP REGISTRATION BEGIN----------------------------------------------


async function register_Institution( institution_name, institution_password){
    var conn = await connect();
    var existingUser = await conn.collection('institution').findOne({ institution_name,});

    if(existingUser !=null){
        throw new Error('Institution already exists!');
    }

    var SALT_ROUNDS = 10;
    var passwordHash = await bcrypt.hash(institution_password, SALT_ROUNDS);

    await conn.collection('institution').insertOne({ institution_name, passwordHash});


}

//-------------------------------GROUP REGISTRATION END----------------------------------------------
//----------------------------------GROUP LOGIN BEGIN------------------------------------------------


async function group_login(institution_name, password){
    var conn = await connect();
    var user = await conn.collection('institution').findOne({institution_name});
    
    if (institution_name == null) {
        throw new Error('Institution does not exist!');
    }

    //console.log(user.passwordHash)
    var valid = await bcrypt.compare(password, user.passwordHash);

    if(!valid){
        throw new Error("Invalid Password!");
    }
}



//------------------------------------GROUP LOGIN END------------------------------------------------
//------------------------------------GROUP JOURNAL START--------------------------------------------
async function add_identification_Number(institution_name,identification_number){
    var conn = await connect();

    await conn.collection('institution').updateOne(
        { institution_name },
        {
            $push: {
                "identification_number": identification_number,
               

            }
        }
    )
}


async function get_All_Users() {

    var conn = await connect();
    var user_list = await conn.collection('institution').distinct("identification_number");

    //console.log(user_list);

    return user_list;
}

async function get_Shared_Journal(identification_number) {

    var conn = await connect();
    var user= await conn.collection('users').findOne({identification_number});
  
    var journal_array = user.journal.journal;
    var journal_share_index = user.journal.journal_share;


    var indices = [];
    var element = 'share_journal';
    //Find index position that match keyword "share_journal"
    var idx = journal_share_index.indexOf(element);
    //return array "indices" where all values matched values have index position
    while (idx != -1) {
    indices.push(idx);
    idx = journal_share_index.indexOf(element, idx + 1);
    }
    // Find journal entries at shared journal index positions
    var only_shared_journal_entries = [];
    var i;
    for (i = 0; i < indices.length; i++) {
        only_shared_journal_entries.push(journal_array[indices[i]])
    }
    

    return only_shared_journal_entries;
}

//get_Shared_Journal("1234")

//------------------------------------GROUP JOURNAL END----------------------------------------------


module.exports = {
    url,
    login,
    register,
    therapistRegister,
    addJournalEntry,
    getJournalEntry,
    getAllListItem,
    getListItem,
    delete_article,
    insert_article,
    getMentalHealthResource,
    addAppointment,
    insert_appointment,
    delete_appointment,
    therapistRegister,
    register_Institution,
    group_login,
    add_identification_Number,
    get_All_Users,
    get_Shared_Journal,


}
