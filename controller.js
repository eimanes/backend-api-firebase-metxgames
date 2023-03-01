const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Define the secret key for JWT token generation
const secretKey = process.env.SECRET_KEY;

// Add JWT middleware to verify token before accessing protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "undefined") {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.decoded = decoded;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const getAll = async (req, res) => {
    try {
        const snapshot = await admin.database().ref().once("value");
        const data = snapshot.val();
        return res.status(200).send(data);
      } catch (error) {
        console.error(error);
        return res.status(500).send(error);
      }
};

const getGameID = async (req, res) => {
    try {
      const { gameID } = req.params;
      const ref = admin.database().ref(`${gameID}`);
      const snapshot = await ref.once("value");
      const userData = snapshot.val();
      return res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
};

const getUserDetails = async (req, res) => {
    try {
      const { gameID, user } = req.params;
      const ref = admin.database().ref(`${gameID}/${user}`);
      const snapshot = await ref.once("value");
      const userData = snapshot.val();
      return res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
};

const login = async (req, res) => {
    try {
        const { gameID, user } = req.params;
        const { username, tokenID, time } = req.query;
        
        const ref = admin.database().ref(`${gameID}/${user}/a_General`);
        await ref.update({ a_TokenID: tokenID, b_LoginTime: time });
        
        const token = jwt.sign({ username }, secretKey, { expiresIn: '2h' }); // Generate token with username
        
        const viewModel = {
          success: true,
          message: "User login info updated successfully",
          data: {
            gameID,
            user,
            tokenID,
            time
          },
          token: token // Add token to response
        };
        return res.status(200).json({viewModel});
  
      } catch (error) {
        console.error(error);
        return res.status(500).send(error);
      }
};

const totalScore = async (req, res) => {
  try {
    const { gameID, user } = req.params;
    const score = parseInt(req.query.score);
    const now = new Date();
    const time = now.toISOString();
    const ref = admin.database().ref(`${gameID}/${user}/b_Score`);
    await ref.update({ d_TotalScore: score, e_TS_Updated: time });
    const viewModel = {
      success: true,
      message: "Total score updated",
      data: {
        score,
        time
      },
    };
    return res.status(200).json(viewModel);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};


const tokensClaim = async (req, res) => {
    try {
        const { gameID, user } = req.params;
        const amount = parseInt(req.query.amount);
        const now = new Date();
        const time = now.toISOString();
        const ref = admin.database().ref(`${gameID}/${user}/d_TokensClaim`);
        await ref.update({ g_TokensClaimed: amount, h_TC_Updated: time});
        postHistory(gameID, user, req, amount, time);
        const viewModel = {
          success: true,
          message: "Tokens claimed updated",
          data: {
            amount,
            time
          },
        };
        return res.status(200).json(viewModel);
      } catch (error) {
        console.error(error);
        return res.status(500).send(error);
      }
};

function postHistory(gameID, user, amount, time){
    const ref = admin.database().ref(`${gameID}/${user}/d_TokensClaim/z_History`);
    ref.update({ time : amount });
};

module.exports = {
    verifyToken,
    getAll,
    getGameID,
    getUserDetails,
    login,
    totalScore,
    tokensClaim
};