import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const utrke = ref(database, 'utrke');
const divutrke=document.getElementById('slijedecatrka');
let datum=0;
let brojtrke;
let utrka;

onValue(utrke, (snapshot) => {
    
    
    let rezultat = Object.entries(snapshot.val());
    for(let i =0; i<rezultat.length; i++){
        //console.log(rezultat[i][1].datum)
        let slijedecatrka=rezultat[i][1].datum;
        if(datum==0&&slijedecatrka>lalala()){
            datum=slijedecatrka;
            //console.log(datum,slijedecatrka)
            brojtrke=i;
        }else if(datum>slijedecatrka &&slijedecatrka>lalala()){
            datum=slijedecatrka;
            //console.log(datum,slijedecatrka)
            brojtrke=i;
        }
        
        

    }
    utrka=rezultat[brojtrke][0];
    //console.log(utrka)
    updateCountdown();

});

function updateCountdown() {
    const targetDate = parseDate(String(datum));
    const now = new Date();
    const timeDifference = targetDate - now;

    
    if (timeDifference <= 0) {
        divutrke.innerHTML = "Dan utrke!";
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    divutrke.innerHTML = 
        `Sljedeća utrka: <strong>${utrka} </strong><br><hr>Još: <strong>${days}</strong> dana,<strong> ${hours}</strong> h, <strong> ${minutes}</strong>min i <strong>${seconds}</strong> sec`;
}





setInterval(updateCountdown, 1000);


function parseDate(dateStr) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; 
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
}

function lalala(){
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