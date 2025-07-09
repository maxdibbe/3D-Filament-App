// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnXR4StZ2ri3AdB3gNgfWxNaN9nYyBIOQ",
  authDomain: "dfilamentapp.firebaseapp.com",
  projectId: "dfilamentapp",
  storageBucket: "dfilamentapp.firebasestorage.app",
  messagingSenderId: "592511326712",
  appId: "1:592511326712:web:55c49e3a13d918a0fc9e0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("login-error");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      errorEl.innerText = error.message;
    });
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
