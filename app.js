require('dotenv').config();
require('colors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const xss = require('xss-clean');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(xss());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); /// this is the most important for this project since we will be dealing with form data
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET,
  })
);
app.use(express.static(path.join(__dirname, 'assets')));

app.use((req, res, next) => {
  // Middleware to pass global messages
  res.locals.message = req.session.message;
  req.session.message = null;
  next();
});

// Initialize engine
app.set('view engine', 'ejs');

// Routes
app.use('', userRoutes);

// Connection
const port = process.env.PORT || 3001;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`.blue.bold);
    });
  })
  .catch((error) => console.log(`Mongoose error -> ${error}`.red.bold));
