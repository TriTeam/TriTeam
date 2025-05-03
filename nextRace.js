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
import { stvaranjeListe } from "./stvaranjeListe.js";
import { promjene } from "./man-woman.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const race = document.getElementById("race");
const konceptUtrke = document.getElementById("konceptUtrke");
function dodajTooltip(div, tekst) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = tekst;
  tooltip.style.position = "absolute";
  tooltip.style.background = "white";
  tooltip.style.padding = "5px 10px";
  tooltip.style.border = "1px solid black";
  tooltip.style.borderRadius = "5px";
  tooltip.style.zIndex = "1000";
  tooltip.style.display = "none";

  document.body.appendChild(tooltip);

  div.addEventListener("click", (e) => {
    tooltip.style.left = `${e.pageX}px`;
    tooltip.style.top = `${e.pageY - 40}px`;
    tooltip.style.display = "block";

    const zatvori = (event) => {
      if (!tooltip.contains(event.target) && event.target !== div) {
        tooltip.style.display = "none";
        document.removeEventListener("click", zatvori);
      }
    };
    setTimeout(() => document.addEventListener("click", zatvori), 0);
  });
}
const tekstRef = ref(db, "FANTASY/utrke");
try {
  const snapshot = await get(tekstRef);

  function normalizujDatum(datum) {
    const [g, m, d] = datum.split("-");
    return `${g.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const listaUtrka = Object.entries(snapshot.val());

  // Sortiranje liste po datumu
  const sortirana = listaUtrka.sort((a, b) => {
    const datumA = normalizujDatum(a[1].datum);
    const datumB = normalizujDatum(b[1].datum);
    return datumA.localeCompare(datumB);
  });

  // Dobavljanje današnjeg datuma u istom formatu
  const danas = new Date();
  const danasStr = `${danas.getFullYear()}-${(danas.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${danas.getDate().toString().padStart(2, "0")}`;

  // Pronalazak prve utrke u budućnosti
  for (let i = 0; i < sortirana.length; i++) {
    const datumUtrke = normalizujDatum(sortirana[i][1].datum);
    if (datumUtrke >= danasStr) {
      sljedecaTrka(sortirana, i);
      break;
    }
  }
} catch (error) {
  console.error("Greška pri radu sa Firebase-om:", error);
}

function sljedecaTrka(sortirana, i) {
  konceptUtrke.innerHTML = "";

  race.innerHTML = "";
  const utrka = sortirana[i];
  stvaranjeSvega(utrka[0]);
  promjene();

  console.log(utrka);
  const divUtrke = document.createElement("div");
  divUtrke.className = "divSljedeceTrke";

  const nazad = document.createElement("div");
  nazad.innerHTML = "<";
  nazad.className = "nazad";
  nazad.addEventListener("click", function () {
    if (i !== 0) {
      sljedecaTrka(sortirana, i - 1);
    }
  });
  const napred = document.createElement("div");
  napred.innerHTML = ">";
  napred.className = "napred";
  napred.addEventListener("click", function () {
    if (i + 1 !== sortirana.length) {
      sljedecaTrka(sortirana, i + 1);
    }
  });
  if (i !== 0) {
    divUtrke.append(nazad);
  }

  const podatci = document.createElement("div");
  podatci.className = "podatci";
  const mjesto = document.createElement("div");
  mjesto.innerHTML = utrka[1].mjesto;
  mjesto.className = "mjesto";

  const imeUtrke = document.createElement("div");
  imeUtrke.innerHTML = utrka[0];
  imeUtrke.className = "imeUtrke";

  const datum = document.createElement("div");
  datum.innerHTML = utrka[1].datum;
  datum.className = "datum";

  podatci.append(mjesto);
  podatci.append(imeUtrke);
  podatci.append(datum);
  divUtrke.append(podatci);

  if (i + 1 !== sortirana.length) {
    divUtrke.append(napred);
  }

  race.append(divUtrke);
  stvaranjeListe(utrka);
}

function stvaranjeSvega(utrka) {
  // Kreiraj glavni container
  const man = document.createElement("div");
  man.id = "man";

  // podatciKorisnika
  const podatciKorisnika = document.createElement("div");
  podatciKorisnika.id = "podatciKorisnika";

  ["Remaining Salary", "Team Value", "Race Points", "Total points"].forEach(
    (text, index) => {
      const padatak = document.createElement("div");
      padatak.className = "padatak";

      const imePodatka = document.createElement("div");
      imePodatka.className = "imePodatka";
      imePodatka.textContent = text;

      const vrijedostPodatka = document.createElement("div");
      vrijedostPodatka.className = "vrijedostPodatka";

      const ids = ["rSalary", "tValue", "rPoints", "tPoints"];
      vrijedostPodatka.id = ids[index];

      vrijedostPodatka.textContent = index === 0 ? "$100" : "0";
      if (index === 1) vrijedostPodatka.textContent = "$0";

      padatak.appendChild(imePodatka);
      padatak.appendChild(vrijedostPodatka);
      podatciKorisnika.appendChild(padatak);
    }
  );
  man.appendChild(podatciKorisnika);

  // poljeSaPoljima
  const poljeSaPoljima = document.createElement("div");
  poljeSaPoljima.id = "poljeSaPoljima";

  // GOLD
  const goldSil = document.createElement("div");
  goldSil.className = "gold-sil";

  const gCol = document.createElement("div");
  gCol.id = "gCol";
  const goldTitle = document.createElement("div");
  goldTitle.className = "gold-silT";
  goldTitle.textContent = "GOLD COMPETITORS";
  const goldInfo = document.createElement("div");
  goldInfo.id = "goldInfo";
  goldInfo.className = "info";
  goldInfo.textContent = "!";
  dodajTooltip(
    goldInfo,
    "Gold competitors receive 100% of points after the race."
  );
  goldSil.appendChild(gCol);
  goldSil.appendChild(goldTitle);
  goldSil.appendChild(goldInfo);
  poljeSaPoljima.appendChild(goldSil);

  // goldR
  const goldR = document.createElement("div");
  goldR.id = "goldR";
  for (let i = 1; i <= 2; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card${i}`;

    const back = document.createElement("div");
    back.className = "back";
    back.id = `back${i}`;
    back.innerHTML = "X";

    const slika = document.createElement("div");
    slika.className = "slika";
    slika.id = `slika${i}`;

    const text = document.createElement("div");
    text.className = "add-text";
    text.id = `text${i}`;
    text.textContent = "ADD COMPETITOR";
    text.addEventListener("click", function () {
      const middle = document.getElementById("prijavljeniNatecatelji");
      middle.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    card.appendChild(back);
    card.appendChild(slika);
    card.appendChild(text);
    goldR.appendChild(card);
  }
  poljeSaPoljima.appendChild(goldR);

  // SILVER
  const silverSil = document.createElement("div");
  silverSil.className = "gold-sil";

  const sCol = document.createElement("div");
  sCol.id = "sCol";
  const silverTitle = document.createElement("div");
  silverTitle.className = "gold-silT";
  silverTitle.textContent = "SILVER COMPETITORS";
  const silverInfo = document.createElement("div");
  silverInfo.id = "silverInfo";
  silverInfo.className = "info";
  silverInfo.textContent = "!";
  dodajTooltip(
    silverInfo,
    "Silver competitors receive 50% of points after the race."
  );
  silverSil.appendChild(sCol);
  silverSil.appendChild(silverTitle);
  silverSil.appendChild(silverInfo);
  poljeSaPoljima.appendChild(silverSil);

  // silverR
  const silverR = document.createElement("div");
  silverR.id = "silverR";
  for (let i = 3; i <= 4; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card${i}`;

    const back = document.createElement("div");
    back.className = "back";
    back.id = `back${i}`;
    back.innerHTML = "X";

    const slika = document.createElement("div");
    slika.className = "slika";
    slika.id = `slika${i}`;

    const text = document.createElement("div");
    text.className = "add-text";
    text.id = `text${i}`;
    text.textContent = "ADD COMPETITOR";
    text.addEventListener("click", function () {
      const middle = document.getElementById("prijavljeniNatecatelji");
      middle.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    card.appendChild(back);
    card.appendChild(slika);
    card.appendChild(text);
    silverR.appendChild(card);
  }
  poljeSaPoljima.appendChild(silverR);

  const clear = document.createElement("div");
  clear.className = "clear";
  clear.id = "clear";
  clear.innerHTML = "Clear team";

  poljeSaPoljima.appendChild(clear);

  const spremi = document.createElement("div");
  spremi.className = "spremi";
  spremi.id = "spremi";
  spremi.innerHTML = "Save team!";
  poljeSaPoljima.appendChild(spremi);

  // Poruka
  const poruka2025 = document.createElement("div");
  poruka2025.id = "poruka2025";
  poruka2025.textContent =
    "All Competitor data is from the beginning of the 2025 season";
  poljeSaPoljima.appendChild(poruka2025);

  man.appendChild(poljeSaPoljima);

  // prijavljeniNatecatelji
  const prijavljeniNatecatelji = document.createElement("div");
  prijavljeniNatecatelji.id = "prijavljeniNatecatelji";
  man.appendChild(prijavljeniNatecatelji);

  // Dodaj 'man' u body
  konceptUtrke.appendChild(man);

  // -----------------------------------------
  // Sad kreiramo 'woman'

  const woman = document.createElement("div");
  woman.id = "woman";

  // podatciKorisnikaW
  const podatciKorisnikaW = document.createElement("div");
  podatciKorisnikaW.id = "podatciKorisnikaW";

  ["Remaining Salary", "Team Value", "Race Points", "Total points"].forEach(
    (text, index) => {
      const padatak = document.createElement("div");
      padatak.className = "padatak";

      const imePodatka = document.createElement("div");
      imePodatka.className = "imePodatka";
      imePodatka.textContent = text;

      const vrijedostPodatka = document.createElement("div");
      vrijedostPodatka.className = "vrijedostPodatka";

      const ids = ["rSalaryW", "tValueW", "rPointsW", "tPointsW"];
      vrijedostPodatka.id = ids[index];

      vrijedostPodatka.textContent = index === 0 ? "$100" : "0";
      if (index === 1) vrijedostPodatka.textContent = "$0";

      padatak.appendChild(imePodatka);
      padatak.appendChild(vrijedostPodatka);
      podatciKorisnikaW.appendChild(padatak);
    }
  );
  woman.appendChild(podatciKorisnikaW);

  // poljeSaPoljimaW
  const poljeSaPoljimaW = document.createElement("div");
  poljeSaPoljimaW.id = "poljeSaPoljimaW";

  // GOLD
  const goldSilW = document.createElement("div");
  goldSilW.className = "gold-sil";

  const gColW = document.createElement("div");
  gColW.id = "gCol";
  const goldTitleW = document.createElement("div");
  goldTitleW.className = "gold-silT";
  goldTitleW.textContent = "GOLD COMPETITORS";
  const goldInfoW = document.createElement("div");
  goldInfoW.id = "goldInfoW";
  goldInfoW.className = "info";
  goldInfoW.textContent = "!";
  dodajTooltip(
    goldInfoW,
    "Gold competitors receive 100% of points after the race."
  );

  goldSilW.appendChild(gColW);
  goldSilW.appendChild(goldTitleW);
  goldSilW.appendChild(goldInfoW);
  poljeSaPoljimaW.appendChild(goldSilW);

  // goldRW
  const goldRW = document.createElement("div");
  goldRW.id = "goldR";
  for (let i = 1; i <= 2; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card${i}W`;

    const back = document.createElement("div");
    back.className = "back";
    back.id = `back${i}W`;
    back.innerHTML = "X";

    const slika = document.createElement("div");
    slika.className = "slika";
    slika.id = `slika${i}W`;

    const text = document.createElement("div");
    text.className = "add-text";
    text.id = `text${i}W`;
    text.textContent = "ADD COMPETITOR";
    text.addEventListener("click", function () {
      const middle = document.getElementById("prijavljeniNatecateljiW");
      middle.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    card.appendChild(back);
    card.appendChild(slika);
    card.appendChild(text);
    goldRW.appendChild(card);
  }
  poljeSaPoljimaW.appendChild(goldRW);

  // SILVER
  const silverSilW = document.createElement("div");
  silverSilW.className = "gold-sil";

  const sColW = document.createElement("div");
  sColW.id = "sCol";
  const silverTitleW = document.createElement("div");
  silverTitleW.className = "gold-silT";
  silverTitleW.textContent = "SILVER COMPETITORS";
  const silverInfoW = document.createElement("div");
  silverInfoW.id = "silverInfo";
  silverInfoW.className = "info";
  silverInfoW.textContent = "!";
  dodajTooltip(
    silverInfoW,
    "Silver competitors receive 50% of points after the race."
  );
  silverSilW.appendChild(sColW);
  silverSilW.appendChild(silverTitleW);
  silverSilW.appendChild(silverInfoW);
  poljeSaPoljimaW.appendChild(silverSilW);

  // silverRW
  const silverRW = document.createElement("div");
  silverRW.id = "silverR";
  ["3W", "4W"].forEach((i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card${i}`;

    const back = document.createElement("div");
    back.className = "back";
    back.id = `back${i}`;
    back.innerHTML = "X";

    const slika = document.createElement("div");
    slika.className = "slika";
    slika.id = `slika${i}`;

    const text = document.createElement("div");
    text.className = "add-text";
    text.id = `text${i}`;
    text.textContent = "ADD COMPETITOR";
    text.addEventListener("click", function () {
      const middle = document.getElementById("prijavljeniNatecateljiW");
      middle.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    card.appendChild(back);
    card.appendChild(slika);
    card.appendChild(text);
    silverRW.appendChild(card);
  });
  poljeSaPoljimaW.appendChild(silverRW);

  const clearW = document.createElement("div");
  clearW.className = "clear";
  clearW.id = "clearW";
  clearW.innerHTML = "Clear team";
  poljeSaPoljimaW.appendChild(clearW);

  const spremiW = document.createElement("div");
  spremiW.className = "spremi";
  spremiW.id = "spremiW";
  spremiW.innerHTML = "Save team!";
  poljeSaPoljimaW.appendChild(spremiW);

  const poruka2025W = document.createElement("div");
  poruka2025W.id = "poruka2025";
  poruka2025W.textContent =
    "All Competitor data is from the beginning of the 2025 season";
  poljeSaPoljimaW.appendChild(poruka2025W);

  woman.appendChild(poljeSaPoljimaW);

  // prijavljeniNatecateljiW
  const prijavljeniNatecateljiW = document.createElement("div");
  prijavljeniNatecateljiW.id = "prijavljeniNatecateljiW";
  woman.appendChild(prijavljeniNatecateljiW);

  // Dodaj 'woman' u body
  konceptUtrke.appendChild(woman);
}
