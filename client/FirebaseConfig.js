// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHgWIB4KiYaUiiA9RWqw5Px-A0UZjveS0",
  authDomain: "cargosync-9adc3.firebaseapp.com",
  projectId: "cargosync-9adc3",
  storageBucket: "cargosync-9adc3.appspot.com",
  messagingSenderId: "296127038117",
  appId: "1:296127038117:web:d6eaa776daf1af42ed434c",
  measurementId: "G-HJ8QGRHMCB"
};
// Initialize Firebase
const firebaseAuth = initializeApp(firebaseConfig);
const  auth = getAuth(firebaseAuth)

export default auth;