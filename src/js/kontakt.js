// import header
import {
  nav,
  navItems,
  hamburger,
  hamburgerIcon,
  closeIcon,
  body,
  toggleMenu,
  activePage,
} from "./site-wide.js";

// import location icon
import markerIcon from "../assets/images/svg/map-location-marker.svg";

// google maps
import { Loader } from "@googlemaps/js-api-loader";

let map;

const loader = new Loader({
  apiKey: "AIzaSyAWGZmIJEj81w1nCFltoYGn-V_PXQHVae0",
  version: "weekly",
});

// Request needed libraries.
loader.importLibrary("maps").then(({ Map }) => {
  // location
  const position = { lat: 47.178561307288355, lng: 9.451303899836864 };

  // The map, centered at home & house
  map = new Map(document.querySelector(".contact__maps"), {
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
    title: "location",
    icon: {
      url: markerIcon,
      scaledSize: iconSize,
    },
  });
});
