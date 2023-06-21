//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");   // local module
const mongoose=require("mongoose");
const ejs=require('ejs');
const _=require('lodash');


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://saiteja:saiteja@cluster0.u1uz09s.mongodb.net/todolistDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const itemSchema=new mongoose.Schema({
  name:String
});

var Item= mongoose.model("Item",itemSchema);




var items=[];
var unique="";
var Unique;
var day = date.getDate();
var check=date.getDay();




const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", async function(req, res) {
  unique="";
  Item=mongoose.model("Item",itemSchema);
  

var item1= new Item({
  name:"Add to-do tasks"
});

var item2= new Item({
  name:"Delte tasks"
});

var item3= new Item({
  name:"Know more using /about page"
});

   items=await Item.find({});
  if(items.length===0){
    Item.insertMany([item1,item2,item3]);
    res.redirect('/');
  } else{ 

    res.render("list", {listTitle:day, newListItems: items});
  }

});




app.get("/:random",async function(req,res){
  items=[];
   unique= req.params.random;
   if(unique==="about"){
    res.render("about");
   } else  {
      Unique= mongoose.model(unique,itemSchema);

  items=await Unique.find({});

  res.render("list", {listTitle: unique, newListItems:items});
   }
  
});

app.post("/", function(req, res){

  var temp= req.body.newItem;
  var heading=req.body.list;
  console.log(heading);
  
  if(heading===check+","){
    Item=mongoose.model("Item",itemSchema);
    var newitem=new Item({
      name:temp
   });
    Item.insertMany([newitem]);
    res.redirect("/");
  } else{
    unique=req.body.list;
    Unique=mongoose.model( unique,itemSchema); 
    var newitem=new Unique({
      name:temp
   });
   
   Unique.insertMany([newitem]);

     
    res.redirect("/"+unique);
  }

 

   
    
    
  
});



app.post("/delete",async function(req,res){
  
  if(req.body.title===check+","){

    await Item.findByIdAndRemove(req.body.checkbox);
    res.redirect("/");
  }
   else {
    unique=req.body.title;
    Unique=mongoose.model( unique,itemSchema); 
    await Unique.findByIdAndDelete(req.body.checkbox);
    res.redirect("/"+req.body.title);
    console.log(req.body.checkbox);
  }
 
});




app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
