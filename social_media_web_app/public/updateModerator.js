const urlParams = new URLSearchParams(window.location.search);
const _id = urlParams.get('_id');


document.getElementById('updateModeratorForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value; 
     try{
 
    const response = await fetch(`http://localhost:3000/api/auth/adminPanel/users/update-moderator?_id=${_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({ role })
    });

    const data = await response.json();
    
    if (response.ok) {
        alert('Moderator updated successfully!');
        //location.assign('/');
    } else {
        alert(data.message);
    }
}catch(err){
    alert("some thing went wrong",err.message)
}
});



// Delete Post Functionality
document.getElementById('deleteModeratorButton').addEventListener('click', async () => {
    const confirmation = confirm('Are you sure you want to delete this Moderator?');
    
    if (confirmation) {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/adminPanel/users/delete-moderator?_id=${_id}`, {
                method: 'DELETE',
                credentials:"include"
            });

            const data = await response.json();

            if (data.success) {
                alert('Moderator deleted successfully');
                window.location.href = '/';  // Redirect to all posts page
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting Moderator:', error);
            alert('An error occurred while deleting the Moderator.');
        }
    }
});

