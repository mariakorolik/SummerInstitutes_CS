const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

//@route GET api/posts/test
//@desc Tests posts route
//@access Public
router.get("/test", (req,res) => res.json({msg: "Posts works!"}));

router.get("/", (req, res) => {
    Post.find()
        .sort({ date: "desc" })
        .then(posts => {
            if(!posts) {
                errors.nopostfound = "There are no posts found";
                return res.status(404).json();
            }
            res.json(posts);
        })
        .catch(err => res.status(404).json({ nopostfound: "No posts found"}));
});

router,get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err =>
        res.status(404).json({ nopostfound: "No post found with that ID"})
        );
});

router.delete("/:id", passport.authenticate("jwt", {session:false}), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(!profile) {
                errors.noprofile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            Post.findById(req.params.id)
                .then(post => {
                    if(!post) {
                        errors.noprofile = "There is no post with that id";
                        res.status(404).sjon(errors);
                    }
                    if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: "User not authorized"});
                    }
                    post.remove().then(() => res.json)
                })
        })
})

module.exports = router;