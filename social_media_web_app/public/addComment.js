document.addEventListener("DOMContentLoaded", function () {
    // Get postId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const _id = urlParams.get('_id'); // Make sure it's available globally

    if (!_id) {
        alert("Error: Post ID (_id) is missing in the URL!");
        return;
    }

    console.log("Extracted Post ID:", _id);

    // Add comment
    document.getElementById('addCommentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const comment = document.getElementById('comment').value;

        try {
            const response = await fetch(`http://localhost:3000/add-comment?_id=${_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ comment })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Comment added successfully!');
                location.reload();
            } else {
                alert('Failed to add a comment.');
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Something went wrong.");
        }
    });

    // Like / Unlike
    document.getElementById('likeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const likeButton = document.getElementById("like");

        try {
            const response = await fetch(`http://localhost:3000/add-like?_id=${_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({})
            });

            const data = await response.json();

            if (response.ok) {
                likeButton.textContent = likeButton.textContent === "Like" ? "Unlike" : "Like";
                alert(data.message);
            } else {
                alert("Failed to add/remove like.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        }
    });

    // Delete Comment (Ensure buttons exist before adding event listeners)
    document.querySelectorAll('.deleteCommentButton').forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();

            const commentId = this.getAttribute("data-comment-id"); // Get comment ID from button attribute

            if (!commentId) {
                alert("Error: Comment ID not found!");
                return;
            }

            const confirmation = confirm('Are you sure you want to delete this comment?');

            if (confirmation) {
                try {
                    const response = await fetch(`http://localhost:3000/delete-comment?_id=${_id}&commentId=${commentId}`, {
                        method: 'DELETE',
                        credentials: "include"
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert('Comment deleted successfully');
                        location.reload(); // Reload page to reflect changes
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error deleting comment:', error);
                    alert('An error occurred while deleting the comment.');
                }
            }
        });
    });
});
