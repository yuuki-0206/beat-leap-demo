window.addEventListener("DOMContentLoaded", (event) => {
  const popup = document.getElementById("popup");
  const infoButton = document.getElementById("info-button");
  const closeButton = document.getElementById("close-button");

  const showPopup = () => (popup.style.display = "block");
  const hidePopup = () => (popup.style.display = "none");

  setTimeout(showPopup, 2500);

  infoButton.addEventListener("click", showPopup);

  closeButton.addEventListener("click", hidePopup);

  window.addEventListener("click", function (event) {
    if (event.target == popup) hidePopup();
  });
});
