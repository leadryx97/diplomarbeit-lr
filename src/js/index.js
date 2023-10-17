/* import scss */
import "../sass/main.scss";
/* header navigation */
const nav = document.querySelector(".header__nav-menu");
const navItems = document.querySelectorAll(".header__nav-link");
const hamburger = document.querySelector(".header__nav-hamburger");
const hamburgerIcon = document.querySelector(".header__nav-hamburger-img");
const closeIcon = document.querySelector(".header__nav-hamburger-img--close");

function toggleMenu() {
  if (nav.classList.contains("header__nav-menu--show")) {
    nav.classList.remove("header__nav-menu--show");
    closeIcon.style.display = "none";
    hamburgerIcon.style.display = "block";
  } else {
    nav.classList.add("header__nav-menu--show");
    closeIcon.style.display = "block";
    hamburgerIcon.style.display = "none";
  }
}
hamburger.addEventListener("click", toggleMenu);

navItems.forEach(function (navItem) {
  navItem.addEventListener("click", toggleMenu);
});
