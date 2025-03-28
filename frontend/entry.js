const signinbutton = document.querySelector('.signinbtn');
const signupbutton = document.querySelector('.signupbtn');
const formbox = document.querySelector('.form-box');
const body = document.querySelector('body');


//sign-in and sign-up functionalty

signupbutton.onclick = function(){
    formbox.classList.add('active');
    body.classList.add('active');
}

signinbutton.onclick = function(){
    formbox.classList.remove('active');
    body.classList.remove('active');
}


// signup

document.querySelector('.signupform form').addEventListener('submit',async function(event){

    event.preventDefault();

    const email = this.querySelector('input[placeholder="Email"]').value;
    const username = this.querySelector('input[placeholder="Username"]').value;
    const password = this.querySelector('input[placeholder="Password"]').value;
    const confirmpassword = this.querySelector('input[placeholder="Confirm Password"]').value;

    if(!email.endsWith("@gmail.com")){
        alert("Invalid Email Format!");
        return;
    }
    if(password != confirmpassword){
        alert("Passwords do not match!");
        return;
    }

    if(password.length < 8){
        alert("Password should be at least 8 characters!");
        return;
    }

  
    try {
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ username, password, email }) 
        });
    
        const data = await response.text(); 
    
        if (response.ok) {
            alert(`Success! ${data}, Please Log In!`);
        } else {
            alert(`Signup failed! ${data}`);
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert("Something went wrong. Please try again.");
    }
    
})


// sign-in login

document.querySelector('.form').addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = this.querySelector('input[placeholder="Username"]').value;
    const password = this.querySelector('input[placeholder="Password"]').value;


    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ username, password }) 
        });

        const data = await response.text(); 

        if (response.ok) {
            localStorage.setItem("jwtToken", data);
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert(`Login failed! ${data}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Something went wrong. Please try again.");
    }
});


// show password functionality

function showpass(){
    const passlist = document.querySelectorAll('.passwordBox');
    const show = document.querySelector('.show');



    passlist.forEach((pass)=>{
        if(pass.type == "password"){
            pass.type = "text";
        }
        else pass.type = "password";
    })
    
}