import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
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
const upcomingField = document.getElementById("upcomingRaces");
const finishedField = document.getElementById("finishedRaces");

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("sve");

  setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        if (content) {
          content.style.display = "flex";
          setTimeout(() => {
            content.style.opacity = "1";
          }, 50);
        }
      }, 300);
    }
  }, 800);
});

const tekstRef = ref(db, "FANTASY/utrke");

function normalizujDatum(datum) {
  const [g, m, d] = datum.split("-");
  return `${g.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

try {
  const snapshot = await get(tekstRef);

  const listaUtrka = Object.entries(snapshot.val());

  const sortirana = listaUtrka.sort((a, b) => {
    const datumA = normalizujDatum(a[1].datum);
    const datumB = normalizujDatum(b[1].datum);
    return datumA.localeCompare(datumB);
  });

  for (let i = 0; i < sortirana.length; i++) {
    stvaranjeUtrke(sortirana[i]);
  }
} catch (error) {
  console.error("Greška pri radu sa Firebase-om:", error);
}

function stvaranjeUtrke(utrka) {
  let podatciUtrke = utrka[1];
  const divUtrke = document.createElement("div");
  divUtrke.className = "divUtrke";

  if (podatciUtrke.tip === "HTL")
    divUtrke.style.backgroundColor = "rgb(102, 102, 255)";
  else if (podatciUtrke.tip === "PH")
    divUtrke.style.backgroundColor = "rgb(212, 57, 106)";
  else if (podatciUtrke.tip === "MIXED RELAY")
    divUtrke.style.backgroundColor = "rgb(88, 165, 0)";

  const datumITip = document.createElement("div");
  datumITip.className = "datumITip";

  const datum = document.createElement("div");
  datum.innerHTML = podatciUtrke.datum;
  datum.className = "datum";

  const tip = document.createElement("div");
  tip.innerHTML = podatciUtrke.tip;
  tip.className = "tip";

  datumITip.append(datum, tip);
  divUtrke.append(datumITip);

  const imeUtrke = document.createElement("div");
  imeUtrke.innerHTML = utrka[0];
  imeUtrke.className = "imeUtrke";

  divUtrke.append(imeUtrke);

  const imeMjesto = document.createElement("div");
  imeMjesto.innerHTML = podatciUtrke.mjesto;
  imeMjesto.className = "mjestoUtrke";

  divUtrke.append(imeMjesto);

  const datumUtrke = new Date(normalizujDatum(podatciUtrke.datum));
  const danas = new Date();

  if (datumUtrke < danas) {
    finishedField.append(divUtrke);
  } else {
    upcomingField.append(divUtrke);
  }
}
