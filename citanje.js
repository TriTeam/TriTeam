import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, onValue, push, get, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const utrke = ref(database, 'utrke');
const spremi=document.getElementById('spremi')
const kluboviSlike = {
    
    8: 'url(zrinski.png)',
    15: 'url(swibir.jpg)',
    12: 'url(rival.webp)',
    5:  'url(matulji.png)',
    10: 'url(pula.jpg)',
    4: 'url(maksimir.jpg)',
    20:  'url(tritim.jpg)',
    26:  'url(zadar.png)',
    21:  'url(triton.png)',
    40: 'url(porec.png)',
    13: 'url(rudolf.jpg)',
    39: 'url(sjever.jpg)',
    14: 'url(split.png)',
    35: 'url(sisak.jpg)'
};

let zapisani=[];

const poljzautrke=document.getElementById('utrke')
let abrakadabra=false;
let abrakadabra2=0;
let gumb1=document.getElementById('poljeZaNatjecatelja1')
let gumb2=document.getElementById('poljeZaNatjecatelja2')
let gumb3=document.getElementById('poljeZaNatjecatelja3')
let gumb4=document.getElementById('poljeZaNatjecatelja4')
let imenjega=document.getElementById('natjecatelj1');
let imenjega2=document.getElementById('natjecatelj2');
let imenjega3=document.getElementById('natjecatelj3');
let imenjega4=document.getElementById('natjecatelj4');
let slikauno=document.getElementById('slika1');
let slikaduo=document.getElementById('slika2');
let slikatre=document.getElementById('slika3');
let slikakvatro=document.getElementById('slika4');

let listaklubva=[];
//--------postavljanje liste utrka---------------------------

onValue(utrke, (snapshot) => {
        const objekti = snapshot.val();
        console.log(objekti);


        const entries = Object.entries(objekti);

        // 2. Sortiraj niz prema 'datum' vrijednostima
        entries.sort(([, a], [, b]) => a.datum - b.datum);

        // 3. Pretvori sortirani niz natrag u objekt
        const sortedObject = Object.fromEntries(entries);

        console.log(sortedObject);

    
        

        let rezultat = Object.entries(sortedObject);

        for (let i = 0; i < rezultat.length; i++) {
            
           let novidiv = document.createElement('div');
           statusUtrke(novidiv,rezultat,i);
           novidiv.id=rezultat[i][0];
           novidiv.innerHTML = rezultat[i][0];
           novidiv.addEventListener('click' , function(){
                console.log('desi se')
                let odabirUtrke=document.getElementById('raspisutrka')
                let mojtim=document.getElementById('mojtim')
                odabirUtrke.style.display='none';
                document.querySelector('.wrapper').style.display = 'flex';
                if(novidiv.className=='natjecanje'){
                    //----
                   
                    
                    let link=Object.values(rezultat[i][1])[1][1]
                    //console.log(link)
                    fetch(link)
                            .then(response=> response.json())
                            .then(data=> {
                                
                                listaklubva=data;
                                console.log(listaklubva)
                                kreiranjeliste(rezultat[i][0])
                                nemampojma(rezultat,i);
                                
                    })
                    kreiranjeliste(rezultat[i][0])
                    nemampojma(rezultat,i);
                    
                    
                }else if(novidiv.className=='natjecanjeZuto'){
                    let link=Object.values(rezultat[i][1])[1][1]
                    console.log(link)
                    if(link){
                        fetch(link)
                            .then(response=> response.json())
                            .then(data=> {
                                
                                listaklubva=data;
                                sveostalo2(rezultat,i);
                                document.querySelector('.wrapper').style.display = 'none';
                    })
                    }else{
                        sveostalo2(rezultat,i)
                        document.querySelector('.wrapper').style.display = 'none';
                    }
                    
                }else if(novidiv.className=='natjecanjeCrveno'){
                    let link=Object.values(rezultat[i][1])[1][1]
                    console.log(link)
                    if(link){
                        fetch(link)
                            .then(response=> response.json())
                            .then(data=> {
                                
                                listaklubva=data;
                                sveostalo(rezultat,i);
                                document.querySelector('.wrapper').style.display = 'none';
                                zbrojboduutrci(rezultat,i);
                    })
                    }else{
                        sveostalo(rezultat,i)
                        document.querySelector('.wrapper').style.display = 'none';
                        zbrojboduutrci(rezultat,i);
                    }
                    
                    

                    
                }
                

            

               

           })
          poljzautrke.append(novidiv);
          document.querySelector('.wrapper').style.display = 'none';
           
     }
});

function zbrojboduutrci(rezultat,i){
    let rezultatiNatjecanja=Object.entries(Object.entries(rezultat[i][1])[2][1]);
    let rezultatidiv=document.getElementById('rezultatinatjecanja')
    let sortiranaLista = rezultatiNatjecanja.sort((a, b) => b[1] - a[1]);
    for(let i =0; i<rezultatiNatjecanja.length;i++){
        let utrkac=document.createElement('p');
        utrkac.innerHTML=String(i+1)+'. '+sortiranaLista[i][0]+' - '+sortiranaLista[i][1];
        utrkac.className='naslov3'
        rezultatidiv.append(utrkac)
    }

    let mapaZbrojeva = {};
    sortiranaLista.forEach(podlista => {
    let prvaVarijabla = podlista[0];
    let drugaVarijabla = podlista[1];

    if (!mapaZbrojeva[prvaVarijabla]) {
        mapaZbrojeva[prvaVarijabla] = 0;
    }

    mapaZbrojeva[prvaVarijabla] += drugaVarijabla;
    });

    console.log(zapisani)
    let zbroj = 0;
    zapisani.forEach(podlista => {
    let prvaVarijabla = podlista[0];
    if (mapaZbrojeva[prvaVarijabla]) {
        zbroj += mapaZbrojeva[prvaVarijabla];
    }
    });
    console.log(zbroj)
    let brojbodova=document.getElementById('brojbodova');
    if(zbroj>0){
        brojbodova.style.display='block'
        brojbodova.innerHTML='na ovoj utrci osvojio si: '+ zbroj+' bodova'
    }
    
}


function sveostalo(rezultat,i){
    let samoakoimatim=document.getElementById('samoakoimatim1')
    samoakoimatim.style.display='none'
    let zavrijemeutrke=document.getElementById('poslijeutrke');
    let akoimatim=document.getElementById('akoimatim1')
    zavrijemeutrke.style.display='block';
    let zapisi=Object.entries(Object.entries(rezultat[i][1])[3][1]);
    let poruka= document.getElementById('poruka').innerHTML;
    for(let i=0; i<zapisi.length;i++){
        
        if(zapisi[i][0]==poruka){zapisani=(Object.entries(zapisi[i][1])[0])[1];}
            
        }
        
    if(zapisani.length===4){
        samoakoimatim.style.display='block'
        for(let i =0;i<4;i++){
            let def='natjecatelj'+String(i+9);
            let def2='slika'+String(i+9);
            let def3='poljeZaNatjecatelja'+String(i+9);
            let def4='slikakluba'+String(i+9);
            let poljeukojeide=document.getElementById(def);
            let poljeukojeidebr=document.getElementById(def2);
            let poljezastisnut=document.getElementById(def3);
            let poljezaklub=document.getElementById(def4);
            poljeukojeide.innerHTML=zapisani[i][0];
            poljeukojeidebr.innerHTML=zapisani[i][1];

            //--------
            let bolek=0;
            for(let b=0;b<listaklubva.length;b++){
                
                if(zapisani[i][0]==listaklubva[b].Competitor.name+' '+listaklubva[b].Competitor.surname){
                    bolek=listaklubva[b].Competitor.Club.id
                    
                }
            }
            
            if (kluboviSlike[bolek]) {
                poljezaklub.style.backgroundImage = kluboviSlike[bolek];
                
            }

            //-------------
            poljezastisnut.addEventListener('click',function(){
                let nemoze=document.getElementById('nemoze1');
                nemoze.style.display='block'
                setTimeout(function() {
                    nemoze.style.display = 'none';
                }, 2500); 
            })

        }
    }else{
        const spremi=document.getElementById('spremi');
        if(spremi.style.backgroundColor=='green'){
            akoimatim.innerHTML='za ovu utrku nisi napravio tim'
        }else{
            akoimatim.innerHTML='ulogiraj se (stisni) kako bi vidio svoj spremljeni tim'
            akoimatim.style.cursor='pointer'
        }

    }
}

function sveostalo2(rezultat,i){
    let samoakoimatim=document.getElementById('samoakoimatim')
    samoakoimatim.style.display='none'
    let zavrijemeutrke=document.getElementById('zavrijemeutrke');
    let akoimatim=document.getElementById('akoimatim')
    zavrijemeutrke.style.display='block';
    let zapisi=Object.entries(Object.entries(rezultat[i][1])[3][1]);
    let poruka= document.getElementById('poruka').innerHTML;
    for(let i=0; i<zapisi.length;i++){
        
        if(zapisi[i][0]==poruka){zapisani=(Object.entries(zapisi[i][1])[0])[1];}
            
        }
        console.log(zapisani)
    if(zapisani.length===4){
        samoakoimatim.style.display='block'
        for(let i =0;i<4;i++){
            let def='natjecatelj'+String(i+5);
            let def2='slika'+String(i+5);
            let def3='poljeZaNatjecatelja'+String(i+5);
            let def4='slikakluba'+String(i+5);
            let poljeukojeide=document.getElementById(def);
            let poljeukojeidebr=document.getElementById(def2);
            let poljezastisnut=document.getElementById(def3);
            let poljezaklub=document.getElementById(def4);
            poljeukojeide.innerHTML=zapisani[i][0];
            poljeukojeidebr.innerHTML=zapisani[i][1];

            let bolek=0;
            for(let b=0;b<listaklubva.length;b++){
                
                if(zapisani[i][0]==listaklubva[b].Competitor.name+' '+listaklubva[b].Competitor.surname){
                    bolek=listaklubva[b].Competitor.Club.id
                    
                }
            }
            
            if (kluboviSlike[bolek]) {
                poljezaklub.style.backgroundImage = kluboviSlike[bolek];
                
            }

            poljezastisnut.addEventListener('click',function(){
                
                let nemoze=document.getElementById('nemoze');
                nemoze.style.display='block'
                setTimeout(function() {
                    nemoze.style.display = 'none';
                }, 2500); 
            })

        }
    }else{
        const spremi=document.getElementById('spremi');
        if(spremi.style.backgroundColor=='green'){
            akoimatim.innerHTML='za ovu utrku nisi napravio tim'
        }else{
            akoimatim.innerHTML='ulogiraj se (stisni) kako bi vidio svoj spremljeni tim'
            akoimatim.style.cursor='pointer'
        }

    }
}
//---------farbanje i datum statusa utrka
function statusUtrke(novidiv,rezultat,i){
    let currentDate = new Date();

    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // Meseci su indeksirani od 0
    let year = currentDate.getFullYear();

    // Dodavanje vodećih nula danu i mesecu ako je potrebno
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    let sadDatum = year+month+day;
    
   
    let datum=Object.entries(rezultat[i][1])[0][1]
    if(datum>sadDatum){
        novidiv.className='natjecanje'   
        
    }else if(datum==sadDatum){
        novidiv.className='natjecanjeZuto'
    }else if(datum<sadDatum){
        novidiv.className='natjecanjeCrveno'
    }
}
//---------izmjena moj tim i popis-------------------------------
let nazad=document.getElementById('nazad');
nazad.addEventListener('click', function(){
    let mojtim=document.getElementById('mojtim')
    let popis=document.getElementById('popisNatjecatelja')
    mojtim.style.display='block'
    popis.style.display='none'
    if(abrakadabra){
        let dudet=document.getElementById('buđet1');
        if(odabirpojedinca==1){
            dudet.innerHTML=Number(dudet.innerHTML)- Number(slikauno.innerHTML);
        }else if(odabirpojedinca==2){
            dudet.innerHTML=Number(dudet.innerHTML)- Number(slikaduo.innerHTML);
        }else if(odabirpojedinca==3){
            dudet.innerHTML=Number(dudet.innerHTML)- Number(slikatre.innerHTML);
        }else if(odabirpojedinca==4){
            dudet.innerHTML=Number(dudet.innerHTML)- Number(slikakvatro.innerHTML);
        }
        console.log(odabirpojedinca)
        abrakadabra=false;
        abrakadabra2=0;

    }

})

gumb1.addEventListener('click', function(){odabirpojedinca=1;pokazipopis()})
gumb2.addEventListener('click', function(){odabirpojedinca=2;pokazipopis()})
gumb3.addEventListener('click', function(){odabirpojedinca=3;pokazipopis()})
gumb4.addEventListener('click', function(){odabirpojedinca=4;pokazipopis()})

function pokazipopis(){
    let mojtim=document.getElementById('mojtim')
    let popis=document.getElementById('popisNatjecatelja');
    mojtim.style.display='none';
    popis.style.display='block';
    let slike = [slikauno, slikaduo, slikatre, slikakvatro];

    if (odabirpojedinca >= 1 && odabirpojedinca <= 4) {
        let slika = slike[odabirpojedinca - 1];
        if (slika.innerHTML != '') {
            let dudet = document.getElementById('buđet1');
            abrakadabra = true;
            dudet.innerHTML = Number(dudet.innerHTML) + Number(slika.innerHTML);
            abrakadabra2 = Number(slika.innerHTML);
        }
    }

}

//----------moj tim----------------------------
let odabirpojedinca=0;
let tokajideubazu=[];
let listica=[];
function kreiranjeliste(imeutrke){
    
    onValue(utrke, (snapshot) => {
        
        let rezultat=Object.entries(snapshot.val());



        for (let i = 0; i < rezultat.length; i++){
            if(imeutrke==rezultat[i][0]){
                

                


                let popisumomtimu=Object.entries(Object.entries(Object.entries(snapshot.val())[i][1])[1][1])
                
                if(listica.length==0){
                    
                    for(let i =1; i<popisumomtimu.length;i++){
                    listica.push(popisumomtimu[i])   
                }
                console.log(listica)

                
            }
                
                

                
                
                
                
            }
        }document.querySelector('.wrapper').style.display = 'none';
        popisNatjecatelja();
        
        
    })}
let a=0;    
//---------------kreiranje popisa-----------------
function popisNatjecatelja(){
    let sortedData = listica.slice().sort((a, b) => b[1] - a[1]);
    
    console.log(sortedData)
    for (let i = 0; i < sortedData.length; i++) {
        a++;
        //console.log(i,listaklubva[i].Competitor.Club.id,listaklubva[i].Competitor.Club.name)
        let slikakluba=document.createElement('div')
        slikakluba.className='slikakluba';
        //brojkluba=listaklubva[i].Competitor.Club.id;
        let brojkluba=0;
        let brojkluba2=0;
        for(let b=0;b<listaklubva.length;b++){
            
            if(sortedData[i][0]==listaklubva[b].Competitor.name+' '+listaklubva[b].Competitor.surname){
                brojkluba=listaklubva[b].Competitor.Club.id
                brojkluba2=listaklubva[b].Competitor.Club.id
                //console.log(brojkluba)
            }
        }
        
        if (kluboviSlike[brojkluba2]) {
            slikakluba.style.backgroundImage = kluboviSlike[brojkluba2];
        }
        
        let poljepojedinca = document.createElement('div');
        let popisNatjecatelja = document.getElementById('popisNatjecatelja2');
        poljepojedinca.className = 'poljeZaNatjecatelja';
        poljepojedinca.id = sortedData[i][0];
        let poljeslike = document.createElement('div');
        poljeslike.className = 'slika';
        poljeslike.innerHTML=sortedData[i][1]
        poljepojedinca.append(slikakluba)
        
        let tekst = document.createElement('div');
        tekst.innerHTML = sortedData[i][0];
        tekst.className='imeNatjecatelja'
        
        poljepojedinca.append(tekst);
        poljepojedinca.append(poljeslike);
        popisNatjecatelja.append(poljepojedinca);
        
        poljepojedinca.addEventListener('click',function(){
            console.log(brojkluba)
            //-------stavljanje pojedinca u moj tim-------------------------
            if(abrakadabra){
                let dudet=document.getElementById('buđet1');
                if(odabirpojedinca==1){
                    dudet.innerHTML=Number(dudet.innerHTML)- Number(slikauno.innerHTML);
                }else if(odabirpojedinca==2){
                    dudet.innerHTML=Number(dudet.innerHTML)- Number(slikaduo.innerHTML);
                }else if(odabirpojedinca==3){
                    dudet.innerHTML=Number(dudet.innerHTML)- Number(slikatre.innerHTML);
                }else if(odabirpojedinca==4){
                    dudet.innerHTML=Number(dudet.innerHTML)- Number(slikakvatro.innerHTML);
                }
                abrakadabra=false;
                abrakadabra2=0;
        
            };
            let ime=tekst.innerHTML;
            if(tokajideubazu.length<4){
                if(odabirpojedinca==1){
                    idegas('natjecatelj1',poljepojedinca,ime,'slika1',poljeslike.innerHTML,brojkluba,'slikakluba1')
                }else if(odabirpojedinca==2){
                    idegas('natjecatelj2',poljepojedinca,ime,'slika2',poljeslike.innerHTML,brojkluba,'slikakluba2')
                }else if(odabirpojedinca==3){
                    idegas('natjecatelj3',poljepojedinca,ime,'slika3',poljeslike.innerHTML,brojkluba,'slikakluba3')
                }else if(odabirpojedinca==4){
                    idegas('natjecatelj4',poljepojedinca,ime,'slika4',poljeslike.innerHTML,brojkluba,'slikakluba4')
        }
            }else if(tokajideubazu.length>=4){
                if(odabirpojedinca==1){
                    idegas2('natjecatelj1',poljepojedinca,ime,'slika1',poljeslike.innerHTML,brojkluba,'slikakluba1')
                }else if(odabirpojedinca==2){
                    idegas2('natjecatelj2',poljepojedinca,ime,'slika2',poljeslike.innerHTML,brojkluba,'slikakluba2')
                }else if(odabirpojedinca==3){
                    idegas2('natjecatelj3',poljepojedinca,ime,'slika3',poljeslike.innerHTML,brojkluba,'slikakluba3')
                }else if(odabirpojedinca==4){
                    idegas2('natjecatelj4',poljepojedinca,ime,'slika4',poljeslike.innerHTML,brojkluba,'slikakluba4')
        }
            }
            
            })}};
let novci=100;
function idegas(natjec,poljepojedinca,ime,slikica,poljeslike,brojkluba,slikakluba){
    console.log(brojkluba)
        let popis=document.getElementById('popisNatjecatelja');
        let slika=document.getElementById(slikica);
        let natj1=document.getElementById(natjec);
        let klubic=document.getElementById(slikakluba);
        
        if(!istinito()){
            let blabla=document.getElementById(natj1.innerHTML);
            blabla.style.display='block'
        }
        
        poljepojedinca.style.display='none';
        mojtim.style.display='block';
        popis.style.display='none';
        for(let i = 0;i<listica.length;i++){
            if(listica[i][0]==ime&&istinito()){
                tokajideubazu.push(listica[i]);
                listica = listica.filter(ideca => ideca !== listica[i]);
                
                console.log(kluboviSlike[brojkluba])
                klubic.style.backgroundImage=kluboviSlike[brojkluba];
                natj1.innerHTML=ime;
                slika.innerHTML=poljeslike
            } else if(listica[i][0]==ime){
                
                tokajideubazu.push(listica[i]);
                listica = listica.filter(ideca => ideca !== listica[i]);
                for(let i=0;i<tokajideubazu.length;i++){
                    if(tokajideubazu[i][0]==natj1.innerHTML){
                        listica.push(tokajideubazu[i]);
                        tokajideubazu = tokajideubazu.filter(ideca => ideca !== tokajideubazu[i]);
                        document.getElementById(natj1.innerHTML).style.display = 'block';
                    }
                }

                klubic.style.backgroundImage=kluboviSlike[brojkluba];
                natj1.innerHTML=ime;
                slika.innerHTML=poljeslike


                
            }
               
        }      
   
    omogciSpremanje();

    obracun();
    console.log(tokajideubazu)
        }
        
function idegas2(natjec, poljepojedinca, ime,slikica,poljeslike,brojkluba,slikakluba) {
    let klubic=document.getElementById(slikakluba);
    let popis = document.getElementById('popisNatjecatelja');
    let slika=document.getElementById(slikica)
    let natj1 = document.getElementById(natjec);
    document.getElementById(natj1.innerHTML).style.display = 'block';

    
    
    for (let i = 0; i < tokajideubazu.length; i++) {
        if (tokajideubazu[i][0] == natj1.innerHTML) {
            listica.push(tokajideubazu[i]);
            tokajideubazu.splice(i, 1);
        }
    }
  
    for (let i = 0; i < listica.length; i++) {
        if (listica[i][0] == ime) {
            tokajideubazu.push(listica[i]);
            listica.splice(i, 1);
        }
    }
    klubic.style.backgroundImage=kluboviSlike[brojkluba];
    natj1.innerHTML = ime;
    slika.innerHTML=poljeslike
    poljepojedinca.style.display = 'none';
    mojtim.style.display = 'block';
    popis.style.display = 'none';
    omogciSpremanje();
    obracun();
    console.log(tokajideubazu)

    
}

function istinito(){
    
    if(odabirpojedinca==1){
        let prvi=document.getElementById('natjecatelj1').innerHTML
        if(prvi=='1.natjecatelj'){
            return true;
        }
    }else if(odabirpojedinca==2){
        let prvi=document.getElementById('natjecatelj2').innerHTML
        if(prvi=='2.natjecatelj'){
        
            return true;
        }
    }else if(odabirpojedinca==3){
        let prvi=document.getElementById('natjecatelj3').innerHTML
        if(prvi=='3.natjecatelj'){
            return true;
        }
    }else if(odabirpojedinca==4){
        
        let prvi=document.getElementById('natjecatelj4').innerHTML
        if(prvi=='4.natjecatelj'){
            return true;
    }}else{
        return false;
    }
};


spremi.addEventListener('click', function() {
    if (spremi.style.backgroundColor == 'green') {
        let utrkica = document.getElementById('odabranautrka').innerHTML;
        let poruka = document.getElementById('poruka').innerHTML;
        
        let put = 'utrke/' + String(utrkica) + '/timovi/' + poruka;
        
        const rab = ref(database, put);
        let poruka2=document.getElementById('poruka2')
        

        get(rab).then((snapshot) => {
            if (snapshot.exists()) {
                remove(rab)
            }
            push(rab, tokajideubazu)
            push(rab, poruka2.innerHTML)
            
        spremi.style.display='none'
        })
    }
});

function obracun(){
    let budet=document.getElementById('buđet');
    let budet1=document.getElementById('buđet1');
    let pare1=Number(document.getElementById('slika1').innerHTML)
    let pare2=Number(document.getElementById('slika2').innerHTML)
    let pare3=Number(document.getElementById('slika3').innerHTML)
    let pare4=Number(document.getElementById('slika4').innerHTML)
    let buđetos=100-(pare1+pare2+pare3+pare4);
    budet.innerHTML=buđetos;
    budet1.innerHTML=buđetos
    if(buđetos<0){
        let upozorenje=document.getElementById('upozorenje')
        upozorenje.style.display='block'
        spremi.style.display='none'
        
    }else{
        let upozorenje=document.getElementById('upozorenje')
        upozorenje.style.display='none'
    }
}

function omogciSpremanje(){
    if(imenjega.innerHTML!=='1.natjecatelj'&&imenjega2.innerHTML!=='2.natjecatelj'&&imenjega3.innerHTML!=='3.natjecatelj'&&imenjega4.innerHTML!=='4.natjecatelj'){
        let spremi=document.getElementById('spremi');
        spremi.style.display='block'
    }
}


function nemampojma(rezultat,i){
    mojtim.style.display='block'
    let odabranaUtrka=document.getElementById('odabranautrka');
    odabranaUtrka.innerHTML=rezultat[i][0];
    const spremi=document.getElementById('spremi');
    if(spremi.style.backgroundColor=='green'){
        
        
        let poruka= document.getElementById('poruka').innerHTML;
        
        //tu dole makni komentar da radi
        let zapisii=Object.entries(Object.values(Object.values(Object.values(Object.values(rezultat[i][1])))));
        if(zapisii[3]!=undefined){
            let zapisi =Object.entries(zapisii[3][1])
            console.log(zapisi)
            for(let i=0; i<zapisi.length;i++){
                if(zapisi[i][0]==poruka){
                    

                    zapisani=(Object.entries(zapisi[i][1])[0])[1];

                    tokajideubazu=zapisani;


                    

            
                    function arraysEqual(arr1, arr2) {
                    if (arr1.length !== arr2.length) return false;
                    for (let i = 0; i < arr1.length; i++) {
                        if (arr1[i] !== arr2[i]) return false;
                    }
                    return true;
                    }

                    
                    zapisani.forEach(sublist1 => {
                    let index = listica.findIndex(sublist2 => arraysEqual(sublist1, sublist2));
                    
                    
                    if (index !== -1) {
                        listica.splice(index, 1);
                    }
                    });

                    
                    console.log(listica);

                    
                    
                    imenjega.innerHTML=zapisani[0][0]
                    imenjega2.innerHTML=zapisani[1][0]
                    imenjega3.innerHTML=zapisani[2][0]
                    imenjega4.innerHTML=zapisani[3][0]
                    slikauno.innerHTML=zapisani[0][1]
                    slikaduo.innerHTML=zapisani[1][1]
                    slikatre.innerHTML=zapisani[2][1]
                    slikakvatro.innerHTML=zapisani[3][1]
                    
                    for(let i =0;i<4;i++){
                        let njegamaknut=document.getElementById(zapisani[i][0])
                        njegamaknut.style.display='none'
                    }
                    obracun();
                    
                }
            };
            console.log(zapisani)
            for(let i =0;i<4;i++){
                let def='natjecatelj'+String(i+1);
                let def2='slika'+String(i+1);
                let def3='poljeZaNatjecatelja'+String(i+1);
                let def4='slikakluba'+String(i+1);
                let poljeukojeide=document.getElementById(def);
                let poljeukojeidebr=document.getElementById(def2);
                let poljezastisnut=document.getElementById(def3);
                let poljezaklub=document.getElementById(def4);
                poljeukojeide.innerHTML=zapisani[i][0];
                poljeukojeidebr.innerHTML=zapisani[i][1];
    
                //--------
                let bolek=0;
                for(let b=0;b<listaklubva.length;b++){
                    
                    if(zapisani[i][0]==listaklubva[b].Competitor.name+' '+listaklubva[b].Competitor.surname){
                        bolek=listaklubva[b].Competitor.Club.id
                        
                    }
                }
                
                if (kluboviSlike[bolek]) {
                    poljezaklub.style.backgroundImage = kluboviSlike[bolek];
                    
                }
    
                //-------------
                
    
            }    
        }
        
            

        
}
}
