import dotenv from 'dotenv';
import admin from "firebase-admin";
import routes from "./routes/router.js";
import express from "express";
import bodyParser from "body-parser";
import { Storage } from '@google-cloud/storage';

dotenv.config();

const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
};

const app = express();

const db_url = process.env.DB_URL;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: db_url
});


const storage = new Storage();
const ref = admin.database().ref("/:gameID/:user/tokensclaim");
ref.on('value', (snapshot) => {
  // Retrieve the path and data that was written
  const path = snapshot.ref.toString().replace(admin.database().ref().toString(), '');
  const data = snapshot.val();

  // Create a file in Cloud Storage with the data
  const bucketName = 'your-bucket-name';
  const fileName = `${path}-${Date.now()}.json`;
  const file = storage.bucket(bucketName).file(fileName);
  const fileContents = JSON.stringify(data);
  file.save(fileContents, { contentType: 'application/json' });
});

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Mount router middleware
app.use("/api/v1", routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
