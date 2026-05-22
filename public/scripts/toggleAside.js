const asideButton = document.querySelector("#asideToggle");
const aside = document.querySelector("aside");

if (asideButton) {
  asideButton.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = aside.classList.toggle("open");

    asideButton.setAttribute("aria-pressed", isOpen);
    asideButton
      .querySelector("svg use")
      .setAttribute("href", `#icon-${isOpen ? "close" : "menu"}`);
  });

  document.addEventListener("click", (e) => {
    const clickedInsideaside = aside.contains(e.target);
    const clickedButton = asideButton.contains(e.target);

    if (!clickedInsideaside && !clickedButton) {
      aside.classList.remove("open");

      asideButton.setAttribute("aria-pressed", false);

      asideButton
        .querySelector("svg use")
        .setAttribute("href", "#icon-menu");
    }
  });
}