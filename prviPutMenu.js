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
    text: "HI, here is quick tutorial how to use this game...(tap to highlighted tabs to continue...)",
    id: "",
    next: "crnaMagla",
    pad: "40dvh",
    tabla: "",
  },
  {
    text: "Here you can add your friends to your friend list by entering their ID",
    id: "dodaj_prijatelja",
    next: "prijateljiBack",
    pad: "40dvh",
    tabla: "prijateljiTabla",
  },
  {
    text: "Here you can find all your data such as: name, races won, races finished, best race time, your rank and ranking info, your ID",
    id: "info_igrac",
    next: "info_igrac",
    pad: "150dvh",
    tabla: "",
  },
  {
    text: "Here you can find all the rules and scoring sistem",
    id: "rules",
    next: "pravilaBack",
    pad: "120dvh",
    tabla: "pravilaDiv",
  },
  {
    text: "Here you can join the game with game ID after your friend gives you one",
    id: "udi_igru",
    next: "udiIgruBack",
    pad: "120dvh",
    tabla: "udiIgru",
  },
  {
    text: "Here you can create the game and then invite your friends",
    id: "kreiraj_igru",
    next: "kreiraj_igru",
    pad: "110dvh",
    tabla: "",
  },
];
let mojid;

async function brisiKajNetreba(id) {
  const [igreSnap, igraIdSnap] = await Promise.all([
    get(ref(db, "IGRA/IGRE")),
    get(ref(db, `IGRA/KORISNICI/${id}/trenutnaIgra`)),
  ]);

  const promises = [];

  if (igraIdSnap.exists()) {
    const igraRef = ref(db, `IGRA/IGRE/${igraIdSnap.val()}`);
    const igraSnap = await get(igraRef);

    if (igraSnap.exists() && igraSnap.val().glavni === id) {
      promises.push(
        remove(ref(db, `IGRA/KORISNICI/${id}/trenutnaIgra`)),
        remove(igraRef)
      );
    }
  }

  if (igreSnap.exists()) {
    const igre = igreSnap.val();

    for (const key in igre) {
      const igra = igre[key];
      const idSnap = await get(ref(db, `IGRA/IGRE/${key}/id`));

      if (!idSnap.exists() || (igra.brojIgraca === 1 && "startTime" in igra)) {
        promises.push(remove(ref(db, `IGRA/IGRE/${key}`)));
      }
    }
  }

  await Promise.all(promises);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const mineID = prvih6Alfanumericki(user.uid);
    provjeraPrviPut(mineID);
    mojid = mineID;
    brisiKajNetreba(mineID);
  } else {
    console.log("error");
  }
});

async function provjeraPrviPut(id) {
  const put = ref(db, "IGRA/KORISNICI/" + id + "/ucitavanja");

  const snapshot = await get(put);
  if (snapshot.exists()) {
    const novo = {
      tutorial: false,
    };

    update(put, novo);
  } else {
    const novo = {
      tutorial: false,
    };
    set(put, novo);
    setTimeout(() => tutorial(), 1500);
  }
}

document.getElementById("tutorial").addEventListener("click", () => zvanje());

async function zvanje() {
  const put = ref(db, "IGRA/KORISNICI/" + mojid + "/ucitavanja");
  const novo = {
    tutorial: true,
  };
  update(put, novo);
  tutorial();
}

function tutorial() {
  document.getElementById("tutorial").style.display = "none";
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
      } else {
        document.getElementById("tutorial").style.display = "block";
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
