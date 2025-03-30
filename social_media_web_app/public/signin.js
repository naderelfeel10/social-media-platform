document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signinForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/signin",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // ✅ Tells the server we're sending JSON
                },
                body : JSON.stringify({email,password})
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(result.message); // Success message
                localStorage.setItem("jwt", result.token); // ✅ Store JWT token
                alert(result.token); // Debugging
              if(!result.isverified || result.isMfaActive){
                const response2 = await fetch("http://localhost:3000/api/auth/sendCode",{
                    method:"POST",
                headers: {
                    "Content-Type": "application/json", // ✅ Tells the server we're sending JSON
                },
                body : JSON.stringify({email})
                });

                const result2 = await response2.json();
                if(response2.ok){
                    alert("good");

                    location.assign("/api/auth/verifyCode")
                }else{
                   alert("an error in sending code")
                }
  
                 // Redirect on success
            } else {
                location.assign("/");
            }

        }else{
            alert("Signup failed: " + result.message); // Show error message
        }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
