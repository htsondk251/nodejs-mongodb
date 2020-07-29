const express = require("express")
const bodyParser = require("body-parser")
const { Db } = require("mongodb")
const MongoClient = require("mongodb").MongoClient 
const app = express()

let db

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
    if (err) {
        return console.log(err)
    }
    db = client.db("web")
    console.log("connected to DB")
})

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname))

app.get("/", function(req, res) { 
    db.collection("items").find().toArray().then(result => {
        // console.log(result)
        res.render("index.ejs", {result})    
    }).catch(error => {
        console.error(error)
    })
})
   
app.get("/add", function(req, res) {    
    res.render("add.ejs")
})

app.post("/new", function(req, res) {    
    db.collection("items").insertOne(req.body).then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error)
    })    
})

app.get("/items/:id", function(req, res) {
    
    let id = req.params["id"]    
    let objectId = require("mongodb").ObjectID
    db.collection("items").findOne( {_id : new objectId(id)} ).then(result => {        
        res.render("details.ejs", {result})
    }).catch(error => {
        console.error(error)
    })    
})

app.post("/items/update", function(req, res) {
    let objectId = require("mongodb").ObjectID    
    db.collection("items").findOneAndUpdate({_id: new objectId(req.body.id)}, {$set: {link:req.body.link, name:req.body.name, desc:req.body.desc}}).then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error)
    })
})

app.post("/items/delete", function(req, res) {
    let objectId = require("mongodb").ObjectID    
    db.collection("items").deleteOne( {_id: new objectId(req.body.id)} ).then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error)
    })
})

app.listen(4000, function() {
    console.log("Server listen on port 4000")
})