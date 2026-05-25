const deleteForms = document.querySelectorAll(".deleteForm");

if (deleteForms) {
  deleteForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!confirm("Delete this message?")) {
        e.preventDefault();
        return;
      }
    });
  });
}
