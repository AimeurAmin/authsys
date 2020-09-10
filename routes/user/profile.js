const express = require('express');
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const User = require('../../model/User');

const router = express.Router();


router.get('/myProfile', auth, (req, res) => {
    User.findById(req.user.id)
        .then(user => res.json(user))
        .catch(err => res.json({message: 'Error fetching user.'}));
})

module.exports = router