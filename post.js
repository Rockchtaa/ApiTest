const apiUrl = "https://tarmeezacademy.com/api/v1";

// Function to get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch and display post details and comments
const postId = getQueryParam("id");
if (postId) {
  fetch(`${apiUrl}/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      const post = data.data;
      console.log(post);
      const postContainer = document.getElementById("post-container");

      const postDetails = `
              <div class="card text-center mb-3" style="width:50%">
                <div class="card-header">
                  <img src="${post.author.profile_image}" style="height: 40px" class="rounded-circle" alt="">
                  <p class="fw-bold">@${post.author.name}</p>
                </div>
                <div class="card-body">
                  <img class="w-100" src="${post.image}" style="height: 250px; width: 100px;" alt="">
                  <h5 class="mt-2">${post.author.username}</h5>
                  <p class="mt-1">${post.title}</p>
                  <p>${post.body}</p>
                </div>
                <div class="card-footer text-body-secondary">
                  ${post.created_at} <span> / ${post.comments_count} Comments </span>
                </div>
          
              </div>
            `;
      postContainer.innerHTML = postDetails;

      // Display comments
      const commentsContainer = document.getElementById("comments-container");
      let commentsHTML = "<h3>Comments</h3>";
      post.comments.forEach((comment) => {
        commentsHTML += `
                <div class="card mb-3">
                  <div class="card-header">
                    <img src="${comment.author.profile_image}" style="height: 30px" class="rounded-circle" alt="">
                    <p class="fw-bold">@${comment.author.name}</p>
                  </div>
                  <div class="card-body">
                    <p>${comment.body}</p>
                  </div>
                </div>
              `;
      });
      commentsContainer.innerHTML = commentsHTML;
    })
    .catch((error) => console.error("Error fetching post details:", error));
  // add a comment
  function AddComment() {
    const addComment = document.getElementById("add-comment").value;
    const token = localStorage.getItem("token");

    fetch(`${apiUrl}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: addComment }),
    })
      .then((response) => response.json())
      .then((comment) => {
        if (comment.error) {
          console.error("Error posting comment:", comment.error);
          return;
        }
        // Clear the input field
        document.getElementById("add-comment").value = "";

        // Append the new comment to the comments section
        const commentsContainer = document.getElementById("comments-container");
        const newCommentHTML = `
          <div class="card mb-3">
            <div class="card-header">
              <img src="${comment.data.author.profile_image}" style="height: 30px" class="rounded-circle" alt="">
              <p class="fw-bold">@${comment.data.author.name}</p>
            </div>
            <div class="card-body">
              <p>${comment.data.body}</p>
            </div>
          </div>
        `;
        commentsContainer.innerHTML += newCommentHTML;
      })
      .catch((err) => console.error("Error:", err.message));
  }
}

// Fetch and display post details and comments
if (postId) {
  fetch(`${apiUrl}/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      const post = data.data;
      console.log(post);
      const postContainer = document.getElementById("post-container");

      // check if the userName is the same as the logging
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const isAuthor =
        currentUser && currentUser.username === post.author.username;

      console.log(isAuthor);

      const postDetails = `
        <div class="card text-center mb-3" style="width:50%">
          <div class="card-header">
            <img src="${
              post.author.profile_image
            }" style="height: 40px" class="rounded-circle" alt="">
            <p class="fw-bold">@${post.author.name}</p>
          </div>
          <div class="card-body">
            <img class="w-100" src="${
              post.image
            }" style="height: 250px; width: 100px;" alt="">
            <h5 class="mt-2">${post.author.username}</h5>
            <p class="mt-1">${post.title}</p>
            <p>${post.body}</p>
          </div>
          <div class="card-footer text-body-secondary">
            ${post.created_at} <span> / ${post.comments_count} Comments </span>
            ${
              isAuthor
                ? `<button class="btn btn-warning" onclick="openEditPostModal(${postId})">Edit</button>`
                : ""
            }
          </div>
        </div>
      `;
      postContainer.innerHTML = postDetails;

      // Display comments
      const commentsContainer = document.getElementById("comments-container");
      let commentsHTML = "<h3>Comments</h3>";
      post.comments.forEach((comment) => {
        commentsHTML += `
          <div class="card mb-3">
            <div class="card-header">
              <img src="${comment.author.profile_image}" style="height: 30px" class="rounded-circle" alt="">
              <p class="fw-bold">@${comment.author.name}</p>
            </div>
            <div class="card-body">
              <p>${comment.body}</p>
            </div>
          </div>
        `;
      });
      commentsContainer.innerHTML = commentsHTML;
    })
    .catch((error) => console.error("Error fetching post details:", error));
}

// Function to open the Edit Post Modal with existing post data
function openEditPostModal(postId) {
  fetch(`${apiUrl}/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      const post = data.data;
      document.getElementById("editPostTitle").value = post.title;
      document.getElementById("editPostBody").value = post.body;
      // Open the modal
      const modal = new bootstrap.Modal(
        document.getElementById("editPostModal")
      );
      modal.show();
      // Attach postId to the save button click
      document.querySelector("#editPostModal .btn-primary").onclick = () =>
        editPost(postId);
    })
    .catch((error) => console.error("Error fetching post details:", error));
}

// the edit "update" is working and I got it why it doesn"t appeared updated but i am to lzay to fix it
// Function to handle post editing
function editPost(postId) {
  const title = document.getElementById("editPostTitle").value;
  const body = document.getElementById("editPostBody").value;
  const imageFile = document.getElementById("editPostImage").files[0];

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to be logged in to edit a post.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  fetch(`${apiUrl}/posts/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((json) => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editPostModal")
      );
      modal.hide();
      showSuccessMsg("Post updated successfully!");
      SetupUI();
      location.reload(); // Refresh the page to see the updated post
    })
    .catch((error) => console.error("Error updating post:", error));
}
