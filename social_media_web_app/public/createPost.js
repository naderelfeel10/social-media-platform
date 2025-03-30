document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const response = await fetch('http://localhost:3000/create-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        credentials: "include", 
        body: JSON.stringify({ title, description })
    });

    const data = await response.json();

    if (data.success) {
        alert('Post Created successfully!');
        location.assign('/all-posts');
    } else {
        alert('Failed to create a Post ' );
    }
});



