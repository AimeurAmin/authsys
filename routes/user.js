const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require('../model/User');

router.post('/signup', 
    [
        check('username', 'please enter a valid username').not().isEmpty(),
        check('email', 'please enter a valid email').isEmail(),
        check('password', 'please enter a valid password (mix of lower & upper case required)').isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors.array())
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()});

        const {username, email} = req.body;
        let {password} = req.body;

        try {
            let user = await User.findOne({email});
            if(user){
                return res.status(400).json({msg: 'User already exisits'});
            }

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            user = new User({
                username,
                email,
                password
            });

            await user.save();

            const payload = {
                user : { id: user.id }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({token});
                }
            );

        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
)

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
    mailcheck(),
    manualpasswordcheck,
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;
        try {
            User.findOne({email}).then( async user => {
                const isPasswordMatch = await bcrypt.compare(password, user.password);
                console.log(isPasswordMatch);
                if(isPasswordMatch){
                    jwt.sign(
                        {
                            user: {
                                id: user.id
                            }
                        },
                        "secret",
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.status(200).json({token})
                        }
                    );
                } else {
                    return res.status(400).json({
                        message: "Incorrect password."
                    })
                }
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