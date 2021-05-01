const mongoose = require('mongoose'); //import mongoose

const thingSchema = mongoose.Schema({ //use object Schema to create a schema of database
  title: { type: String, required: true }, //constructor type String and it's required, if it's empty then error
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true }, //type Number for a price
});

module.exports = mongoose.model('thing', thingSchema); //export the module thingSchema in 'thing' as a model to create database