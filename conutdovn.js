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

const background = document.getElementById("staze");
const pomicanje = document.getElementById("pomicanjeS");

const plus = document.getElementById("plus");
const minus = document.getElementById("minus");
const swim = document.getElementById("swim");
const bike = document.getElementById("bike");
const run = document.getElementById("run");
const jacina5 = document.getElementById("jacina5");
const jacina4 = document.getElementById("jacina4");
const jacina3 = document.getElementById("jacina3");
const jacina2 = document.getElementById("jacina2");
const tvojGas = document.getElementById("tvojGas");
const trakab = document.getElementById("trakab");
const vrijeme = document.getElementById("vrijeme");
let swimD;
let bikeD;
let runD;
let ubrzanje;
let maxgas = 3;
let bgY = -1924.5;
let postotak = 100;
const energijaDiv = document.getElementById("pozadina");
let gascina = -1;
let lastFrameTime = 0;
const targetFPS = 80;
const frameInterval = 1000 / targetFPS;
let prizvano = 0;
let mineid;
let gameid;
let imemoje;
let pocelo = false;
let check = true;
let timerInterval;
let milliseconds = 0;

const objekt = {
  protivnik1: true,
  protivnik2: true,
  protivnik3: true,
};
let izmjena;
let kojaje = 0;
let mojaPozicija = 1;
gas(0);
let sviSpremni = false;

document.addEventListener("dblclick", function (event) {
  event.preventDefault();
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const mojid = prvih6Alfanumericki(user.uid);

    setTimeout(() => {
      nakonPrijave(mojid);
    }, 2500);

    const mojeime = user.displayName;
    ajmo(mojid, mojeime);
  } else {
    console.log("error");
  }
});

async function ajmo(mid, mime) {
  const tekstRef = ref(db, "IGRA/KORISNICI/" + mid + "/trenutnaIgra");

  try {
    const snapshot = await get(tekstRef);
    const idigre = snapshot.val();
    const sveOIgriPut = ref(db, "IGRA/IGRE/" + idigre);
    try {
      const snapshot2 = await get(sveOIgriPut);
      const sveOIgri = snapshot2.val();
      sve(mid, mime, sveOIgri);
    } catch (error) {
      console.error("Greška pri radu sa Firebase-om:", error);
    }
  } catch (error) {
    console.error("Greška pri radu sa Firebase-om:", error);
  }
}

async function sve(id, ime, igra) {
  mineid = id;
  gameid = igra.id;
  imemoje = ime;
  const listaIgraca = Object.keys(igra.postavkeIgraca);
  const sortedPlayers = [id, ...listaIgraca.filter((player) => player !== id)];
  mojaPozicija = sortedPlayers.length - 1;
  for (let i = 0; i < sortedPlayers.length; i++) {
    if (i == 0) {
      document.getElementById("ime1").innerHTML = ime;
      document.getElementById("player").style.backgroundColor =
        igra.postavkeIgraca[id].boja;
    } else {
      //tu ce ici igraci u tu stazu
      console.log();
      const bojaIgraca = igra.postavkeIgraca[sortedPlayers[i]].boja;
      const putDoRanka = ref(
        db,
        "IGRA/KORISNICI/" + sortedPlayers[i] + "/rank"
      );
      const rankProtivnika = await get(putDoRanka);
      const divIgraca = document.createElement("div");
      divIgraca.style.backgroundColor = bojaIgraca;

      divIgraca.classList.add("player", rankProtivnika.val());
      divIgraca.id = sortedPlayers[i] + "Div";
      divIgraca.style.top = "50dvh";
      divIgraca.style.left = 12 + i * 25 + "%";
      setTimeout(() => pozicijaProtivnika(sortedPlayers[i], i), 2000);

      const draft = document.createElement("div");
      draft.style.top = "54dvh";
      draft.className = "draft";
      draft.id = sortedPlayers[i] + "Draft";

      document.getElementById("ostaliigr").appendChild(divIgraca);
      document.getElementById("ostaliigr").appendChild(draft);
      const putime = ref(db, `IGRA/KORISNICI/${sortedPlayers[i]}/ime`);

      try {
        const snapshot = await get(putime);
        const ime2 = snapshot.val();
        document.getElementById("ime" + (i + 1)).innerHTML = ime2;
      } catch (error) {
        console.error("Greška pri postavljanju vremena početka igre:", error);
      }
    }
  }
  const mojeP = igra.postavkeIgraca[id];
  swim.innerHTML = mojeP.swim;
  swimD = mojeP.swim;
  bike.innerHTML = mojeP.bike;
  bikeD = mojeP.bike;
  run.innerHTML = mojeP.run;
  runD = mojeP.run;
}

async function pozicijaProtivnika(idProtivnika, i) {
  const putZaNoviPoziv = ref(db, "IGRA/IGRE/" + gameid + "/postavkeIgraca");
  onValue(putZaNoviPoziv, (snapshot) => {
    if (!snapshot.exists()) {
      return; // Ako snapshot ne postoji, odmah prekini funkciju
    }
    const data = snapshot.val()[idProtivnika];
    if (data) {
      // Prikaz samo ako stvarno ima podataka

      const divic = document.getElementById(idProtivnika + "Div");
      const divdraft = document.getElementById(idProtivnika + "Draft");

      određivanjePoz(data.position, i);
      let razlikaPozicija = bgY - data.position;
      let brzinaP = data.speed;
      let plivanje = data.swim;
      let bicikl = data.bike;
      let trcanje = data.run;
      if (data.position == 32.5) {
        setTimeout(() => upisMogRezz(), 500);
      }

      if (pocelo) {
        if (data.position - 4 - bgY >= 1 && data.position - 4 - bgY <= 20) {
          if (postotak <= 100) {
            postotak += (20 - (data.position - 4 - bgY)) / 200;
          }
        }
        divic.style.top = razlikaPozicija + 50 + "dvh";

        divdraft.style.top = razlikaPozicija + 54 + "dvh";
      }
    }
  });
}

function određivanjePoz(njegovapoz, i) {
  const ime = "protivnik" + (i + 1);
  if (njegovapoz < bgY) {
    if (izmjena != 1) {
      mojaPozicija--;
    }
    izmjena = 1;
  } else {
    if (izmjena != 2) {
      mojaPozicija++;
    }
    izmjena = 2;
  }
  document.getElementById("pozicija").innerHTML = "P " + mojaPozicija;
}

function pozoviInterval() {
  setInterval(() => energija(), 250);
}

document.getElementById("leaveT").addEventListener("click", function () {
  bgY += 11;
  this.style.display = "none";
});

function energija() {
  let ggg = gascina;
  if (!((bgY >= -1645 && bgY <= -1635) || (bgY >= -574 && bgY <= -566))) {
    if (ggg == 1 || ggg == -1) {
      if (ggg == -1) {
        if (postotak <= 100) {
          postotak = postotak - 0.16 * ggg;
        }
      } else {
        postotak = postotak - 0.08 * ggg;
      }
    } else {
      if (9 < postotak && postotak < 22) {
        postotak = postotak - 0.08 * (ggg + 1);
      } else {
        if (ggg != 0) {
          postotak = postotak - 0.05 * ggg ** 1.6;
        }
      }
    }
  } else {
    if (postotak <= 100) {
      postotak = postotak + 0.2;
    }
  }

  const sirina = postotak + "%";
  energijaDiv.style.width = sirina;
  if (postotak < 9) {
    energijaDiv.style.backgroundColor = "red";
    jacina2.style.backgroundColor = "black";
    maxgas = -1;
    if (gascina > -1) {
      gascina = -1;
      gas(disciplina);
    }
  } else if (postotak < 22) {
    energijaDiv.style.backgroundColor = "orange";
    jacina3.style.backgroundColor = "black";
    maxgas = 0;
    if (gascina > 0) {
      gascina = 0;
      gas(disciplina);
    }
    if (jacina2.style.backgroundColor == "black") {
      jacina2.style.backgroundColor = "white";
    }
  } else if (postotak < 39) {
    energijaDiv.style.backgroundColor = "rgb(191, 191, 1)";
    jacina4.style.backgroundColor = "black";
    maxgas = 1;
    if (gascina > 1) {
      gascina = 1;
      gas(disciplina);
    }
    if (jacina3.style.backgroundColor == "black") {
      jacina3.style.backgroundColor = "white";
    }
  } else if (postotak < 59) {
    energijaDiv.style.backgroundColor = "rgb(111, 128, 0)";
    jacina5.style.backgroundColor = "black";
    maxgas = 2;
    if (gascina > 2) {
      gascina = 2;
      gas(disciplina);
    }
    if (jacina4.style.backgroundColor == "black") {
      jacina4.style.backgroundColor = "white";
    }
  } else {
    maxgas = 3;
    energijaDiv.style.backgroundColor = "green";
    if (jacina5.style.backgroundColor == "black") {
      jacina5.style.backgroundColor = "white";
    }
  }
}
let disciplina = 0;
// Početna pozicija (izvan ekrana)

function scrollBackground(currentTime) {
  requestAnimationFrame(scrollBackground);

  // Proveri da li je prošlo dovoljno vremena od zadnjeg frame-a
  if (currentTime - lastFrameTime >= frameInterval) {
    lastFrameTime = currentTime;
    //0.05 najmanjaaaa
    //kraj=32.5
    //t1= -1640
    //t2= -571

    prizvano++;
    if (prizvano > 40) {
      prizvano = 0;
      upisivanjeStatusa(gascina, bgY);
    }

    if (bgY < -1635 && bgY > -1645) {
      document.getElementById("leaveT").style.display = "block";
    } else if (bgY < -566 && bgY > -574) {
      document.getElementById("leaveT").style.display = "block";
    } else if (bgY <= 32.5) {
      let zaKraj = ((-1 * (bgY - 32.5)) / 1956.5) * 100 + "%";
      trakab.style.width = zaKraj;
      bgY += gas(disciplina); // Brzina pomeranja (povećaj ako je presporo)
      background.style.top = `${bgY}dvh`;
      pomicanje.style.top = `${bgY}dvh`;
      if (bgY >= -570) {
        if (disciplina == 1) {
          disciplina++;
        }
        if (disciplina == 2) {
          gas(disciplina);
        }
      } else if (bgY >= -1639) {
        if (disciplina == 0) {
          disciplina++;
        }
        if (disciplina == 1) {
          gas(disciplina);
        }
      } else if (bgY >= -1924) {
        if (disciplina == 0) {
          gas(disciplina);
        }
      }
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById("postoljediv").style.display = "flex";
      upisMogRezz();
      upisVremena();
    }
    // Resetuj poziciju ako pređe donji kraj
  }
}

async function upisVremena() {
  const timeRef = ref(db, "IGRA/KORISNICI/" + mineid + "/vrijemeBest");
  const timeRef2 = ref(db, "IGRA/KORISNICI/" + mineid);
  const bestTimeRef = ref(db, "IGRA/BEST");

  const [timeSnapshot, bestTimeSnapshot] = await Promise.all([
    get(timeRef),
    get(bestTimeRef),
  ]);

  const vrijemeOvo = timeToMilliseconds(vrijeme.innerHTML);

  // Provjera i ažuriranje korisničkog vremena
  if (timeSnapshot.exists()) {
    const vrijemeMoje = timeToMilliseconds(timeSnapshot.val());
    if (vrijemeOvo < vrijemeMoje) {
      const newmy = {
        vrijemeBest: vrijeme.innerHTML,
      };
      await update(timeRef2, newmy); // Ažuriraj samo ako je novo vrijeme bolje
    }
  } else {
    await set(timeRef, vrijeme.innerHTML); // Postavi vrijeme ako ne postoji
  }

  // Provjera i ažuriranje najboljeg vremena
  if (bestTimeSnapshot.exists()) {
    const vrijemeNaj = timeToMilliseconds(bestTimeSnapshot.val().vrijeme);
    if (vrijemeOvo < vrijemeNaj) {
      const noviRekord = {
        ime: imemoje,
        vrijeme: vrijeme.innerHTML,
      };
      await update(bestTimeRef, noviRekord);
    }
  } else {
    const noviRekord = {
      ime: imemoje,
      vrijeme: vrijeme.innerHTML,
    };
    await set(bestTimeRef, noviRekord);
  }
}

function timeToMilliseconds(time) {
  let parts = time.split(":");
  if (parts.length !== 3) {
    console.error("Neispravan format vremena:", time);
    return 0;
  }

  let minutes = parseInt(parts[0]);
  let seconds = parseInt(parts[1]);
  let tenths = parseInt(parts[2]);

  if (isNaN(minutes) || isNaN(seconds) || isNaN(tenths)) {
    console.error("Neispravan format vremena:", time);
    return 0;
  }

  return minutes * 60 * 1000 + seconds * 1000 + tenths * 100;
}

async function upisMogRezz() {
  const way = ref(db, "IGRA/IGRE/" + gameid + "/rezultati");

  const snapshot = await get(way);
  const rezultati = snapshot.val();
  for (let i = 1; i < Object.keys(rezultati).length + 1; i++) {
    if (rezultati[i] == "" && rezultati[i] != mineid) {
      if (check) {
        const noviPodaci = {
          [i]: mineid,
        };
        check = false;
        update(way, noviPodaci);
      }
    }
    if (i == 1) {
      document.getElementById("prvi").innerHTML = rezultati[i];
    } else if (i == 2) {
      document.getElementById("drugi").innerHTML = rezultati[i];
    } else if (i == 3) {
      document.getElementById("treci").innerHTML = rezultati[i];
    } else if (i == 4) {
      document.getElementById("cetvrti").innerHTML = rezultati[i];
    }
  }
}

plus.addEventListener("click", () => povecanjeGasa("p"));
minus.addEventListener("click", () => povecanjeGasa("m"));

const countdownElement = document.getElementById("countdown");
const numbers = [3, 2, 1, "GO!"];
let index = 0;

function startCountdown() {
  countdownElement.style.display = "flex";
  if (index < numbers.length) {
    countdownElement.textContent = numbers[index];
    countdownElement.style.transform = "scale(1.5)";
    countdownElement.style.opacity = "1";

    setTimeout(() => {
      countdownElement.style.transform = "scale(0.5)";
      countdownElement.style.opacity = "0";

      setTimeout(() => {
        index++;
        startCountdown();
      }, 500);
    }, 500);
  } else {
    countdownElement.style.display = "none";

    setTimeout(() => {
      pocelo = true;
    }, 1000);
    requestAnimationFrame(scrollBackground);
    pozoviInterval();
    stoperica();
  }
}

function stoperica() {
  if (timerInterval) return;
  timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
  milliseconds += 100;
  let totalSeconds = milliseconds / 1000;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  let tenths = Math.floor((milliseconds % 1000) / 100);
  vrijeme.innerText =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    ":" +
    tenths;
  //clearInterval(timerInterval);
  //timerInterval = null;
}

function prvih6Alfanumericki(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 7)
    .toUpperCase();
}

function povecanjeGasa(mP) {
  if (mP == "p") {
    if (gascina < 3) {
      if (!(gascina == maxgas)) {
        gascina++;
        console.log(gascina);
        document.getElementById(
          "jacina" + (gascina + 2)
        ).style.backgroundColor = "red";
      }
    }
  } else {
    if (gascina > -1) {
      gascina--;
      console.log(gascina);
      document.getElementById("jacina" + (gascina + 3)).style.backgroundColor =
        "white";
    }
  }
  gas();
}

function gas(disc) {
  if (disc == 0) {
    ubrzanje = 0.00376 * (swimD / 1.5 + 1.85 ** (gascina + 2));
  } else if (disc == 1) {
    ubrzanje = 0.0136 * (bikeD / 1.5 + 1.88 ** (gascina + 2));
  } else if (disc == 2) {
    ubrzanje = 0.008 * (runD / 1.5 + 1.85 ** (gascina + 2));
  }
  tvojGas.innerHTML = (ubrzanje * 100).toFixed(2);

  return ubrzanje;
}

async function provjeraSpremnih(id) {
  const igracigra = ref(db, `IGRA/KORISNICI/${id}/trenutnaIgra`);

  try {
    const snapshot = await get(igracigra);
    const idigre = snapshot.val();

    if (!idigre) {
      return false;
    }

    const sveOIgriPut = ref(db, `IGRA/IGRE/${idigre}`);
    const novo = ref(db, `IGRA/IGRE/${idigre}/ucitanoSpremni`);

    return new Promise((resolve, reject) => {
      runTransaction(novo, (currentValue) => {
        return currentValue === null ? 1 : currentValue + 1;
      })
        .then(async ({ committed, snapshot }) => {
          if (!committed) {
            reject("Transakcija nije uspješno izvršena.");
            return;
          }

          const snapshot2 = await get(sveOIgriPut);
          const brojIgraca = snapshot2.val()?.brojIgraca || 0;
          const spremni = snapshot.val();

          if (spremni === brojIgraca) {
            // Samo prvi igrač koji vidi da su svi spremni postavlja startTime
            const startTimeRef = ref(db, `IGRA/IGRE/${idigre}/startTime`);
            const startTimeSnap = await get(startTimeRef);

            if (!startTimeSnap.exists()) {
              await postaviVrijemePocetka(idigre);
            }

            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          console.error("Greška u transakciji Firebase-a:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Greška pri radu sa Firebase-om:", error);
    return false;
  }
}

async function postaviVrijemePocetka(idigre) {
  const startTimeRef = ref(db, `IGRA/IGRE/${idigre}/startTime`);

  try {
    const trenutnoVrijeme = Date.now(); // Trenutno vrijeme u milisekundama
    const startTime = trenutnoVrijeme + 2000; // Dodajemo 4 sekunde

    await set(startTimeRef, startTime);
  } catch (error) {
    console.error("Greška pri postavljanju vremena početka igre:", error);
  }
}

function slusajVrijemePocetka(idigre) {
  const startTimeRef = ref(db, `IGRA/IGRE/${idigre}/startTime`);

  onValue(startTimeRef, (snapshot) => {
    const startTime = snapshot.val();

    if (startTime) {
      const sada = Date.now();
      const preostaloVrijeme = startTime - sada;

      if (preostaloVrijeme > 0) {
        setTimeout(startCountdown, preostaloVrijeme);
      } else {
        startCountdown();
      }
    }
  });
}

// 🔹 Funkcija koja se poziva nakon prijave igrača
async function nakonPrijave(id) {
  const spremni = await provjeraSpremnih(id);

  // Dohvati ID igre
  const igracigra = ref(db, `IGRA/KORISNICI/${id}/trenutnaIgra`);
  const snapshot = await get(igracigra);
  const idigre = snapshot.val();

  if (idigre) {
    slusajVrijemePocetka(idigre); // ✅ Svi igrači sada slušaju Firebase
  }
}

async function upisivanjeStatusa(ggas, pomaknuce) {
  const dbRef = ref(db, "IGRA/IGRE/" + gameid + "/postavkeIgraca/" + mineid);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const noviPodaci = {
      speed: ggas,
      position: pomaknuce,
    };

    update(dbRef, noviPodaci);
  }
}
