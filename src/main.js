const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("submit-button");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("OKKK: " + loginForm.username.value);
    const username = loginForm.username.value;
    const password = loginForm.password.value;


    if (username === "admina" && password === "admina") {
        alert("You have successfully logged in as admina.");
        location.reload();
    } else if (username === "normalo" && password === "normalo") {
        alert("You have successfully logged in as normalo.");
        location.reload();
    }else {
        loginErrorMsg.style.opacity = 1;
    }
})