document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signupForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/signup",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // ✅ Tells the server we're sending JSON
                },
                body : JSON.stringify({email,password})
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(result.message); // Success message
                location.assign("/api/auth/signin") // Redirect on success

                //sendCodeToken by fetching 
                
                //redirect to verificationPage 
            } else {
                alert("Signup failed: " + result.message); // Show error message
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
