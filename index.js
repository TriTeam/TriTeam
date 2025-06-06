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

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("sve");

  // Show content after a short delay
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        if (content) {
          content.style.display = "flex";
          setTimeout(() => {
            content.style.opacity = "1";
          }, 50);
        }
      }, 300);
    }
  }, 800);
});
