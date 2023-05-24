const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginErrorMsg = document.getElementById("login-error-msg");

const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const locationSelect = document.getElementById("locations-select");
const addButton = document.getElementById("main-screen-add-button");
const logoutButton = document.getElementById("logout-button");

const addScreen = document.getElementById("add-screen");
const addButtonSubmit = document.getElementById("add-screen-add-button");
const addScreenCancelButton = document.getElementById("add-screen-cancel-button");

const detailsScreen = document.getElementById("update-delete-screen");
const updateButton = document.getElementById("update-button");
const deleteButton = document.getElementById("delete-button");
const detailsScreenCancelButton = document.getElementById("details-screen-cancel-button");

function Location(name, description, street, postalcode, city, district, lat, long) {
    this.name = name;
    this.description = description;
    this.street = street;
    this.postalcode = postalcode;
    this.city = city;
    this.district = district;
    this.lat = lat;
    this.long = long;
}

let locationOne = new Location("Friedrichshain-Kreuzberg", "desatstat", "staswuek", 12345, "Berlin", "sdtr", 12, 32);
let locationTwo = new Location("Neukölln", "desatstat", "staswuek", 12345, "Berlin", "sdtr", 12, 32);
let locationThree = new Location("Lichtenberg", "desatstat", "staswuek", 12345, "Berlin", "sdtr", 12, 32);

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;


    if (username === "admina" && password === "admina") {
        // location.reload();
        loginScreen.style.display = "none";
        mainScreen.style.display = "block";
        addButton.style.display = "inline";
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
    mainScreen.style.display = "none";
    loginScreen.style.display = "block";

    //alert("Logged out successfully.");
})

addButton.addEventListener("click", (e) => {
    mainScreen.style.display = "none";
    addScreen.style.display = "block";
})

addScreenCancelButton.addEventListener("click", (e) => {
    addScreen.style.display = "none";
    mainScreen.style.display = "block";
})

locationSelect.addEventListener("change", (e) =>{
    let selectedLocation = locationSelect.options[locationSelect.selectedIndex].textContent;
    console.log(selectedLocation);
    //detailsScreen.ul.li.textContent.concat(selectedLocation);

    detailsScreen.style.display = "block";
    mainScreen.style.display = "none";
 })

 detailsScreenCancelButton.addEventListener("click", (e) =>{
    detailsScreen.style.display = "none";
    mainScreen.style.display = "block";
 })
