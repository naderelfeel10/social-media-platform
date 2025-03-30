document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleLikes");
    const likesContainer = document.getElementById("likesContainer");

    toggleButton.addEventListener("click", function () {
        if (likesContainer.style.display === "none") {
            likesContainer.style.display = "block";
            toggleButton.textContent = "Hide Likes"; // Change button text
        } else {
            likesContainer.style.display = "none";
            toggleButton.textContent = "Show Likes"; // Reset button text
        }
    });
});
