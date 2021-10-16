const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

router.post("/", (req, res, next) => {
	console.log(req.body);
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length >= 1) {
				// user exists
				return res.status(409).json({
					message: "User already exist",
				});
			} else {
				// Generate User
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						console.log(err);
						return res.status(500).json({
							error: err,
						});
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							email: req.body.email,
							password: hash,
						});

						user
							.save()
							.then(result => {
								console.log(result);
								return res.status(201).json({
									message: "User created",
								});
							})
							.catch(err => {
								console.log(err);
								return res.status(500).json({
									error: err,
								});
							});
					}
				});
			}
		})
		.catch(err => {
			console.log(err);
			return res.status(422).json({
				error: err,
			});
		});
});

module.exports = router;
