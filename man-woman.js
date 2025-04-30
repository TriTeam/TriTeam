export function promjene() {
  const gumbi = document.querySelectorAll(".upfin");
  gumbi.forEach((gumb) => {
    gumb.addEventListener("click", function () {
      promjena(this);
    });
  });
}
let izmjena = true;
function promjena(to) {
  const upcoming = document.getElementById("upcoming");
  const finished = document.getElementById("finished");
  const woman = document.getElementById("woman");
  const man = document.getElementById("man");

  if (to.id == "finished" && izmjena == true) {
    izmjena = false;
    man.style.display = "none";
    woman.style.display = "block";
    upcoming.style.fontWeight = "100";
    upcoming.style.color = "black";
    upcoming.style.backgroundColor = "white";
    finished.style.fontWeight = "bold";
    finished.style.color = "white";
    finished.style.backgroundColor = "black";
  } else if (to.id == "upcoming" && izmjena == false) {
    izmjena = true;
    man.style.display = "block";
    woman.style.display = "none";
    finished.style.fontWeight = "100";
    finished.style.color = "black";
    finished.style.backgroundColor = "white";
    upcoming.style.fontWeight = "bold";
    upcoming.style.color = "white";
    upcoming.style.backgroundColor = "black";
  }
}
