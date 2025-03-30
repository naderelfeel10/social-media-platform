document.addEventListener("DOMContentLoaded", function () {
    const isverified = sessionStorage.getItem("isverified");
    const email = sessionStorage.getItem("email");
    document.getElementById("ResetPasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault(); 


        const password = document.getElementById("password").value;
        const newPassword = document.getElementById("newPassword").value;
        
        try {
            const response = await fetch("http://localhost:3000/api/auth/resetPassword",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body : JSON.stringify({email,isverified,password,newPassword})
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(result.message); 

                location.assign("/") 
            } else {
                alert("verification failed: " + result.message); 
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
