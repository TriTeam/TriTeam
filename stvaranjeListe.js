import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ucitavanjePostojeceg } from "./ucitavanjeSpremljenog.js";
const firebaseConfig = {
  apiKey: "AIzaSyAeTpzrQ-V21EwUF-26DNLGY6n_ZiZ7weg",
  authDomain: "triteam-7328e.firebaseapp.com",
  databaseURL: "https://triteam-7328e-default-rtdb.firebaseio.com",
  projectId: "triteam-7328e",
  storageBucket: "triteam-7328e.appspot.com",
  messagingSenderId: "99207607267",
  appId: "1:99207607267:web:07c7b9549374b32fa326d6",
};
const auth = getAuth();
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let userId;
let muski = [undefined, undefined, undefined, undefined];
let zene = [undefined, undefined, undefined, undefined];
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
  } else {
    window.location.href = "login.html";
  }
});

const lockoutPolje = document.getElementById("lockout");
const startlist = document.getElementById("startlist");
export async function stvaranjeListe(utrka) {
  const datumput = ref(db, `FANTASY/utrke/${utrka[0]}`);
  try {
    const snapshot2 = await get(datumput);

    lockoutPolje.innerHTML = countdownToEvent(snapshot2.val().datum);
  } catch (error) {
    console.error("Greška pri radu sa Firebase-om:", error);
  }

  const tekstRef = ref(db, `FANTASY/utrke/${utrka[0]}/prijavljeni`);
  try {
    const snapshot = await get(tekstRef);
    startlist.innerHTML = "";
    if (snapshot.exists()) {
      document.getElementById("podatciKorisnika").style.display = "flex";
      document.getElementById("poljeSaPoljima").style.display = "block";
      document.getElementById("podatciKorisnikaW").style.display = "flex";
      document.getElementById("poljeSaPoljimaW").style.display = "block";
      document.getElementById("up-fin").style.display = "flex";
      document.getElementById("clear").onclick = function () {
        muski = [undefined, undefined, undefined, undefined];
        for (let i = 1; i < 5; i++) {
          document.getElementById(`text${i}`).innerHTML = "ADD COMPETITOR";
        }

        if (window.skriveniElementiM) {
          window.skriveniElementiM.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
              if (id.startsWith("slika")) el.style.display = "block";
              else el.style.display = "flex";
            }
          });
        }
      };

      document.getElementById("clearW").onclick = function () {
        zene = [undefined, undefined, undefined, undefined];
        for (let i = 1; i < 5; i++) {
          document.getElementById(`text${i}W`).innerHTML = "ADD COMPETITOR";
        }

        if (window.skriveniElementiZ) {
          window.skriveniElementiZ.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
              if (id.startsWith("slika")) el.style.display = "block";
              else el.style.display = "flex";
            }
          });
        }
      };

      await listaPrivavljenih(snapshot.val(), utrka[0]);
      let listeSaSpremljenima = await ucitavanjePostojeceg(utrka);
      muski = listeSaSpremljenima[0];
      zene = listeSaSpremljenima[1];
    } else {
      document.getElementById("loader").style.display = "none";
      document.getElementById("sve").style.display = "flex";
      startlist.innerHTML =
        "There is no start list for this race at the moment";
      document.getElementById("up-fin").style.display = "none";
    }
  } catch (error) {
    console.error("Greška pri radu sa Firebase-om:", error);
  }
}

function countdownToEvent(dateString) {
  const now = new Date();
  const eventDate = new Date(dateString);

  // Resetujemo vrijeme za dan upoređivanje
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );

  if (eventDay.getTime() === today.getTime()) {
    return "Today";
  }

  const msDiff = eventDate - now;

  if (msDiff > 0) {
    // Budućnost
    const totalSeconds = Math.floor(msDiff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `LOCKOUT IN: ${days}D ${hours}H ${minutes}M`;
  } else {
    // Prošlost
    const pastDiff = now - eventDate;
    const daysAgo = Math.floor(pastDiff / (1000 * 60 * 60 * 24));
    return `${daysAgo} days ago`;
  }
}

async function listaPrivavljenih(prijavljeni, utrkaOva) {
  const put = ref(db, `FANTASY/natjecatelji`);
  try {
    const snapshot2 = await get(put);
    const sviNatjecatelji = snapshot2.val();
    let isDragging = false;
    let startX;
    let scrollLeft;

    const slikeKlubovaDiv = document.createElement("div");
    slikeKlubovaDiv.className = "slikeKlubovaDiv";

    const slikeKlubovaDivW = document.createElement("div");
    slikeKlubovaDivW.className = "slikeKlubovaDiv";

    const podatciNatjecatelja = document.createElement("div");
    podatciNatjecatelja.className = "podatciNatjecatelja";
    dodajDragScroll(podatciNatjecatelja);

    const podatciNatjecateljaW = document.createElement("div");
    podatciNatjecateljaW.className = "podatciNatjecatelja";
    dodajDragScroll(podatciNatjecateljaW);

    const dodaj = document.createElement("div");
    dodaj.className = "dodaj";

    const dodajW = document.createElement("div");
    dodajW.className = "dodaj";
    let istina = true;

    // DODANO: Polja za pamćenje svih grupiranih divova
    const grupe = [];
    const grupeW = [];
    const maxKey = Math.max(...Object.keys(prijavljeni).map(Number));

    // Napravimo niz
    const result = [];

    for (let i = 0; i <= maxKey; i++) {
      result[i] = prijavljeni.hasOwnProperty(i) ? prijavljeni[i] : undefined;
    }

    for (let i = 0; i < result.length; i++) {
      const oNatjecatelju = snapshot2.val()[i];
      if (result[i] !== undefined) {
        if (istina) {
          i--;

          const slikaKluba = document.createElement("div");
          slikaKluba.className = "slikaKluba svi2";

          if (oNatjecatelju.spol == "M") {
            slikeKlubovaDiv.append(slikaKluba);
          } else if (oNatjecatelju.spol == "Z") {
            slikeKlubovaDivW.append(slikaKluba);
          }

          const linijaPodataka = document.createElement("div");
          linijaPodataka.className = "linijaPodataka svi2";

          const imeIklub = document.createElement("div");
          imeIklub.className = "imeIklubF";
          imeIklub.innerHTML = "Competitor";

          const price = document.createElement("div");
          price.className = "price";
          price.innerHTML = "Price";

          const tPoints = document.createElement("div");
          tPoints.className = "tPoints";
          tPoints.innerHTML = "Total<br>Points";

          const ThisRace = document.createElement("div");
          ThisRace.className = "pointsTR";
          ThisRace.innerHTML = "Points<br>this<br>race";

          const podiums = document.createElement("div");
          podiums.className = "pointsTR";
          podiums.innerHTML = "Total<br>Podiums";

          const lastTR = document.createElement("div");
          lastTR.className = "lastTR";
          lastTR.innerHTML = "Last<br>Three<br>Races";

          linijaPodataka.append(imeIklub);
          linijaPodataka.append(price);
          linijaPodataka.append(tPoints);
          linijaPodataka.append(ThisRace);
          linijaPodataka.append(podiums);
          linijaPodataka.append(lastTR);
          if (oNatjecatelju.spol == "M") {
            podatciNatjecatelja.append(linijaPodataka);
          } else if (oNatjecatelju.spol == "Z") {
            podatciNatjecateljaW.append(linijaPodataka);
          }

          const plus = document.createElement("div");
          plus.className = "svi2";

          if (oNatjecatelju.spol == "M") {
            dodaj.append(plus);
          } else if (oNatjecatelju.spol == "Z") {
            dodajW.append(plus);
          }

          if (oNatjecatelju.spol == "M") {
            grupe.push({
              tip: "header",
              slikaKluba,
              linijaPodataka,
              plus,
            });
          } else if (oNatjecatelju.spol == "Z") {
            grupeW.push({
              tip: "header",
              slikaKluba,
              linijaPodataka,
              plus,
            });
          }
        } else {
          const slikaKluba = document.createElement("div");
          slikaKluba.className = "slikaKluba svi";
          slikaKluba.id = "slika" + i;
          slikaKluba.style.backgroundImage = nadiSliku(oNatjecatelju.klub)[0];

          if (oNatjecatelju.spol == "M") {
            slikeKlubovaDiv.append(slikaKluba);
          } else if (oNatjecatelju.spol == "Z") {
            slikeKlubovaDivW.append(slikaKluba);
          }

          const linijaPodataka = document.createElement("div");
          linijaPodataka.className = "linijaPodataka svi";
          linijaPodataka.id = "linija" + i;

          const imeIklub = document.createElement("div");
          imeIklub.className = "imeIklub";
          const imeN = document.createElement("div");
          imeN.className = "imeN";
          imeN.innerHTML = oNatjecatelju.ime;
          const klubN = document.createElement("div");
          klubN.className = "klubN";
          klubN.innerHTML = oNatjecatelju.klub;

          imeIklub.append(imeN);
          imeIklub.append(klubN);

          const vrijednost = document.createElement("div");
          vrijednost.className = "vrijednost";
          vrijednost.innerHTML = "$" + oNatjecatelju.vrijednost.sad;

          const totalPoints = document.createElement("div");
          totalPoints.className = "totalPoints";
          totalPoints.innerHTML = oNatjecatelju.bodovi;
          //----------------------------------------------
          const ThisRace = document.createElement("div");
          if (oNatjecatelju.utrke !== undefined) {
            const listaImenaUtrka = oNatjecatelju.utrke.map(
              (utrka) => Object.keys(utrka)[0]
            );
            console.log(listaImenaUtrka.includes(utrkaOva));
            const index = listaImenaUtrka.indexOf(utrkaOva);
            if (index !== -1) {
              ThisRace.className = "totalPoints";
              ThisRace.innerHTML = racunanjeBodova(
                Object.values(oNatjecatelju.utrke[index])[0]
              );
            } else {
              ThisRace.className = "totalPoints";
              ThisRace.innerHTML = "-";
            }
          } else {
            ThisRace.className = "totalPoints";
            ThisRace.innerHTML = "-";
          }

          const totalPodiums = document.createElement("div");
          totalPodiums.className = "totalPoints";
          totalPodiums.innerHTML = izracunPostolja(oNatjecatelju.utrke);

          linijaPodataka.append(imeIklub);
          linijaPodataka.append(vrijednost);
          linijaPodataka.append(totalPoints);
          linijaPodataka.append(ThisRace);
          linijaPodataka.append(totalPodiums);
          linijaPodataka.append(lastTRace(oNatjecatelju.utrke));
          if (oNatjecatelju.spol == "M") {
            podatciNatjecatelja.append(linijaPodataka);
          } else if (oNatjecatelju.spol == "Z") {
            podatciNatjecateljaW.append(linijaPodataka);
          }

          const plus = document.createElement("div");
          plus.innerHTML = "+";
          plus.className = "plus svi";
          plus.id = i;
          plus.addEventListener("click", function () {
            postavljanjeIgraca(
              sviNatjecatelji,
              i,
              oNatjecatelju.spol,
              slikaKluba,
              linijaPodataka,
              plus,
              utrkaOva
            );
          });
          if (oNatjecatelju.spol == "M") {
            dodaj.append(plus);
          } else if (oNatjecatelju.spol == "Z") {
            dodajW.append(plus);
          }

          // DODANO: Pamti natjecatelja u grupe
          if (oNatjecatelju.spol == "M") {
            grupe.push({
              tip: "natjecatelj",
              vrijednost: oNatjecatelju.vrijednost.sad,
              slikaKluba,
              linijaPodataka,
              plus,
            });
          } else if (oNatjecatelju.spol == "Z") {
            grupeW.push({
              tip: "natjecatelj",
              vrijednost: oNatjecatelju.vrijednost.sad,
              slikaKluba,
              linijaPodataka,
              plus,
            });
          }
        }
        istina = false;
      }
    }

    const prijavljeniNatecatelji = document.getElementById(
      "prijavljeniNatecatelji"
    );
    const prijavljeniNatecateljiW = document.getElementById(
      "prijavljeniNatecateljiW"
    );

    const fixni = document.createElement("div");
    fixni.className = "fixni";
    fixni.append(podatciNatjecatelja);

    const fixniW = document.createElement("div");
    fixniW.className = "fixni";
    fixniW.append(podatciNatjecateljaW);

    prijavljeniNatecatelji.append(slikeKlubovaDiv);
    prijavljeniNatecatelji.append(fixni);
    prijavljeniNatecatelji.append(dodaj);

    prijavljeniNatecateljiW.append(slikeKlubovaDivW);
    prijavljeniNatecateljiW.append(fixniW);
    prijavljeniNatecateljiW.append(dodajW);

    //----------------------------------------------
    // DODANO: Prava grupirana sort funkcija

    // Odvojimo header od natjecatelja
    const headerGrupa = grupe.find((g) => g.tip === "header");
    const natjecateljiGrupe = grupe.filter((g) => g.tip === "natjecatelj");

    const headerGrupaW = grupeW.find((g) => g.tip === "header");
    const natjecateljiGrupeW = grupeW.filter((g) => g.tip === "natjecatelj");

    // Sortiramo natjecatelje po vrijednosti
    natjecateljiGrupe.sort((a, b) => b.vrijednost - a.vrijednost);

    natjecateljiGrupeW.sort((a, b) => b.vrijednost - a.vrijednost);

    // Brišemo sve iz divova
    slikeKlubovaDiv.innerHTML = "";
    podatciNatjecatelja.innerHTML = "";
    dodaj.innerHTML = "";

    slikeKlubovaDivW.innerHTML = "";
    podatciNatjecateljaW.innerHTML = "";
    dodajW.innerHTML = "";

    // Vratimo prvo header ako postoji
    if (headerGrupa) {
      slikeKlubovaDiv.appendChild(headerGrupa.slikaKluba);
      podatciNatjecatelja.appendChild(headerGrupa.linijaPodataka);
      dodaj.appendChild(headerGrupa.plus);
    }

    if (headerGrupaW) {
      slikeKlubovaDivW.appendChild(headerGrupaW.slikaKluba);
      podatciNatjecateljaW.appendChild(headerGrupaW.linijaPodataka);
      dodajW.appendChild(headerGrupaW.plus);
    }

    // Sad dodamo sortirane natjecatelje
    natjecateljiGrupe.forEach((grupa) => {
      slikeKlubovaDiv.appendChild(grupa.slikaKluba);
      podatciNatjecatelja.appendChild(grupa.linijaPodataka);
      dodaj.appendChild(grupa.plus);
    });

    natjecateljiGrupeW.forEach((grupaW) => {
      slikeKlubovaDivW.appendChild(grupaW.slikaKluba);
      podatciNatjecateljaW.appendChild(grupaW.linijaPodataka);
      dodajW.appendChild(grupaW.plus);
    });
    document.getElementById("loader").style.display = "none";
    document.getElementById("sve").style.display = "block";
    // DODANO: kraj sortiranja grupirano
  } catch (error) {
    console.error("Greška pri radu sa Firebase-om:", error);
  }
}

function nadiSliku(klub) {
  switch (klub) {
    case "tk maksimir":
      return ["url(maksimir.jpg)"];

    case "tk matulji":
      return ["url(matulji.png)"];

    case "tk trimax":
      return ["url(trimax.jpg)"];

    case "tk zrinski":
      return ["url(zrinski.png)"];

    case "tk swibir":
      return ["url(swibir.jpg)"];

    case "tk dubrovnik":
      return ["url(dubrovnik.jpg)"];

    case "tk zadar":
      return ["url(zadar.png)"];

    case "tk šibenik":
      return ["url(šibenik.jpeg)"];

    case "tk rival":
      return ["url(rival.webp)"];

    case "tk rudolf":
      return ["url(rudolf.jpg)"];

    case "tk pula":
      return ["url(pula.jpg)"];  
    
    case "tk sisak":
      return ["url(sisak copy.jpg)"];
      /*
    case vrednost3:
      return ["url()"];
*/
    default:
      return ["none"];
  }
}

function racunanjeBodova(mjesto) {
  switch (mjesto) {
    case 1:
      return 160;
    case 2:
      return 140;
    case 3:
      return 120;
    case 4:
      return 100;
    case 5:
      return 90;
    case 6:
      return 80;
    case 7:
      return 70;
    case 8:
      return 65;
    case 9:
      return 60;
    case 10:
      return 55;
    case 11:
      return 50;
    case 12:
      return 45;
    case 13:
      return 40;
    case 14:
      return 35;
    case 15:
      return 30;
    case 16:
      return 25;
    case 17:
      return 20;
    case 18:
      return 15;
    case 19:
      return 10;
    case 20:
      return 5;
    default:
      return 0;
  }
}

function izracunPostolja(staro) {
  if (staro == undefined) {
    return 0; // ili return []; zavisi šta očekuješ
  }
  console.log(staro);
  let podaci = [];
  for (let i = 0; i < staro.length; i++) {
    podaci.push(Object.values(staro[i])[0]);
  }
  const vrijednosti = Object.values(podaci);
  let postolja = vrijednosti.filter(
    (broj) => broj === 1 || broj === 2 || broj === 3
  ).length;
  console.log(postolja);
  return postolja;
  // Onda dalje radiš šta treba
}

function lastTRace(staro) {
  const div = document.createElement("div");
  div.className = "divZadnjeTri";

  for (let i = 1; i <= 3; i++) {
    const prije = document.createElement("div");
    prije.className = "prijasnjeTrke";

    if (!staro) {
      prije.innerHTML = "--";
      prije.style.backgroundColor = "white";
      prije.style.color = "black";
    } else {
      let pozicije = [];
      for (let i = 0; i < staro.length; i++) {
        pozicije.push(Object.values(staro[i])[0]);
      }
      const kojaPozicija = Object.values(pozicije);
      const index = kojaPozicija.length - (3 - i + 1); // računanje 3.odozada, 2.odozada, zadnji

      if (index >= 0) {
        const vrijednost = kojaPozicija[index];
        prije.innerHTML = vrijednost;

        if (vrijednost == 1 || vrijednost == 2 || vrijednost == 3) {
          prije.style.backgroundColor = "red";
          prije.style.color = "white";
        } else {
          prije.style.backgroundColor = "white";
          prije.style.color = "black";
        }
      } else {
        prije.innerHTML = "--";
        prije.style.backgroundColor = "white";
        prije.style.color = "black";
      }
    }

    div.appendChild(prije);
  }

  return div;
}

function postavljanjeIgraca(
  sviNatjecatelji,
  i,
  spol,
  slika,
  linija,
  plus,
  ovaTrka
) {
  console.log(sviNatjecatelji[i], spol);
  const novac = document.getElementById("rSalary");
  const novacW = document.getElementById("rSalaryW");
  const tValue = document.getElementById("tValue");
  const tValueW = document.getElementById("tValueW");
  if (spol == "M") {
    for (let x = 0; x < 4; x++) {
      console.log(muski);
      if (muski[x] == undefined) {
        const natjecatelj = sviNatjecatelji[i];
        let number = parseFloat(novac.innerHTML.replace(/[^0-9.]/g, ""));
        let number2 = parseFloat(tValue.innerHTML.replace(/[^0-9.]/g, ""));
        if (number - Number(natjecatelj.vrijednost.sad) > -0.1) {
          console.log(number - Number(natjecatelj.vrijednost.sad));
          const pozicija = x + 1;
          slika.style.display = "none";
          linija.style.display = "none";
          plus.style.display = "none";
          const mjestoZaIme = document.getElementById(`text${pozicija}`);
          mjestoZaIme.innerHTML =
            natjecatelj.ime + "<br>" + natjecatelj.vrijednost.sad;
          if (x < 2) {
            muski[x] = { [i]: natjecatelj.ime, value: "gold" };
          } else {
            muski[x] = { [i]: natjecatelj.ime, value: "silver" };
            if (!muski.includes(undefined)) {
              const spremi = document.getElementById("spremi");
              spremi.style.backgroundColor = "green";
              spremi.onclick = function () {
                spremanjeUBazu(muski, ovaTrka, "M");
              };
            }
          }

          const ostataknovca = number - natjecatelj.vrijednost.sad;

          novac.innerHTML = "$" + ostataknovca;

          const sadVrijedi = number2 + Number(natjecatelj.vrijednost.sad);
          tValue.innerHTML = "$" + sadVrijedi;

          const back = document.getElementById("back" + pozicija);
          back.style.display = "flex";
          back.onclick = function () {
            console.log("CLICK listener triggered");
            slika.style.display = "block";
            linija.style.display = "flex";
            plus.style.display = "flex";
            const spremi = document.getElementById("spremi");
            spremi.style.backgroundColor = "gray";
            spremi.innerHTML = "Save team!";
            muski[x] = undefined;

            const novac = document.getElementById("rSalary");
            const tValue = document.getElementById("tValue");
            let parts = mjestoZaIme.innerHTML.split("<br>");
            let deoIzaBr = parts[1];
            console.log(mjestoZaIme.innerHTML);
            let number = parseFloat(novac.innerHTML.replace(/[^0-9.]/g, ""));
            let number2 = parseFloat(tValue.innerHTML.replace(/[^0-9.]/g, ""));

            let ostataknovca = number + Number(deoIzaBr);
            novac.innerHTML = "$" + ostataknovca;

            const sadVrijedi = number2 - Number(deoIzaBr);
            tValue.innerHTML = "$" + sadVrijedi;

            back.style.display = "none";

            mjestoZaIme.innerHTML = "ADD COMPETITOR";
          };
        }
        break;
      }
    }
  } else if (spol == "Z") {
    for (let x = 0; x < zene.length; x++) {
      if (zene[x] == undefined) {
        const natjecatelj = sviNatjecatelji[i];
        let number = parseFloat(novacW.innerHTML.replace(/[^0-9.]/g, ""));
        if (number - Number(natjecatelj.vrijednost.sad) > -0.1) {
          const pozicija = x + 1;
          slika.style.display = "none";
          linija.style.display = "none";
          plus.style.display = "none";
          const mjestoZaIme = document.getElementById(`text${pozicija}W`);
          mjestoZaIme.innerHTML =
            natjecatelj.ime + "<br>" + natjecatelj.vrijednost.sad;
          if (x < 2) {
            zene[x] = { [i]: natjecatelj.ime, value: "gold" };
          } else {
            zene[x] = { [i]: natjecatelj.ime, value: "silver" };

            if (!zene.includes(undefined)) {
              const spremiW = document.getElementById("spremiW");
              spremiW.style.backgroundColor = "green";
              spremiW.onclick = function () {
                spremanjeUBazu(zene, ovaTrka, "Z");
              };
            }
          }

          const ostataknovca = number - natjecatelj.vrijednost.sad;

          novacW.innerHTML = "$" + ostataknovca;

          let number2 = parseFloat(tValueW.innerHTML.replace(/[^0-9.]/g, ""));
          const sadVrijedi = number2 + Number(natjecatelj.vrijednost.sad);
          tValueW.innerHTML = "$" + sadVrijedi;
          console.log(zene);

          const back = document.getElementById("back" + pozicija + "W");
          back.style.display = "flex";
          back.onclick = function () {
            console.log("CLICK listener triggered");
            slika.style.display = "block";
            linija.style.display = "flex";
            plus.style.display = "flex";
            zene[x] = undefined;
            const spremiW = document.getElementById("spremiW");
            spremiW.style.backgroundColor = "gray";
            spremiW.innerHTML = "Save team!";
            const novac = document.getElementById("rSalaryW");
            const tValue = document.getElementById("tValueW");
            let parts = mjestoZaIme.innerHTML.split("<br>");
            let deoIzaBr = parts[1];
            console.log(mjestoZaIme.innerHTML);
            let number = parseFloat(novac.innerHTML.replace(/[^0-9.]/g, ""));
            let number2 = parseFloat(tValue.innerHTML.replace(/[^0-9.]/g, ""));

            let ostataknovca = number + Number(deoIzaBr);
            novac.innerHTML = "$" + ostataknovca;

            const sadVrijedi = number2 - Number(deoIzaBr);
            tValue.innerHTML = "$" + sadVrijedi;

            back.style.display = "none";

            mjestoZaIme.innerHTML = "ADD COMPETITOR";
          };
        }
        break;
      }
    }
  }
}

async function spremanjeUBazu(lista, trka, spol) {
  let spremi;
  if (spol == "M") {
    spremi = document.getElementById("spremi");
  } else {
    spremi = document.getElementById("spremiW");
  }
  console.log(
    !lista.includes(undefined),
    spremi.innerHTML == "Save Team!",
    spremi
  );
  if (!lista.includes(undefined) && spremi.innerHTML == "Save team!") {
    const put = ref(db, `FANTASY/utrke/${trka}/timovi/${spol}`);
    console.log(lista, userId);
    const zaUpis = {
      [userId]: lista,
    };
    update(put, zaUpis)
      .then(() => {
        console.log("Update uspješan!");
        spremi.style.backgroundColor = "grey";
        spremi.innerHTML = "Team saved!";
      })
      .catch((error) => {
        console.error("Greška pri updateu:", error);
      });
  }
}

function dodajDragScroll(div) {
  let isDragging = false;
  let startX;
  let scrollLeft;

  // Mouse events
  div.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - div.offsetLeft;
    scrollLeft = div.scrollLeft;
    div.style.cursor = "grabbing";
  });

  div.addEventListener("mouseleave", () => {
    isDragging = false;
    div.style.cursor = "grab";
  });

  div.addEventListener("mouseup", () => {
    isDragging = false;
    div.style.cursor = "grab";
  });

  div.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - div.offsetLeft;
    const walk = x - startX;
    div.scrollLeft = scrollLeft - walk;
  });

  // Touch events
  div.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - div.offsetLeft;
    scrollLeft = div.scrollLeft;
  });

  div.addEventListener("touchend", () => {
    isDragging = false;
  });

  div.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - div.offsetLeft;
      const walk = x - startX;
      div.scrollLeft = scrollLeft - walk;
    },
    { passive: false }
  );
}
