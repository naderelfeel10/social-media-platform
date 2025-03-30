document.addEventListener("DOMContentLoaded", function () {

document.getElementById('activate2FA').addEventListener('click', async () => {
        event.preventDefault();    
        const confirmation = confirm('Are you sure you want to activate 2FA?');
    
    if (confirmation) {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/activate-mfa`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:"include",
                body: JSON.stringify({  })
            })

            const data = await response.json();

            if (response.ok) {
                alert('2FA is updated successfully');
                window.location.href = 'api/auth/signout';  // Redirect to all posts page
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error in activating 2fa', error);
            alert('An error occurred while activating 2fa.');
        }
    }
});
})
