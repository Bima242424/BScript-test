import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// GANTI dengan config Firebase kamu (Project settings > Web app)
const cfg = { apiKey: "AIzaSyABjQSY4Je7tq23_bLIeKCi3m8mmHBfOtA", authDomain: "bscript-e2e2d.firebaseapp.com", projectId: "bscript-e2e2d", appId: "1:41917685003:web:1e2d7c334aaa7d1bbb960e" };
const app = initializeApp(cfg);
export const db = getFirestore(app);
export const auth = getAuth(app);
