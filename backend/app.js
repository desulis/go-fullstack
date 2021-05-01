const express = require('express'); //import express

const bodyParser = require('body-parser'); //import body-parser

const mongoose = require('mongoose'); //import mongoose

const Thing = require('./models/thing'); //import new Mongoose modele that created in thing.js

mongoose.connect('mongodb+srv://desulisl31:xxx@desuliscluster.qrhjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

app.use('/api/stuff', (req, res, next) => { // second middleware : route .use as a string to define a URL that will be asked by frontend
  const stuff = [ //middleware that send a response in the form of table
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff); //object response in form of JSON and code 200 for successfull request
});

module.exports = app;