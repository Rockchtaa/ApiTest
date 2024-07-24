
SetupUI();
const apiUrl = "https://tarmeezacademy.com/api/v1";

fetch(`${apiUrl}/posts`)
  .then((response) => response.json())
  .then((data) => {
    const postsContainer = document.getElementById("posts-container");


    const postsArray = Object.values(data.data);

    postsArray.forEach((post) => {  
      

      const postCard = `
                  <div class="card text-center mb-3">
                      <div class="card-header">
                          <img src="${post.author.profile_image}" style="height: 40px" class="rounded-circle" alt="">
                          <p class="fw-bold">@${post.author.name}</p>
                      </div>
                      <div class="card-body">
                          <img class="w-100" src="${post.image}" style="height: 250px; width: 100px;" alt="">
                          <h5 class="mt-2">${post.author.username}</h5>
                          <p class="mt-1">${post.title}</p>
                      </div>
                      <div class="card-footer text-body-secondary">
                          ${post.created_at} <span> / ${post.comments_count} Comments </span>

                          <span id="post-tags">
                                <button class="btn btn-sm rounded-5" style="background-color:gray; color: white"> policy </button>                          
                          </span>
                      </div>
                  </div>
              `;
      postsContainer.innerHTML += postCard;

    });
    


    // document.getElementById("post-tags").innerHTML = "";

    // data.data.forEach(tag => {
    //     console.log(tag); 
    // });

  })
  .catch((error) => console.error("Error fetching posts:", error));



// function loginBtnClicked() {

//   const username = document.getElementById("userName").value;
//   const password = document.getElementById("Password").value;
//   const example = document.getElementById("example");

//   const data = {
//     username: username,
//     password: password,
//   };

//   fetch(`${apiUrl}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => {

//       console.log(response);



//       if (!response.ok) {
//         console.log("there is an error");
//       }
//       // return response.json();

//       else if(response.ok)
//       {
//         // example.style.visibility = 'hidden';
//         return response.json();
//       }
//     })

//     .then((json) => 
//       console.log(json);
//       localStorage.setItem("token", response.data.token)
//       localStorage.setItem("user", JSON.stringify(response.data.user))
//   )
//     .catch((err) => console.log(err.message));
//   // console.log("Username:", username, "Password:", password);
// }



// when the user want to log in 



function loginBtnClicked() {
  const username = document.getElementById("userName").value;
  const password = document.getElementById("Password").value;
  const Modal = document.getElementById("exampleModal");
  const ApiUser = document.getElementById("api-username");

  const data = {
    username: username,
    password: password,
  };

  fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((json) => {
      // Log the JSON response for debugging
      // Check if 'token' and 'user' exist in the JSON response
      // if (json.token && json.user) {
      //   localStorage.setItem("token", json.token);
      //   localStorage.setItem("user", JSON.stringify(json.user));
      // } else {
      //   throw new Error("Token or user data missing in response");
      // }
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));

      const modalInstance = bootstrap.Modal.getInstance(Modal); 
      modalInstance.hide(); // how to hide the window on bootsrap by adding hide function
      SetupUI();
      showSuccessMsg("You have successfully logged in");
      // console.log(json.user.username);

      ApiUser.innerHTML = json.user.username;
      
    })
    .catch((err) => console.error('Error:', err.message));
    
}



//  when the user want to register 

function registerBtnClicked() {

  const name = document.getElementById("register-name").value;
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const Modal = document.getElementById("register-modal");

  const data = {
    name: name,
    username: username,
    password: password,

  };

  fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((json) => {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));

      const modalInstance = bootstrap.Modal.getInstance(Modal); 
      modalInstance.hide(); // how to hide the window on bootsrap by adding hide function
      SetupUI();
      showSuccessMsg('You have successfully registered');
   
    })
    .catch((err) => console.error('Error:', err.message));
}

// msg of successfull log in 
function showSuccessMsg(message) {
  const alertPlaceholder = document.getElementById('successAlert')

  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper);
    setTimeout(() => {
      wrapper.remove();
    }, 3000);
  }

  appendAlert(message);
    
}


// msg of log out 
function showLogoutMsg(message) {
  const alertPlaceholder = document.getElementById('LogoutAlert')

  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper);
    setTimeout(() => {
      wrapper.remove();
    }, 3000);
  }

  appendAlert(message);
    
}



// dispaly and hide buttton of login logout and register 
function SetupUI() {
    const token = localStorage.getItem("token");
    const loggedIN = document.querySelector("#logged-in");
    const logOut = document.getElementById("logged-out");
    const ApiUser = document.getElementById("api-username");
    const createPostButton = document.getElementById("createPostButton");

    if (token == null) {
      logOut.style.setProperty("display", "none", "important")
      loggedIN.style.setProperty("display", "block", "important")
      ApiUser.style.setProperty("display", "none", "important")
      createPostButton.style.setProperty("display", "none", "important");

    }else{
      logOut.style.setProperty("display", "block", "important") 
      loggedIN.style.setProperty("display", "none","important" )
      ApiUser.style.setProperty("display", "block", "important")
      createPostButton.style.setProperty("display", "block", "important");

      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      if (user) {
        ApiUser.innerHTML = user.username;
      }
    }
    

  }

function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  SetupUI();
  showLogoutMsg('You have logged out');
  
}


function createPost() {
  const title = document.getElementById("postTitle").value;
  const body = document.getElementById("postBody").value;
  const imageFile = document.getElementById("postImage").files[0];

  // Check if the user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to be logged in to create a post.");
    return;
  }

  // Prepare the form data
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", imageFile);

  console.log(formData.title);

  fetch(`${apiUrl}/posts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`, // Include token for authentication
    },
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(json => {
      showSuccessMsg("Post created successfully!");
      SetupUI(); 
      document.getElementById("createPostForm").reset(); // Reset form fields
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById("createPostModal"));
      modalInstance.hide();
    })
    .catch(error => {
      console.error("Error creating post:", error);
    });
}
