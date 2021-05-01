const express = require('express'); //import express

const bodyParser = require('body-parser'); //import body-parser

const mongoose = require('mongoose'); //import mongoose

const Thing = require('./models/thing'); //import new Mongoose modele that created in thing.js

const fs = require('fs');
const password = fs.readFileSync('./password.txt', {encoding:'utf8', flag:'r'});

mongoose.connect('mongodb+srv://desulisl31:' + password + '@desuliscluster.qrhjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 

app.use((req, res, next) => { //.use treat all type of request, 1st middleware, set a header to object response to authorize all the type of request API access
  res.setHeader('Access-Control-Allow-Origin', '*'); //object Origin allow all '*'
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //all type of Headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //all type of method
  next(); // to the next middleware 
});

app.use(bodyParser.json()); //define json as a middleware global function for app

app.post('/api/stuff', (req, res, next) => { //instance 'Thing'
  delete req.body._id; //delete the fake _id first
  const thing = new Thing({
    ...req.body //call the instance 'thing' with its contructor (title, image, etc) by operator spread ... to copy all elements req.body
  });
  thing.save() //save the 'Thing' in database
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //return Promise.then with code 201 and message
    .catch(error => res.status(400).json({ error })); //send and error if occured with code 400
});

app.put('/api/stuff/:id', (req, res, next) => { //Put request to modify the database
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) //find the same _id as parameter id, and all the body content also with same id to make sure
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/stuff/:id', (req, res, next) => { //Delete request
  Thing.deleteOne({ _id: req.params.id }) //delete object that has same id as parameter id
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/stuff/:id', (req, res, next) => { //:id as get request parameter to show in url and it is a dynamic segment
  Thing.findOne({ _id: req.params.id }) //findOne method to find a unique Thing that has same _id. Comparison _id and parameter id
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error })); //code 404 not such a file found
});

app.get('/api/stuff', (req, res, next) => { // second middleware : route .use as a string to define a URL that will be asked by frontend
  Thing.find() //find method to send back the respond in the form of table with all elements of Things
    .then(things => res.status(200).json(things)) //promise code 200
    .catch(error => res.status(400).json({ error })); //error
});


module.exports = app;