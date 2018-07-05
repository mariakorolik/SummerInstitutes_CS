const express = require("express");
const router = express.Router();
const gravatar = require("gravatar"); //deals with user avatar
const bcrypt = require("bcryptjs");  //encrypts data
const User = require("../../models/User");  //loads user model
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const validateLoginInput = require("../../validation/login");
const validateRegisterInput = require("../../validation/register");

//@route GET api/posts/test
//@desc Tests posts route
//@access Public

router.get("/test", (req,res) => res.json({msg: "Users works!"}));

router.post("/register", (req,res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "Email already exists"});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s : "200", //size of image
                    r : "pg", //rating
                    d : "mm" //default image
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                });
 ;           }
        })
});

router.post("/login", (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email})
        .then(user => {
            if (!user) {
                return res.status(404).json({errors:"User not found"});
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = { id: user.id, name: user.name, avatar: user.avatar };
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 36000 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    } else {
                       errors.password = "Password invalid";
                       return res.status(400).json(errors);
                    }
                });
        });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session:false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;