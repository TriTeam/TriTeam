import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove,set, update } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const utrke = ref(database, 'utrke');
const vrijednosti=ref(database, 'vrijednosti');
let a=0;
let b=0;
onValue(utrke, (snapshot) => {
    
    
    let rezultat = Object.entries(snapshot.val());
    for (let i = 0; i < rezultat.length; i++) {
        let utrka=document.createElement('div');
        utrka.innerHTML=rezultat[i][0];
        utrka.className='natjecanje'
        let sveutrke=document.getElementById('sveutrke')
        utrka.addEventListener('click', function(){
            
            
            let link=Object.values(rezultat[i][1])[1][1]
            console.log(link)
            fetch(link)
                .then(response=> response.json())
                .then(data=> {
                    
                    
                    for(let o =0; o<data.length; o++){
                        console.log(data[o].Competitor.name+' '+data[o].Competitor.surname)
                        onValue(vrijednosti, (snapshot) => {

                            let skupNatjecateljaINjihovihVrijednosti = Object.entries(snapshot.val());
                            let ime=data[o].Competitor.name+' '+data[o].Competitor.surname
                            let put = 'utrke/' + String(rezultat[i][0]) + '/natjecatelji';
                            const rab = ref(database, put);

                            console.log(skupNatjecateljaINjihovihVrijednosti);

                            let rezultatb = skupNatjecateljaINjihovihVrijednosti.findIndex(([prviElement]) => prviElement === ime);


                            if (rezultatb  !== -1) {
                                get(rab).then((snapshot) => {
                                    if (snapshot.exists()) {
                                        let updates = {};
                                        updates[ime] = skupNatjecateljaINjihovihVrijednosti[rezultatb][1];
                                        update(rab, updates);
                                    } else {
                                        set(rab, {
                                            [ime]: skupNatjecateljaINjihovihVrijednosti[rezultatb][1]
                                        });
                                    }
                                });
                                
                            } else {
                                get(rab).then((snapshot) => {
                                    if (snapshot.exists()) {
                                        let updates = {};
                                        updates[ime] = 1;
                                        update(rab, updates);
                                    } else {
                                        set(rab, {
                                            [ime]: 1
                                        });
                                    }
                                });
                                
                            }
                            
                            /*
                            
                            */
                        })
                       
                        
                        };


                        
                        
                })
            
            
            
        })
        sveutrke.append(utrka)
        

    }})




