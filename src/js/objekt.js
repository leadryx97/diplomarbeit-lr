// import header
import {
  nav,
  navItems,
  hamburger,
  hamburgerIcon,
  closeIcon,
  body,
  toggleMenu,
  setActiveItem,
} from "./site-wide.js";

// import footer
import { scrollToTopBtn, rootElement } from "./footer.js";

// import graphql
import { GraphQLClient, gql } from "graphql-request";

const graphQLClient = new GraphQLClient("https://dev22-api.web-professionals.ch/graphql");

// import location icon
import markerIcon from "../assets/images/svg/map-location-marker.svg";

// dynamic property page
// handling of url
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get("propertyId");

// graphql request to load property details
async function loadPropertyDetails(propertyId) {
  try {
    const propertyQuery = gql`
      query GetProperty($propertyId: ID!) {
        estate(id: $propertyId) {
          id
          estate_type
          title
          availability
          zip
          city
          canton
          prize
          usable_area
          description
          lat
          long
          images {
            image_path
          }
        }
      }
    `;
    const response = await graphQLClient.request(propertyQuery, { propertyId });
    const property = response.estate;
    // render dynamic property content
    renderProperty(property);
    return property;
  } catch (error) {
    console.error("Error:", error);
  }
}

// render property content
function renderProperty(property) {
  // format price to swiss franc
  const formattedPrice = property.prize.toLocaleString("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  });

  // check if image object exists, if so, return image_path
  const firstImagePath = property.images[0] && property.images[0].image_path;
  const secondImagePath = property.images[1] && property.images[1].image_path;
  const thirdImagePath = property.images[2] && property.images[2].image_path;
  const fourthImagePath = property.images[3] && property.images[3].image_path;

  // image container variables
  const firstImageContainer = document.querySelector(".slider__picture");
  const secondImageContainer = document.querySelector(".slider__thumbnail-picture--first");
  const thirdImageContainer = document.querySelector(".slider__thumbnail-picture--second");
  const fourthImageContainer = document.querySelector(".slider__thumbnail-picture--third");

  // assign title
  document.querySelector(".page-title--property").childNodes[0].textContent =
    property.estate_type + " ";
  document.querySelector(".page-title--property-bold").textContent = property.title;

  // if image exists, assign path; otherwise, remove element
  if (firstImagePath) {
    document.querySelector(".slider__picture-img").src = firstImagePath;
    document.querySelector(".slider__picture--avif").srcset = `${firstImagePath}?avif`;
    document.querySelector(".slider__picture--webp").srcset = `${firstImagePath}?webp`;
  } else {
    firstImageContainer.remove();
  }
  if (secondImagePath) {
    document.querySelector(".slider__thumbnail-picture-img--first").src = secondImagePath;
    document.querySelector(
      ".slider__thumbnail-picture--avif-first"
    ).srcset = `${secondImagePath}?avif`;
    document.querySelector(
      ".slider__thumbnail-picture--webp-first"
    ).srcset = `${secondImagePath}?webp`;
  } else {
    secondImageContainer.remove();
  }
  if (thirdImagePath) {
    document.querySelector(".slider__thumbnail-picture-img--second").src = thirdImagePath;
    document.querySelector(
      ".slider__thumbnail-picture--avif-second"
    ).srcset = `${thirdImagePath}?avif`;
    document.querySelector(
      ".slider__thumbnail-picture--webp-second"
    ).srcset = `${thirdImagePath}?webp`;
  } else {
    thirdImageContainer.remove();
  }
  if (fourthImagePath) {
    document.querySelector(".slider__thumbnail-picture-img--third").src = fourthImagePath;
    document.querySelector(
      ".slider__thumbnail-picture--avif-third"
    ).srcset = `${fourthImagePath}?avif`;
    document.querySelector(
      ".slider__thumbnail-picture--webp-third"
    ).srcset = `${fourthImagePath}?webp`;
  } else {
    fourthImageContainer.remove();
  }

  // assign detailed information
  document.querySelector(".property-information__specs--available").textContent =
    property.availability;
  document.querySelector(
    ".property-information__specs--location"
  ).textContent = `${property.zip} ${property.city}, ${property.canton}`;
  document.querySelector(".property-information__specs--price").textContent = formattedPrice;
  document.querySelector(
    ".property-information__specs--area"
  ).textContent = `Fläche ${property.usable_area}m²`;
  document.querySelector(".property-information__specs--description").textContent =
    property.description;

  // assign title in modal
  document.querySelector(".property-information__modal-property").textContent = property.title;
}

// google maps
import { Loader } from "@googlemaps/js-api-loader";

let map;

const loader = new Loader({
  apiKey: "AIzaSyAWGZmIJEj81w1nCFltoYGn-V_PXQHVae0",
  version: "weekly",
});

async function initMap(propertyLat, propertyLong) {
  // Request needed libraries
  const { Map } = await loader.importLibrary("maps");
  // location
  const position = { lat: propertyLat, lng: propertyLong };

  // The map, centered at property location
  map = new Map(document.querySelector(".property-information__map"), {
    zoom: 15.7,
    center: position,
    disableDefaultUI: true,
    mapId: "560e1e5e3f75ad8c",
  });

  // The marker, positioned at property location
  const iconSize = new google.maps.Size(50, 50);

  new google.maps.Marker({
    position: position,
    map,
    title: "location",
    icon: {
      url: markerIcon,
      scaledSize: iconSize,
    },
  });
}

// handle modal form
const requestButton = document.querySelector(".property-information__button-interest");
const modal = document.querySelector(".property-information__modal");
const closeModal = document.querySelector(".property-information__close-modal");

requestButton.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});

// transmit form information to graphql
async function createMessage(
  firstname,
  lastname,
  address,
  postalcode,
  city,
  email,
  phonenumber,
  content,
  estate_id,
  information,
  visit
) {
  try {
    const create = gql`
      mutation createMessage(
        $firstname: String = ""
        $lastname: String = ""
        $address: String = ""
        $postalcode: String = ""
        $city: String = ""
        $email: String = ""
        $phonenumber: String = ""
        $content: String = ""
        $estate_id: ID = ""
        $information: Boolean = false
        $visit: Boolean = false
      ) {
        createMessage(
          firstname: $firstname
          lastname: $lastname
          address: $address
          postalcode: $postalcode
          city: $city
          email: $email
          phonenumber: $phonenumber
          content: $content
          estate_id: $estate_id
          information: $information
          visit: $visit
        ) {
          id
          firstname
          lastname
          address
          postalcode
          city
          email
          phonenumber
          content
          estate_id
          information
          visit
        }
      }
    `;
    const response = await graphQLClient.request(create, {
      firstname,
      lastname,
      address,
      postalcode,
      city,
      email,
      phonenumber,
      content,
      estate_id,
      information,
      visit,
    });

    const newMessage = response.createMessage;
  } catch (error) {
    console.error("Error:", error);
  }
}

function sendMessage(propertyId) {
  const inputFirstName = document.querySelector(".property-information__modal-input--firstname");
  const inputLastName = document.querySelector(".property-information__modal-input--lastname");
  const inputAddress = document.querySelector(".property-information__modal-input--address");
  const inputPostal = document.querySelector(".property-information__modal-input--postal");
  const inputLocation = document.querySelector(".property-information__modal-input--location");
  const inputEmail = document.querySelector(".property-information__modal-input--email");
  const inputTel = document.querySelector(".property-information__modal-input--tel");
  const inputMessage = document.querySelector(".property-information__modal-textarea");
  const checkboxInformation = document.querySelector(
    ".property-information__modal-checkbox--information"
  );
  const checkboxVisit = document.querySelector(".property-information__modal-checkbox--visit");

  const firstName = inputFirstName.value;
  const lastName = inputLastName.value;
  const address = inputAddress.value;
  const postal = inputPostal.value;
  const location = inputLocation.value;
  const email = inputEmail.value;
  const tel = inputTel.value;
  const message = inputMessage.value;
  const estateId = propertyId;
  let information = checkboxInformation.checked;
  let visit = checkboxVisit.checked;

  createMessage(
    firstName,
    lastName,
    address,
    postal,
    location,
    email,
    tel,
    message,
    estateId,
    information,
    visit
  );
}

const sendButton = document.querySelector(".property-information__modal-button");
sendButton.addEventListener("click", () => {
  sendMessage(propertyId);
});

// icon checkbox
const checkbox = document.querySelectorAll(".property-information__modal-checkbox");

checkbox.forEach((checkboxElement) => {
  checkboxElement.addEventListener("click", () => {
    checkboxElement.classList.toggle("property-information__modal-checkbox--checked");
  });
});

// list of current properties
let properties = [];

// graphql request to load latest properties
async function loadLatestProperties() {
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
    sortDateDescending();
    renderList();
  } catch (error) {
    console.error("Error:", error);
  }
}

const latestProperties = document.querySelector(".latest-properties");

// limit results of lates properties
let displayedResults = 2;
let firstDisplayedResult = 0;

if (screen.width >= 1400) {
  displayedResults = 3;
}

// sort latest properties: date descending
function sortDateDescending() {
  properties.sort(function (a, b) {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  });
}

// render latest properties
function renderList() {
  latestProperties.innerHTML = "";
  properties.slice(firstDisplayedResult, displayedResults).forEach(function (property) {
    const firstImagePath = property.images[0] ? property.images[0].image_path : ""; // check if first image object exists, if so, return image_path
    const formattedPrice = property.prize.toLocaleString("de-CH", {
      style: "currency",
      currency: "CHF",
      maximumFractionDigits: 0,
    }); // format price to swiss franc

    const div = document.createElement("div");
    div.classList.add("latest-properties__element");
    div.dataset.propertyId = property.id;
    div.innerHTML = `
        <picture class="latest-properties__element-picture">
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
                    class="latest-properties__element-img"
                  />
                </picture>
        <p class="latest-properties__element-status">${property.estate_type}, ${property.availability}</p>
        <p class="latest-properties__element-location">${property.zip} ${property.city}, ${property.canton}</p>
        <h3 class="latest-properties__element-title">${property.title}</h3>
        <p class="latest-properties__element-value">Fläche ${property.usable_area}m², Preis: ${formattedPrice}</p>
        `;
    latestProperties.appendChild(div);
  });
}

// handle links to detail pages of latest properties
// get property id of clicked latest property & navigate to related detail page
function getPropertyId(event) {
  // click on text
  if (event.target.parentNode.matches(".latest-properties__element")) {
    const property = event.target.parentNode;
    const propertyId = property.dataset.propertyId;

    // open property detail page
    window.location.href = `http://localhost:8080/objekt.html?propertyId=${propertyId}`;
  }
  // click on image
  else if (event.target.parentNode.parentNode.matches(".latest-properties__element")) {
    const property = event.target.parentNode.parentNode;
    const propertyId = property.dataset.propertyId;

    // open property detail page
    window.location.href = `http://localhost:8080/objekt.html?propertyId=${propertyId}`;
  }
}

const latestPropertiesContainer = document.querySelector(".latest-properties");
latestPropertiesContainer.addEventListener("click", getPropertyId);

// render page content (property details, map & latest properties)
async function renderPage() {
  const property = await loadPropertyDetails(propertyId);
  await initMap(property.lat, property.long);
  loadLatestProperties();
}

renderPage();
