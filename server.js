"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

const PORT = process.env.PORT || 7000;

let currentUser = null;

const handleHome = (req, res) => {
  if (!currentUser) {
    res.redirect("/signin");
    return;
  }

  let friendArray = users.filter(user => {
    return currentUser.friends.includes(user.id);
  });

  res.render("pages/myProfile", {
    title: "Current User Profile",
    currentUser: currentUser,
    friendArray: friendArray
  });
};

const handleSignin = (req, res) => {
  if (currentUser) {
    res.redirect("/");
    return;
  }
  res.render("pages/signinPage", {
    title: "Signin to Friendface!"
  });
};

const handleUser = (req, res) => {
  if (!currentUser) {
    res.redirect("/signin");
    return;
  }
  const id = req.params.id;
  res.send(`user id is ${id}`);
};

const handleName = (req, res) => {
  const firstName = req.query.firstName;
  currentUser = users.find(user => user.name === firstName) || null;

  res.redirect(`${currentUser ? "/" : "/signin"}`);
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHome)
  .get("/signin", handleSignin)
  .get("/user/:id", handleUser)
  .get("/getname", handleName)

  .get("*", (req, res) => {
    res.status(404);
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl
    });
  })

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
