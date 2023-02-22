const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bot-game-a4374-default-rtdb.asia-southeast1.firebasedatabase.app"
});

// Define the secret key for JWT token generation
const secretKey = 'metx-games-secure-18-01-2023';


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

// Define your routes here
app.get("/", verifyToken, async (req, res) => {
    try {
      const snapshot = await admin.database().ref().once("value");
      const data = snapshot.val();
      return res.status(200).send(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });
  


//get list of users
app.get("/:gameID", verifyToken, async (req, res) => {
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
});

app.get("/:gameID/:user", verifyToken, async (req, res) => {
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
  });
  
  
  app.put("/:gameID/:user/login", async (req, res) => {
    try {
      const { gameID, user } = req.params;
      const { username, tokenID, time } = req.query;
      
      const ref = admin.database().ref(`${gameID}/${user}/a_General`);
      await ref.update({ a_TokenID: tokenID, b_LoginTime: time });
      
      const token = jwt.sign({ username }, secretKey, { expiresIn: null }); // Generate token with username
      
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
  });
  

app.put("/:gameID/:user/totalscore", verifyToken, async (req, res) => {
    try {
      const { gameID, user } = req.params;
      const score = parseInt(req.query.score);
      const time = req.query.time;
      const ref = admin.database().ref(`${gameID}/${user}/b_Score`);
      await ref.update({ d_TotalScore: score, e_TS_Updated: time});
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
  });

app.put("/:gameID/:user/tokensreq", verifyToken, async (req, res) => {
    try {
      const { gameID, user } = req.params;
      const amount = parseInt(req.query.amount);
      const { hash, time} = req.query;
      const timestamp = parseInt(req.query.timestamp);
      const ref = admin.database().ref(`${gameID}/${user}/c_TokensReq`);
      await ref.update({ a_TokensReq: amount, b_TxnHash: hash, c_TR_Updated: time, d_TimeStamp: timestamp});
      const viewModel = {
        success: true,
        message: "Tokens Requested updated",
        data: {
          amount,
          hash,
          time,
          timestamp
        },
      };
      return res.status(200).json(viewModel);

    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });

app.put("/:gameID/:user/tokensclaim", verifyToken, async (req, res) => {
    try {
      const { gameID, user } = req.params;
      const amount = parseInt(req.query.amount);
      const time = req.query.time;
      const ref = admin.database().ref(`${gameID}/${user}/d_TokensClaim`);
      await ref.update({ g_TokensClaimed: amount, h_TC_Updated: time});
      postHistory(gameID, user, req);
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
  });

function postHistory(gameID, user, req){
    const { date, amount } = req.query;
    const ref = admin.database().ref(`${gameID}/${user}/d_TokensClaim/z_History`);
    ref.update({ [date]:amount });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
