document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("changePasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const newPassword2 = document.getElementById("newPassword2").value;
        const token = localStorage.getItem("jwt"); // Or get from cookies
        try {
            const response = await fetch("http://localhost:3000/api/auth/changePassword",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // ✅ Tells the server we're sending JSON
                    // "Authorization": `Bearer ${token}`
                },
                credentials: "include", 
                body : JSON.stringify({oldPassword,newPassword,newPassword2})
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(result.message); // Success message
                location.assign("/")
            }else{
            alert("changing password failed: " + result.message); // Show error message
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
