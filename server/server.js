const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/my-blog', { useMongoClient: true });
mongoose.Promise = Promise;

app.use(json());

app.get('*', (req, res) => {
    res.status(200).send('Hewwo');
});

module.exports = app;