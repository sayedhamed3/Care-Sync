// =======================
// 1. IMPORTS + CONTROLLERS
// =======================
const express = require('express');
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
require('dotenv').config()
const mongoose = require("mongoose")
console.log("Dev Branch")
const session = require('express-session');
const passUserToView = require('./middleware/pass-to-user.js')
const isSignedIn = require('./middleware/is-signed-in.js')
const path = require('path')

const authController = require('./controllers/auth.routes.js');
const patientController = require('./controllers/patient.routes.js')
const appointmentController = require('./controllers/appointment.routes.js')

// =======================
// 2. MIDDLEWARE
// =======================
app.use(express.urlencoded({ extended: false })); // parses the request body. Needed for the req.body
app.use(methodOverride("_method")); // Will change the methods for
app.use(morgan("dev")); // Logs the requests in the terminal
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")))
app.use(passUserToView)


// =======================
// 3. CONNECTION TO DATABASE
// =======================
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{console.log("Connected to DATABSE")})
.catch(()=>{console.log("ERROR CONNECTING TO DB OMAR")})

// =======================
// 4. ROUTES
// =======================
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user
  });
});

app.get('/error', (req,res) => {
  res.render('error.ejs')
})

app.use('/auth', authController);

app.use(isSignedIn)

app.use('/appointments', appointmentController)
app.use('/patients',patientController)

// =======================
// 5. LISTENING ON PORT 3000
// =======================

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
