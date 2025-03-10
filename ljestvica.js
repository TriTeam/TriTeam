import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  get,
  remove,
  update,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://triteam-7328e-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

const poredak = document.getElementById("poredak");
const load = document.getElementById("loader");
const cont = document.getElementById("container");

setTimeout(function () {
  load.style.display = "none";
  cont.style.display = "flex";
}, 2000);

const vrijednosti = ref(database, "IGRA/KORISNICI");

onValue(vrijednosti, (snapshot) => {
  poredak.innerHTML = "";
  let rezultat = Object.values(snapshot.val());
  let sviIgraci = [];
  for (let i = 0; i < rezultat.length; i++) {
    console.log(rezultat[i].bodoviRanka);
    sviIgraci.push([
      rezultat[i].bodoviRanka,
      rezultat[i].ime,
      rezultat[i].rank,
    ]);
  }
  sviIgraci.sort((a, b) => b[0] - a[0]);

  console.log(sviIgraci);

  for (let i = 0; i < sviIgraci.length; i++) {
    let redak = document.createElement("div");
    let osoba = document.createElement("span");
    let vrijednost = document.createElement("span");
    let kojije = document.createElement("span");
    kojije.className = "kojije";
    kojije.innerHTML = sviIgraci[i][0];
    redak.className = "redak";
    osoba.className = "osoba";
    vrijednost.classList.add(sviIgraci[i][2]);
    osoba.innerHTML = sviIgraci[i][1];
    vrijednost.innerHTML = sviIgraci[i][2];

    poredak.append(redak);
    redak.append(kojije);
    redak.append(osoba);

    redak.append(vrijednost);
  }
});
