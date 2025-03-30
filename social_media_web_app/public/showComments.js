document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleComments");
    const commentsContainer = document.getElementById("commentsContainer");

    toggleButton.addEventListener("click", function () {
        if (commentsContainer.style.display === "none") {
            commentsContainer.style.display = "block";
            toggleButton.textContent = "Hide Comments"; // Change button text
        } else {
            commentsContainer.style.display = "none";
            toggleButton.textContent = "Show Comments"; // Reset button text
        }
    });
});
