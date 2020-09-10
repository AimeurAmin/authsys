const express = require('express');
const { check, validationResult } = require('express-validator'); // to validate data received from user (email, password)
const bcrypt = require("bcryptjs"); // to hash the users passwords
const jwt = require("jsonwebtoken"); // to perform the signup, login and keeping session
const router = express.Router();

const User = require('../../model/User');


// Checking email using express-validator
const mailcheck = () => check("email", "please enter a valid email.").isEmail();

// Checking password using express-validator
// const passwordcheck = () => check("password", "please enter a valid password.").isLength({min: 6}); 

// Checking password manually
const manualpasswordcheck = (req, res, next) => { 
    if(req.body.password.length < 6) 
        return res.send("please enter a valid password") 
    else 
        next()
}

// Route for user login
router.post(
    '/login',
    mailcheck(), // validating the email using check method from express-validator
    manualpasswordcheck, // validationg the password using a simple middleware (for demo)
    async (req, res) => {
        const errors = validationResult(req); // executing the previous checks of express-validator
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()}); // returning errors of express-validator checks if any
        }

        const {email, password} = req.body;

        try {
            // Finding the user from database if exists
            User.findOne({email}).then( async user => {
                const isPasswordMatch = await bcrypt.compare(password, user.password); // checking if given password matches the one on the db
                if(isPasswordMatch){
                    // Logging in the user using JWT sign method
                    jwt.sign(
                        { // payload (any not sensitive data can be passed here to be add to the JWT token)
                            user: {
                                id: user.id
                            }
                        },
                        "secret", // Random string
                        { expiresIn: 3600 }, 
                        (err, token) => {
                            if(err) throw err; // throwing errors if any
                            res.status(200).json({token}) // successfully returning token
                        }
                    );
                } else {
                    // If password is a miss-match
                    return res.status(400).json({
                        message: "Incorrect password."
                    })
                }
            }).catch(err => {
                res.status(400).json({
                    message: "User not found! please signup first."
                })
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

module.exports = router;