import controller from "../controllers/controller.js";
import audit from "../controllers/audit.controller.js";
import express from "express";

const router = express.Router();

// Add JWT middleware to verify token before accessing protected routes
const verifyToken = controller.verifyToken;

router.get("/", controller.getAll);

router.get("/:gameID", verifyToken, controller.getGameID);

router.get("/:gameID/:user", verifyToken, controller.getUserDetails);
  
router.put("/:gameID/:user/login", controller.login);
  
router.put("/:gameID/:user/totalscore", verifyToken, controller.totalScore);

router.put("/:gameID/:user/tokensclaim", verifyToken, controller.tokensClaim);

router.get("/gethistory", verifyToken, audit.getHistory);

router.post("/updatehistory", verifyToken, audit.updateHistory);

export default router;
