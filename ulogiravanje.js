import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeTpzrQ-V21EwUF-26DNLGY6n_ZiZ7weg",
  authDomain: "triteam-7328e.firebaseapp.com",
  databaseURL: "https://triteam-7328e-default-rtdb.firebaseio.com",
  projectId: "triteam-7328e",
  storageBucket: "triteam-7328e.appspot.com",
  messagingSenderId: "99207607267",
  appId: "1:99207607267:web:07c7b9549374b32fa326d6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

const put = ref(db, "FANTASY/users");

onAuthStateChanged(auth, (user) => {
  if (user) {
    provjeri(user);
    console.log(user);
  } else {
    window.location.href = "login.html";
  }
});
async function provjeri(user) {
  const put = ref(db, "FANTASY/users/" + user.uid);
  const snapshot = await get(put);

  if (!snapshot.exists()) {
    // Ako korisnik ne postoji
    const korisnik = {
      ime: user.displayName,
      email: user.email,
    };
    await set(put, korisnik);
  } else {
    // Ako korisnik već postoji
    const korisnikData = snapshot.val();

    if (!korisnikData.ime) {
      // Ako nema ime, dodaj ime i email
      await update(put, {
        ime: user.displayName,
        email: user.email,
      });
    }
  }
}
