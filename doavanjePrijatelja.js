import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const database = getDatabase(app);
let stop1;

const dodaj = document.getElementById('dodajPrijatelja');
let inputId = document.getElementById('brojPrijatelj');


dodaj.addEventListener('click', dodavanjePr);

async function dodavanjePr() {
    let provjera = true;
    stop1 = true;
    const mojId = document.getElementById('idUser').innerHTML.toUpperCase();
    const korisnici = ref(database, "IGRA/KORISNICI");
    const putPrijatelja=ref(database, "IGRA/KORISNICI/"+mojId+'/prijatelji');
    let vrijednostInputa = inputId.value.toUpperCase();
    const listaPrijatelja=await pronadiListu(putPrijatelja);
    console.log(listaPrijatelja)
    try {
        // Dobijamo podatke samo jednom
        const snapshot = await get(korisnici);
        if (snapshot.exists()) {
            const data = snapshot.val();

            
            // Konvertujemo objekat u listu
            const itemList = Object.keys(data).map(key => ({
                id: key,  // Dodajemo ID za svaki objekat
                ...data[key]
            }));

            for (let i = 0; i < itemList.length; i++) {
                let idOdSvakog = itemList[i].id.toUpperCase();
                if (vrijednostInputa === idOdSvakog) {
                    if (vrijednostInputa === mojId) {
                        alert('Ne možeš dodati samog sebe šefe');
                        inputId.value = '';
                        provjera = false;
                    }else if(listaPrijatelja.includes(vrijednostInputa)){
                        alert('vec ti je to prijatelj');
                        inputId.value = '';
                        provjera = false;
                    } else {
                        await posaljiPoziv(vrijednostInputa, mojId);
                        provjera = false;
                    }
                    break; // Prekidaš petlju čim nađeš odgovarajući ID
                }
            }
        }

        if (provjera) {
            alert('Ne postoji korisnik sa tim ID-jem');
        }inputId.value='';
    } catch (error) {
        console.error("Greška pri čitanju podataka: ", error);
    }
}

async function posaljiPoziv(njegovID, mojID) {
    const putDoPrijatelja = ref(database, 'IGRA/KORISNICI/' + njegovID);
    const putDopoziva = ref(database, 'IGRA/KORISNICI/' + njegovID + '/pozivi');

    try {
        // Dobijamo podatke samo jednom
        const snapshot = await get(putDopoziva);
        if (snapshot.exists()) {
            let lista = snapshot.val();
            if (!lista.includes(mojID)) { // Dodajemo ID samo ako već nije u listi
                lista.push(mojID);
                console.log("Nova lista poziva: ", lista);

                // Ažuriramo bazu sa novim podacima
                await update(putDoPrijatelja, { pozivi: lista });
            } else {
                alert("Već ste pozvali tog korisnika.");
            }
        }
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
}



async function pronadiListu(putPrijatelja) {
    try{
        const snapshot2 = await get(putPrijatelja);
        if(snapshot2.exists()){
            const prijateljiPostojeci=snapshot2.val();
            return prijateljiPostojeci;
        }

    }catch (error) {
        console.error("Greška pri čitanju podataka: ", error);
    }

}


