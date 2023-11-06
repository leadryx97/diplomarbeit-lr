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

// import graphql
import { GraphQLClient, gql } from "graphql-request";

const graphQLClient = new GraphQLClient("https://dev22-api.web-professionals.ch/graphql");

let properties = [];

// graphql: show properties
async function showProperties() {
  try {
    const showQuery = gql`
      query {
        estates {
          id
          estate_type
          availability
          canton
          city
          zip
          title
          usable_area
          prize
          images {
            image_path
          }
        }
      }
    `;
    const response = await graphQLClient.request(showQuery);
    const allProperties = response.estates;

    properties = allProperties;
    renderList();
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showProperties();
});

// graphql: create list of properties
const propertiesElements = document.querySelector(".properties__elements");

// limit results
let displayedResults = 3;

function renderList() {
  propertiesElements.innerHTML = "";

  properties.slice(0, displayedResults).forEach(function (property) {
    const firstImagePath = property.images[0] ? property.images[0].image_path : ""; // check if first image object exists, if so, return image_path
    const formattedPrice = property.prize.toLocaleString("de-CH", {
      style: "currency",
      currency: "CHF",
      maximumFractionDigits: 0,
    }); // format price to swiss franc

    const div = document.createElement("div");
    div.classList.add("properties__element");
    div.innerHTML = `
    <picture class="properties__element-picture">
              <source
                srcset="${firstImagePath}?as=avif"
                type="image/avif"
              />
              <source
                srcset="${firstImagePath}?as=webp"
                type="image/webp"
              />
              <img
                src="${firstImagePath}"
                alt="Immobilienobjekt Bijou am See"
                class="properties__element-img"
              />
            </picture>
    <p class="properties__element-status">${property.estate_type}, ${property.availability}</p>
    <p class="properties__element-location">${property.zip} ${property.city}, ${property.canton}</p>
    <h3 class="properties__element-title">${property.title}</h3>
    <p class="properties__element-value">Fläche ${property.usable_area}m&sup2;, Preis: ${formattedPrice}</p>
    `;
    propertiesElements.appendChild(div);
  });
}

// load more results button
const loadMoreButton = document.querySelector(".properties__button--load-more");

loadMoreButton.addEventListener("click", () => {
  displayedResults += 3;
  showProperties();
});

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
