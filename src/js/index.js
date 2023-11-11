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
import tableIconUp from "../assets/images/svg/table-arrow-up.svg";
import tableIconDown from "../assets/images/svg/table-arrow-down.svg";

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
          created_at
          country
          images {
            image_path
          }
          ref_type {
            title
          }
        }
      }
    `;
    const response = await graphQLClient.request(showQuery);
    const allProperties = response.estates;

    properties = allProperties;
    filterProperties();
    pagination();
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  gridView();
  showProperties();
});

// graphql: create list of properties
const propertiesElements = document.querySelector(".properties__elements");

// limit results
let displayedResults = 3;
let firstDisplayedResult = 0;
let filteredProperties = [];

if (screen.width >= 1400) {
  displayedResults = 6;
}

function filterProperties() {
  filteredProperties = [];

  properties.forEach(function (property) {
    const propertyType = property.ref_type;
    const propertyTypeTitle = propertyType.title;
    const propertyLocation = property.city;
    const propertyEstateType = property.estate_type;
    if (
      (propertySelection === "Alle Objekte" || propertySelection === propertyTypeTitle) &&
      (locationSelection === "Alle Orte" || locationSelection === propertyLocation) &&
      (estateTypeSelection === "all" || estateTypeSelection === propertyEstateType)
    ) {
      filteredProperties.push(property);
    }
  });

  if (sortSelection === "price-ascending") {
    sortPriceAscending();
  } else if (sortSelection === "price-descending") {
    sortPriceDescending();
  } else if (sortSelection === "date-ascending") {
    sortDateAscending();
  } else if (sortSelection === "date-descending") {
    sortDateDescending();
  }

  if (propertiesTable.classList.contains("properties__table--hidden")) {
    renderList();
  } else {
    listViewRenderList();
  }
}

// sorting functions
function sortPriceAscending() {
  filteredProperties.sort(function (a, b) {
    return a.prize - b.prize;
  });
}

function sortPriceDescending() {
  filteredProperties.sort(function (a, b) {
    return b.prize - a.prize;
  });
}

function sortDateAscending() {
  filteredProperties.sort(function (a, b) {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateA - dateB;
  });
}

function sortDateDescending() {
  filteredProperties.sort(function (a, b) {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  });
}

// render properties grid view
function renderList() {
  propertiesElements.innerHTML = "";
  filteredProperties.slice(firstDisplayedResult, displayedResults).forEach(function (property) {
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
        <p class="properties__element-value">Fläche ${property.usable_area}m², Preis: ${formattedPrice}</p>
        `;
    propertiesElements.appendChild(div);
  });
}

// render properties list view
function listViewRenderList() {
  const table = document.querySelector(".properties__table");
  const tableRows = document.querySelectorAll(".properties__table-row");
  for (let i = 0; i < tableRows.length; i++) {
    tableRows[i].parentNode.removeChild(tableRows[i]);
  }

  filteredProperties.forEach(function (property) {
    const formattedPrice = property.prize.toLocaleString("de-CH", {
      style: "currency",
      currency: "CHF",
      maximumFractionDigits: 0,
    }); // format price to swiss franc

    let tableRow = table.insertRow();
    tableRow.classList.add("properties__table-row");
    let tableCellTitle = tableRow.insertCell(0);
    tableCellTitle.classList.add("properties__table-cell", "properties__table-cell--title");
    let cellTextTitle = document.createTextNode(`${property.title}`);
    tableCellTitle.appendChild(cellTextTitle);

    let tableCellLocation = null;
    let tableCellArea = null;
    let tableCellPrice = null;

    if (screen.width >= 1400) {
      tableCellLocation = tableRow.insertCell(1);
      tableCellLocation.classList.add("properties__table-cell");
      let cellTextLocation = document.createTextNode(
        `${property.zip} ${property.city}, ${property.country}`
      );
      tableCellLocation.appendChild(cellTextLocation);
      tableCellArea = tableRow.insertCell(2);
      tableCellArea.classList.add("properties__table-cell");
      let cellTextArea = document.createTextNode(`${property.usable_area}m²`);
      tableCellArea.appendChild(cellTextArea);
      tableCellPrice = tableRow.insertCell(3);
      tableCellPrice.classList.add("properties__table-cell", "properties__table-cell--price");
      let cellTextPrice = document.createTextNode(formattedPrice);
      tableCellPrice.appendChild(cellTextPrice);
    } else {
      tableCellPrice = tableRow.insertCell(1);
      tableCellPrice.classList.add("properties__table-cell", "properties__table-cell--price");
      let cellTextPrice = document.createTextNode(formattedPrice);
      tableCellPrice.appendChild(cellTextPrice);
    }
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
      opt.classList.add("properties__locationOptions");
      locationSelect.appendChild(opt);
      existingOptions.add(location);
    }
  });
}

// form selections
let propertySelection = "Alle Objekte";
let locationSelection = "Alle Orte";
let estateTypeSelection = "all";
let sortSelection = null;

const propertySelect = document.querySelector(".properties__select--properties");
const locationSelect = document.querySelector(".properties__select--location");
const sortSelect = document.querySelector(".properties__select--sort");
const estateTypeCheckbox = document.querySelector(".properties__switch-input");
const filterButton = document.querySelector(".properties__button");

function propertySelectValue(event) {
  propertySelection = event.target.value;
}
function locationSelectValue(event) {
  locationSelection = event.target.value;
}
function sortSelectValue(event) {
  sortSelection = event.target.value;
}
function estateTypeCheckboxValue() {
  if (estateTypeCheckbox.checked) {
    estateTypeSelection = "zu verkaufen";
  } else {
    estateTypeSelection = "zu vermieten";
  }
}

propertySelect.addEventListener("change", propertySelectValue);
locationSelect.addEventListener("change", locationSelectValue);
sortSelect.addEventListener("change", sortSelectValue);
estateTypeCheckbox.addEventListener("change", estateTypeCheckboxValue);

// sort select: handle placeholder text
function sortSelectPlaceholder() {
  const placeholderOption = document.querySelector(".properties__option--placeholder");
  if (placeholderOption && placeholderOption.selected) {
    sortSelect.removeChild(placeholderOption);
  }
}

sortSelect.addEventListener("click", sortSelectPlaceholder);

filterButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the form from actually submitting
  estateTypeCheckboxValue();
  displayedResults = 3; // show only 3 results after changing filter
  if (screen.width >= 1400) {
    displayedResults = 6;
  }
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

// properties grid view
const gridViewIcon = document.querySelector(".properties__view-grid-icon");
const propertiesTable = document.querySelector(".properties__table");

function gridView() {
  propertiesElements.classList.remove("properties__elements--hidden");
  propertiesTable.classList.add("properties__table--hidden");
  loadMoreButton.classList.remove("properties__button--load-more-hidden");
  paginationLink.classList.remove("properties__page-reference--hidden");
  paginationLink;
  renderList();
}

gridViewIcon.addEventListener("click", gridView);

// properties list view
const listViewIcon = document.querySelector(".properties__view-list-icon");

function listView() {
  propertiesElements.classList.add("properties__elements--hidden");
  propertiesTable.classList.remove("properties__table--hidden");
  loadMoreButton.classList.add("properties__button--load-more-hidden");
  paginationLink.classList.add("properties__page-reference--hidden");
  listViewToggleColumns();
  listViewRenderList();
}

function listViewToggleColumns() {
  const tableHeadersHidden = document.querySelectorAll(".properties__table-header--hidden");
  const tableCellsHidden = document.querySelectorAll(".properties__table-cell--hidden");
  if (screen.width >= 1400) {
    tableHeadersHidden.forEach((tableHeader) => {
      tableHeader.classList.remove("properties__table-header--hidden");
    });
    tableCellsHidden.forEach((tableCell) => {
      tableCell.classList.remove("properties__table-cell--hidden");
    });
  } else {
    tableHeadersHidden.forEach((tableHeader) => {
      tableHeader.classList.add("properties__table-header--hidden");
    });
    tableCellsHidden.forEach((tableCell) => {
      tableCell.classList.add("properties__table-cell--hidden");
    });
  }
}

listViewIcon.addEventListener("click", listView);
window.addEventListener("resize", listViewToggleColumns);

// sort list / table view title
const tableTitleHeader = document.querySelector(".properties__table-header--title");
let sortAscending = true; // track sorting order

function sortPropertyTitle() {
  const tableIcon = document.querySelector(".properties__table-icon--title");
  if (sortAscending) {
    tableIcon.src = tableIconDown;
  } else {
    tableIcon.src = tableIconUp;
  }
  sortAscending = !sortAscending;

  // Nach Titel oder Datum sortieren?
  /*filteredProperties.sort(function (a, b) {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (sortAscending) {
      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;
    } else {
      if (titleA < titleB) return 1;
      if (titleA > titleB) return -1;
    }
    return 0;
  });*/
  filteredProperties.sort(function (a, b) {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    if (sortAscending) {
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    } else {
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
    }
    return 0;
  });
  listViewRenderList();
}

tableTitleHeader.addEventListener("click", sortPropertyTitle);

// sort list / table view location
const tableLocationHeader = document.querySelector(".properties__table-header--location");

function sortPropertyLocation() {
  const tableIcon = document.querySelector(".properties__table-icon--location");
  if (sortAscending) {
    tableIcon.src = tableIconDown;
  } else {
    tableIcon.src = tableIconUp;
  }
  sortAscending = !sortAscending;

  filteredProperties.sort(function (a, b) {
    if (sortAscending) {
      return a.zip - b.zip;
    } else {
      return b.zip - a.zip;
    }
  });
  listViewRenderList();
}

tableLocationHeader.addEventListener("click", sortPropertyLocation);

// sort list / table view area
const tableAreaHeader = document.querySelector(".properties__table-header--area");

function sortPropertyArea() {
  const tableIcon = document.querySelector(".properties__table-icon--area");
  if (sortAscending) {
    tableIcon.src = tableIconDown;
  } else {
    tableIcon.src = tableIconUp;
  }
  sortAscending = !sortAscending;

  filteredProperties.sort(function (a, b) {
    if (sortAscending) {
      return a.usable_area - b.usable_area;
    } else {
      return b.usable_area - a.usable_area;
    }
  });
  listViewRenderList();
}

tableAreaHeader.addEventListener("click", sortPropertyArea);

// sort list / table view price
const tablePriceHeader = document.querySelector(".properties__table-header--price");

function sortPropertyPrice() {
  const tableIcon = document.querySelector(".properties__table-icon--price");
  if (sortAscending) {
    tableIcon.src = tableIconDown;
  } else {
    tableIcon.src = tableIconUp;
  }
  sortAscending = !sortAscending;

  filteredProperties.sort(function (a, b) {
    if (sortAscending) {
      return a.prize - b.prize;
    } else {
      return b.prize - a.prize;
    }
  });
  listViewRenderList();
}

tablePriceHeader.addEventListener("click", sortPropertyPrice);
