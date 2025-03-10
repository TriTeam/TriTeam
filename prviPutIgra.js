import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
  remove,
  update,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth();

const magla = document.getElementById("crnaMagla");

const stavkeTutoriala = [
  1,
  {
    text: "Here you can change the speed you want to go, your speed will depand on your selected settings for each discipline.",
    id: "samoGas",
    next: "samoGas",
    pad: "10dvh",
  },
  {
    text: "This is your energy,the higher your speed is, the more energy you will spend",
    id: "energija",
    next: "energija",
    pad: "50dvh",
  },
  {
    text: "this is game field, here you will see your rivals, yoursels and percentage of race distance done 1-100%",
    id: "utrka",
    next: "utrka",
    pad: "90dvh",
  },
  {
    text: "here are can leave game after you finish the race, make sure that you will lose points if you leave before finish",
    id: "izadi",
    next: "izadi",
    pad: "40dvh",
  },
];

onAuthStateChanged(auth, (user) => {
  if (user) {
    const mineID = prvih6Alfanumericki(user.uid);
    provjeraPrviPut(mineID);
  } else {
    console.log("error");
  }
});

async function provjeraPrviPut(id) {
  const put = ref(db, "IGRA/KORISNICI/" + id + "/ucitavanja");
  const snapshot = await get(put);

  const menuUlogiranje = snapshot.val().igra + 1;
  if (snapshot.val().tutorial == true) {
    setTimeout(() => tutorial(), 1500);
  }
}

function tutorial() {
  magla.style.display = "flex";
  const ovastavka = stavkeTutoriala[stavkeTutoriala[0]];
  magla.innerHTML = ovastavka.text;
  magla.style.paddingTop = ovastavka.pad;
  if (ovastavka.id != "") {
    document.getElementById(ovastavka.id).style.zIndex = 550;
    console.log(stavkeTutoriala[stavkeTutoriala[0]]);
    document.getElementById(ovastavka.id).addEventListener(
      "click",
      function () {
        magla.style.display = "none";
        document.getElementById(ovastavka.id).style.zIndex = "";
      },
      { once: true }
    );
  }

  document.getElementById(ovastavka.next).addEventListener(
    "click",
    function () {
      stavkeTutoriala[0]++;
      if (stavkeTutoriala[0] != 7) {
        tutorial();
      }
    },
    { once: true }
  );
}

function prvih6Alfanumericki(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 7)
    .toUpperCase();
}
