const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
	bcrypt.hash(req.body.password, 10) //Promise function async hash the passwords with 10x possibilities algorithme
	.then(hash => {
		const user = new User({
		email: req.body.email,
		password: hash
	});
	user.save() //save to the database as a promise
		.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
		.catch(error => res.status(400).json({ error }));
	})
	.catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email }) //find the same email exist in database
	.then(user => {
		if (!user) { //if not the same user
		return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //401 access unathorized
		}
		bcrypt.compare(req.body.password, user.password) //if user exist then compare by bcrypt method compare
		.then(valid => {
			if (!valid) { //if not valid
			return res.status(401).json({ error: 'Mot de passe incorrect !' }); //send error
			}
			res.status(200).json({
				userId: user._id,
				token: jwt.sign( //use a sign function of jsonwebtoken to generate a token
				  { userId: user._id }, //this token has an id as a payload (a data generate from token)
				  'RANDOM_TOKEN_SECRET', //temporary keyword to generate the token
				  { expiresIn: '24h' }
				)
			});
		})
		.catch(error => res.status(500).json({ error })); //500 error server
	})
	.catch(error => res.status(500).json({ error }));
};