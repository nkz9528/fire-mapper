import { getApps, initializeApp } from "firebase/app";

function init() {
  const firebaseConfig = require("../../../firebase-config")["default"];
  if (getApps().length > 0) {
    return;
  }
  initializeApp(firebaseConfig);
}

export default init;
