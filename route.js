const express = require("express");

const controller = require("./controller.js");

const route = express.Router();


// Add JWT middleware to verify token before accessing protected routes
const verifyToken = controller.verifyToken;

route.get("/", controller.getAll);

route.get("/:gameID", verifyToken, controller.getGameID);

route.get("/:gameID/:user", verifyToken, controller.getUserDetails);
  
route.put("/:gameID/:user/login", controller.login);
  
route.put("/:gameID/:user/totalscore", verifyToken, controller.totalScore);

route.put("/:gameID/:user/tokensclaim", verifyToken, controller.tokensClaim);

module.exports = route;