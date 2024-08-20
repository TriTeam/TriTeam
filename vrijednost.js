import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove, update,set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const vrijednosti = ref(database, 'vrijednosti-muski');
const poredak=document.getElementById('poredak')

onValue(vrijednosti, (snapshot) => {
    let rezultat = Object.entries(snapshot.val());
    console.log(rezultat)
    let sortedData = rezultat.slice().sort((a, b) => b[1] - a[1]);

    console.log(sortedData);

    for(let i=0;i<sortedData.length;i++){
        let redak=document.createElement('div');
        let osoba=document.createElement('span');
        let vrijednost=document.createElement('span');
        redak.className='redak'
        osoba.className='osoba'
        vrijednost.className='vrijednost'
        osoba.innerHTML=sortedData[i][0]
        vrijednost.innerHTML=sortedData[i][1]
        
        
        poredak.append(redak)
        redak.append(osoba)
        
        redak.append(vrijednost)
    
    }
    document.querySelector('.wrapper').style.display = 'none';

})
