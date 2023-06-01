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
const streetInput = document.getElementById("street");
const postalCodeInput = document.getElementById("postal-code");
const cityInput = document.getElementById("city");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const nameInput = document.getElementById("name");
const districtInput = document.getElementById("district");
const descriptionInput = document.getElementById("description");

const detailsScreen = document.getElementById("details-screen");
const updateForm = document.getElementById("update-form");
const updateButton = document.getElementById("update-button");
const deleteButton = document.getElementById("delete-button");
const detailsScreenCancelButton = document.getElementById("details-screen-cancel-button");

let currentUser;
let currentLocationIndex;
let locationList = [];
let map;
let nameInputString = "";
let streetInputString = "";
let postalCodeInputString = "";

//hard-coded locations
let locationOne = new Location("Wilhelminenhofstraße", "Fahrradweg geh nur in eine Richtung und bricht abrupt ab", "Wilhelminenhofstraße 76", 12459, "Berlin", "Schöneweide", 52.457776, 13.527499);
let locationTwo = new Location("Goethestraße", "Backsteinpflaster und Autos die auf beiden Seiten parken behindern Fahrradmobilität",
"Goethestraße 55", 12459, "Berlin", "Schöneweide", 52.462778, 13.516392);
let locationThree = new Location("Herzbergstraße", "Auf der Herzbergstraße teilen sich Radfahrende, Autos und die Tram den begrenzten Raum. Weil der Straßenrand als Parkfläche genutzt wird, fahren Radfahrende bislang zwischen parkenden Autos und den Schienen, was Unfallgefahren birgt und zudem den Tramverkehr ausbremst.",
 "Herzbergstraße 126", 10365, "Berlin", "Lichtenberg", 52.526482, 13.493836);
locationList.push(locationOne, locationTwo, locationThree);

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

//login-screen
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "admina" && password === "admina") {
        currentUser = "admina";
        loadMainScreen(currentUser);
        loginForm.reset();
    } else if (username === "normalo" && password === "normalo") {
        currentUser = "normalo";
        loadMainScreen(currentUser);
        loginForm.reset();
    } else {
        loginErrorMsg.style.opacity = 1;
        loginForm.reset();
    }
})

//main-screen
logoutButton.addEventListener("click", (e) => {
    currentUser = undefined;
    loadLoginScreen();
})

addButton.addEventListener("click", (e) => {
    loadAddScreen();
})

locationSelect.addEventListener("change", (e) =>{
    let selectedLocation = locationSelect.options.selectedIndex;

    locationSelect.options[locationSelect.selectedIndex].selected = false;

    currentLocationIndex = findLocationInList(selectedLocation);

    changeDetailsScreen(currentLocationIndex);

    loadDetailsScreen(currentUser);
})

//add-screen
addScreenCancelButton.addEventListener("click", (e) => {
    loadMainScreen(currentUser);

    addForm.reset();
})

//Timos Add-button für Map-Pins
addButtonSubmit.addEventListener("click", (e) => {
    convertInputToMarker();
})

addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // let newLocation =  new Location(addForm.name.value, addForm.description.value, addForm.street.value, addForm.postalCode.value,
    //                 addForm.city.value, addForm.district.value, addForm.latitude.value, addForm.longitude.value);
    // locationList.push(newLocation);

    locationCanBeCreated = true;
    
    let newSelectOption = document.createElement("option");
    newSelectOption.innerHTML = addForm.name.value;

    locationSelect.appendChild(newSelectOption);

    loadMainScreen(currentUser);
    addForm.reset();
})

const setNewLocation = (name, description, street, postalCode, city, district, lat, long) => {
    let newLocation = new Location(name, description, street, postalCode, city, district, lat, long);
    console.log("WOW: " + newLocation.name);
    console.log("LOL XD: " + newLocation.lat);
    locationList.push(newLocation);
}

//details-screen
updateButton.addEventListener("click", (e) => {
    e.preventDefault();

    changeLocation(currentLocationIndex);

    loadMainScreen(currentUser);

    updateForm.reset();
})

deleteButton.addEventListener("click", (e) => {
    console.log(locationList[currentLocationIndex].marker);
    locationSelect.removeChild(locationSelect.children[currentLocationIndex]);
    locationList[currentLocationIndex].marker.setMap(null);
    locationList[currentLocationIndex].marker = [];
    locationList.splice(currentLocationIndex, 1);

    loadMainScreen(currentUser);
})

detailsScreenCancelButton.addEventListener("click", (e) => {
    loadMainScreen(currentUser);
})

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
    if (currentUser == "admina") {
        addButton.style.display = "inline";
    }
    else if (currentUser == "normalo") {
        addButton.style.display = "none";
    }
}

function loadAddScreen() {
    loginScreen.style.display = "none";
    mainScreen.style.display = "none";
    detailsScreen.style.display = "none";
    addScreen.style.display = "block";
}

function loadDetailsScreen(currentUser) {
    loginScreen.style.display = "none";
    mainScreen.style.display = "none";
    detailsScreen.style.display = "block";
    addScreen.style.display = "none";
    if (currentUser == "admina") {
        updateButton.style.display = "inline";
        deleteButton.style.display = "inline";
    }
    else if (currentUser == "normalo") {
        updateButton.style.display = "none";
        deleteButton.style.display = "none";
        for (let i = 0; i < updateForm.length; i++) {
            updateForm.elements[i].readOnly = true;
        }
    }
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
    let updatedLocationMarkerCoords = new google.maps.LatLng(updateForm.latitude.value, updateForm.longitude.value);
    locationList[locationIndex].marker.setPosition(updatedLocationMarkerCoords);
}

function changeDetailsScreen(locationIndex) {
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
        if(i == selectedLocation) {
            selectedLocationIndex = i;
        }
    }

    return selectedLocationIndex;
}

// response = fetch(url).then(function (response) {
//     return response.json();
// }).then(function (data) {
//     console.log(data);
// }).catch(function (err) {
//     console.log('Fetch Error :-S', err);
// });

const makeGetRequest = (url) => {
    return fetch(url).then((response) => response.json());
}

const inputHasCoordinatesAndIsANumber = () => {
    return (latitudeInput.value != "" && !isNaN(latitudeInput.value)) && (longitudeInput.value != "" && !isNaN(longitudeInput.value));
}

const convertInputToMarker = () => {
    let location = {
        lat: Number(""),
        lng: Number("")
    };

    let address = "";
    let responseType = "json";

    const API_KEY = "AIzaSyDxEI-CLi55TJFKgdMfxSRRVrr1i4NrgCQ";

    if (inputHasCoordinatesAndIsANumber()) {
        nameInputString = nameInput.value;
        location.lat = Number(latitudeInput.value);
        location.lng = Number(longitudeInput.value);
        //wasSuccess = 1;
        locationList[locationList.length-1].marker = addMarker(location);
        return Promise.resolve("Location Added");
    } else {
        nameInputString = nameInput.value;
        streetInputString = streetInput.value;
        address = streetInput.value + ", "
            + postalCodeInput.value + ", "
            + cityInput.value;

        const url = "https://maps.googleapis.com/maps/api/geocode/"
            + responseType
            + "?address=" + address
            + "&key=" + API_KEY;

        makeGetRequest(url).then((result) => {
            if(result.results[0].address_components.length <= 4) {
                alert("Please enter a valid address or valid coordinates.");
            }
            else {
                location.lat = result.results[0].geometry.location.lat;
                location.lng = result.results[0].geometry.location.lng;
                locationList[locationList.length-1].marker = addMarker(location);

                if (locationCanBeCreated) {
                    setNewLocation(addForm.name.value, addForm.description.value, addForm.street.value, addForm.postalCode.value,
                        addForm.city.value, addForm.district.value, location.lat, location.lng);
                        locationCanBeCreated = false;
                }
            }
        }).catch((error) => alert("Address entered is not a real location"));
    }
}

// google-maps
// Initialize and add the map
function initMap() {
    // The coordinates of Berlin
    const berlin = { lat: 52.531677, lng: 13.381777 };

    const locationOneMarkerCoords = { lat: 52.457776, lng: 13.527499 };
    const locationTwoMarkerCoords = { lat: 52.462778, lng: 13.516392 };
    const locationThreeMarkerCoords = { lat: 52.526482, lng: 13.493836 };

    // The map, centered around Berlin
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: berlin
    });

    nameInputString = locationOne.name;
    streetInputString = locationOne.street;
    postalCodeInputString = locationOne.postalCode;
    locationOne.marker = addMarker(locationOneMarkerCoords);
    nameInputString = locationTwo.name;
    streetInputString = locationTwo.street;
    postalCodeInputString = locationTwo.postalCode;
    locationTwo.marker = addMarker(locationTwoMarkerCoords);
    nameInputString = locationThree.name;
    streetInputString = locationThree.street;
    postalCodeInputString = locationThree.postalCode;
    locationThree.marker = addMarker(locationThreeMarkerCoords);
}

// Function for adding a marker to the page.
function addMarker(location) {
    let marker = new google.maps.Marker({
        position: location,
        map: map,
        title: nameInputString
    });
    const contentString = `<h1>`
    + nameInputString 
    + `</h1><p style= "font-size: 25px;" >Is located at: <b>` 
    + streetInputString + ", "
    + postalCodeInputString
    + `</b></p>`;
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: nameInputString + "LOOOOOOOL"
    });
  
    marker.addListener("click", () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });

    return marker;
}

window.initMap = initMap;
