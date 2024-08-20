import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove, update,set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const utrke = ref(database, 'rang');
const poredak=document.getElementById('poredak')
let lista1=[];

onValue(utrke, (snapshot) => {
    let rezultat = Object.entries(snapshot.val());
    
    for(let i=0;i<rezultat.length;i++){
        lista1.push(Object.values(rezultat[i][1]))
       
        
    }
    let lista = lista1.sort((a, b) => b[1] - a[1]);
    console.log(lista)
    for(let i=0;i<lista.length;i++){
        let redak=document.createElement('div');
        let osoba=document.createElement('span');
        let vrijednost=document.createElement('span');
        let kojije=document.createElement('span')
        kojije.className='kojije'
        redak.className='redak'
        osoba.className='osoba'
        vrijednost.className='vrijednost'
        osoba.innerHTML=lista[i][0]
        vrijednost.innerHTML=lista[i][1]
        kojije.innerHTML=Number([i])+1+'.'
        
        poredak.append(redak)
        redak.append(kojije)
        redak.append(osoba)
        
        redak.append(vrijednost)

    }
    document.querySelector('.wrapper').style.display = 'none';
})

