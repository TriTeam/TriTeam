const upcoming = document.getElementById("upcoming");
const finished = document.getElementById("finished");
const finishedRaces = document.getElementById("finishedRaces");
const upcomingRaces = document.getElementById("upcomingRaces");
const gumbi = document.querySelectorAll(".upfin");
let izmjena = true;

gumbi.forEach((gumb) => {
  gumb.addEventListener("click", function () {
    promjena(this);
  });
});

function promjena(to) {
  if (to.id == "finished" && izmjena == true) {
    izmjena = false;
    upcomingRaces.style.display = "none";
    finishedRaces.style.display = "block";
    upcoming.style.fontWeight = "100";
    upcoming.style.color = "black";
    upcoming.style.backgroundColor = "white";
    finished.style.fontWeight = "bold";
    finished.style.color = "white";
    finished.style.backgroundColor = "black";
  } else if (to.id == "upcoming" && izmjena == false) {
    izmjena = true;
    upcomingRaces.style.display = "block";
    finishedRaces.style.display = "none";
    finished.style.fontWeight = "100";
    finished.style.color = "black";
    finished.style.backgroundColor = "white";
    upcoming.style.fontWeight = "bold";
    upcoming.style.color = "white";
    upcoming.style.backgroundColor = "black";
  }
}
