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
                
                    const rang = ref(database, 'vrijednosti');

                    onValue(rang, (snapshot) => {                        
                        let vrijednost = Object.entries(snapshot.val());
                        let lista1 = vrijednost.slice().sort((a, b) => b[1] - a[1]);

                        let rezultatitetrke=Object.entries(Object.values(Object.values(rezultat)[i][1])[2])
                        let lista2=rezultatitetrke.slice().sort((a, b) => b[1] - a[1]);

                        obradavrijednosti(lista1,lista2)
                        

                    });
               
                })
                    }


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

//-----------------------------------------------------------


function obradavrijednosti(lista1, lista2) {
    console.log(lista1, lista2);

    // Filtriranje `lista1` da zadrži samo one koji su prisutni u `lista2`
    const filtriranaLista1 = lista1.filter(sublist =>
        lista2.some(sub => sub[0] === sublist[0]) // bla bla: Proveravamo da li prvi element iz `lista1` postoji u `lista2`
    );

    // Filtriranje `lista2` da zadrži samo one koji su u filtriranoj `lista1`
    const filteredLista2 = lista2
        .filter(sublist =>
            filtriranaLista1.some(filtered => filtered[0] === sublist[0]) // bla bla: Proveravamo da li prvi element iz `lista2` postoji u filtriranoj `lista1`
        )
        .map(sublist => sublist[0]); // bla bla: Uzimamo samo prvi element svake podliste iz `lista2`

    console.log(filtriranaLista1, filteredLista2);

    for (let i = 0; i < filteredLista2.length; i++) {
        for (let o = 0; o < filteredLista2.length; o++) {
            if (filtriranaLista1[i][0] === filteredLista2[o]) {
                if (i !== o) {
                    if (o < i) {
                        let razlika = Math.round((i - o) / 2);
                        filtriranaLista1[i][1] += razlika;
                        console.log('mijenja+')
                    } else {
                        let razlika = Math.round((o - i) / 2);
                        filtriranaLista1[i][1] -= razlika;
                        console.log('mijenja+')
                    }
                }
            }
        }
    }

    console.log(filtriranaLista1);

    



    for(let i = 0; i<filtriranaLista1.length;i++){
        let vrijednostput = ref(database, 'vrijednosti');
        let vrijednostpojedinca= ref(database, 'vrijednosti'+filtriranaLista1[i][0]);
        get(vrijednostpojedinca).then((snapshot) => {
            if (snapshot.exists()) {
                let bla=filtriranaLista1[i][0];
                const novo = {
                    [bla]:filtriranaLista1[i][1]
                };
    
                update(vrijednostput, novo)
                
    
            }})
    }

    for(let i = 0; i<filtriranaLista1.length;i++){
        let vrijednostput = ref(database, 'vrijednosti-muski');
        let vrijednostpojedinca= ref(database, 'vrijednosti-muski'+filtriranaLista1[i][0]);
        get(vrijednostpojedinca).then((snapshot) => {
            if (snapshot.exists()) {
                let bla=filtriranaLista1[i][0];
                const novo = {
                    [bla]:filtriranaLista1[i][1]
                };

                update(vrijednostput, novo)
    
            }})
    }

    for(let i = 0; i<filtriranaLista1.length;i++){
        let vrijednostput = ref(database, 'vrijednosti-zene');
        let vrijednostpojedinca= ref(database, 'vrijednosti-zene'+filtriranaLista1[i][0]);
        get(vrijednostpojedinca).then((snapshot) => {
            if (snapshot.exists()) {
                let bla=filtriranaLista1[i][0];
                const novo = {
                    [bla]:filtriranaLista1[i][1]
                };
  
                update(vrijednostput, novo)
    
            }})
    }



    
}


