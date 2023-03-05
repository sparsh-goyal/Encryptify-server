const express = require("express");
const app = express();
const crypto = require("crypto");
app.use(express.json());
const cors = require("cors");
bodyParser = require('body-parser');

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));
app.listen(5000, () => `Server running on port 5000`);

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/homepage.html");
});

app.get("/upload", (req, res) => {
  // var exportedkey = req.body.exportedkey;
  console.log(req.body.data);
  // var iv = window.Buffer.from(req.body.iv, 'base64').toString('binary');
  // var encryptedData = window.Buffer.from(req.body.encryptedData, 'base64').toString('binary');
  // console.log("ExportedKey: " + exportedkey);
  // console.log("IV: " + iv);
  // console.log("EncryptedData: " + encryptedData);
  // decryptFile(exportedkey, iv, encryptedData).then(() => res.send("Decrypted")); //post request here to send decrypted
});

const decryptFile = async (exportedkey, iv, encryptedData) => {
  let key = await crypto.subtle.importKey(
    "jwk",
    exportedkey,
    { name: "AES-CBC" },
    true,
    ["encrypt", "decrypt"]
  );

  let ivDec = new Uint8Array(iv.toString().split(","));

  let algorithm = {
    name: "AES-CBC",
    iv: ivDec,
  };

  let decryptedData = await crypto.subtle.decrypt(
    algorithm,
    key,
    encryptedData //should be coming from db
  );

  console.log(
    "The decrypted data is " + decryptedData.byteLength + " bytes long"
  ); // decrypted is an ArrayBuffer
  console.log("dec impo key", key);
  console.log("dec iv", ivDec);

  // convertToImg(decryptedData, "decryptedImg");
};
