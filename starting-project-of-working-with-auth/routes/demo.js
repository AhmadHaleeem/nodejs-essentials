const express = require('express');
const bcrypt = require("bcryptjs");

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome');
});

router.get('/signup', function (req, res) {
  let sessionInputData = req.session.userData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      password: ""
    }
  }

  req.session.userData = null;

  res.render('signup', { inputData: sessionInputData });
});

router.get('/login', function (req, res) {
  let sessionInputData = req.session.userData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: ""
    }
  }

  req.session.userData = null;

  res.render('login', { inputData: sessionInputData });
});

router.post('/signup', async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password; // 123123

  if (!enteredEmail || !enteredConfirmEmail || !enteredPassword 
    || enteredPassword.trim() < 6
    || enteredEmail !== enteredConfirmEmail || !enteredEmail.includes('@')
  ) {
    //console.log('Incorrect Data');
    req.session.userData = {
      hasError: true,
      message: "Invalid Input - please check your data",
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword
    }
    
    req.session.save(function() {
      res.redirect("/signup")
    })
    return;
  }

  const existingUser = await db.getDb().collection("users").findOne({email: enteredEmail});
  if (existingUser) {
    req.session.userData = {
      hasError: true,
      message: "User exists already!",
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword
    }

    req.session.save(function() {
      res.redirect("/signup")
    })
    return;
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12)

  const user = {
    email: enteredEmail,
    password: hashedPassword
  }

  await db.getDb().collection('users').insertOne(user);

  res.redirect('/login')
});

router.post('/login', async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredPassword = userData.password; // 123123

  const existingUser = await db.getDb()
    .collection('users')
    .findOne({ email: enteredEmail })

  if (!existingUser) {
    req.session.userData = {
      hasError: true,
      message: "Could not log you in - please check your credentails",
      email: enteredEmail,
      password: enteredPassword
    }

    req.session.save(function() {
      res.redirect("/login")
    })
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(enteredPassword, existingUser.password);

  if (!passwordsAreEqual) {
    req.session.userData = {
      hasError: true,
      message: "Could not log in! - password is not correct!",
      email: enteredEmail,
      password: enteredPassword
    }

    req.session.save(function() {
      res.redirect("/login")
    })
    return;
  }

  //console.log('User is authenticated..');
  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(function() {
    res.redirect("/profile");
  });

});

router.get('/admin', async function (req, res) {
  // Check the user 'ticket'
  if (!res.locals.isAuth) { // if (!req.session.user)
    return res.status(401).render("401");
  }

  //const user = await db.getDb().collection("users").findOne({_id: req.session.user.id});

  if (!res.locals.isAdmin) {
    return res.status(403).render("403")
  }

  res.render('admin');
});

router.get('/profile', function (req, res) {
  // Check the user 'ticket'
  if (!res.locals.isAuth) { // if (!req.session.user)
    return res.status(401).render("401");
  }
  res.render('profile');
});

router.post('/logout', function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
});

module.exports = router;
