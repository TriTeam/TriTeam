const menu = document.getElementById("menu");
const menubar = document.getElementById("menubar");
const content = document.getElementById("content");
const root = document.getElementById("root");
let switchmenu = true;

// Improved menu toggle with animation
menu.addEventListener("click", () => {
  if (switchmenu) {
    menubar.style.display = "flex";
    menubar.style.opacity = "0";
    setTimeout(() => {
      menubar.style.opacity = "1";
    }, 10);
    content.style.display = "none";
    root.style.display = "none";
    switchmenu = false;
  } else {
    menubar.style.opacity = "0";
    setTimeout(() => {
      menubar.style.display = "none";
      content.style.display = "block";
      root.style.display = "block";
    }, 200);
    switchmenu = true;
  }
});

// Navigation functions
function home() {
  window.location.href = "index.html";
}
function htl() {
  window.location.href = "https://triatlon.hr/hts/";
}
function profile() {
  window.location.href = "myprofile.html";
}

// Improved page loading
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
