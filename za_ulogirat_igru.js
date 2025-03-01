import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



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
const provider = new GoogleAuthProvider();

const login= document.getElementById('login');
const udi= document.getElementById('join');
const okvir_pocetna= document.getElementById('okvir_pocetna');
const imeUser= document.getElementById('ime');
const pobjedeUser= document.getElementById('pobjede');
const gubitciUser= document.getElementById('gubitci');
const pprihvacanjeDiv=document.getElementById('prihvacanjeDiv');
const pprihvacanjeDivIgra=document.getElementById('prihvacanjeDivIgra');
const rankUser= document.getElementById('rank');
const idUser= document.getElementById('idUser');
const noviZahtjev = document.getElementById('noviZahtjev');
const noviZahtjevIgra = document.getElementById('noviZahtjevIgra');
const udiIgru = document.getElementById('brojIgre');
let jelUpisanoBazu=false;
let firstLoad = true;
let firstLoad2 = true; // Praćenje prvog učitavanja
let sadOdPrije;
let sadOdPrije2;
let ucitavanje=true;
const ljestvica=document.getElementById('ranking');
ljestvica.addEventListener('click',function() {window.location.href='ljestvica.html'});



document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
      document.getElementById("loader").style.display = "none";
      if(ucitavanje){
        login.style.display='block'
        
      }else{
        okvir_pocetna.style.display = "block";
      }
  }, 2100); // Simulacija učitavanja od 3 sekunde
});

const onseulogiro = async() => {
    signInWithPopup(auth, provider).then((result) => {
        const user= result.user;
        login.style.display='none';
      okvir_pocetna.style.display='block';

    }).catch((error)=>{
        const errorCode= error.code;
        const errorMessage= error.message;
    })
}

onAuthStateChanged(auth,(user)=>{
    if(user){
      
        //promjena sa login gumba na menu
       ucitavanje=false;
        //upisivanje podataka u infu tablu usera
        upisUInfoUsera(user);
        if(!jelUpisanoBazu){
            upisiUDatabazu();
        }
        provjeraZahvtjeva();
        provjeraZahvtjevaIgra();
        
        noviZahtjev.addEventListener('click',() => otvaranje());
        noviZahtjevIgra.addEventListener('click',() => otvaranjeIgra());

        const idmoj = prvih6Alfanumericki(user.uid);
        udi.addEventListener('click',() => ulazPrekoUlaza(idmoj));
        const putZaNoviPoziv = ref(db, 'IGRA/KORISNICI/' + idmoj + '/pozivi');
        onValue(putZaNoviPoziv, (snapshot) => {
            if (firstLoad) {
                firstLoad = false; // Ignoriši prvo učitavanje
                return;
            }

            const data = snapshot.val();
            if (data) { // Prikaz samo ako stvarno ima podataka
                noviZahtjev.style.display = 'block';
                sadOdPrije=false;
                stvaranjeDivaZahtjeva(data,sadOdPrije)
            }
        });

        const putZaNoviPozivIgre = ref(db, 'IGRA/KORISNICI/' + idmoj + '/inviteGame');
        onValue(putZaNoviPozivIgre, (snapshot) => {
            if (firstLoad2) {
                firstLoad2 = false; // Ignoriši prvo učitavanje
                return;
            }

            const data = snapshot.val();
            if (data) { // Prikaz samo ako stvarno ima podataka
                console.log('lal')
                noviZahtjevIgra.style.display = 'block';
                sadOdPrije2=false;
                stvaranjeDivaZahtjevaIgra(data,sadOdPrije2,idmoj)
            }
        });

    }else{
        console.log('error')
    }
})

login.addEventListener('click', onseulogiro);



//funkcija za upisivanje info podataka iz usera
function upisUInfoUsera(podatci){
    console.log(podatci)
    imeUser.innerHTML=podatci.displayName
    idUser.innerHTML=prvih6Alfanumericki(podatci.uid);

}

// Funkcija za upis Usera u Firebase
async function upisiUDatabazu() {
    const IdUsera = idUser.innerHTML; // Dobijanje teksta iz div-a
    const ImeKorisnika = imeUser.innerHTML;
    const tekstRef = ref(db, 'IGRA/KORISNICI/'+IdUsera.toUpperCase()); // Referenca na podatke u bazi
    try {
        const snapshot = await get(tekstRef); // Dobavljanje trenutnih podataka
  
        if (snapshot.exists()) {
            console.log(snapshot.val())
            pobjedeUser.innerHTML=snapshot.val().pobjede;
            gubitciUser.innerHTML=snapshot.val().zavrseneIgre;
            rankUser.innerHTML=snapshot.val().rank;
        } else {
            const podatciUpisaNovogUsera = {
                ime: ImeKorisnika,
                pobjede: 0,
                zavrseneIgre: 0,
                rank: 'Beginner',
                id: IdUsera,
                pozivi: [0],
                prijatelji: [0],
                inviteGame: [0],
                bodoviRanka:0
                };
          await set(tekstRef, podatciUpisaNovogUsera); // Upisujemo samo ako ne postoji
          jelUpisanoBazu=true;
        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
}

function prvih6Alfanumericki(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
}


async function provjeraZahvtjeva(){
    const IdUsera = idUser.innerHTML;
    const tekstRef = ref(db, 'IGRA/KORISNICI/'+IdUsera); 
    try {
        const snapshot = await get(tekstRef);  
        if (snapshot.exists()) {
            const pozivi=snapshot.val().pozivi;
            if(pozivi.length!=1){
                console.log(pozivi.length);
                sadOdPrije=true;
                stvaranjeDivaZahtjeva(pozivi,sadOdPrije)
                noviZahtjev.style.display='block'

            }

        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
}

async function provjeraZahvtjevaIgra(){
    const IdUsera = idUser.innerHTML;
    const tekstRef = ref(db, 'IGRA/KORISNICI/'+IdUsera); 
    try {
        const snapshot = await get(tekstRef);  
        if (snapshot.exists()) {
            const invite=snapshot.val().inviteGame;
            if(invite.length!=1){
                console.log(invite.length);
                const lista=[0];
                firstLoad2=true;
                await update(tekstRef, { inviteGame:lista });
                
                

            }

        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
}


function stvaranjeDivaZahtjeva(broj,sadPrije) {
    
    
    
    let roditeljDiv = document.getElementById("zaZahtjeve");
    
    // Čistimo sadržaj roditeljskog diva pre nego što dodamo nove elemente
    roditeljDiv.innerHTML = '';

    // Petlja koja stvara 'prihvacanjePojedinac' divove
    for (let i = 1; i < broj.length; i++) {
        if(!(broj[i]==undefined)){
            console.log('radi',broj[i])
            // Kreiramo novi div za 'prihvacanjePojedinac'
            let pojedinacDiv = document.createElement("div");
            pojedinacDiv.id = "prihvacanjePojedinac"+i;
            pojedinacDiv.className = "prihvacanjePojedinac";

            // Kreiramo i dodajemo 'prihvacanjeIme'
            let imeDiv = document.createElement("div");
            
            imeDiv.className = "prihvacanjeIme";

            imenaOdZahtjeva(broj[i])
            .then(ime => {
            imeDiv.textContent = ime;
            })

            pojedinacDiv.appendChild(imeDiv);

            // Kreiramo i dodajemo 'prihvacanjeOpcije'
            let opcijeDiv = document.createElement("div");
            opcijeDiv.id = "prihvacanjeOpcije";

            // Kreiramo 'prihvacanjePrihvati' dugme
            let prihvatiDiv = document.createElement("div");
            prihvatiDiv.className = "prihvacanjePrihvati";
            prihvatiDiv.id = "prihvatiOd"+i;
            prihvatiDiv.textContent = "PRIHVATI";
            prihvatiDiv.addEventListener('click',() => prihvacen(broj[i],i));
            opcijeDiv.appendChild(prihvatiDiv);

            // Kreiramo 'prihvacanjeOdbij' dugme
            let odbijDiv = document.createElement("div");
            odbijDiv.className = "prihvacanjeOdbij";
            odbijDiv.id = "odbijOd"+i;
            odbijDiv.textContent = "ODBIJ";
            odbijDiv.addEventListener('click', () => odbijen(broj[i],i));
            opcijeDiv.appendChild(odbijDiv);

            // Dodajemo 'prihvacanjeOpcije' u 'prihvacanjePojedinac'
            pojedinacDiv.appendChild(opcijeDiv);

            // Dodajemo novi 'prihvacanjePojedinac' u roditeljski div
            roditeljDiv.appendChild(pojedinacDiv);
        }
        if(sadPrije){
            pprihvacanjeDiv.style.display='block';
        }
        
        }
        


}

function stvaranjeDivaZahtjevaIgra(broj,sadPrije2,mineid) {
    
    
    
    let roditeljDiv = document.getElementById("zaZahtjeveIgra");
    
    // Čistimo sadržaj roditeljskog diva pre nego što dodamo nove elemente
    roditeljDiv.innerHTML = '';

    // Petlja koja stvara 'prihvacanjePojedinac' divove
    for (let i = 1; i < broj.length; i++) {
        if(!(broj[i]==undefined)){
            console.log('radi',broj[i])
            // Kreiramo novi div za 'prihvacanjePojedinac'
            let pojedinacDiv = document.createElement("div");
            pojedinacDiv.id = "prihvacanjePojedinacIgra"+i;
            pojedinacDiv.className = "prihvacanjePojedinac";

            // Kreiramo i dodajemo 'prihvacanjeIme'
            let imeDiv = document.createElement("div");
            
            imeDiv.className = "prihvacanjeIme";

            imenaOdZahtjeva(broj[i])
            .then(ime => {
            imeDiv.textContent = ime;
            })

            pojedinacDiv.appendChild(imeDiv);

            // Kreiramo i dodajemo 'prihvacanjeOpcije'
            let opcijeDiv = document.createElement("div");
            opcijeDiv.id = "prihvacanjeOpcije";

            // Kreiramo 'prihvacanjePrihvati' dugme
            let prihvatiDiv = document.createElement("div");
            prihvatiDiv.className = "prihvacanjePrihvati";
            prihvatiDiv.id = "prihvatiOdIgra"+i;
            prihvatiDiv.textContent = "PRIHVATI";
            prihvatiDiv.addEventListener('click',() => prihvacenIgra(broj[i],i,mineid));
            opcijeDiv.appendChild(prihvatiDiv);

            // Kreiramo 'prihvacanjeOdbij' dugme
            let odbijDiv = document.createElement("div");
            odbijDiv.className = "prihvacanjeOdbij";
            odbijDiv.id = "odbijOdIgra"+i;
            odbijDiv.textContent = "ODBIJ";
            odbijDiv.addEventListener('click', () => odbijenIgra(broj[i],i));
            opcijeDiv.appendChild(odbijDiv);

            // Dodajemo 'prihvacanjeOpcije' u 'prihvacanjePojedinac'
            pojedinacDiv.appendChild(opcijeDiv);

            // Dodajemo novi 'prihvacanjePojedinac' u roditeljski div
            roditeljDiv.appendChild(pojedinacDiv);
        }
        if(sadPrije2){
            pprihvacanjeDivIgra.style.display='block';
        }
        
        }
        


}


async function imenaOdZahtjeva(i){
    const tekstRef = ref(db, 'IGRA/KORISNICI'); 
    try {
        const snapshot = await get(tekstRef);  
        if (snapshot.exists()) {
            const pozivi=Object.entries(snapshot.val());
            
            for (let x = 0; x < pozivi.length; x++) {
                if(pozivi[x][0]==i){
                    console.log(pozivi[x][1].ime);
                    let izvadenoIme=pozivi[x][1].ime;
                    return izvadenoIme
                }
            }
        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
}

function prihvacen(id,i){
    dodavanjePrijateljaMeni(id);
    dodavanjePrijateljaNjemu(id);
    const itemRef = ref(db, 'IGRA/KORISNICI/' + idUser.innerHTML + '/pozivi/'+i); // Putanja do stavke
    remove(itemRef).then(() => {
        console.log("Stavka uspešno obrisana!",idUser.innerHTML);
      })
      .catch((error) => {
        console.error("Greška prilikom brisanja:", error);
      });;
      brisanjePojedinca(i);
    
}
function odbijen(id,i){
    console.log(id,'je odbijen')
    const itemRef = ref(db, 'IGRA/KORISNICI/' + idUser.innerHTML + '/pozivi/'+i); // Putanja do stavke
    remove(itemRef).then(() => {
        console.log("Stavka uspešno obrisana!",idUser.innerHTML);
      })
      .catch((error) => {
        console.error("Greška prilikom brisanja:", error);
      });;
      brisanjePojedinca(i);
}

function odbijenIgra(id,i){
    console.log(id,'je odbijen')
    const itemRef = ref(db, 'IGRA/KORISNICI/' + idUser.innerHTML + '/inviteGame/'+i); // Putanja do stavke
    remove(itemRef).then(() => {
        console.log("Stavka uspešno obrisana!",idUser.innerHTML);
      })
      .catch((error) => {
        console.error("Greška prilikom brisanja:", error);
      });;
      brisanjePojedincaIgra(i);
}

async function prihvacenIgra(id, i,mojid){
    console.log('check1');
    const tekstRef = ref(db, 'IGRA/KORISNICI/'+id+'/trenutnaIgra');
    try {
        const snapshot = await get(tekstRef); // Dobavljanje trenutnih podataka
  
        if (snapshot.exists()) {
            ubacivanjeUIgru(snapshot.val(),mojid);

        } 
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
 
}


async function ubacivanjeUIgru(igra,mojid) {
    console.log('check2');
    const putigra = ref(db, 'IGRA/IGRE/'+igra);
    try {
        const snapshot = await get(putigra); // Dobavljanje trenutnih podataka
  
        if (snapshot.exists()) {
            console.log(snapshot.val())
            const podatciIgre=snapshot.val();
            if(podatciIgre.brojIgraca<4){
                const listaBezMene=podatciIgre.igraci;
                const listaSamnom=listaBezMene.push(mojid);
                
                const noviPodatci={
                    brojIgraca:podatciIgre.brojIgraca+1,
                    igraci:listaBezMene
                }
                console.log(noviPodatci)
                await update(putigra, noviPodatci);
                provjeraZahvtjevaIgra();
                stvaranjeMeniIgre(mojid,podatciIgre.id)
            }else{
                alert('ova igra je popunjena')
            }
        } 
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
}

async function stvaranjeMeniIgre(mojid,idigre){
    const idNoveIgre=idigre;
    console.log(idNoveIgre)
    
    const tekstRef2 = ref(db, 'IGRA/KORISNICI/'+mojid+'/trenutnaIgra');
    try {
 
        await set(tekstRef2, idNoveIgre); 

        window.location.href = "loby.html";

        } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
        }
}


async function ulazPrekoUlaza(mojId){
  const idigre=udiIgru.value

  const putigra = ref(db, 'IGRA/IGRE/'+idigre);
    try {
        const snapshot = await get(putigra); // Dobavljanje trenutnih podataka
  
        if (snapshot.exists()) {
            console.log(snapshot.val())
            const podatciIgre=snapshot.val();
            if(podatciIgre.brojIgraca<4){
                const listaBezMene=podatciIgre.igraci;
                const listaSamnom=listaBezMene.push(mojId);
                
                const noviPodatci={
                    brojIgraca:podatciIgre.brojIgraca+1,
                    igraci:listaBezMene
                }
                console.log(noviPodatci)
                await update(putigra, noviPodatci)             
            }else{
                alert('ova igra je popunjena')
            }
        } 
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }

  if(idigre!=''){
    const tekstRef2 = ref(db, 'IGRA/KORISNICI/'+mojId+'/trenutnaIgra');
    try {
 
        await set(tekstRef2, idigre); 

        window.location.href = "loby.html";

        } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
        }
  }else{
    alert('nisi unio id')
  }
}


async function brisanjePojedinca(i){
    const trenutnaListaPoziva = ref(db, 'IGRA/KORISNICI/' + idUser.innerHTML + '/pozivi')
    
    try {
        const snapshot = await get(trenutnaListaPoziva);  
        if (snapshot.exists()) {
            const sadPozivi=snapshot.val();
            console.log(sadPozivi);
            if(sadPozivi.length==1){
                pprihvacanjeDiv.style.display='none';
                noviZahtjev.style.display='none';
            }
        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
    
}

async function brisanjePojedincaIgra(i){
    const trenutnaListaPoziva = ref(db, 'IGRA/KORISNICI/' + idUser.innerHTML + '/inviteGame')
    
    try {
        const snapshot = await get(trenutnaListaPoziva);  
        if (snapshot.exists()) {
            const sadPozivi=snapshot.val();
            console.log(sadPozivi);
            if(sadPozivi.length==1){
                pprihvacanjeDivIgra.style.display='none';
                noviZahtjevIgra.style.display='none';
            }
        }
      } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
      }
    
}


async function dodavanjePrijateljaMeni(id) {
    const putDoliste = ref(db, 'IGRA/KORISNICI/' + idUser.innerHTML + '/prijatelji');
    const putDoprijatelj = ref(db, 'IGRA/KORISNICI/' + idUser.innerHTML);
    try {
        // Dobijamo podatke samo jednom
        const snapshot = await get(putDoliste);
        if (snapshot.exists()) {
            let lista = snapshot.val();
            if (!lista.includes(id)) { // Dodajemo ID samo ako već nije u listi
                lista.push(id);
                // Ažuriramo bazu sa novim podacima
                await update(putDoprijatelj, { prijatelji: lista });
            } else {
                alert("Već ste pozvali tog korisnika.");
            }
        }
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
}
async function dodavanjePrijateljaNjemu(id) {
    const putDoliste = ref(db, 'IGRA/KORISNICI/' + id + '/prijatelji');
    const putDoprijatelj = ref(db, 'IGRA/KORISNICI/' + id);
    try {
        // Dobijamo podatke samo jednom
        const snapshot = await get(putDoliste);
        if (snapshot.exists()) {
            let lista = snapshot.val();
            if (!lista.includes(idUser.innerHTML)) { // Dodajemo ID samo ako već nije u listi
                lista.push(idUser.innerHTML);
                // Ažuriramo bazu sa novim podacima
                await update(putDoprijatelj, { prijatelji: lista });
            } else {
                alert("Već ste pozvali tog korisnika.");
            }
        }
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
}



function otvaranje(){
    pprihvacanjeDiv.style.display='block'
}
function otvaranjeIgra(){
    pprihvacanjeDivIgra.style.display='block'
}












const pprihvacanjeBack=document.getElementById('prihvacanjeBack');

pprihvacanjeBack.addEventListener('click', function(){pprihvacanjeDiv.style.display='none'})


const pprihvacanjeBackIgra=document.getElementById('prihvacanjeBackIgra');

pprihvacanjeBackIgra.addEventListener('click', function(){pprihvacanjeDivIgra.style.display='none'})
