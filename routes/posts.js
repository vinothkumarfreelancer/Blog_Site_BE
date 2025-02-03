const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");



//CREATE POST 
// router.post("/", async (req, res) => {
//     const newPost = new Post(req.body);
//     try {
//         const savedPost = await newPost.save();
//         res.status(201).json(savedPost);
//     } catch (error) {
//         console.error("Error saving post:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

router.post("/", async (req, res) => {
    const { title, desc, photo, username, categories } = req.body;

    // Check if the username is provided in the request body
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        // Create a new post with the provided data
        const newPost = new Post({
            title,
            desc,
            photo,
            username,
            categories
        });

        // Save the new post to the database
        const savedPost = await newPost.save();

        // Respond with the saved post
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error saving post:", error);

        // Check for validation errors and send a response
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        // If another error occurs, send a general internal server error
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// UPDATE POST
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                    }, 
                    { new:true }
                );
                res.status(200).json(updatedPost);
            } 
            catch (error) {
                res.status(500).json(error);
            }
        }
        else{
            res.status(401).json("You can update only your post")
        }
    } catch (error) {
        res.status(500).json(error);
    }
});



// DELETE POST 
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try {
                // await post.remove();
                await Post.findByIdAndDelete(req.params.id);
                res.status(200).json("Post has been deleted...");
            } 
            catch (error) {
                res.status(500).json(error);
            }
        }
        else{
            res.status(401).json("You can delete only your post")
        }
    } catch (error) {
        res.status(500).json(error);
    }
});



// GET POST
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});




//GET ALL POSTS
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if(username){
            posts = await Post.find({username});
        }
        else if(catName){
            posts = await Post.find({
                categories:{
                    $in:[catName],
                },
            });
        }
        else{
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});





module.exports = router 