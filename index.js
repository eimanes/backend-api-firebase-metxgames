const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(bodyParser.json());

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bot-game-a4374-default-rtdb.asia-southeast1.firebasedatabase.app"
});

// Define your routes here
app.get("/", async (req, res) => {
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
app.get("/:gameID", async (req, res) => {
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

app.get("/:gameID/:user", async (req, res) => {
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
    const { tokenID, loginTime } = req.body;
    const ref = admin.database().ref(`${gameID}/${user}/a_General`);
    await ref.update({ a_TokenID: tokenID, b_LoginTime: loginTime });
    return res.status(200).send("User login info updated successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

app.put("/:gameID/:user/totalscore", async (req, res) => {
    try {
        const { gameID, user } = req.params;
      const { totalScore, ts_time } = req.body;
      const ref = admin.database().ref(`${gameID}/${user}/b_Score`);
      await ref.update({ d_TotalScore: totalScore, e_TS_Updated: ts_time});
      return res.status(200).send("Total score updated");
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });

app.put("/:gameID/:user/tokensreq", async (req, res) => {
    try {
        const { gameID, user } = req.params;
      const { tokensreq, txnHash, tr_time, timestamp } = req.body;
      const ref = admin.database().ref(`${gameID}/${user}/c_TokensReq`);
      await ref.update({ a_TokensReq: tokensreq, b_TxnHash: txnHash, c_TR_Updated: tr_time, d_TimeStamp: timestamp});
      return res.status(200).send("Tokens req updated");
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });

app.put("/:gameID/:user/tokensclaim", async (req, res) => {
    try {
        const { gameID, user } = req.params;
      const { tokensclaim, tc_time } = req.body;
      const ref = admin.database().ref(`${gameID}/${user}/d_TokensClaim`);
      await ref.update({ g_TokensClaimed: tokensclaim, h_TC_Updated: tc_time});
      postHistory(gameID, user, req);
      return res.status(200).send("Tokens claim updated");
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });

function postHistory(gameID, user, req){
    const { date, amount } = req.body;
    const ref = admin.database().ref(`${gameID}/${user}/d_TokensClaim/z_History`);
    ref.update({ [date]:amount });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
