const express = require("express");
const router = express.Router();
const passport = require("passport");
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route GET api/posts/test
//@desc Tests posts route
//@access Public
router.get("/test", (req,res) => res.json({msg: "Profile works!"}));

router.get("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id})
        .then( profile => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

router.get("/handle/:handle", (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if(!profile) {
                errors.noprofile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

router.get("/user/:user_id", (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if(!profile) {
                errors.noprofile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

router.get("/all", (req, res) => {const errors ={};
    Profile.find()
        .populate("user", ["name", "avatar"])
        .then(profiles => {
            if(!profiles) {
                errors.noprofile = "There are no profiles";
                return res.status(404).json();
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({profile: "There are no profiles"}));
});

module.exports = router;