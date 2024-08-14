import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth=getAuth();
const provider = new GoogleAuthProvider();
        
const ulogiraj= document.getElementById('ulogiraj');
const ulogiraj2= document.getElementById('ulogiraj2');
const izlogiraj= document.getElementById('izlogiraj');
const poruka= document.getElementById('poruka');
const poruka2= document.getElementById('poruka2');
const akoimatim=document.getElementById('akoimatim');
const akoimatim1=document.getElementById('akoimatim1');

izlogiraj.style.display='none'
poruka.style.display='none'
ulogiraj2.style.display='none'

const onseulogiro = async() => {
    signInWithPopup(auth, provider).then((result) => {
        const user= result.user;
        
        
    }).catch((error)=>{
        const errorCode= error.code;
        const errorMessage= error.message;
    })
}

const userSingOut= async()=>{
    signOut(auth).then(()=>{
    
    }).catch((error)=>{})
}
let kadstisne;
const spremi=document.getElementById('spremi');
onAuthStateChanged(auth,(user)=>{
    if(user){
        izlogiraj.style.display='inline-block';
    
        poruka.innerHTML=user.uid;
        poruka2.innerHTML='Bok: '+user.displayName+' !';
        kadstisne=true
        ulogiraj.style.display='none'
        spremi.style.backgroundColor='green'
        console.log(user);

        ulogiraj2.style.display='none'
    }else{
        izlogiraj.style.display='none'
        poruka.style.display='none'
        kadstisne=false;
        spremi.style.backgroundColor='red'
        
    }
})

ulogiraj.addEventListener('click', onseulogiro);
izlogiraj.addEventListener('click', userSingOut);
ulogiraj2.addEventListener('click', onseulogiro);
akoimatim.addEventListener('click',function(){
    if(akoimatim.innerHTML=='ulogiraj se (stisni) kako bi vidio svoj spremljeni tim'){
        onseulogiro();
        akoimatim.innerHTML='reload this page'
        }else if(akoimatim.innerHTML=='reload this page'){
            location.reload()
        }
        
    })

akoimatim1.addEventListener('click',function(){
    if(akoimatim1.innerHTML=='ulogiraj se (stisni) kako bi vidio svoj spremljeni tim'){
        onseulogiro();
        akoimatim1.innerHTML='reload this page'
        }else if(akoimatim1.innerHTML=='reload this page'){
            location.reload()
        }
        
    })
 


spremi.addEventListener('click',function(){
    if(kadstisne){
        
    }else{
        ulogiraj2.style.display='inline-block'
    }
})



