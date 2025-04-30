const menu = document.getElementById("menu");
const menubar = document.getElementById("menubar");
const content = document.getElementById("content");
const root = document.getElementById("root");
let switchmenu = true;

menu.addEventListener("click", function () {
  if (switchmenu) {
    menubar.style.display = "flex";
    content.style.display = "none";
    root.style.display = "none";
    switchmenu = false;
  } else {
    menubar.style.display = "none";
    content.style.display = "block";
    root.style.display = "block";
    switchmenu = true;
  }
});

function home() {
  window.location.href = "index.html";
}
function htl() {
  window.location.href = "https://triatlon.hr/hts/";
}
function profile() {
  window.location.href = "myprofile.html";
}
