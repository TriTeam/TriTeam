import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove, update,set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

const poredak=document.getElementById('poredak')
const load=document.getElementById('loader');
const cont=document.getElementById('container');

setTimeout(function(){
  load.style.display='none';
  cont.style.display='flex';
},2000)


const vrijednosti = ref(database, 'IGRA/KORISNICI');

onValue(vrijednosti, (snapshot) => {
    let rezultat = Object.values(snapshot.val());
    let sviIgraci=[];
    for(let i=0; i<rezultat.length;i++){
      console.log(rezultat[i].vrijemeBest)
      if(rezultat[i].vrijemeBest!=undefined){
        sviIgraci.push([timeToMilliseconds(rezultat[i].vrijemeBest),rezultat[i].ime])
      }
      
    }
    sviIgraci.sort((a, b) => b[0] - a[0]);

    console.log(sviIgraci);

    for(let i=0;i<sviIgraci.length;i++){
        
        let redak=document.createElement('div');
        let osoba=document.createElement('span');
        
        let kojije=document.createElement('span')
        kojije.className='kojije2'
        kojije.innerHTML=millisecondsToTime(sviIgraci[i][0]);
        redak.className='redak'
        osoba.className='osoba'
    
        osoba.innerHTML=sviIgraci[i][1]
        
        
        
        
        poredak.append(redak)
        redak.append(kojije)
        redak.append(osoba)
        
        
    
    }
    

})


function timeToMilliseconds(time) {
  let parts = time.split(':');
  if (parts.length !== 3) {
    console.error('Neispravan format vremena:', time);
    return 0;
  }
  
  let minutes = parseInt(parts[0]);
  let seconds = parseInt(parts[1]);
  let tenths = parseInt(parts[2]);
  
  if (isNaN(minutes) || isNaN(seconds) || isNaN(tenths)) {
    console.error('Neispravan format vremena:', time);
    return 0;
  }

  return (minutes * 60 * 1000) + (seconds * 1000) + (tenths * 100);
}


function millisecondsToTime(ms) {
  if (isNaN(ms) || ms < 0) {
    console.error('Neispravan broj milisekundi:', ms);
    return '00:00:0';
  }
  
  let minutes = Math.floor(ms / (60 * 1000));
  ms %= 60 * 1000;
  let seconds = Math.floor(ms / 1000);
  let tenths = Math.floor((ms % 1000) / 100);
  
  let formattedMinutes = String(minutes).padStart(2, '0');
  let formattedSeconds = String(seconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}:${tenths}`;
}
