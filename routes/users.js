const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");


//UPDATE
router.put("/:id", async (req, res) => {
    try {
        // if the user ID matches the one in the route parameters
        if (req.body.userId === req.params.id) {
            if (req.body.password) {
                // If a new password is provided
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            // Update the user using
            const updateUser = await User.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body,
            },
            { new: true }
            );
            
            // If the user is updated successfully
            res.status(200).json(updateUser);
        } else {
            // If the user is trying to update an account
            res.status(400).json({ error: "You can update only your account" });
        }
    } catch (error) {
        // Handle other errors
        //
        console.error("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id){
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({ username: user.username});
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
            } catch (error) {
                res.status(500).json(error);
            }
        } catch (error) {
            res.status(404).json("User not found");
        }
    }
    else{
        res.status(401).json("You can delete only your account");
    }
});


// GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router 