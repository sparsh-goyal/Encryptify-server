const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const cors = require("cors");
app.use(cors());

const crypto = require("crypto");

app.use(bodyParser.json({ limit: "1mb" }));

const multer = require("multer");
const { ref, uploadBytes, getStorage } = require("firebase/storage");
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe8lHayscXRWyl328zJwyObpHjk46lkRo",
  authDomain: "encriptify-a1938.firebaseapp.com",
  projectId: "encriptify-a1938",
  storageBucket: "encriptify-a1938.appspot.com",
  messagingSenderId: "228723211733",
  appId: "1:228723211733:web:ccb97927f5964a7918d15c",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

// multer
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

app.listen(3001, () => {
  console.log("Example app listening on port 3001!");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/homepage.html");
});

let ExportedKey;
let IV;
let EncryptedData;
let transformedIV;
let transformedEncryptedData;

let fileName;
let decryptedDataVar;

app.post("/decrypt", (req, res) => {
  var startTime = new Date();
  ExportedKey = JSON.parse(atob(req.body.exportedKey));
  console.log("Received encoded ExportedKey: ", ExportedKey);

  IV = req.body.iV;
  transformedIV = convertToBinary(IV);
  console.log("Received encoded IV: ", req.body.iV);

  EncryptedData = req.body.encryptedData;
  transformedEncryptedData = convertToBinary(EncryptedData);
  console.log("Received encoded EncryptedData: ", req.body.encryptedData);

  decryptFile(startTime);

  res.end();
});

function convertToBinary(dataURI) {
  var raw = atob(dataURI);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }

  return array;
}

const decryptFile = async (startTime) => {
  let key = await crypto.subtle.importKey(
    "jwk",
    ExportedKey,
    { name: "AES-CBC" },
    true,
    ["encrypt", "decrypt"]
  );

  let ivDec = new Uint8Array(transformedIV.toString().split(","));

  let algorithm = {
    name: "AES-CBC",
    iv: ivDec,
  };

  let decryptedData = await crypto.subtle.decrypt(
    algorithm,
    key,
    transformedEncryptedData //should be coming from db / client
  );

  var elapsedTime = new Date() - startTime;
  console.log("Decryption time for client: ", elapsedTime, " ms");

  console.log("Decrypted data: ", decryptedData);

  console.warn(
    "The decrypted data is " + decryptedData.byteLength + " bytes long"
  ); // decrypted is an ArrayBuffer
  console.log("Decoded imported key: ", key);
  console.log("Decoded IV: ", ivDec);

  fileName = "decrypted.jpg";
  decryptedDataVar = decryptedData;

  app.post("/uploadDecryptedFile", async (req, res) => {
    const imageRef = ref(storage, `decrypted/${fileName}`);
    // console.log("hejrhejhrejhrjeh:->", decryptedData);
    // console.log("imageRef:->", imageRef);
    await uploadBytes(imageRef, decryptedData)
      .then((snapshot) => {
        //       // getDownloadURL(snapshot.ref)
        //       //   .then((url) => {
        //       //     console.log(url);
        console.log("done");
      })
      .catch((error) => console.log(error.message));
    // });
    //   // res.end();
  });
};
