import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
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
const db = getDatabase(app);

const form = document.getElementById("utrkaForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const ime = document.getElementById("ime").value;
  const mjesto = document.getElementById("mjesto").value;
  const tip = document.getElementById("tip").value;
  const distanca = document.getElementById("distanca").value;
  const datum = document.getElementById("datum").value;
  const organizator = document.getElementById("organizator").value;

  const utrkaData = {
    mjesto,
    tip,
    distanca,
    datum,
    organizator,
  };

  set(ref(db, "FANTASY/utrke/" + ime), utrkaData)
    .then(() => {
      alert("Utrka uspješno prijavljena!");
      form.reset();
    })
    .catch((error) => {
      console.error("Greška pri upisu u bazu:", error);
      alert("Došlo je do greške. Pokušajte ponovno.");
    });
});
