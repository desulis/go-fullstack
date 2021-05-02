const express = require('express'); //import express

const router = express.Router(); //method router express
// console.log(router)
const Thing = require('../models/Thing'); //import new Mongoose modele that created in thing.js, import to stuff.js as a new router file

//change app. to router. because now the router of app.js is simply using a router method
router.post('/', (req, res, next) => { //instance 'Thing', delete api/stuff 
	const thing = new Thing({
		title: req.body.title,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
		price: req.body.price,
		userId: req.body.userId
	});
	thing.save().then( //save the 'Thing' in database
	() => { //return Promise.then with code 201 and message
		res.status(201).json({
			message: 'Objet enregistré !'
		}); 
	}
	).catch(
		(error) => {
			res.status(400).json({ //send and error if occured with code 400
				error: error 
			});
		}
	); 
});

router.get('/:id', (req, res, next) => { //:id as get request parameter to show in url and it is a dynamic segment
	Thing.findOne({ //findOne method to find a unique Thing that has same _id. Comparison _id and parameter id
		_id: req.params.id
	}).then(
		(thing) => {
		res.status(200).json(thing);
		}
	).catch(
		(error) => {
			res.status(404).json({ //code 404 not such a file found
				error: error
			});
		}
	);
});

router.put('/:id', (req, res, next) => { //Put request to modify the database
	const thing = new Thing({
		_id: req.params.id,
		title: req.body.title,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
		price: req.body.price,
		userId: req.body.userId
	});
	Thing.updateOne({_id: req.params.id}, thing).then( //find the same _id as parameter id, and all the body content also with same id to make sure
		() => {
			res.status(201).json({
				message: 'Thing updated successfully!'
			});
		}
	).catch(
		(error) => {
			res.status(400).json({
				error: error
			});
		}
	);
});

router.delete('/:id', (req, res, next) => { //Delete request
	Thing.deleteOne({_id: req.params.id}).then( //delete object that has same id as parameter id
		() => {
			res.status(200).json({
				message: 'Deleted!'
			});
		}
	).catch(
		(error) => {
			res.status(400).json({
				error: error
			});
		}
	);
});

router.get('/' +
	'', (req, res, next) => {
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
});

module.exports = router;