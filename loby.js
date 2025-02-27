import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, get, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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


const kucicaMoja=document.getElementById('kucicaMoja');
const imeMoje=document.getElementById('imeMoje');
const idMoj=document.getElementById('idMoj');
const kucicaPrazna2=document.getElementById('kucicaPrazna2');
const kucicaPrazna3=document.getElementById('kucicaPrazna3');
const kucicaPrazna4=document.getElementById('kucicaPrazna4');
const sve=document.getElementById('sve');
const wrap=document.getElementById('wrap');
const mojiPrijatelji=document.getElementById('prijateljiTabla');
const gameId=document.getElementById('gameID');
const izlaz=document.getElementById('izadi');
const spreman=document.getElementById('ready')
const animatedDiv = document.getElementById("animatedDiv");
const divPostavke = document.getElementById("micanje");
const idIgr2 = document.getElementById("idIgraca2");
const idIgr3 = document.getElementById("idIgraca3");
const idIgr4 = document.getElementById("idIgraca4");
const kucica2=document.getElementById('kucicaIgraca2');
const kucica3=document.getElementById('kucicaIgraca3');
const kucica4=document.getElementById('kucicaIgraca4');
const zaOstale=document.getElementById('zaOstaleSpremne');
const ime2=document.getElementById('imeIgraca2');
const ime3=document.getElementById('imeIgraca3');
const ime4=document.getElementById('imeIgraca4');
const paleta = document.getElementById("paletaBoja");
const bojaOpcije = document.querySelectorAll(".bojaOpcija");
const odabirB = document.getElementById("odabirB");


odabirB.addEventListener('click', function(){
  paleta.style.display='block';
  console.log('di')
} );



let prviPut=true;
let firstLoad = true;
let izasoje=true;
let rojac=0;

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
      document.getElementById("loader").style.display = "none";
      sve.style.display = "block";
  }, 2100); // Simulacija učitavanja od 3 sekunde
});


onAuthStateChanged(auth, (user) => {
    if (user) {
        ucitajSve(user);
        const mineID=prvih6Alfanumericki(user.uid);
        kucicaPrazna2.addEventListener('click', () => dobivanje(mineID));
        kucicaPrazna3.addEventListener('click', () => dobivanje(mineID));
        kucicaPrazna4.addEventListener('click', () => dobivanje(mineID));


        

        
    } else {
        console.log('error');
    }
});




async function ucitajSve(user){
    console.log(user)
    const mojIDD=prvih6Alfanumericki(user.uid)
    imeMoje.innerHTML=user.displayName
    idMoj.innerHTML=mojIDD;

    const putDoIdIgre = ref(db, 'IGRA/KORISNICI/' + mojIDD+'/trenutnaIgra');
    try {
        const snapshot = await get(putDoIdIgre);
        if (snapshot.exists()) {
            let idIgre = snapshot.val();
            gameId.innerHTML='ID: '+idIgre;
            izlaz.addEventListener('click', () => brisanjeIgre(idIgre, mojIDD));

            const putZaNoviPoziv = ref(db, 'IGRA/IGRE/' + idIgre);
            const snapshot4 = await get(putZaNoviPoziv);
            if (snapshot4.exists()) {
                const podatci=snapshot4.val();
                
                dodavanjeNovogIgraca(podatci,mojIDD);

            }
            onValue(putZaNoviPoziv, (snapshot1) => {
                if (firstLoad) {
                    firstLoad = false; // Ignoriši prvo učitavanje
                    return;
                }

                const data = snapshot1.val();
                if (data) { // Prikaz samo ako stvarno ima podataka
                    console.log('blabla')
                   
                    
                    dodavanjeNovogIgraca(data,mojIDD);
                    
                }
            });
            }
            
        
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
    
}

async function davanjeBoje(data, mojid) {
    const idigre=data.id;
    const put = ref(db, 'IGRA/IGRE/' + idigre+'/postavkeIgraca');
    try {
        const snapshot = await get(put);
        if (snapshot.exists()) {
            console.log(snapshot.val())
            const spremni=snapshot.val();
            const spremniIgraciId=Object.keys(spremni);
            zaOstale.innerHTML='';
            for(let i=0; i<spremniIgraciId.length;i++){
                if(mojid==spremniIgraciId[i]){
                    spreman.style.display='none'
                    divPostavke.style.display='none'
                    if (animatedDiv.classList.contains("hidden")) {
                        animatedDiv.classList.remove("hidden");
                        animatedDiv.classList.add("visible");

                    }
                    console.log(spremniIgraciId[i])
                    const bojica=Object.values(spremni)[i].boja
                    console.log(bojica)
                    kucicaMoja.style.backgroundColor=bojica;
                }else{
                  console.log(spremniIgraciId[i],idIgr2.innerHTML)
                    if(idIgr2.innerHTML==spremniIgraciId[i]){
                        const bojica=Object.values(spremni)[i].boja
                        kucica2.style.backgroundColor=bojica;
                        kreiranjeSpremnog(spremniIgraciId[i],'s',idigre)
                        console.log(spremniIgraciId[i])
                    }else if(idIgr3.innerHTML==spremniIgraciId[i]){
                        const bojica=Object.values(spremni)[i].boja;
                        kucica3.style.backgroundColor=bojica;
                        console.log(spremniIgraciId[i])
                        kreiranjeSpremnog(spremniIgraciId[i],'s',idigre)
                    }else if(idIgr4.innerHTML==spremniIgraciId[i]){
                        const bojica=Object.values(spremni)[i].boja;
                        kucica4.style.backgroundColor=bojica;
                        console.log(spremniIgraciId[i])
                        kreiranjeSpremnog(spremniIgraciId[i],'s',idigre)
                    }
                }
            }provjeraNeReady(idigre);
        }
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
}


async function provjeraNeReady(idigre) {
  const putDopoziva = ref(db, 'IGRA/IGRE/'+idigre+'/igraci');
  const putDopoziva2 = ref(db, 'IGRA/IGRE/' + idigre+'/postavkeIgraca');
    try {
      const snapshot = await get(putDopoziva);
      
      const listaIgraca=snapshot.val()
     
          
        try {
          const snapshot2 = await get(putDopoziva2);
          if (snapshot2.exists()) {
            const listaSpremnih=Object.keys(snapshot2.val())
            console.log(listaSpremnih)

            for(let i=0; i<listaIgraca.length;i++){
              if(!(listaSpremnih.includes(listaIgraca[i]))){
                const putDopoziva3 = ref(db, 'IGRA/KORISNICI/' + listaIgraca[i]+'/ime');
                try {
                  const snapshot3 = await get(putDopoziva3);
                  const ime=snapshot3.val();
                  kreiranjeSpremnog('nema','ns', ime);
                } catch (error) {
                    console.error("Greška pri slanju poziva: ", error);
                }
              }}
              
            if(listaIgraca.length==listaSpremnih.length){
              zapocniIgru();
            }
            }
          } catch (error) {
              console.error("Greška pri slanju poziva: ", error);
          }
      
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
}

function zapocniIgru(){
  window.location.href='igra.html'
}


async function kreiranjeSpremnog(id, sN,ime) {
    if(sN=='s'){
        const putDopoziva = ref(db, 'IGRA/KORISNICI/' + id+'/ime');
        try {
            const snapshot = await get(putDopoziva);
            const ime=snapshot.val();
            console.log(ime)
            const rediDiv=document.createElement('div');
            rediDiv.className='readyDiv';

            const imeP=document.createElement('p');
            imeP.className='readyIme';
            imeP.innerHTML=ime+':';

            const readyP=document.createElement('p');
            readyP.className='readyIg'
            readyP.innerHTML='(ready)'
            readyP.style.backgroundColor='green'


            rediDiv.appendChild(imeP);
            rediDiv.appendChild(readyP);
            zaOstale.appendChild(rediDiv);
        } catch (error) {
            console.error("Greška pri slanju poziva: ", error);
        }
        
    }else{
      const rediDiv=document.createElement('div');
      rediDiv.className='readyDiv';

      const imeP=document.createElement('p');
      imeP.className='readyIme';
      imeP.innerHTML=ime+':';

      const readyP=document.createElement('p');
      readyP.className='readyIg'
      readyP.innerHTML='(not ready)'
      readyP.style.backgroundColor='red'


      rediDiv.appendChild(imeP);
      rediDiv.appendChild(readyP);
      zaOstale.appendChild(rediDiv);
    }
}



async function dodavanjeNovogIgraca(dataIgre,mojid) {
    const brojIgraca=dataIgre.brojIgraca;
    const idIgre=dataIgre.id;
    const igraci=dataIgre.igraci;

    if(brojIgraca>1){
        spreman.style.backgroundColor='green'
        spreman.addEventListener('click', () => ready());
    }

    if(brojIgraca==2){
        const praznoPolje2=document.getElementById('praznoPolje2');
        const noviigrac2=document.getElementById('poljeIgraca2');
        
        
        const id2=document.getElementById('idIgraca2');
        if(!(mojid==igraci[0])){
            id2.innerHTML=igraci[0];
            const putDopoziva = ref(db, 'IGRA/KORISNICI/' + igraci[0]+'/ime');
            try {
                const snapshot = await get(putDopoziva);
                if (snapshot.exists()) {
                    ime2.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        } else{
            id2.innerHTML=igraci[1];
            const putDopoziva = ref(db, 'IGRA/KORISNICI/' + igraci[1]+'/ime');
            try {
                const snapshot = await get(putDopoziva);
                if (snapshot.exists()) {
                    ime2.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }

        praznoPolje2.style.display='none';
        noviigrac2.style.display='block';
    }
    if(brojIgraca==3){
        const praznoPolje2=document.getElementById('praznoPolje2');
        const noviigrac2=document.getElementById('poljeIgraca2');
        const kucica2=document.getElementById('kucicaIgraca2');
        const ime2=document.getElementById('imeIgraca2');
        const id2=document.getElementById('idIgraca2');
        if(mojid==igraci[1]){
            id2.innerHTML=igraci[0];
            const putDopoziva = ref(db, 'IGRA/KORISNICI/' + igraci[0]+'/ime');
            try {
                const snapshot = await get(putDopoziva);
                if (snapshot.exists()) {
                    ime2.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        } else{
            id2.innerHTML=igraci[1];
            const putDopoziva = ref(db, 'IGRA/KORISNICI/' + igraci[1]+'/ime');
            try {
                const snapshot = await get(putDopoziva);
                if (snapshot.exists()) {
                    ime2.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }

        praznoPolje2.style.display='none';
        noviigrac2.style.display='block';




//---------------------------------------------------------
        const praznoPolje3=document.getElementById('praznoPolje3');
        const noviigrac3=document.getElementById('poljeIgraca3');
        
        
        const id3=document.getElementById('idIgraca3');
        if(mojid==igraci[2]){
            id3.innerHTML=igraci[0];
            const putDopoziva2 = ref(db, 'IGRA/KORISNICI/' + igraci[0]+'/ime');
            try {
                const snapshot = await get(putDopoziva2);
                if (snapshot.exists()) {
                    ime3.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }else{
            id3.innerHTML=igraci[2];
            const putDopoziva2 = ref(db, 'IGRA/KORISNICI/' + igraci[2]+'/ime');
            try {
                const snapshot = await get(putDopoziva2);
                if (snapshot.exists()) {
                    ime3.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }

        praznoPolje3.style.display='none';
        noviigrac3.style.display='block';
    }

    if(brojIgraca==4){
        const praznoPolje2=document.getElementById('praznoPolje2');
        const noviigrac2=document.getElementById('poljeIgraca2');
        const kucica2=document.getElementById('kucicaIgraca2');
        const ime2=document.getElementById('imeIgraca2');
        const id2=document.getElementById('idIgraca2');
        if(mojid==igraci[1]){
            id2.innerHTML=igraci[0];
            const putDopoziva = ref(db, 'IGRA/KORISNICI/' + igraci[0]+'/ime');
            try {
                const snapshot = await get(putDopoziva);
                if (snapshot.exists()) {
                    ime2.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        } else{
            id2.innerHTML=igraci[1];
            const putDopoziva = ref(db, 'IGRA/KORISNICI/' + igraci[1]+'/ime');
            try {
                const snapshot = await get(putDopoziva);
                if (snapshot.exists()) {
                    ime2.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }

        praznoPolje2.style.display='none';
        noviigrac2.style.display='block';


        const praznoPolje3=document.getElementById('praznoPolje3');
        const noviigrac3=document.getElementById('poljeIgraca3');
        const kucica3=document.getElementById('kucicaIgraca3');
        const ime3=document.getElementById('imeIgraca3');
        const id3=document.getElementById('idIgraca3');
        if(mojid==igraci[2]){
            id3.innerHTML=igraci[0];
            const putDopoziva2 = ref(db, 'IGRA/KORISNICI/' + igraci[0]+'/ime');
            try {
                const snapshot = await get(putDopoziva2);
                if (snapshot.exists()) {
                    ime3.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }else{
            id3.innerHTML=igraci[2];
            const putDopoziva2 = ref(db, 'IGRA/KORISNICI/' + igraci[2]+'/ime');
            try {
                const snapshot = await get(putDopoziva2);
                if (snapshot.exists()) {
                    ime3.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }

        praznoPolje3.style.display='none';
        noviigrac3.style.display='block';


        const praznoPolje4=document.getElementById('praznoPolje4');
        const noviigrac4=document.getElementById('poljeIgraca4');
        
        
        const id4=document.getElementById('idIgraca4');
        if(mojid==igraci[3]){
            id4.innerHTML=igraci[0];
            const putDopoziva4 = ref(db, 'IGRA/KORISNICI/' + igraci[0]+'/ime');
            try {
                const snapshot = await get(putDopoziva4);
                if (snapshot.exists()) {
                    ime4.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }else{
            id4.innerHTML=igraci[3];
            const putDopoziva4 = ref(db, 'IGRA/KORISNICI/' + igraci[3]+'/ime');
            try {
                const snapshot = await get(putDopoziva4);
                if (snapshot.exists()) {
                    ime4.innerHTML=snapshot.val();
                }
            } catch (error) {
                console.error("Greška pri slanju poziva: ", error);
            }
        }

        praznoPolje4.style.display='none';
        noviigrac4.style.display='block';
    }
    davanjeBoje(dataIgre,mojid);
}


async function ready() {
    console.log('spreman')
}


async function brisanjeIgre(idigre, mojid) {
    izasoje=false;
    const tekstRef = ref(db, 'IGRA/IGRE/'+idigre); 
    const itemRef = ref(db, 'IGRA/KORISNICI/' + mojid + '/trenutnaIgra'); // Putanja do stavke
        remove(itemRef).then(() => {
            console.log("Stavka uspešno obrisana!");
          })
          .catch((error) => {
            console.error("Greška prilikom brisanja:", error);
          });;

          if(await glanviProvjera(idigre,mojid)){
            remove(tekstRef).then(() => {
                console.log("Stavka uspešno obrisana!");
              })
              .catch((error) => {
                console.error("Greška prilikom brisanja:", error);
              });;
              console.log('glavni uslo')
          }else{
            uredivanjeIgre(tekstRef,mojid);
        }

         window.location.href = "menu.html";
}


async function uredivanjeIgre(tekstRef,mojId) {
    try {
        const snapshot = await get(tekstRef);
        if (snapshot.exists()) {
            const podatciIgre=snapshot.val();
            
            const listaBezMene=podatciIgre.igraci;
            const listaSamnom=listaBezMene.filter(item => item !== mojId);
            
            const noviPodatci={
                brojIgraca:podatciIgre.brojIgraca-1,
                igraci:listaSamnom
            }
            await update(tekstRef, noviPodatci);
           console.log(noviPodatci)
        } 
        } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
        }
}


async function glanviProvjera(idigre, mojid) {
    const putIgre = ref(db, 'IGRA/IGRE/'+idigre);
    try {
        const snapshot = await get(putIgre);
        if (snapshot.exists()) {
            const glava=snapshot.val().glavni;
            
            if(mojid==glava){
                return true;
                
            }else{
                return false;
    
            }
        }
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
}

async function dobivanje(mojid) {
    
    mojiPrijatelji.style.display='block'
    if(prviPut){
        const dataRef = ref(db, 'IGRA/KORISNICI/' + mojid + '/prijatelji');
        try {
            const snapshot = await get(dataRef);  
            if (snapshot.exists()) {
                const prijatelji=snapshot.val();
                zvanjePrijatelja(mojid,prijatelji);
            }
            } catch (error) {
            console.error("Greška pri radu sa Firebase-om:", error);
            }
    }
}


function zvanjePrijatelja(mojId,prijatelji) {
    
    const roditeljDiv=document.getElementById('dostupniPrijatelji');
    
    for (let i = 1; i < prijatelji.length; i++) {
        

        let jedanPrijatelj = document.createElement("div");
        jedanPrijatelj.className= "JedanPrijatelj";
        jedanPrijatelj.id='JedanPrijatelj'+i;

        let pojedinacDiv = document.createElement("p");
        imenaOdZahtjeva(prijatelji[i])
        .then(ime => {
        pojedinacDiv.textContent = ime;
        })

        let dodajDiv = document.createElement("div");
        dodajDiv.className = "dodaj";
        dodajDiv.id = "dodaj"+i;
        dodajDiv.textContent = "+";
        dodajDiv.addEventListener('click', () => dodajPrijatelja(prijatelji[i],i,mojId));
        

        jedanPrijatelj.appendChild(pojedinacDiv);
        jedanPrijatelj.appendChild(dodajDiv);
        roditeljDiv.appendChild(jedanPrijatelj)   
        prviPut=false;
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


async function dodajPrijatelja(prijatelj, i , mojid) {
    console.log(prijatelj,i,mojid)
    const putDopoziva = ref(db, 'IGRA/KORISNICI/' + prijatelj + '/inviteGame');
    const putDoPrijatelja = ref(db, 'IGRA/KORISNICI/' + prijatelj);
    try {
        const snapshot = await get(putDopoziva);
        if (snapshot.exists()) {
            let lista = snapshot.val();
            if (!lista.includes(mojid)) { 
                lista.push(mojid);
                console.log("Nova lista poziva: ", lista);

                await update(putDoPrijatelja, { inviteGame: lista });

            } else {
                alert("Već ste pozvali tog korisnika.");
            }
        }
    } catch (error) {
        console.error("Greška pri slanju poziva: ", error);
    }
}



function prvih6Alfanumericki(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
}




bojaOpcije.forEach(opcija => {
  opcija.addEventListener("click", function() {
      let odabranaBoja = this.style.backgroundColor;
      kucicaMoja.style.backgroundColor = odabranaBoja;
      paleta.style.display = "none";
      odabirB.style.backgroundColor=odabranaBoja;
  });
});





const pprihvacanjeBack=document.getElementById('prijateljiBack');

pprihvacanjeBack.addEventListener('click', function(){mojiPrijatelji.style.display='none'})