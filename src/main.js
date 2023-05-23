const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginErrorMsg = document.getElementById("login-error-msg");

const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const addButton = document.getElementById("main-screen-add-button");
const logoutButton = document.getElementById("logout-button");

const addScreen = document.getElementById("add-screen");
const addButtonSubmit = document.getElementById("add-screen-add-button");
const cancelButton = document.getElementById("add-screen-cancel-button");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("OKKK: " + loginForm.username.value);
    const username = loginForm.username.value;
    const password = loginForm.password.value;


    if (username === "admina" && password === "admina") {
        // location.reload();
        loginScreen.style.display = "none";
        mainScreen.style.display = "block";
        document.getElementById("welcome").textContent = "Welcome " + username + ".";

        loginForm.reset();

        //alert("You have successfully logged in as admina.");
    } else if (username === "normalo" && password === "normalo") {
        // location.reload();
        loginScreen.style.display = "none";
        mainScreen.style.display = "block";
        addButton.style.display = "none";
        document.getElementById("welcome").textContent = "Welcome " + username + ".";

        loginForm.reset();

        //alert("You have successfully logged in as normalo.");
    } else {
        loginErrorMsg.style.opacity = 1;
        loginForm.reset();
        // loginErrorMsg.style.display = "block";
        // loginErrorMsg.style.visibility = "visible";
    }
})

logoutButton.addEventListener("click", (e) => {
    console.log("OKKK: " + loginForm.username.value + "logged out");

    mainScreen.style.display = "none";
    loginScreen.style.display = "block";

    //alert("Logged out successfully.");
})


addButton.addEventListener("click", (e) => {
    console.log("Switched to add screen");

    mainScreen.style.display = "none";
    addScreen.style.display = "block";
})

cancelButton.addEventListener("click", (e) => {
    console.log("Cancelled add.");

    addScreen.style.display = "none";
    mainScreen.style.display = "block";
})