const names = [
   "John Doe",
    "Mary James",
    "David Smith",
    "Sarah Williams",
    "Michael Johnson"
];   

const form = document.getElementById("loginForm"); 

form.addEventListener("submit", async function(event) {

  event.preventDefault();
  
  const data = new FormData(form)
  const result = Object.fromEntries(data.entries());

  //window.location.replace("http://127.0.0.1:5500/dashboard.html")
  try{
  const response = await fetch('./users.json');
  if(!response.ok){
     throw new Error("Failed to load users.json");
}
  const users = await response.json();

// check if email and password match 
  const user = users.find(
    user =>
    user.email === result.email &&
    user.password === result.password
  );
      
  if (user){
    console.log("got em")
    const loggedInUser ={
      id: user.id,
      name:user.name,
      email:user.email
    };
     
    // localStorage.setItem(
    //   "loggedInUser"
    //  (JSON).stringify(loggedInUser)
    // );

  //redirect to dashboard
    window.location.replace ("http://127.0.0.1:5500/dashboard.html");
    
  } else {
    console.log("Invalid email or password");
  }

} catch{;
 console.error(' error'); 
}
});

 
  console.log(result);

  // result.innerHTML = `
  //   <h3>Login Details</h3>
  //   <p>Welcome!</p>
  //   <p>Email: ${email.value}</p>
  //   <p>Password: ${password.value}</p>
  // `;

