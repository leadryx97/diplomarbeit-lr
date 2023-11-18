// footer
// scroll to top button
const scrollToTopBtn = document.querySelector(".footer__scroll-to-top-button");
const rootElement = document.documentElement;

function scrollToTop() {
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

scrollToTopBtn.addEventListener("click", scrollToTop);

export { scrollToTopBtn, rootElement };
