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

// import location icon
import markerIcon from "../assets/images/svg/map-location-marker.svg";

// dynamic property page
// handling of url
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get("propertyId");
console.log(urlParams, propertyId);

// graphql request
async function createDetailPage(propertyId) {
  try {
    const idQuery = gql`
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
          images {
            image_path
          }
        }
      }
    `;
    const response = await graphQLClient.request(idQuery, { propertyId });
    const property = response.estate;
    // format price to swiss franc
    const formattedPrice = property.prize.toLocaleString("de-CH", {
      style: "currency",
      currency: "CHF",
      maximumFractionDigits: 0,
    });
    // check if first image object exists, if so, return image_path
    const firstImagePath = property.images[0] ? property.images[0].image_path : "";
    const secondImagePath = property.images[1] ? property.images[1].image_path : "";
    const thirdImagePath = property.images[2] ? property.images[2].image_path : "";
    const fourthImagePath = property.images[3] ? property.images[3].image_path : "";
    // load dynamic property content
    if (property) {
      /* title */
      document.querySelector(".page-title--property").childNodes[0].textContent =
        property.estate_type + " ";
      document.querySelector(".page-title--property-bold").textContent = property.title;

      /* images / slideshow */
      document.querySelector(".slider__picture-img").src = firstImagePath;
      document.querySelector(".slider__picture--avif").srcset = `${firstImagePath}?avif`;
      document.querySelector(".slider__picture--webp").srcset = `${firstImagePath}?webp`;

      document.querySelector(".slider__thumbnail-picture-img--first").src = secondImagePath;
      document.querySelector(
        ".slider__thumbnail-picture--avif-first"
      ).srcset = `${secondImagePath}?avif`;
      document.querySelector(
        ".slider__thumbnail-picture--webp-first"
      ).srcset = `${secondImagePath}?webp`;

      document.querySelector(".slider__thumbnail-picture-img--second").src = thirdImagePath;
      document.querySelector(
        ".slider__thumbnail-picture--avif-second"
      ).srcset = `${thirdImagePath}?avif`;
      document.querySelector(
        ".slider__thumbnail-picture--webp-second"
      ).srcset = `${thirdImagePath}?webp`;

      document.querySelector(".slider__thumbnail-picture-img--third").src = fourthImagePath;
      document.querySelector(
        ".slider__thumbnail-picture--avif-third"
      ).srcset = `${fourthImagePath}?avif`;
      document.querySelector(
        ".slider__thumbnail-picture--webp-third"
      ).srcset = `${fourthImagePath}?webp`;

      /* information */
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

      /* modal */
      document.querySelector(".property-information__modal-property").textContent = property.title;
    } else {
      console.error("Property not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

if (propertyId) {
  createDetailPage(propertyId);
}

// google maps
((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyAWGZmIJEj81w1nCFltoYGn-V_PXQHVae0",
});
// Initialize and add the map
let map;

async function initMap() {
  // location
  const position = { lat: 47.178561307288355, lng: 9.451303899836864 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

  // The map, centered at home & house
  map = new Map(document.querySelector(".property-information__map"), {
    zoom: 15.7,
    center: position,
    disableDefaultUI: true,
    mapId: "560e1e5e3f75ad8c",
  });

  // The marker, positioned at home & house
  const iconSize = new google.maps.Size(50, 50);

  new google.maps.Marker({
    position: position,
    map,
    title: "Hello World!",
    icon: {
      url: markerIcon,
      scaledSize: iconSize,
    },
  });
}

initMap();

// modal form
const requestButton = document.querySelector(".property-information__button-interest");
const modal = document.querySelector(".property-information__modal");
const closeModal = document.querySelector(".property-information__close-modal");

requestButton.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});

// icon checkbox
const checkbox = document.querySelectorAll(".property-information__modal-checkbox");

checkbox.forEach((checkboxElement) => {
  checkboxElement.addEventListener("click", () => {
    checkboxElement.classList.toggle("property-information__modal-checkbox--checked");
  });
});
