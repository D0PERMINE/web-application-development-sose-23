const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("submit-button");
const loginErrorMsg = document.getElementById("login-error-msg");

const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const addButton = document.getElementById("add-button");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("OKKK: " + loginForm.username.value);
    const username = loginForm.username.value;
    const password = loginForm.password.value;


    if (username === "admina" && password === "admina") {
        alert("You have successfully logged in as admina.");
        // location.reload();
        loginScreen.style.display = "none";
        mainScreen.style.display = "block";
    } else if (username === "normalo" && password === "normalo") {
        alert("You have successfully logged in as normalo.");
        // location.reload();
        loginScreen.style.display = "none";
        mainScreen.style.display = "block";
        addButton.style.display = "none";

    } else {
        loginErrorMsg.style.opacity = 1;
        // loginErrorMsg.style.display = "block";
        // loginErrorMsg.style.visibility = "visible";
    }
})