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

// import pagination icon
import paginationIcon from "../assets/images/svg/next-page-arrow.svg";

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
    pagination();
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
let firstDisplayedResult = 0;

if (screen.width >= 1400) {
  displayedResults = 6;
}

function renderList() {
  propertiesElements.innerHTML = "";

  properties.slice(firstDisplayedResult, displayedResults).forEach(function (property) {
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

// load more results button (mobile)
const loadMoreButton = document.querySelector(".properties__button--load-more");

loadMoreButton.addEventListener("click", () => {
  displayedResults += 3;
  showProperties();
});

// pagination (desktop)
let currentPage = 1;
let endPage = 1;
let resultsPerPage = 6;
const paginationLink = document.querySelector(".properties__page-reference");

function calculateEndPage() {
  endPage = Math.ceil(properties.length / resultsPerPage);
}

function pagination() {
  calculateEndPage();
  paginationLink.innerHTML = `<p class="properties__pagination">
    Seite <span class="properties__current-page">${currentPage}</span> von
    <span class="properties__total-pages">${endPage}</span>
  </p>
  <img
    src="${paginationIcon}"
    alt="Pfeil Icon nächste Seite"
    class="properties__pagination-arrow"
  />`;
}

function paginationIncrease() {
  if (currentPage < endPage) {
    currentPage++;
  }
}

paginationLink.addEventListener("click", () => {
  paginationIncrease();
});

// load next page (desktop)
const loadNextPage = document.querySelector(".properties__page-reference");

loadNextPage.addEventListener("click", () => {
  displayedResults += 6;
  firstDisplayedResult += 6;
  showProperties();
});

// graphql properties filter/select
let selectProperties = [];

async function selectProperty() {
  try {
    const selectPropertyQuery = gql`
      query {
        estates {
          ref_type {
            title
          }
        }
      }
    `;
    const response = await graphQLClient.request(selectPropertyQuery);
    const selectPropertiesAll = response.estates;

    selectProperties = selectPropertiesAll;
    renderPropertiesSelect();
  } catch (error) {
    console.error("Error:", error);
  }
}

selectProperty();

// add new option to properties filter/select
function renderPropertiesSelect() {
  const propertiesSelect = document.querySelector(".properties__select--properties");
  const existingOptions = new Set();

  selectProperties.forEach((selectProperty) => {
    const refType = selectProperty.ref_type;
    const refTypeTitle = refType.title;
    // check if option already exists
    if (!existingOptions.has(refTypeTitle)) {
      const opt = document.createElement("option");
      opt.value = refType.title;
      opt.text = refType.title;
      propertiesSelect.appendChild(opt);
      existingOptions.add(refTypeTitle);
    }
  });
}

// graphql location filter/select
let selectLocations = [];

async function selectLocation() {
  try {
    const selectLocationQuery = gql`
      query {
        estates {
          city
        }
      }
    `;
    const response = await graphQLClient.request(selectLocationQuery);
    const selectLocationAll = response.estates;

    selectLocations = selectLocationAll;
    renderLocationSelect();
  } catch (error) {
    console.error("Error:", error);
  }
}

selectLocation();

// add new option to location filter/select
function renderLocationSelect() {
  const locationSelect = document.querySelector(".properties__select--location");
  const existingOptions = new Set();

  selectLocations.forEach((selectLocation) => {
    const location = selectLocation.city;
    // check if option already exists
    if (!existingOptions.has(location)) {
      const opt = document.createElement("option");
      opt.value = location;
      opt.text = location;
      locationSelect.appendChild(opt);
      existingOptions.add(location);
    }
  });
}

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
