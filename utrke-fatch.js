import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { showRaceDetail } from "./prikazPodatkaUtrke.js";

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

// Show loader
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("sve");

  // Fetch data with timeout
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
try {
  const snapshot = await get(tekstRef);
  function normalizujDatum(datum) {
    const [g, m, d] = datum.split("-");
    return `${g.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const listaUtrka = Object.entries(snapshot.val());

  // Sortiranje liste
  const sortirana = listaUtrka.sort((a, b) => {
    const datumA = normalizujDatum(a[1].datum);
    const datumB = normalizujDatum(b[1].datum);
    return datumA.localeCompare(datumB);
  });

  // Get current date
  const danas = new Date();
  const danasStr = `${danas.getFullYear()}-${(danas.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${danas.getDate().toString().padStart(2, "0")}`;

  // Separate upcoming and finished races
  let hasUpcoming = false;
  let hasFinished = false;

  for (let i = 0; i < sortirana.length; i++) {
    const datumUtrke = normalizujDatum(sortirana[i][1].datum);

    if (datumUtrke >= danasStr) {
      // Upcoming race
      stvaranjeUtrke(sortirana[i], upcomingField);
      hasUpcoming = true;
    } else {
      // Finished race
      stvaranjeUtrke(sortirana[i], finishedField, true);
      hasFinished = true;
    }
  }

  // Show message if no races
  if (!hasUpcoming) {
    const noRaces = document.createElement("div");
    noRaces.className = "no-races";
    noRaces.textContent = "There are no upcoming races scheduled at the moment";
    upcomingField.appendChild(noRaces);
  }

  if (!hasFinished) {
    const noRaces = document.createElement("div");
    noRaces.className = "no-races";
    noRaces.textContent = "There are no finished races yet";
    finishedField.appendChild(noRaces);
  }
} catch (error) {
  console.error("Error working with Firebase:", error);

  // Show error message
  const errorMsg = document.createElement("div");
  errorMsg.className = "no-races";
  errorMsg.style.backgroundColor = "rgba(255,0,0,0.2)";
  errorMsg.textContent = "Unable to load race data. Please try again later.";
  upcomingField.appendChild(errorMsg);

  // Hide loader
  document.getElementById("loader").style.display = "none";
  document.getElementById("sve").style.display = "flex";
  document.getElementById("sve").style.opacity = "1";
}

function stvaranjeUtrke(utrka, container, isFinished = false) {
  const podatciUtrke = utrka[1];
  const divUtrke = document.createElement("div");
  divUtrke.className = "divUtrke";
  divUtrke.id = utrka[0];
  // Set data attribute for race type styling
  divUtrke.setAttribute("data-type", podatciUtrke.tip || "HTL");

  // Create date and type header
  const datumITip = document.createElement("div");
  datumITip.className = "datumITip";

  const datum = document.createElement("div");
  datum.innerHTML = formatDate(podatciUtrke.datum);
  datum.className = "datum";

  const tip = document.createElement("div");
  tip.innerHTML = podatciUtrke.tip || "Triathlon";
  tip.className = "tip";

  datumITip.append(datum);
  datumITip.append(tip);
  divUtrke.append(datumITip);

  // Race name
  const imeUtrke = document.createElement("div");
  imeUtrke.innerHTML = utrka[0];
  imeUtrke.className = "imeUtrke";
  divUtrke.append(imeUtrke);

  // Race location
  const imeMjesto = document.createElement("div");
  imeMjesto.innerHTML = podatciUtrke.mjesto;
  imeMjesto.className = "mjestoUtrke";
  divUtrke.append(imeMjesto);

  // Add race details
  const raceDetails = document.createElement("div");
  raceDetails.className = "race-details";

  // Distance detail
  if (podatciUtrke.distanca) {
    const distanceDetail = document.createElement("div");
    distanceDetail.className = "detail-item";

    const distanceLabel = document.createElement("div");
    distanceLabel.className = "detail-label";
    distanceLabel.textContent = "DISTANCE";

    const distanceValue = document.createElement("div");
    distanceValue.className = "detail-value";
    distanceValue.textContent = `${podatciUtrke.distanca}`;

    distanceDetail.appendChild(distanceLabel);
    distanceDetail.appendChild(distanceValue);
    raceDetails.appendChild(distanceDetail);
  }

  // Organizer detail
  if (podatciUtrke.organizator) {
    const organizerDetail = document.createElement("div");
    organizerDetail.className = "detail-item";

    const organizerLabel = document.createElement("div");
    organizerLabel.className = "detail-label";
    organizerLabel.textContent = "ORGANIZER";

    const organizerValue = document.createElement("div");
    organizerValue.className = "detail-value";
    organizerValue.textContent = podatciUtrke.organizator;

    organizerDetail.appendChild(organizerLabel);
    organizerDetail.appendChild(organizerValue);
    raceDetails.appendChild(organizerDetail);
  }

  divUtrke.appendChild(raceDetails);

  if (container.id == "finishedRaces") {
    divUtrke.addEventListener("click", function () {
      showRaceDetail(utrka);
      console.log("lal");
    });
  }
  container.append(divUtrke);
}

// Format date to be more readable
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day} ${months[Number.parseInt(month) - 1]} ${year}`;
}
