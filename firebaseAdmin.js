const admin = require("firebase-admin");
const serviceAccount = require("./secrets.json");

export const verifyIdToken = (token) => {
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((err) => {
      throw err;
    });
};
