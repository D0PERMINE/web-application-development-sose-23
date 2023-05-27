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

const detailsScreen = document.getElementById("location-details");
const updateButton = document.getElementById("update-button");
const deleteButton = document.getElementById("delete-button");
const detailsScreenCancelButton = document.getElementById("details-screen-cancel-button");

let locationOne = {
    name: "Friedrichshain-Kreuzberg"
};

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
        console.log("LOL");
        loginErrorMsg.style.opacity = 1;
        loginForm.reset();

        // loginErrorMsg.style.display = "block";
        // loginErrorMsg.style.visibility = "visible";
    }
})


locationSelect.addEventListener("change", (e) => {
    let selectedLocation = locationSelect.options[locationSelect.selectedIndex].textContent;
    console.log(selectedLocation);
    //detailsScreen.ul.li.textContent.concat(selectedLocation);

    detailsScreen.style.display = "block";
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

addScreenCancelButton.addEventListener("click", (e) => {
    console.log("Cancelled add.");

    addScreen.style.display = "none";
    mainScreen.style.display = "block";
})

// google-maps
// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat: 52.531677, lng: 13.381777 };
    const berlin = { lat: 51.531677, lng: 14.381777 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: uluru
    });

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });

    const marker2 = new google.maps.Marker({
        position: berlin,
        map: map,
    });

}

// window.initMap = initMap;

