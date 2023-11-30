import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAdvJgT3Bla6puwLJR-e5hLwoub-q3B5Oc",
    authDomain: "lab4-17758.firebaseapp.com",
    projectId: "lab4-17758",
    storageBucket: "lab4-17758.appspot.com",
    messagingSenderId: "796032698447",
    appId: "1:796032698447:web:006f93f348cff88f18c23a"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {auth};