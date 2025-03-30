document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("verifyEmailForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const email = document.getElementById("email").value;
        const code = document.getElementById("code").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/verifyCode",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // ✅ Tells the server we're sending JSON
                },
                body : JSON.stringify({email,code})
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(result.message); // Success message

                location.assign("/") // Redirect on success
            } else {
                alert("verification failed: " + result.message); // Show error message
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
