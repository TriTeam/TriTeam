import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, get, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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






let firstLoad = true; // Praćenje prvog učitavanja


onAuthStateChanged(auth, (user) => {
    if (user) {
        const idmoj = prvih6Alfanumericki(user.uid);
        const dataRef = ref(db, 'IGRA/KORISNICI/' + idmoj + '/prijatelji');
        prijateljiImas(dataRef,idmoj);
        onValue(dataRef, (snapshot) => {
            if (firstLoad) {
                firstLoad = false;
                return;
            }

            const data = snapshot.val();
            if (data) { 
                prijateljiImas(dataRef,idmoj);

            }
        });
    } else {
        console.log('error');
    }
});




async function prijateljiImas(put,mojidPR) {
    try {
        const snapshot = await get(put);  
        if (snapshot.exists()) {
            const prijatelji=snapshot.val();
            stvaranjePPrijatelja(prijatelji,mojidPR);
        }
        } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
        }
    
}


function stvaranjePPrijatelja(prijatelji,mojidPR){
    let roditeljDiv = document.getElementById("dostupniPrijatelji");

    roditeljDiv.innerHTML = '';

    
    for (let i = 1; i < prijatelji.length; i++) {
        if(!(prijatelji[i]==undefined)){

            let jedanPrijatelj = document.createElement("div");
            jedanPrijatelj.className= "JedanPrijatelj";
            jedanPrijatelj.id='JedanPrijatelj'+i;

            let pojedinacDiv = document.createElement("p");
            imenaOdZahtjeva(prijatelji[i])
            .then(ime => {
            pojedinacDiv.textContent = ime;
            })

            let odbijDiv = document.createElement("div");
            odbijDiv.className = "makniPrijatelja";
            odbijDiv.id = "odbijOd"+i;
            odbijDiv.textContent = "x";
            odbijDiv.addEventListener('click', () => ukloniPrijatelja(prijatelji[i],i,mojidPR));
            

            jedanPrijatelj.appendChild(pojedinacDiv);
            jedanPrijatelj.appendChild(odbijDiv);
            roditeljDiv.appendChild(jedanPrijatelj)
        }
        
        
    }
}


async function imenaOdZahtjeva(i){
    const tekstRef = ref(db, 'IGRA/KORISNICI'); 
    try {
        const snapshot = await get(tekstRef);  
        if (snapshot.exists()) {
            const prijatelji=Object.entries(snapshot.val());
            
            for (let x = 0; x < prijatelji.length; x++) {
                if(prijatelji[x][0]==i){
                    console.log(prijatelji[x][1].ime);
                    let izvadenoIme=prijatelji[x][1].ime;
                    return izvadenoIme
                }
            }
        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
}

async function ukloniPrijatelja(id,i,mojid){
    console.log(id,i,mojid)
    const putDoMene = ref(db, 'IGRA/KORISNICI/' + mojid + '/prijatelji/'+i);
    remove(putDoMene).then(() => {
        console.log("Stavka uspešno obrisana!",id);
        })
        .catch((error) => {
        console.error("Greška prilikom brisanja:", error);
        });;

    const putDoNjega = ref(db, 'IGRA/KORISNICI/' + id + '/prijatelji');
    try {
        const snapshot3 = await get(putDoNjega);  
        if (snapshot3.exists()) {
            console.log(snapshot3.val())
            const listaNjegovihPr=snapshot3.val();
            for(let i=1; i<listaNjegovihPr.length; i++){
                if(listaNjegovihPr[i]==mojid){
                    const putDoMeneUNjemu = ref(db, 'IGRA/KORISNICI/' + id + '/prijatelji/'+i);
                    remove(putDoMeneUNjemu).then(() => {
                        console.log("Stavka uspešno obrisana!",listaNjegovihPr[i]);
                        })
                        .catch((error) => {
                        console.error("Greška prilikom brisanja:", error);
                        });;
                }
            }
        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
        
}




function prvih6Alfanumericki(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
}


