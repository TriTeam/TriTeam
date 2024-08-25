import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://triteam-7328e-default-rtdb.firebaseio.com/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

document.getElementById("utrkaForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Preuzimanje unesenih vrijednosti
    const utrka = document.getElementById("utrka").value;
    const datum = Number(document.getElementById("datum").value)
    const natjecatelj = document.getElementById("natjecatelj").value;

    // Kreiranje reference za novu utrku
    const dbRef = ref(database, `utrke/${utrka}`);

    // Kreiranje novog zapisa pod utrke koristeći push()
    const newUtrkaRef = push(dbRef);

    set(dbRef, {
        datum: datum,
        natjecatelji: {
            1: natjecatelj
        },
        rezultati: {
            nema: ''
        }
    })
    .then(() => {
        // Reset forme nakon unosa
        document.getElementById("utrkaForm").reset();
        alert("Utrka je uspešno dodana!");
    })
    .catch((error) => {
        console.error("Greška prilikom dodavanja utrke: ", error);
        alert("Došlo je do greške pri dodavanju utrke. Molimo pokušajte ponovo.");
    });
});
