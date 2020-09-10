const express = require('express');
const { check, validationResult } = require('express-validator'); // to validate data received from user (email, password)
const bcrypt = require("bcryptjs"); // to hash the users passwords
const jwt = require("jsonwebtoken"); // to perform the signup, login and keeping session
const router = express.Router();

const User = require('../../model/User');

// Signup Route
router.post('/signup', 
    // Running checkes on username, email and password
    [
        check('username', 'please enter a valid username').not().isEmpty(),
        check('email', 'please enter a valid email').isEmail(),
        check('password', 'please enter a valid password (mix of lower & upper case required)').isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req); // executing the previous checks
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()}); // return errors if any

        const {username, email} = req.body;
        let {password} = req.body;

        try {

            // Checking if the user already exists on the database
            let user = await User.findOne({email}); 
            if(user){
                return res.status(400).json({msg: 'User already exisits'});
            }

            // Encrypting the password
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            // Adding the user to the database
            user = new User({
                username,
                email,
                password
            });

            await user.save();

            // Creating the playload (any not sensitive data can be passed here to be add to the JWT token)
            const payload = {
                user : { id: user.id }
            };

            // Signing in the user using JWT
            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 10000
                },
                (err, token) => {
                    if(err) throw err; // throwing errors if any
                    res.status(200).json({token}) // successfully returning token
                }
            );

        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

module.exports = router;
