const express = require('express');

const mysql = require('mysql');

const hbs = require('hbs');

const path = require('path');

const app = express();

var db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "adhil",
    port: 3306

});

db.connect((err) => {

    if (!err) {

        console.log("Connected")

    }

    else {

        console.log("Connection Failed")
    }
}
);



//connect viewengine
app.set('views', path.join(__dirname));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('views/firstpage')
});

// // register section
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/register', (req, res) => {
    res.render('views/register')
})
app.get('/update', (req, res) => {
    res.render('views/update')
})
app.get('/delete', (req, res) => {
    res.render('views/delete')
})


app.get('/logout', (req, res) => {
    res.render('views/firstpage')
})
// insert values to users table
app.post('/users',(req,res)=>{
    console.log(req.body);

    const sql = "INSERT INTO users (name, address, email, password) VALUES ('" + req.body.txtname + "', '" + req.body.txtaddress + "', '" + req.body.txtemail + "', '" + req.body.txtpwd + "')";



    db.query(sql,function(err,data){
        if(err){
            throw err;
        }else{
  
console.log("ok donr");
res.render('views/admin')



           



        }
    });
});

app.post('/delete',(req,res)=>{
    console.log(req.body);

    const sql = "DELETE FROM users WHERE name = '" + req.body.txtname + "'";



    db.query(sql,function(err,data){
        if(err){
            throw err;
        }else{
console.log("ok delted");
  
res.render('views/admin')



           



        }
    });
});
app.post('/Update',(req,res)=>{
    console.log(req.body);

    const sql = "UPDATE users SET name = '"+req.body.txtname+"', address = '"+req.body.txtaddress+"', email = '"+req.body.txtemail+"', password = '"+req.body.txtpwd+"' WHERE name = '"+req.body.txtname+"'";

    db.query(sql,function(err,data){
        if(err){
            throw err;
        }else{


res.render('views/admin')
  
console.log("ok upfsdsd");



           



        }
    });
});

app.get('/gotoedit', (req, res) => {
    res.render('views/edituserpage')
})
app.post('/edituser', (req, res) => {
    console.log(req.body, "edit user request");

    const { txtname, txtaddress, txtemail, txtpwd } = req.body;

   
    if (!txtemail) {
        return res.send("email is required to update user.");
    }


    let updates = [];
    if (txtaddress) updates.push(`address = '${txtaddress}'`);
    if (txtname) updates.push(`name = '${txtname}'`);
    if (txtpwd) updates.push(`password = '${txtpwd}'`);

    
    if (updates.length === 0) {
        return res.send("No fields to update.");
    }

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE email = '${txtemail}'`;
console.log(sql,"ithann  query")
    db.query(sql, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log("User updated");
           
             res.render('views/user',{ username: txtname,emailid:txtemail })
        }
    });
});

app.post('/login',(req,res)=>{

// console.log(req.body,"requestdatabody")
let {txtname,txtpwd,txtemail}=req.body
console.log(txtemail,"textemmiiklllllllll")
if (txtname=="admin" && txtpwd=="admin") {
res.render('views/admin')

    
}else{
    
}



let query = `
SELECT * FROM users 
WHERE name = "${txtname}" AND password = "${txtpwd}"
`;


db.query(query,function(err,data){
    if(err){
        throw err;
    }else{




        
        
        data.forEach(e=>{
         
           if (e.name==txtname&& e.password==txtpwd) {
            console.log("ok");                
            res.render('views/user',{ username: txtname })
            
           }else{

            console.log("incorrect")
           }
        })




    }
});





})
app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});
