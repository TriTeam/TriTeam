import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, get, remove, update,set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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


const kreirajIgru = document.getElementById('kreiraj_igru');


//---------------------------------------------------------

onAuthStateChanged(auth,(user)=>{
    if(user){
        const mojid=prvih6Alfanumericki(user.uid);

        kreirajIgru.addEventListener('click',() => stvaranjeIgre(mojid));
        
    }else{
        console.log('error')
    }
})


//----------------------------------------------------

async function stvaranjeIgre(mojid){
    const idNoveIgre=stvaranjeIdIgre();
    console.log(idNoveIgre)

    const tekstRef = ref(db, 'IGRA/IGRE/'+idNoveIgre);
    const tekstRef2 = ref(db, 'IGRA/KORISNICI/'+mojid+'/trenutnaIgra');
    try {

        const novaIgra = {
            igraci: [mojid],
            brojIgraca:1,
            id:idNoveIgre,
            glavni: mojid,
            rezultati:{
              1:'',
              2:'',
              3:'',
              4:''
              }
            };
    
        await set(tekstRef, novaIgra); 
        await set(tekstRef2, idNoveIgre); 

        window.location.href = "loby.html";

        } catch (error) {
        console.error("Greška pri radu sa Firebase-om:", error);
        }
}





//-------------------------------------------------------

function stvaranjeIdIgre(){
    return Math.floor(10000 + Math.random() * 90000);
}

function prvih6Alfanumericki(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
}
