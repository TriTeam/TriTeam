import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove, update,set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const utrke = ref(database, 'utrke');
const ucitaj=document.getElementById('ucitaj');
const utrkei=document.getElementById('utrke')
let rezultatiNatjecanja;
let poredak;
let bodeki;

ucitaj.addEventListener('click', function(){
    onValue(utrke, (snapshot) => {
    
    
        let rezultat = Object.entries(snapshot.val());
         
        for (let i = 0; i < rezultat.length; i++) {
            let to=Object.entries(rezultat[i][1])[0][1]
            if(to<=datum()){
                  
                let novidiv = document.createElement('div');
                novidiv.id=rezultat[i][0];
                novidiv.innerHTML = rezultat[i][0];
                novidiv.className='natjecanje'
                utrkei.append(novidiv)


                novidiv.addEventListener('click', function(){
                    let zapisi=Object.entries(Object.entries(rezultat[i][1])[3][1]);


                    for(let o =0; o<zapisi.length;o++){
                        let ime=Object.entries(zapisi[o][1])[1][1]
                        let zapisani=(Object.entries(zapisi[o][1])[0])[1];
                        rezultatiNatjecanja=Object.entries(Object.entries(rezultat[i][1])[2][1]);
                        let sortiranaLista = rezultatiNatjecanja.sort((a, b) => b[1] - a[1]);
                        
                        
                        

                        const rab = ref(database, 'rang/' + zapisi[o][0]);
                        get(rab).then((snapshot) => {
                            if (snapshot.exists()) {
                                // Ako čvor postoji, dohvati trenutne podatke i ažuriraj ih
                                const currentData = snapshot.val();
                                const poredak = currentData.poredak || 0;
                                const noviBodovi = poredak + brojbod(sortiranaLista, zapisani);
                                
                                const updates = {
                                    poredak: noviBodovi,
                                    ime: ime
                                };

                                // Ažuriraj vrijednosti u bazi podataka
                                update(rab, updates).then(() => {
                                    console.log("Podaci su uspješno ažurirani.");
                                }).catch((error) => {
                                    console.error("Greška pri ažuriranju podataka:", error);
                                });
                            } else {
                                // Ako čvor ne postoji, stvori ga i upiši nove podatke
                                const newData = {
                                    poredak: brojbod(sortiranaLista, zapisani),
                                    ime: ime
                                };

                                set(rab, newData).then(() => {
                                    console.log("Novi podaci su uspješno upisani.");
                                }).catch((error) => {
                                    console.error("Greška pri upisivanju novih podataka:", error);
                                });
                            }
                        }).catch((error) => {
                            console.error("Greška pri dohvaćanju podataka:", error);
                        });

                        
                    } 
                })}


}})})












function datum(){
    let currentDate = new Date();

    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // Meseci su indeksirani od 0
    let year = currentDate.getFullYear();

    // Dodavanje vodećih nula danu i mesecu ako je potrebno
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    let sadDatum = year+month+day;
    return sadDatum;
}


function brojbod(sortiranaLista,zapisani){
    let mapaZbrojeva = {};
    sortiranaLista.forEach(podlista => {
    let prvaVarijabla = podlista[0];
    let drugaVarijabla = podlista[1];

    if (!mapaZbrojeva[prvaVarijabla]) {
        mapaZbrojeva[prvaVarijabla] = 0;
    }

    mapaZbrojeva[prvaVarijabla] += drugaVarijabla;
    });

    
    let zbroj = 0;
    zapisani.forEach(podlista => {
    let prvaVarijabla = podlista[0];
    if (mapaZbrojeva[prvaVarijabla]) {
        zbroj += mapaZbrojeva[prvaVarijabla];
    }
    });
    return zbroj;
}