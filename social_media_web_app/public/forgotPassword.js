document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("forgotPasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const email = document.getElementById("email").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/sendforgotPasswordCode",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // ✅ Tells the server we're sending JSON
                },
                body : JSON.stringify({email})
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(result.message); // Success message
                sessionStorage.setItem("email", email); // Store email too (optional)
                location.assign("verifyForgotPasswordCode")
            }else{
            alert("sending Code failed: " + result.message); // Show error message
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
