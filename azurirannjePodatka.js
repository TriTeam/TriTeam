import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, update, remove, onValue, runTransaction, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



const firebaseConfig = {
    apiKey: "AIzaSyAeTpzrQ-V21EwUF-26DNLGY6n_ZiZ7weg",
    authDomain: "triteam-7328e.firebaseapp.com",
    databaseURL: "https://triteam-7328e-default-rtdb.firebaseio.com",
    projectId: "triteam-7328e",
    storageBucket: "triteam-7328e.appspot.com",
    messagingSenderId: "99207607267",
    appId: "1:99207607267:web:07c7b9549374b32fa326d6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth=getAuth();
let kraj=true;
let uppisano=true;

onAuthStateChanged(auth, (user) => {
  if (user) {
      idutrke(prvih6Alfanumericki(user.uid))
  } else {
      console.log("error");
  }
});




async function rangiranje(igrica, id) {
  const putdoigreID = ref(db, 'IGRA/KORISNICI/' + id);
  const results = igrica.rezultati;
  const brojIgraca = igrica.brojIgraca;
  let mojeMjesto = null;
  let rankoviOstalih = {};

  // Filtriranje rezultata da uklonimo prazne vrijednosti
  let filtriraniRezultati = Object.entries(results)
      .filter(([key, value]) => value.trim() !== '') // Uklanja prazne rezultate
      .map(([key, value]) => value); // Ostavljamo samo ID-eve igrača

  let stvarniBrojIgraca = filtriraniRezultati.length; // Stvarni broj igrača u utrci

  if (brojIgraca !== stvarniBrojIgraca) return; // Ako se broj igrača ne podudara, prekini funkciju
  uppisano=false;
  // Pronalazimo mjesto igrača i dohvaćamo rankove ostalih
  for (let [key, igracId] of Object.entries(results)) {
    if (igracId.trim() === id.trim()) {  
        mojeMjesto = parseInt(key, 10) - 1;  // Ključ -1 za točan indeks (0 za prvo mjesto, itd.)
    } else if (igracId) {
        const snapshot = await get(ref(db, 'IGRA/KORISNICI/' + igracId));
        if (snapshot.exists()) {
            rankoviOstalih[igracId] = snapshot.val().rank;
        }
    }
  }

  if (mojeMjesto === null) return;



  // Dohvati trenutni rank, bodove, pobjede i zavrsene igre igrača
  const snapshot = await get(putdoigreID);
  if (!snapshot.exists()) return;

  const mojRank = snapshot.val().rank;
  let trenutniBodovi = snapshot.val().bodoviRanka || 0;
  let trenutnePobjede = snapshot.val().pobjede || 0;
  let zavrseneIgre = snapshot.val().zavrseneIgre || 0;

  // Rankovi u bodovima
  const ranks = {
    "Beginner": 0,
    "Rookie": 300,
    "Competitor": 700,
    "Veteran": 1200,
    "Master": 1900
  };

  // Osnovni bodovi za plasman (1. i zadnje mjesto jednako dobivaju/gube)
  const basePoints = [100, 40, -40, -100];

  // Skaliranje bodova ovisno o broju igrača
  const playerModifier = [0.5, 0.8, 1, 1.2][stvarniBrojIgraca - 2];

  // Prilagodba bodova za manje od 4 igrača
  let adjustedBasePoints = stvarniBrojIgraca === 2 
    ? [100, -100] 
    : basePoints.slice(0, stvarniBrojIgraca).concat(-100);

  // Računanje bodova
  let points = adjustedBasePoints[mojeMjesto] * playerModifier; 
  console.log("Početni bodovi:", points);

  // Prilagodba bodova prema rankovima protivnika
  Object.values(rankoviOstalih).forEach(rank => {
    let razlikaRanka = (ranks[rank] || 0) - (ranks[mojRank] || 0);
    points += (razlikaRanka / 300) * 10; // 10 bodova za svaku razliku u ranku
  });

  console.log("Bodovi nakon prilagodbe rankova:", points);

  // Provjera NaN i dodavanje bodova
  if (isNaN(points)) {
    console.log("Greška: NaN u bodovima");
    return;
  }

  // Održavanje bodova na 0 ako je igrač izgubio
  trenutniBodovi = Math.max(0, trenutniBodovi + Math.round(points)); // Ako je rezultat negativan, ostaje 0
  console.log("Konačni bodovi:", trenutniBodovi);

  // Ako je igrač pobijedio (1. mjesto), povećaj broj pobjeda
  if (mojeMjesto === 0) {
    trenutnePobjede += 1;
  }

  // Povećaj broj završenih igara
  zavrseneIgre += 1;

  // Ažuriranje ranka ako je potrebno
  let noviRank = mojRank;
  for (const [rankName, minPoints] of Object.entries(ranks).reverse()) {
    if (trenutniBodovi >= minPoints) {
      noviRank = rankName;
      break;
    }
  }

  console.log(`Konačni bodovi: ${trenutniBodovi}, Novi rank: ${noviRank}, Pobjede: ${trenutnePobjede}, Završene igre: ${zavrseneIgre}`);
  uppisano=false;
  // Pošaljite update u bazu podataka
  await update(putdoigreID, {
    bodoviRanka: trenutniBodovi,
    rank: noviRank,
    pobjede: trenutnePobjede,
    zavrseneIgre: zavrseneIgre
  });


  console.log(`Igrač ${id} sada ima ${trenutniBodovi} bodova, rank ${noviRank}, ${trenutnePobjede} pobjeda i ${zavrseneIgre} završenih igara.`);
}








async function idutrke(id){
  const putdoigreID=ref(db,'IGRA/KORISNICI/'+id)
  const snapshot=await get (putdoigreID);
  const mojeIME=snapshot.val().ime;
  const idgame=snapshot.val().trenutnaIgra
  const Putigra=ref(db,'IGRA/IGRE/'+idgame)

  onValue(Putigra, (snapshot2) => {
    const igra = snapshot2.val();
    if(kraj && uppisano){
      rangiranje(igra, id);
    }
});
  


}



function prvih6Alfanumericki(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
}



