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
    text: "Here you can add your friends to your game",
    id: "kucicaPrazna2",
    next: "prijateljiBack",
    pad: "70dvh",
    tabla: "prijateljiTabla",
  },
  {
    text: "Here you will pick your color, and your settings for the race",
    id: "postavkeDiv",
    next: "postavkeDiv",
    pad: "50dvh",
    tabla: "",
  },
  {
    text: "this is your game id, if you have not added your friends in menu, you can give them game id so they can join your game",
    id: "gameID",
    next: "gameID",
    pad: "40dvh",
    tabla: "",
  },
  {
    text: "when there are 2-4 players in your loby ready button will turn green and you will be able to start a game",
    id: "ready",
    next: "ready",
    pad: "40dvh",
    tabla: "",
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
  const menuUlogiranje = snapshot.val().loby + 1;
  let novo;
  if (snapshot.val().tutorial == true) {
    setTimeout(() => tutorial(), 1500);
  }
}

function tutorial() {
  magla.style.display = "flex";
  const ovastavka = stavkeTutoriala[stavkeTutoriala[0]];
  magla.innerHTML = ovastavka.text;
  magla.style.paddingTop = ovastavka.pad;
  if (ovastavka.tabla != "") {
    document.getElementById(ovastavka.tabla).style.position = "relative";
    document.getElementById(ovastavka.tabla).style.zIndex = 550;
  }
  if (ovastavka.id != "") {
    document.getElementById(ovastavka.id).style.zIndex = 550;
    console.log(stavkeTutoriala[stavkeTutoriala[0]]);
    document.getElementById(ovastavka.id).addEventListener(
      "click",
      function () {
        magla.innerHTML = "";
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
