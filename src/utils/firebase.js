import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyACoshZhOCkXtZR0CS9LyaA3-CpzHYjNlQ",
  authDomain: "electron-22518.firebaseapp.com",
  databaseURL: "https://electron-22518.firebaseio.com",
  projectId: "electron-22518",
  storageBucket: "electron-22518.appspot.com",
  messagingSenderId: "874275605444",
  appId: "1:874275605444:web:49b173bd487258bd327291",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
