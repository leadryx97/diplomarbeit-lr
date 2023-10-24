// import header navigation
import {
  nav,
  navItems,
  hamburger,
  hamburgerIcon,
  closeIcon,
  body,
  toggleMenu,
  setActiveItem,
} from "./header.js";

// properties form toggle switch
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

// properties form drop-down (arrows)
const selectDropDown = document.querySelectorAll(".properties__select");
const noDropDown = document.querySelectorAll(".properties__select--no-dropdown");

selectDropDown.forEach((selectElement) => {
  selectElement.addEventListener("focus", () => {
    selectElement.classList.add("properties__select--active");
  });
});

selectDropDown.forEach((selectElement) => {
  selectElement.addEventListener("blur", () => {
    selectElement.classList.remove("properties__select--active");
  });
});

noDropDown.forEach((selectElement) => {
  if (screen.width >= 576) {
    window.addEventListener("load", () => {
      selectElement.classList.remove("properties__select--no-dropdown");
    });
  }
});
