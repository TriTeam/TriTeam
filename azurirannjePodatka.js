import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  runTransaction,
  serverTimestamp,
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
const auth = getAuth();
let kraj = true;
let uppisano = true;

onAuthStateChanged(auth, (user) => {
  if (user) {
    idutrke(prvih6Alfanumericki(user.uid));
  } else {
    console.log("error");
  }
});

async function rangiranje(igrica, id) {
  const putdoigreID = ref(db, "IGRA/KORISNICI/" + id);
  const results = igrica.rezultati;
  let mojeMjesto = null;
  let rankoviOstalih = {};
  const brIgraca = igrica.brojIgraca;

  console.log("Početak rangiranja", { igrica, id });

  if (!results || typeof results !== "object") {
    console.error("Greška: Rezultati nisu ispravni", results);
    return;
  }

  let filtriraniRezultati = Object.entries(results)
    .filter(([key, value]) => value.trim() !== "")
    .map(([key, value]) => value);

  console.log("Filtrirani rezultati:", filtriraniRezultati);

  if (!filtriraniRezultati.includes(id)) {
    console.warn("ID igrača nije pronađen u rezultatima");
    return;
  }
  uppisano = false;
  // Pronalazimo mjesto igrača
  for (let [key, igracId] of Object.entries(results)) {
    if (igracId.trim() === id.trim()) {
      mojeMjesto = parseInt(key, 10) - 1;
    }
  }

  console.log("Moje mjesto:", mojeMjesto);

  if (mojeMjesto === null) {
    console.error("Greška: Moje mjesto nije pronađeno");
    return;
  }

  // Dohvati rankove svih igrača
  for (let igracId of igrica.igraci) {
    if (igracId !== id) {
      try {
        const snapshot = await get(ref(db, "IGRA/KORISNICI/" + igracId));
        if (snapshot.exists()) {
          rankoviOstalih[igracId] = snapshot.val().rank;
        }
      } catch (error) {
        console.error(
          "Greška pri dohvaćanju podataka za igrača",
          igracId,
          error
        );
      }
    }
  }

  console.log("Rankovi ostalih igrača:", rankoviOstalih);

  let snapshot;
  try {
    snapshot = await get(putdoigreID);
    if (!snapshot.exists()) {
      console.warn("Podaci za igrača ne postoje u bazi");
      return;
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka za trenutnog igrača", error);
    return;
  }

  const mojRank = snapshot.val().rank;
  let trenutniBodovi = snapshot.val().bodoviRanka || 0;
  let trenutnePobjede = snapshot.val().pobjede || 0;
  let zavrseneIgre = snapshot.val().zavrseneIgre || 0;

  console.log("Trenutni podaci igrača:", {
    mojRank,
    trenutniBodovi,
    trenutnePobjede,
    zavrseneIgre,
  });

  const ranks = {
    Beginner: 0,
    Rookie: 100,
    Competitor: 350,
    Veteran: 600,
    Master: 1000,
  };

  const basePoints = [100, 40, -40, -100];
  const playerModifier = [0.5, 0.8, 1, 1.2];
  [filtriraniRezultati.length - 2];
  let adjustedBasePoints =
    filtriraniRezultati.length === 2
      ? [100, -100]
      : basePoints.slice(0, filtriraniRezultati.length).concat(-100);

  console.log("Moje mjesto:", mojeMjesto);
  console.log("Adjusted base points array:", adjustedBasePoints);
  console.log("Base points za moje mjesto:", adjustedBasePoints[mojeMjesto]);
  console.log("Player modifier:", playerModifier);

  let points = adjustedBasePoints[mojeMjesto] * playerModifier[brIgraca - 2];

  Object.values(rankoviOstalih).forEach((rank) => {
    let razlikaRanka = (ranks[rank] || 0) - (ranks[mojRank] || 0);
    points += (razlikaRanka / 300) * 10;
  });

  console.log("Izračunati bodovi prije zaokruživanja:", points);

  if (isNaN(points)) {
    console.error("Greška: Izračunati bodovi nisu broj", points);
    return;
  }

  trenutniBodovi = Math.max(0, trenutniBodovi + Math.round(points));

  if (mojeMjesto === 0) {
    trenutnePobjede += 1;
  }
  zavrseneIgre += 1;

  let noviRank = mojRank;
  for (const [rankName, minPoints] of Object.entries(ranks).reverse()) {
    if (trenutniBodovi >= minPoints) {
      noviRank = rankName;
      break;
    }
  }

  console.log("Novi podaci igrača prije ažuriranja:", {
    bodoviRanka: trenutniBodovi,
    rank: noviRank,
    pobjede: trenutnePobjede,
    zavrseneIgre,
  });

  try {
    await update(putdoigreID, {
      bodoviRanka: trenutniBodovi,
      rank: noviRank,
      pobjede: trenutnePobjede,
      zavrseneIgre: zavrseneIgre,
    });
    console.log("Uspješno ažurirani podaci za igrača");
  } catch (error) {
    console.error("Greška pri ažuriranju podataka", error);
  }
}

async function idutrke(id) {
  const putdoigreID = ref(db, "IGRA/KORISNICI/" + id);
  const snapshot = await get(putdoigreID);
  const mojeIME = snapshot.val().ime;
  const idgame = snapshot.val().trenutnaIgra;
  const Putigra = ref(db, "IGRA/IGRE/" + idgame);

  onValue(Putigra, (snapshot2) => {
    const igra = snapshot2.val();
    if (kraj && uppisano) {
      rangiranje(igra, id);
    }
  });
}

function prvih6Alfanumericki(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 7)
    .toUpperCase();
}
