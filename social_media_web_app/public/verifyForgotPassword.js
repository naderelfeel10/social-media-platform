document.addEventListener("DOMContentLoaded", function () {
    const email = sessionStorage.getItem("email");

    document.getElementById("verifyForgotPasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        //const email = document.getElementById("email").value;
        const code = document.getElementById("code").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/verifyForgotPasswordCode",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // ✅ Tells the server we're sending JSON
                },
                body : JSON.stringify({email,code})
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(result.message); // Success message
                sessionStorage.setItem("isverified", true); // Store the code securely
                sessionStorage.setItem("email", email); // Store email too (optional)
                
                location.assign("/api/auth/resetPassword"); // Redirect on success
            } else {
                alert("verification failed: " + result.message); // Show error message
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
