import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "XX",
    authDomain: "access-9b291.firebaseapp.com",
    databaseURL: "https://access-9b291.firebaseio.com",
    projectId: "access-9b291",
    storageBucket: "access-9b291.appspot.com",
    messagingSenderId: "XX",
    appId: "XX",
    measurementId: "XX"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  var storage = firebase.storage();

  export {storage, firebase as default};