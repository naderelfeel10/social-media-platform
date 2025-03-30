const urlParams = new URLSearchParams(window.location.search);
const _id = urlParams.get('_id'); // Or, if it's part of the path, adjust accordingly

document.getElementById('updateUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();

      
    const role = document.getElementById('role').value;
     try{
    const response = await fetch(`http://localhost:3000/api/auth/adminPanel/users/update-user?_id=${_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({ role })
    });

    const data = await response.json();
    
    if (response.ok) {
        alert('User updated successfully!');
        //location.assign('/');
    } else {
        alert(data.message);
    }
}catch(err){
    alert("some thing went wrong",err.message)
}
});



// Delete Post Functionality
document.getElementById('deleteUserButton').addEventListener('click', async () => {
    const confirmation = confirm('Are you sure you want to delete this User?');
    
    if (confirmation) {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/adminPanel/users/delete-user?_id=${_id}`, {
                method: 'DELETE',
                credentials:"include"
            });

            const data = await response.json();

            if (data.success) {
                alert('User deleted successfully');
                window.location.href = '/';  // Redirect to all posts page
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting User:', error);
            alert('An error occurred while deleting the user.');
        }
    }
});

