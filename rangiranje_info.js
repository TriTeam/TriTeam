import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
  remove,
  update,
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

const info = document.getElementById("kako_rangirat");
const back = document.getElementById("infoRankBack");
const tabla = document.getElementById("infoRank");
const tabla_join = document.getElementById("udiIgru");
const back_join = document.getElementById("udiIgruBack");
const zaJoinTablu = document.getElementById("udi_igru");
const prijatelji = document.getElementById("dodaj_prijatelja");
const prijateljiBack = document.getElementById("prijateljiBack");
const prijateljiTabla = document.getElementById("prijateljiTabla");
const rank = document.getElementById("rank");
const linijaa = document.getElementById("rankPomicanje");
const pravila = document.getElementById("rules");
const pravilaBack = document.getElementById("pravilaBack");
const pravilaDiv = document.getElementById("pravilaDiv");

back.addEventListener("click", function () {
  tabla.style.display = "none";
});
info.addEventListener("click", function () {
  tabla.style.display = "block";
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const id = prvih6Alfanumericki(user.uid);
    statusic(id);
  } else {
    console.log("error");
  }
});

async function statusic(id) {
  const put = ref(db, "IGRA/KORISNICI/" + id);
  const snapshot = await get(put);
  const ja = snapshot.val();
  const bestTime = ja.vrijemeBest;
  console.log(bestTime);
  if (bestTime != undefined) {
    document.getElementById("timeBest").innerHTML = bestTime;
  } else {
    document.getElementById("timeBest").innerHTML = "none";
  }
  const rankic = ja.rank;

  const vrijednostR = ja.bodoviRanka;
  switch (rankic) {
    case "Beginner":
      rank.className = "Beginner";
      break;
    case "Rookie":
      rank.className = "Rookie";
      break;
    case "Competitor":
      rank.className = "Competitor";
      break;
    case "Veteran":
      rank.className = "Veteran";
      break;
    case "Master":
      rank.className = "Master";
      break;
    default:
      console.log("Nepoznata vrijednost!");
  } //&&
  if (vrijednostR < 100) {
    const sirina = 100 - vrijednostR + "%";
    linijaa.style.width = sirina;
  } else if (vrijednostR < 350) {
    const sirina = 100 - (vrijednostR - 100) / 2.5 + "%";
    linijaa.style.width = sirina;
  } else if (vrijednostR < 600) {
    const sirina = 100 - (vrijednostR - 350) / 2.5 + "%";
    linijaa.style.width = sirina;
  } else if (vrijednostR < 1000) {
    const sirina = 100 - (vrijednostR - 600) / 4 + "%";
    linijaa.style.width = sirina;
  } else {
    linijaa.style.width = "0%";
  }
  document.getElementById("bodoviRanka").innerHTML = vrijednostR;
}

back_join.addEventListener("click", function () {
  tabla_join.style.display = "none";
});
zaJoinTablu.addEventListener("click", function () {
  tabla_join.style.display = "block";
});

prijateljiBack.addEventListener("click", function () {
  prijateljiTabla.style.display = "none";
});
prijatelji.addEventListener("click", function () {
  prijateljiTabla.style.display = "block";
});

pravila.addEventListener("click", function () {
  pravilaDiv.style.display = "block";
});
pravilaBack.addEventListener("click", function () {
  pravilaDiv.style.display = "none";
});

function prvih6Alfanumericki(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 7)
    .toUpperCase();
}
