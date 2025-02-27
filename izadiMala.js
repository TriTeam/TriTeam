import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, update, remove, onValue, runTransaction, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



const firebaseConfig = {
    apiKey: "AIzaSyAeTpzrQ-V21EwUF-26DNLGY6n_ZiZ7weg",
    authDomain: "triteam-7328e.firebaseapp.com",
    databaseURL: "https://triteam-7328e-default-rtdb.firebaseio.com",
    projectId: "triteam-7328e",
    storageBucket: "triteam-7328e.appspot.com",
    messagingSenderId: "99207607267",
    appId: "1:99207607267:web:07c7b9549374b32fa326d6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth=getAuth();



const izadi=document.getElementById('izadi');

onAuthStateChanged(auth, (user) => {
  if (user) {
      const mojid = prvih6Alfanumericki(user.uid);
      izadi.addEventListener('click',() => brisanje(mojid));
  } else {
      console.log("error");
  }
});



async function brisanje(id) {
  const refi=ref(db, 'IGRA/KORISNICI/'+id+'/trenutnaIgra');
  const snapshot=await get(refi);
  const put=ref(db, 'IGRA/IGRE/'+snapshot.val())
  const snapshot2=await get(put)
  console.log(snapshot2.val())
  if(snapshot2.exists()){
    if(snapshot2.val().glavni==id){
      remove(put)
      remove(refi);
    }else{
      remove(refi);
    }
  }else{
    remove(refi);
  }
  
  

  window.location.href='menu.html'
}




function prvih6Alfanumericki(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
}