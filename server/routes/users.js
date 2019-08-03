const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    try {
        User
            .find()
            .then(users => {
                res.status(200).json(users);
            });
    }
    catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:*', (req, res) => {
    try {
        User.findById(/id=(.+)(?:&|$)/.exec(req.url)[1])
            .then(user => {
                if (user === null) throw new Error(`The requested user does not exist`);
                res.status(200).json(user);
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    }
    catch (error) {
        res.status(404).send(error);
    }
});

router.post('/', (req, res) => {
    try {
        const newUser = new User(req.body);
        newUser.save((err) => {
            if (err) throw err;
            res.status(201).json(newUser)
        });
    }
    catch (error) {
        res.status(404).send(error);
    }
});

router.put('/:*', (req, res) => {
    try {
        User.updateOne({ _id: /id=(.+)(?:&|$)/.exec(req.url)[1] }, req.body, (err, raw) => {
            if (err) throw err;
            res.status(204).json(raw);
        });
    }
    catch (error) {
        res.status(404).send(error);
    }
});

router.delete('/:*', (req, res) => {
    try {
        User.deleteOne({ _id: /id=(.+)(?:&|$)/.exec(req.url)[1] }, (err) => {
            if (err) throw err;
            res.status(200).send(`Successfully deleted user with ID: ${/id=(.+)(?:&|$)/.exec(req.url)[1]}`)
        })
    }
    catch (error) {
        res.status(404).send(error);
    }
});

module.exports = router;

/*
GET	/api/users/	Get all Users	.find()
GET	/api/users/:id	Get single User	.findById()
POST	/api/users/	Create a User	.save() (read Constructing Documents)
PUT	/api/users/:id	Update a User	.findByIdAndUpdate()
DELETE	/api/users/:id	Delete a User	.findByIdAndRemove()
*/