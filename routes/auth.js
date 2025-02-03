const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//REGISTER
router.post("/register", async (req, res) => {
    try {
        // hide the password in hash number
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

 
// LOGIN
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        // If no user inside DB
        if (!user) {
            return res.status(400).json("User not found");
        }

        // if the password is correct using compare method
        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        // If the password is not valid
        if (!isValidPassword) {
            return res.status(400).json("Invalid password");
        }

        // Don't want to send password to user
        const { password, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
})

module.exports = router 