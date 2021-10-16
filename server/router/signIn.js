const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/", (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length < 1) {
				//no user found
				return res.status(401).json({
					message: "Auth Failed",
				});
			}

			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: "Auth Failed",
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							userId: user[0]._id,
							firstName: user[0].firstName,
							lastName: user[0].lastName,
							email: user[0].email,
						},
						require("../configs/default").secret_key,
						{
							expiresIn: "1h",
						}
					);
					return res.status(200).json({
						message: "Auth Successful",
						token: token,
					});
				}

				return res.status(401).json({
					message: "Auth Failed",
				});
			});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({
				error: err,
			});
		});
});

module.exports = router;
