const urlParams = new URLSearchParams(window.location.search);
const _id = urlParams.get('_id'); // Or, if it's part of the path, adjust accordingly

document.getElementById('updatePostForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const response = await fetch(`http://localhost:3000/update-post?_id=${_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({ title, description })
    });

    const data = await response.json();
    
    if (data.success) {
        alert('Post updated successfully!');
        location.assign('/all-posts');
    } else {
        alert(data.message);
    }
});

// Delete Post Functionality
document.getElementById('deletePostButton').addEventListener('click', async () => {
    const confirmation = confirm('Are you sure you want to delete this post?');
    
    if (confirmation) {
        try {
            const response = await fetch(`http://localhost:3000/delete-post?_id=${_id}`, {
                method: 'DELETE',
                credentials:"include"
            });

            const data = await response.json();

            if (data.success) {
                alert('Post deleted successfully');
                window.location.href = '/all-posts';  // Redirect to all posts page
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('An error occurred while deleting the post.');
        }
    }
});

