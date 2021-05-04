const Thing = require('../models/thing');
const fs = require('fs'); //function file system that allow to modify the file system like delete

//export all function that was in route.js
exports.createThing = (req, res, next) => { 
  const thingObject = JSON.parse(req.body.thing); //parse Json to get object utilisable
  delete thingObject._id;
  const thing = new Thing({ //a chain request that converted from Thing
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //protocol : get a segment from http, add // and a server host, folder image and filename
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ? // file ? exist or not
    {
      ...JSON.parse(req.body.thing), // if yes, parse the object and create as createThing
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //if not create one
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }) //id as a parameter to find a thing correspondance to request
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1]; //split image name and take second one after /images/ so [1]
      fs.unlink(`images/${filename}`, () => { //unlink the value that we split from image name
        Thing.deleteOne({ _id: req.params.id }) //and delete it
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};