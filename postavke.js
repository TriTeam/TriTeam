import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, get, remove, update , set} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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





const tokeni=document.getElementById('tokeni')
const plusS=document.getElementById('plusSwim')
const minusS=document.getElementById('minusSwim')
const plusB=document.getElementById('plusBike')
const minusB=document.getElementById('minusBike')
const plusR=document.getElementById('plusTrcanje')
const minusR=document.getElementById('minusTrcanje')
const bodS=document.getElementById('bodoviSwim')
const bodB=document.getElementById('bodoviBike')
const bodR=document.getElementById('bodoviTrcanje')
const spreman=document.getElementById('ready')
const animatedDiv = document.getElementById("animatedDiv");
const divPostavke = document.getElementById("micanje");







onAuthStateChanged(auth, (user) => {
    if (user) {
        spreman.addEventListener('click', () => ready(user));
        
    } else {
        console.log('error');
    }
});

let swim=1;
let bike=1;
let run=1;
let points=15;

minusS.addEventListener('click',() => racunanje('s','-'));
plusS.addEventListener('click',() => racunanje('s','+'));
minusB.addEventListener('click',() => racunanje('b','-'));
plusB.addEventListener('click',() => racunanje('b','+'));
minusR.addEventListener('click',() => racunanje('r','-'));
plusR.addEventListener('click',() => racunanje('r','+'));



async function ready(user){
    const mojIDD=prvih6Alfanumericki(user.uid);
    
    if(spreman.style.backgroundColor=='green'){
        if(points==0){
            const putDoIdIgre = ref(db, 'IGRA/KORISNICI/' + mojIDD+'/trenutnaIgra');
            try {
                const snapshot = await get(putDoIdIgre);
                if (snapshot.exists()) {
                    console.log(snapshot.val())
                    const putDoIdIgre2 = ref(db, 'IGRA/IGRE/' + snapshot.val()+'/postavkeIgraca/'+mojIDD);
                    const putDoBoja = ref(db, 'IGRA/IGRE/' + snapshot.val()+'/postavkeIgraca');
                    const listaBoja=[];
                    const bojeSnapshot=await get(putDoBoja);
                    if((bojeSnapshot.val())!=undefined){
                      for (let kljuc in bojeSnapshot.val()) {
                        if (bojeSnapshot.val()[kljuc].boja) {
                          listaBoja.push(bojeSnapshot.val()[kljuc].boja);
                          console.log(listaBoja)
                        }
                      }
                    }
                    
                    
                    try {
                        const snapshot7=await get(putDoIdIgre2)

                        if(!(snapshot7.exists())){
                            const boja=document.getElementById('odabirB').style.backgroundColor;
                            if(boja!=='white' && !(listaBoja.includes(boja))){
                                const postakve={
                                    swim:swim,
                                    bike:bike,
                                    run:run,
                                    boja:boja,
                                    position:0,
                                    speed:-1
                                    }
                                    await set(putDoIdIgre2, postakve);
                                    spreman.style.display='none'
                                    divPostavke.style.display='none'
                                    if (animatedDiv.classList.contains("hidden")) {
                                        animatedDiv.classList.remove("hidden");
                                        animatedDiv.classList.add("visible");
                                    }
                                    
                                    }else{
                                        alert('nisi odabrao boju ili si odabrao boju koja se već koristi')
                                    }
                            }
                            
                        
                            
                    } catch (error) {console.error("Greška pri slanju poziva: ", error);}
                }
            } catch (error) {console.error("Greška pri slanju poziva: ", error);}
            }else{
                alert('nisi iskoristio sve tokene')
            }
    }
}



function racunanje(disciplina, plusMinus){

    if(disciplina=='s'){
        if(plusMinus=='+'){
            if(swim<10){
                if(points>0){
                    swim++;
                    points--;
                    const novo=document.getElementById('poljeGrafa'+swim)
                    novo.style.backgroundColor='red'
                    
                    
                }
            }

        }else{
            if(swim>1){
                swim--;
                points++;
                const novo=document.getElementById('poljeGrafa'+(swim+1))
                novo.style.backgroundColor=''
            }
        }
    }else if(disciplina=='b'){
        if(plusMinus=='+'){
            if(bike<10){
                if(points>0){
                    bike++;
                    points--;
                    const novo=document.getElementById('poljeGrafaBike'+bike)
                    novo.style.backgroundColor='red'
                    
                    
                }
            }

        }else{
            if(bike>1){
                bike--;
                points++;
                const novo=document.getElementById('poljeGrafaBike'+(bike+1))
                novo.style.backgroundColor=''
            }
        }
    }else{
        if(plusMinus=='+'){
            if(run<10){
                if(points>0){
                    run++;
                    points--;
                    const novo=document.getElementById('poljeGrafaTrcanje'+run)
                    novo.style.backgroundColor='red'
                    
                    
                }
            }

        }else{
            if(run>1){
                run--;
                points++;
                const novo=document.getElementById('poljeGrafaTrcanje'+(run+1))
                novo.style.backgroundColor=''
            }
        }
    }
    tokeni.innerHTML=points;
    bodB.innerHTML=bike;
    bodR.innerHTML=run;
    bodS.innerHTML=swim;
    console.log(swim,bike,run,points)
}


function prvih6Alfanumericki(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
}