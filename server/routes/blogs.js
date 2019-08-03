const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

router.get('/', (req, res) => {
    try {
        Blog
            .find()
            .then(blogs => {
                res.status(200).json(blogs);
            });
    }
    catch (error) {
        res.status(500).send(error);
    }
});

router.get('/featured', (req, res) => {
    try {
        Blog.find().where({ featured: true })
            .then(blogs => {
                if (blogs === null || blogs === 'null') throw new Error(`There are currently no featured blogs`);
                res.status(200).json(blogs);
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    }
    catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:*', (req, res) => {
    try {
        Blog.findById(/id=(.+)(?:&|$)/.exec(req.url)[1])
            .then(blog => {
                if (blog === null || blog === 'null') throw new Error(`The requested blog does not exist`);
                res.status(200).json(blog);
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    }
    catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', (req, res) => {
    try {
        let dbUser = null;

        User.findById(req.body.author)
            .then(user => {
                if (user === null) throw new Error(`Error, invalid author id`);
                dbUser = user;

                // Create a blog
                const newBlog = new Blog(req.body);

                // Bind the user ot it
                newBlog.author = user._id;

                // Save it to the database
                return newBlog.save();
            })
            .then(blog => {
                dbUser.blogs.push(blog);

                dbUser.save((err) => {
                    if (err) throw err;
                    res.status(201).json(blog)
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(404).send(err);
            })
    }
    catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:*', (req, res) => {
    try {
        Blog.updateOne({ _id: /id=(.+)(?:&|$)/.exec(req.url)[1] }, req.body, (err, raw) => {
            if (err) throw err;
            res.status(204).json(raw);
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:*', (req, res) => {
    try {
        Blog.deleteOne({ _id: /id=(.+)(?:&|$)/.exec(req.url)[1] }, (err) => {
            if (err) throw err;
            res.status(200).send(`Successfully deleted blog with ID: ${/id=(.+)(?:&|$)/.exec(req.url)[1]}`)
        })
    }
    catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

/*
GET	/api/blogs/	Get all Blogs	.find()
GET	/api/blogs/featured	Get all featured Blogs	.where()
GET	/api/blogs/:id	Get single Blog	.findById()
POST	/api/blogs	Create a Blog + associate to userId	.save() (read Creating related documents below for additional help)
PUT	/api/blogs/:id	Update a Blog	.findByIdAndUpdate()
DELETE	/api/blogs/:id	Delete a Blog	.findByIdAndRemove()
*/