import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
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
const auth = getAuth();
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let userId;

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
  } else {
    window.location.href = "login.html";
  }
});

export async function ucitavanjePostojeceg(utrka) {
  const putM = ref(db, `FANTASY/utrke/${utrka[0]}/timovi/M/${userId}`);
  const putZ = ref(db, `FANTASY/utrke/${utrka[0]}/timovi/Z/${userId}`);
  const putSvih = ref(db, `FANTASY/natjecatelji`);

  const [snapshotM, snapshotZ, snapshotSvih] = await Promise.all([
    get(putM),
    get(putZ),
    get(putSvih),
  ]);

  console.log("Učitani snapshotovi:");
  console.log("Muški tim snapshot:", snapshotM.val());
  console.log("Ženski tim snapshot:", snapshotZ.val());
  console.log("Svi natjecatelji:", snapshotSvih.val());

  const sviNatjecatelji = snapshotSvih.exists() ? snapshotSvih.val() : {};
  const timM = [];
  const timZ = [];

  if (snapshotM.exists()) {
    window.skriveniElementiM = []; // inicijalizacija
    snapshotM.val().forEach((objekt, index) => {
      const [id, ime] = Object.entries(objekt)[0];
      const vrijednost = sviNatjecatelji[id]?.vrijednost?.sad ?? "Nepoznato";

      // ...
      document.getElementById(`slika${id}`).style.display = "none";
      window.skriveniElementiM.push(`slika${id}`);

      document.getElementById(`${id}`).style.display = "none";
      window.skriveniElementiM.push(`${id}`);

      document.getElementById(`linija${id}`).style.display = "none";
      window.skriveniElementiM.push(`linija${id}`);
      const textId = `text${index + 1}`;
      const textPolje = document.getElementById(textId);

      if (textPolje) {
        textPolje.innerHTML = `${ime}<br>${vrijednost}`;
      } else {
      }

      timM.push(objekt);
    });
  }

  if (snapshotZ.exists()) {
    window.skriveniElementiZ = [];
    snapshotZ.val().forEach((objekt, index) => {
      const [id, ime] = Object.entries(objekt)[0];
      const vrijednost = sviNatjecatelji[id]?.vrijednost?.sad ?? "Nepoznato";

      document.getElementById(`slika${id}`).style.display = "none";
      window.skriveniElementiZ.push(`slika${id}`);

      document.getElementById(`${id}`).style.display = "none";
      window.skriveniElementiZ.push(`${id}`);

      document.getElementById(`linija${id}`).style.display = "none";
      window.skriveniElementiZ.push(`linija${id}`);

      const textIdW = `text${index + 1}W`;
      const textPolje = document.getElementById(textIdW);

      console.log(
        `Ženski član ${index}: ID=${id}, Ime=${ime}, Vrijednost=${vrijednost}`
      );
      if (textPolje) {
        textPolje.innerHTML = `${ime}<br>${vrijednost}`;
        console.log(`Upisano u element #${textIdW}`);
      } else {
        console.warn(`Element s ID '${textIdW}' nije pronađen!`);
      }

      timZ.push(objekt);
    });
  } else {
    console.warn("Ženski tim ne postoji u bazi.");
  }
  console.log([
    timM.length > 0 ? timM : [undefined, undefined, undefined, undefined],
    timZ.length > 0 ? timZ : [undefined, undefined, undefined, undefined],
  ]);
  return [
    timM.length > 0 ? timM : [undefined, undefined, undefined, undefined],
    timZ.length > 0 ? timZ : [undefined, undefined, undefined, undefined],
  ];
}
