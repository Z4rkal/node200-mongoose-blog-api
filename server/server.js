const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { json } = require('body-parser');

const app = express();

app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my-blog');
mongoose.Promise = Promise;

app.use(json());

app.use('/api/users', require('./routes/users'));
app.use('/api/blogs', require('./routes/blogs'));

app.get('*', (req, res) => {
    res.status(200).send('Hewwo, this project is just a backend, you can interact with it by sending requests to /api/users and /api/blogs with postman.');
});

module.exports = app;