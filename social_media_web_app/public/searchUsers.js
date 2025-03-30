document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    
    searchInput.addEventListener("keyup", function () {
        let input = searchInput.value.toLowerCase();
        let users = document.querySelectorAll(".user");

        users.forEach(user => {
            let email = user.querySelector(".user-email").textContent.toLowerCase();
            user.style.display = email.includes(input) ? "block" : "none";
        });
    });
});
