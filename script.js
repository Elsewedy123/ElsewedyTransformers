/* ─────────────────────────────────────────
   Registration & Login  –  Shared Script
   ───────────────────────────────────────── */

var goodToGo = true;
var allIsGood = [];

// Registration fields (new single fullname field)
let userFullName  = document.getElementById("fullname");
let userEmail     = document.getElementById("email");
let userPassword  = document.getElementById("password");
let userCPassword = document.getElementById("cpassword");

// Login fields
let userLoginEmail    = document.getElementById("loginEmail");
let userLoginPassword = document.getElementById("loginPassword");

let flag      = false;
let loginuser = "";
let tempiD;
let tempName;

let allusers = [];
let userID;

// Bootstrap from localStorage
if (localStorage.getItem("users")) {
  allusers = JSON.parse(localStorage.getItem("users"));
  userID   = JSON.parse(localStorage.getItem("id"));
  userID++;
} else {
  allusers = [];
  userID   = 0;
}

/* ── Helper: show inline error next to an input ── */
function changeText(msg, inputId, labelId) {
  var input = document.getElementById(inputId);
  var label = document.getElementById(labelId);
  if (!input || !label) return;
  input.style.border = "3px solid red";
  label.innerHTML    = msg;
  label.style.marginTop  = "-13px";
  label.style.fontSize   = "10px";
  label.style.fontWeight = "bold";
  setTimeout(function () {
    input.value            = "";
    input.style.border     = "1px solid black";
    label.style.marginTop  = "";
    label.innerHTML        = "";
  }, 2500);
}

/* ── Registration: validate and create user ── */
function callAll() {
  var allValid = true;

  // Full name
  if (!userFullName || userFullName.value.trim() === "") {
    changeText("Full name is required", "fullname", "l1");
    allValid = false;
  } else if (/\d/.test(userFullName.value)) {
    changeText("Name should not contain numbers", "fullname", "l1");
    allValid = false;
  }

  // Email
  if (!userEmail || userEmail.value.trim() === "") {
    changeText("Email is required", "email", "l3");
    allValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value)) {
    changeText("Invalid email address", "email", "l3");
    allValid = false;
  }

  // Password
  if (!userPassword || userPassword.value === "") {
    changeText("Password is required", "password", "l4");
    allValid = false;
  } else {
    var pw = userPassword.value;
    if (pw.length < 8)          { changeText("Password must be at least 8 characters", "password", "l4"); allValid = false; }
    else if (!/[a-z]/.test(pw)) { changeText("Password must contain a lowercase letter", "password", "l4"); allValid = false; }
    else if (!/[A-Z]/.test(pw)) { changeText("Password must contain an uppercase letter", "password", "l4"); allValid = false; }
    else if (!/\d/.test(pw))    { changeText("Password must contain a number", "password", "l4"); allValid = false; }
    else if (!/[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?~`-]/.test(pw)) {
      changeText("Password must contain a special character", "password", "l4"); allValid = false;
    }
  }

  // Confirm password
  if (!userCPassword || userCPassword.value === "") {
    changeText("Please confirm your password", "cpassword", "l5");
    allValid = false;
  } else if (userPassword && userPassword.value !== userCPassword.value) {
    changeText("Passwords do not match", "cpassword", "l5");
    allValid = false;
  }

  if (allValid) {
    createUser();
    window.location.href = "login.html";
  }
}

/* ── Create and persist user ── */
function createUser() {
  // Check for duplicate email
  var duplicate = allusers.some(function(u) {
    return u.uEmail === userEmail.value.trim();
  });
  if (duplicate) {
    changeText("Email already registered", "email", "l3");
    return;
  }

  var user = {
    uID      : userID,
    uName    : userFullName.value.trim(),
    uEmail   : userEmail.value.trim(),
    uPassword: userPassword.value
  };
  allusers.push(user);
  localStorage.setItem("users", JSON.stringify(allusers));
  localStorage.setItem("id",    JSON.stringify(userID));
  alert("Account created successfully!");
}

/* ── Login ── */
function logIn() {
  if (!userLoginEmail || !userLoginPassword) return;

  if (isEmpty("loginEmail")) {
    changeText("Email is required", "loginEmail", "lemail");
    return;
  }
  if (isEmpty("loginPassword")) {
    changeText("Password is required", "loginPassword", "lpass");
    return;
  }

  if (localStorage.getItem("users")) {
    var searchedUser = JSON.parse(localStorage.getItem("users"));
    for (var i = 0; i < searchedUser.length; i++) {
      if (userLoginEmail.value === searchedUser[i].uEmail &&
          userLoginPassword.value === searchedUser[i].uPassword) {
        flag      = true;
        loginuser = 'Welcome, "' + searchedUser[i].uName + '"';
        tempiD    = searchedUser[i].uID;
        tempName  = searchedUser[i].uName;
        break;
      }
    }
    if (flag) {
      localStorage.setItem("logInuser",     tempiD);
      localStorage.setItem("logInuserName", tempName);
      alert(loginuser);
      window.location.href = "index.html";
    } else {
      changeText("Invalid email or password", "loginEmail",    "lemail");
      changeText("Invalid email or password", "loginPassword", "lpass");
    }
  } else {
    changeText("No accounts found — please register first", "loginEmail", "lemail");
  }
}

/* ── Misc helpers ── */
function isEmpty(inputId) {
  var input = document.getElementById(inputId);
  return !input || input.value.trim() === "";
}

function logout() {
  window.location.href = "login.html";
}

function changeName() {
  var el = document.getElementById("fullname");
  if (el) el.innerHTML = localStorage.getItem("logInuserName") || "";
}

function checkHover(isHovered) {
  var el = document.getElementById("fullname");
  if (!el) return;
  el.innerHTML = isHovered ? "Logout" : (localStorage.getItem("logInuserName") || "");
}
