// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBuVfR4976ADdjB1Ayd_D_FS2GPTRxdB8",
  authDomain: "dance-game-36744.firebaseapp.com",
  projectId: "dance-game-36744",
  storageBucket: "dance-game-36744.appspot.com",
  messagingSenderId: "518173905749",
  appId: "1:518173905749:web:0727b8b4fac545427a95dc"
};

const fbApp = initializeApp(firebaseConfig)

export default fbApp