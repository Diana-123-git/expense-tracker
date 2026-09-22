const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) { 
  // No user is logged in 
  
 window.location.replace("index.html");
}