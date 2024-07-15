
SetupUI();
const apiUrl = "https://tarmeezacademy.com/api/v1";

fetch(`${apiUrl}/posts`)
  .then((response) => response.json())
  .then((data) => {
    const postsContainer = document.getElementById("posts-container");
    console.log(data);

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
    


    document.getElementById("post-tags").innerHTML = "";

    data.data.forEach(tag => {
        console.log(tag); 
    });

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


function loginBtnClicked() {
  const username = document.getElementById("userName").value;
  const password = document.getElementById("Password").value;
  const Modal = document.getElementById("exampleModal");

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
      console.log(json); // Log the JSON response for debugging
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
      showSuccessMsg();
    })
    .catch((err) => console.error('Error:', err.message));
    
}


function showSuccessMsg() {
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

  appendAlert('You have successfully logged in');
    
}

function showLogoutMsg() {
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

  appendAlert('You have logged out');
    
}


function SetupUI() {
    const token = localStorage.getItem("token");
    const loggedIN = document.querySelector("#logged-in");
    console.log(loggedIN);
    const logOut = document.getElementById("logged-out");

    if (token == null) {
      logOut.style.setProperty("display", "none", "important")
      loggedIN.style.setProperty("display", "block", "important") 
    }else{
      logOut.style.setProperty("display", "block", "important") 
      loggedIN.style.setProperty("display", "none","important" )
    }
    

  }

function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  SetupUI();
  showLogoutMsg();
  
}
