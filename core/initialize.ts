import { getApps, initializeApp } from "firebase/app";

export function initAppIfNeeded() {
  const firebaseConfig = require("../../../firebase-config.js")["default"];
  if (getApps().length > 0) {
    return;
  }
  initializeApp(firebaseConfig);
}
