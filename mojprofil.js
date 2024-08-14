import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


//------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAeTpzrQ-V21EwUF-26DNLGY6n_ZiZ7weg",
    authDomain: "triteam-7328e.firebaseapp.com",
    databaseURL: "https://triteam-7328e-default-rtdb.firebaseio.com",
    projectId: "triteam-7328e",
    storageBucket: "triteam-7328e.appspot.com",
    messagingSenderId: "99207607267",
    appId: "1:99207607267:web:07c7b9549374b32fa326d6"
};


//const appp = initializeApp(firebaseConfig);
const auth=getAuth();
const provider = new GoogleAuthProvider();

//---------------------------------------------------------------
const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const rang = ref(database, 'rang');
const id=document.getElementById('poruka')
let idljuda;
const brbod=document.getElementById('brojbodova')
const mjpor=document.getElementById('mjestoporetka')
const imeuprofilu=document.getElementById('imeuprofilu')
const mailuprofilu=document.getElementById('mailuprofilu')
let mojalista=[];
//---------------------------------------------------------

onAuthStateChanged(auth,(user)=>{
    if(user){
        idljuda=user.uid
        mailuprofilu.innerHTML=user.email;

        let prvaRijec = user.displayName.split(" ")[0];
        imeuprofilu.innerHTML=prvaRijec;
        console.log(idljuda);
        upisipodatke();
    }else{   
        console.log('nisam');  
    }
})


//-----------------------------------------------------
function upisipodatke(){
    onValue(rang, (snapshot) => {
    
        console.log(id.innerHTML)
        let rezultat = Object.entries(snapshot.val());
        mojalista=rezultat;
        mojalista.sort((a, b) => b[1].poredak - a[1].poredak);
        for (let i = 0; i < mojalista.length; i++) {
            
            console.log(mojalista[i][1])
            if(mojalista[i][0]==idljuda){
                console.log('tisu')
                brbod.innerHTML='Bodovi: '+mojalista[i][1].poredak;
                mjpor.innerHTML='Poredak: '+(i+1)+'.';
            }
    
        }
    
    })
}
/*

    */