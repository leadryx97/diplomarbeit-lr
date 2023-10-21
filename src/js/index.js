/* import scss */
import "../sass/main.scss";
/* header navigation */
const nav = document.querySelector(".header__nav-menu");
const navItems = document.querySelectorAll(".header__nav-link");
const hamburger = document.querySelector(".header__nav-hamburger");
const hamburgerIcon = document.querySelector(".header__nav-hamburger-img");
const closeIcon = document.querySelector(".header__nav-hamburger-img--close");
const body = document.querySelector("body");

/* hamburger menu */
function toggleMenu() {
  if (nav.classList.contains("header__nav-menu--show")) {
    nav.classList.remove("header__nav-menu--show");
    closeIcon.style.display = "none";
    hamburgerIcon.style.display = "block";
    body.style.overflowY = "visible";
  } else {
    nav.classList.add("header__nav-menu--show");
    closeIcon.style.display = "block";
    hamburgerIcon.style.display = "none";
    body.style.overflowY = "hidden";
  }
}
hamburger.addEventListener("click", toggleMenu);

navItems.forEach((navItem) => {
  navItem.addEventListener("click", toggleMenu);
});

/* active menu element */
function setActiveItem(event) {
  navItems.forEach((item) => item.classList.remove("header__nav-link--active"));
  event.target.classList.add("header__nav-link--active");
}

navItems.forEach((navItem) => {
  navItem.addEventListener("click", setActiveItem);
});

/* properties form toggle switch */
const switchToggle = document.querySelector(".properties__switch-input");
const switchBuy = document.querySelector(".properties__switch-value--buy");
const switchRent = document.querySelector(".properties__switch-value--rent");

function toggleSwitch() {
  if (switchToggle.checked) {
    switchRent.classList.add("properties__switch-value--unchecked");
    switchBuy.classList.remove("properties__switch-value--unchecked");
  } else {
    switchRent.classList.remove("properties__switch-value--unchecked");
    switchBuy.classList.add("properties__switch-value--unchecked");
  }
}
switchToggle.addEventListener("change", toggleSwitch);

/* properties form drop-down */
const selectDropDown = document.querySelector(".properties__select--drop-down");

selectDropDown.addEventListener("focus", () => {
  selectDropDown.classList.add("properties__select--drop-down-active");
});

selectDropDown.addEventListener("blur", () => {
  selectDropDown.classList.remove("properties__select--drop-down-active");
});
