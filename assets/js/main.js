const links = {
  szakipush: "https://borsiimre60.github.io/szakipush-web/"
};

document.querySelectorAll("[data-link]").forEach((element) => {
  const key = element.getAttribute("data-link");
  if (key && links[key]) {
    element.setAttribute("href", links[key]);
  }
});

const yearTarget = document.getElementById("current-year");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}
