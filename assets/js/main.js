const links = {
  home: "https://borsiimre60.github.io/",
  kozoskepviselok: "https://borsiimre60.github.io/kozoskepviselok/",
  kozoskepviseloForm: "https://docs.google.com/forms/d/e/1FAIpQLSfbSlrvX8jRNn0K3WF7z-yO2KEKpI40qX7tWSVVk0XNBhhh7A/viewform?usp=pp_url&entry.716565563=kozos_kepviselo_kampany",
  vendeglatohelyek: "https://borsiimre60.github.io/vendeglatohelyek/",
  szakemberek: "https://borsiimre60.github.io/szakemberek/",
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
