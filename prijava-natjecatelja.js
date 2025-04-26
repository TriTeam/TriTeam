import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
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

const label = document.getElementById("lokacijaLabel");
const optionsContainer = document.getElementById("lokacijaOpcije");
const hiddenInput = document.getElementById("lokacijaInput");

const form = document.getElementById("utrkaForm1");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const race = label.innerHTML;
  const ime = document.getElementById("ime").value;
  if (race !== "Odaberi lokaciju") {
    const dbRef = ref(db, "FANTASY");
    const snapshot = await get(dbRef);
    const lista = Object.values(snapshot.val().natjecatelji);
    const indexPetra = lista.findIndex(
      (osoba) => (osoba.ime || "").toLowerCase() === ime.toLowerCase()
    );

    const postojiPetar = indexPetra !== -1;
    if (postojiPetar) {
      console.log("postoji");
      const mojbr = indexPetra;
      update(ref(db, "FANTASY/utrke/" + race + "/prijavljeni"), {
        [mojbr]: ime,
      })
        .then(() => {
          form.reset();
        })
        .catch((error) => {
          console.error("Greška pri upisu u bazu:", error);
          alert("Došlo je do greške. Pokušajte ponovno.");
        });
    } else {
      console.log("ne postoji");
      novi(ime, race, lista.length);
    }
  } else {
    alert("lokacija1");
  }
});

label.addEventListener("click", async () => {
  optionsContainer.style.display =
    optionsContainer.style.display === "none" ? "block" : "none";

  optionsContainer.innerHTML = "";

  const dbRef = ref(db, "FANTASY/utrke");
  const snapshot = await get(dbRef);

  if (snapshot.exists()) {
    const data = snapshot.val(); // Objekt sa key: value
    const gradovi = Object.entries(data); // [["Zagreb", "xx"], ["Split", "yy"]...]

    gradovi.forEach(([grad, _]) => {
      const div = document.createElement("div");
      div.textContent = grad;
      div.addEventListener("click", () => {
        label.textContent = grad;
        hiddenInput.value = grad;
        optionsContainer.style.display = "none";
      });
      optionsContainer.appendChild(div);
    });
  } else {
    optionsContainer.innerHTML = "<div>Nema podataka</div>";
  }
});

function novi(imme, trka, broj) {
  console.log(imme, trka);
  document.getElementById("utrkaForm1").style.display = "none";
  document.getElementById("utrkaForm").style.display = "flex";

  const form2 = document.getElementById("utrkaForm");
  form2.addEventListener("submit", async (e) => {
    e.preventDefault();
    const klub = document.getElementById("klub").value;
    const vrijednost = document.getElementById("vrijednost").value;
    const spol = document.getElementById("spol").value;
    const utrkaData = {
      ime: imme,
      vrijednost: { sad: vrijednost, prije: vrijednost },
      klub: klub,
      spol: spol,
      bodovi: 0,
    };

    set(ref(db, "FANTASY/natjecatelji/" + broj), utrkaData)
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        console.error("Greška pri upisu u bazu:", error);
        alert("Došlo je do greške. Pokušajte ponovno.");
      });

    update(ref(db, "FANTASY/utrke/" + trka + "/prijavljeni"), { [broj]: imme })
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        console.error("Greška pri upisu u bazu:", error);
        alert("Došlo je do greške. Pokušajte ponovno.");
      });
  });
}
/*
 */
