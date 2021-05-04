const express = require('express'); //import express

const bodyParser = require('body-parser'); //import body-parser

const mongoose = require('mongoose'); //import mongoose

const stuffRoutes = require('./routes/stuff'); //import router on stuff.js
// console.log(stuffRoutes)
const userRoutes = require('./routes/user'); //import router for user route


const fs = require('fs');
const password = fs.readFileSync('./password.txt', {encoding:'utf8', flag:'r'});

mongoose.connect('mongodb+srv://desulisl31:' + password + '@desuliscluster.qrhjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express(); 

const path = require('path'); //path to server

app.use((req, res, next) => { //.use treat all type of request, 1st middleware, set a header to object response to authorize all the type of request API access
  res.setHeader('Access-Control-Allow-Origin', '*'); //object Origin allow all '*'
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //all type of Headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //all type of method
  next(); // to the next middleware 
});

app.use(bodyParser.json()); //define json as a middleware global function for app

app.use('/api/stuff', stuffRoutes); //save as a unique route to all request on /api/stuff
app.use('/app/auth', userRoutes); //save for the user authentification
app.use('/images', express.static(path.join(__dirname, 'images'))); //indicate to express to manage 'images' in static subrepo __dirname

module.exports = app;