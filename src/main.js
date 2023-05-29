const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginErrorMsg = document.getElementById("login-error-msg");

const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const locationSelect = document.getElementById("locations-select");
const addButton = document.getElementById("main-screen-add-button");
const logoutButton = document.getElementById("logout-button");

const addScreen = document.getElementById("add-screen");
const addForm = document.getElementById("add-form");
const addButtonSubmit = document.getElementById("add-screen-add-button");
const addScreenCancelButton = document.getElementById("add-screen-cancel-button");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

const detailsScreen = document.getElementById("update-delete-screen");
const updateForm = document.getElementById("update-form");
const updateButton = document.getElementById("update-button");
const deleteButton = document.getElementById("delete-button");
const detailsScreenCancelButton = document.getElementById("details-screen-cancel-button");

function Location(name, description, street, postalCode, city, district, lat, long, marker) {
    this.name = name;
    this.description = description;
    this.street = street;
    this.postalCode = postalCode;
    this.city = city;
    this.district = district;
    this.lat = lat;
    this.long = long;
    this.marker = marker;
}

let currentUser;
let currentLocationIndex;

let locationOne = new Location("Friedrichshain-Kreuzberg", "desatstat", "staswuek", 12345, "Berlin", "sdtr", 12, 32);
let locationTwo = new Location("Neukölln", "desatstat", "staswuek", 12345, "Berlin", "sdtr", 12, 32);
let locationThree = new Location("Lichtenberg", "desatstat", "staswuek", 12345, "Berlin", "sdtr", 12, 32);

let locationList = [];
locationList.push(locationOne, locationTwo, locationThree);

//login-screen
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "admina" && password === "admina") {
        // location.reload();
        currentUser = "admina";
        loadMainScreen(currentUser);

        loginForm.reset();
        //alert("You have successfully logged in as admina.");
    } else if (username === "normalo" && password === "normalo") {
        // location.reload();
        currentUser = "normalo";
        loadMainScreen(currentUser);

        loginForm.reset();
        //alert("You have successfully logged in as normalo.");
    } else {
        // const berlin2 = { lat: 50.531677, lng: 15.381777 };

        // const marker3 = new google.maps.Marker({
        //     position: berlin2,
        //     map: map,
        // });
        loginErrorMsg.style.opacity = 1;
        loginForm.reset();


        // loginErrorMsg.style.display = "block";
        // loginErrorMsg.style.visibility = "visible";
    }
})

//main-screen
logoutButton.addEventListener("click", (e) => {
    currentUser = undefined;
    loadLoginScreen();
    //alert("Logged out successfully.");
})

addButton.addEventListener("click", (e) => {
    loadAddScreen();
})

locationSelect.addEventListener("change", (e) =>{
    let selectedLocation = locationSelect.options[locationSelect.selectedIndex].value;
    locationSelect.options[locationSelect.selectedIndex].selected = false;

    currentLocationIndex = findLocationInList(selectedLocation);

    changeUpdateForm(currentLocationIndex);

    loadDetailsScreen(currentUser);
 })

//add-screen
addScreenCancelButton.addEventListener("click", (e) => {
    loadMainScreen(currentUser);
})

addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let latLng = new google.maps.LatLng(addForm.latitude.value, addForm.longitude.value);

    let newLocation =  new Location(addForm.name.value, addForm.description.value, addForm.street.value, addForm.postalCode.value,
                    addForm.city.value, addForm.district.value, addForm.latitude.value, addForm.longitude.value, addMarker(latLng));
    locationList.push(newLocation);

    let newSelectOption = document.createElement("option");
    newSelectOption.innerHTML= addForm.name.value;

    locationSelect.appendChild(newSelectOption);

    loadMainScreen(currentUser);

    addForm.reset();
})

//update/delete-screen
updateButton.addEventListener("click", (e) =>{
    e.preventDefault();

    changeLocation(currentLocationIndex);

    loadMainScreen(currentUser);

    updateForm.reset();
})

deleteButton.addEventListener("click", (e) => {
    locationSelect.removeChild(locationSelect.children[currentLocationIndex]);
    locationList[currentLocationIndex].marker.setMap(null);
    locationList.splice(currentLocationIndex, 1);

    loadMainScreen(currentUser);
})

detailsScreenCancelButton.addEventListener("click", (e) =>{
    loadMainScreen(currentUser);
})

//Timos Add-button für Map-Pins
// addButtonSubmit.addEventListener("click", (e) => {
//     console.log("add button clicked");
//     TestMarker();

//     const url = "https://maps.googleapis.com/maps/api/geocode/json?address=berlin&key=AIzaSyDxEI-CLi55TJFKgdMfxSRRVrr1i4NrgCQ";

//     fetch(url).then(function(response) {
//         return response.json();
//       }).then(function(data) {
//         console.log(data);
//       }).catch(function(err) {
//         console.log('Fetch Error :-S', err);
//       });
    

// })

//functions
function loadLoginScreen() {
    loginScreen.style.display = "block";
    mainScreen.style.display = "none";
    detailsScreen.style.display = "none";
    addScreen.style.display = "none";
}

function loadMainScreen(currentUser) {
    loginScreen.style.display = "none";
    mainScreen.style.display = "block";
    detailsScreen.style.display = "none";
    addScreen.style.display = "none";
    document.getElementById("welcome").textContent = "Welcome " + currentUser + ".";
    if(currentUser == "admina") {
        addButton.style.display = "inline";
    }
    else if(currentUser == "normalo") {
        addButton.style.display = "none";
    }
}

function loadDetailsScreen(currentUser) {
    loginScreen.style.display = "none";
    mainScreen.style.display = "none";
    detailsScreen.style.display = "block";
    addScreen.style.display = "none";
    if(currentUser == "admina") {
        updateButton.style.display = "inline";
        deleteButton.style.display = "inline";
    }
    else if(currentUser == "normalo") {
        updateButton.style.display = "none";
        deleteButton.style.display = "none";
        for(let i = 0; i < updateForm.length; i++) {
            updateForm.elements[i].readOnly = true;
        }
    }
}

function loadAddScreen() {
    loginScreen.style.display = "none";
    mainScreen.style.display = "none";
    detailsScreen.style.display = "none";
    addScreen.style.display = "block";
}

function changeLocation(locationIndex) {
    locationList[locationIndex].name = updateForm.name.value;
    locationList[locationIndex].description = updateForm.description.value;
    locationList[locationIndex].street = updateForm.street.value;
    locationList[locationIndex].postalCode = updateForm.postalCode.value;
    locationList[locationIndex].city = updateForm.city.value;
    locationList[locationIndex].district = updateForm.district.value;
    locationList[locationIndex].lat = updateForm.latitude.value;
    locationList[locationIndex].long = updateForm.longitude.value;
    let latLng = new google.maps.LatLng(updateForm.latitude.value, updateForm.longitude.value);
    locationList[locationIndex].marker.setPosition(latLng);
}

function changeUpdateForm(locationIndex) {
    updateForm.name.value = locationList[locationIndex].name;
    updateForm.description.value = locationList[locationIndex].description;
    updateForm.street.value = locationList[locationIndex].street;
    updateForm.postalCode.value = locationList[locationIndex].postalCode;
    updateForm.city.value = locationList[locationIndex].city;
    updateForm.district.value = locationList[locationIndex].district;
    updateForm.latitude.value = locationList[locationIndex].lat;
    updateForm.longitude.value = locationList[locationIndex].long;
}

function findLocationInList(selectedLocation) {
    let selectedLocationIndex;

    for(let i = 0; i < locationList.length; i++){
        if(locationList[i].name == selectedLocation) {
            selectedLocationIndex = i;
        }
    }
    return selectedLocationIndex;
}

// google-maps
let map;
// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat: 52.531677, lng: 13.381777 };
    const berlin = { lat: 51.531677, lng: 14.381777 };

    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
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

// Function for adding a marker to the page.
function addMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map
    });

    return marker;
}

function TestMarker() {
    // CentralPark = new google.maps.LatLng(50.7699298, 15.4469157);
    CentralPark = {lat: + latitudeInput.value, lng: + longitudeInput.value};
    addMarker(CentralPark);
}

window.initMap = initMap;
