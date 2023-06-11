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
let indexOfSelectedLocation;
let locationList = [];
let markerList = [];
let map;
let nameInputString = "";
let streetInputString = "";
let postalCodeInputString = "";
let infowindow;
let inputValues = [];
let queryParamValue = "";
let responseType = "json";
let url;
let setMarkerIsReady = false;

const API_KEY = "AIzaSyDxEI-CLi55TJFKgdMfxSRRVrr1i4NrgCQ";

//hard-coded locations
let locationOne = new Location("Wilhelminenhofstraße", "Fahrradweg geh nur in eine Richtung und bricht abrupt ab", "Wilhelminenhofstraße 76", 12459, "Berlin", "Schöneweide", 52.457776, 13.527499);
let locationTwo = new Location("Goethestraße", "Backsteinpflaster und Autos die auf beiden Seiten parken behindern Fahrradmobilität",
    "Goethestraße 55", 12459, "Berlin", "Schöneweide", 52.462778, 13.516392);
let locationThree = new Location("Herzbergstraße", "Auf der Herzbergstraße teilen sich Radfahrende, Autos und die Tram den begrenzten Raum. Weil der Straßenrand als Parkfläche genutzt wird, fahren Radfahrende bislang zwischen parkenden Autos und den Schienen, was Unfallgefahren birgt und zudem den Tramverkehr ausbremst.",
    "Herzbergstraße 126", 10365, "Berlin", "Lichtenberg", 52.526482, 13.493836);
locationList.push(locationOne, locationTwo, locationThree);

function Location(name, description, street, postalCode, city, district, lat, long) {
    this.name = name;
    this.description = description;
    this.street = street;
    this.postalCode = postalCode;
    this.city = city;
    this.district = district;
    this.lat = lat;
    this.long = long;
    // this.marker = marker;
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

locationSelect.addEventListener("change", (e) => {
    getIndexOfSelectedLocation();
    locationSelect.options[indexOfSelectedLocation].selected = false;
    changeDetailsScreen(getIndexOfSelectedLocation());

    loadDetailsScreen(currentUser);
})

//add-screen
addScreenCancelButton.addEventListener("click", (e) => {
    loadMainScreen(currentUser);

    addForm.reset();
})

addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    locationCanBeCreated = true;

    convertInputToMarker();

    addForm.reset();
})

const createAndAddNewElementToList = () => {
    let newSelectOption = document.createElement("option");
    newSelectOption.innerHTML = addForm.name.value;

    locationSelect.appendChild(newSelectOption);
}

const setNewLocation = (name, description, street, postalCode, city, district, lat, long) => {
    let newLocation = new Location(name, description, street, postalCode, city, district, lat, long);

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
    locationSelect.removeChild(locationSelect.children[indexOfSelectedLocation]);
    locationList.splice(indexOfSelectedLocation, 1);
    console.log("length map: " + markerList.length)

    markerList[indexOfSelectedLocation].setMap(null);
    markerList.splice(indexOfSelectedLocation, 1);

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
    // locationList[locationIndex].marker.setPosition(updatedLocationMarkerCoords);
    marker[locationIndex].marker.setPosition(updatedLocationMarkerCoords);
}

function changeDetailsScreen(locationIndex) {
    console.log(locationIndex);
    updateForm.name.value = locationList[locationIndex].name;
    updateForm.description.value = locationList[locationIndex].description;
    updateForm.street.value = locationList[locationIndex].street;
    updateForm.postalCode.value = locationList[locationIndex].postalCode;
    updateForm.city.value = locationList[locationIndex].city;
    updateForm.district.value = locationList[locationIndex].district;
    updateForm.latitude.value = locationList[locationIndex].lat;
    updateForm.longitude.value = locationList[locationIndex].long;
}

function findIndexOfSelectedLocation() {
    let selectedLocation = locationSelect.options.selectedIndex;

    for (let i = 0; i < locationList.length; i++) {
        if (i == selectedLocation) {
            indexOfSelectedLocation = i;
        }
    }

}

const getIndexOfSelectedLocation = () => {
    findIndexOfSelectedLocation();
    return indexOfSelectedLocation;
}

const makeGetRequest = (url) => {
    return fetch(url).then((response) => response.json());
}

const inputHasCoordinatesAndIsANumber = () => {
    return (latitudeInput.value != "" && !isNaN(latitudeInput.value)) && (longitudeInput.value != "" && !isNaN(longitudeInput.value));
}

const inputHasAddress = () => {
    return streetInput.value != ""
        && postalCodeInput != ""
        && cityInput != "";
}

let locationCanBeCreated;

const convertInputToMarker = () => {
    let positionProperties = {
        lat: Number(""),
        lng: Number("")
    };

    let addressProperties = {
        street: "",
        postalCode: "",
        city: "",
        district: ""
    };

    let serviceType = "";


    /* 4 Fälle
    1. Weder adresse, noch koordinaten angegeben
    2. Nur koordinaten angegeben
    3. Nur adresse angegeben
    4. Adresse und koordinten angegeben   //brauch man nicht, weil wenn 
                                            Fall 2 eintritt, dann werden die Koordinaten so oder so bevorzugt
    */

    if (!inputHasAddress() && !inputHasCoordinatesAndIsANumber()) {
        alert("Please insert a valid address or valid coordinates.")
    }
    else if (inputHasCoordinatesAndIsANumber()) {
        setServiceType("CoordinatesToAddress");
        createNewLocationSetUp();

        makeGetRequest(url).then((result) => {
            createNewLocationWhenInputCoordinatesIsValid(addressProperties, result);
        })
        createAndAddNewElementToList();

        loadMainScreen(currentUser);
    }
    else if (inputHasAddress()) {
        setServiceType("AddressToCoordinates");
        createNewLocationSetUp();

        makeGetRequest(url).then((result) => {
            if (inputHasInvalidAddress(result)) {
                alert("This is not a valid address.\n"
                    + "Please enter a valid address or valid coordinates.");
            }
            else {
                createNewLocationWhenInputAddressIsValid(positionProperties, result);
            }
        }).catch((error) => alert("The request you have send is invalid. Please try again."));

        createAndAddNewElementToList();

        loadMainScreen(currentUser);
    }

}

const setServiceType = (serviceType) => {
    if (serviceType == "AddressToCoordinates" || serviceType == "CoordinatesToAddress") {
        this.serviceType = serviceType;
    } else {
        console.log("Invalid service type. Please only use 'AddressToCoordinates' or 'CoordinatesToAddress' as service type.");
    }
}

const createNewLocationSetUp = () => {
    setInputValues();
    prepareNameAndStreetForInfoWindow();
    prepareQueryParamValueForUrl();
    setUrl(responseType, queryParamValue, API_KEY, serviceType);
}

const prepareNameAndStreetForInfoWindow = () => {
    nameInputString = nameInput.value;
    streetInputString = streetInput.value;
}

const prepareQueryParamValueForUrl = () => {
    if (serviceType == "AddressToCoordinates") {
        queryParamValue = streetInput.value + ", "
            + postalCodeInput.value + ", "
            + cityInput.value;
    } else if (serviceType == "CoordinatesToAddress") {
        queryParamValue = latitudeInput.value + ", "
            + longitudeInput.value;
    }
}

const setUrl = (responseType, queryParamValue, apiKey, serviceType) => {
    if (serviceType == "AddressToCoordinates") {
        url = "https://maps.googleapis.com/maps/api/geocode/"
            + responseType
            + "?address=" + queryParamValue
            + "&key=" + apiKey;
    } else if (serviceType == "CoordinatesToAddress") {
        url = "https://maps.googleapis.com/maps/api/geocode/"
            + responseType
            + "?latlng=" + queryParamValue
            + "&key=" + apiKey;
    }
}
const inputHasInvalidAddress = (result) => {
    result.results[0].address_components.length <= 4;
}

const setInputValues = () => {
    inputValues = [nameInput.value, descriptionInput.value, streetInput.value, postalCodeInput.value,
    cityInput.value, districtInput.value, latitudeInput.value, longitudeInput.value];
}

const createNewLocationWhenInputAddressIsValid = (positionProperties, result) => {
    setLocationCoordinates(positionProperties, result);
    setMarkerIsReady = true;
    addMarker(positionProperties);
    console.log(result);

    if (locationCanBeCreated) {
        setNewLocation(inputValues[0], inputValues[1], inputValues[2], inputValues[3], inputValues[4], inputValues[5], positionProperties.lat, positionProperties.lng);
        locationCanBeCreated = false;
    }
}

const createNewLocationWhenInputCoordinatesIsValid = (addressProperties, result) => {
    setLocationAddress(addressProperties, result);
    setMarkerIsReady = true;
    addMarker(new google.maps.LatLng(inputValues[6], inputValues[7]));
    console.log(result);

    if (locationCanBeCreated) {
        setNewLocation(inputValues[0], inputValues[1], addressProperties.street, addressProperties.postalCode, addressProperties.city, addressProperties.district, inputValues[6], inputValues[7]);
        locationCanBeCreated = false;
    }
}

const setLocationAddress = (addressProperties, data) => {
    if (addressProperties.postalCode = data.results[0].address_components.length > 7) {
        addressProperties.street = data.results[0].address_components[1].long_name + " "
            + data.results[0].address_components[0].long_name;

        addressProperties.postalCode = data.results[0].address_components[7].long_name;
        addressProperties.city = data.results[0].address_components[3].long_name;
        addressProperties.district = data.results[0].address_components[2].long_name;
    } else {
        alert("Those coordinates only provide very limited details about this location. Please enter appropriate coordinates for a better result.");
        addressProperties.street = "unknown";
        addressProperties.postalCode = "unknown";
        addressProperties.city = "unknown";
        addressProperties.district = "unknown";
    }
}

const setLocationCoordinates = (positionProperties, data) => {
    positionProperties.lat = data.results[0].geometry.location.lat;
    positionProperties.lng = data.results[0].geometry.location.lng;
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
    // locationOne.marker = addMarker(locationOneMarkerCoords);
    addMarker(locationOneMarkerCoords);
    nameInputString = locationTwo.name;
    streetInputString = locationTwo.street;
    postalCodeInputString = locationTwo.postalCode;
    // locationTwo.marker = addMarker(locationTwoMarkerCoords);
    addMarker(locationTwoMarkerCoords);
    nameInputString = locationThree.name;
    streetInputString = locationThree.street;
    postalCodeInputString = locationThree.postalCode;
    // locationThree.marker = addMarker(locationThreeMarkerCoords);
    addMarker(locationThreeMarkerCoords);
}

// Function for adding a marker to the page.
function addMarker(location) {
    let marker = new google.maps.Marker({
        position: location,
        map: map,
        title: nameInputString
    });
    
    setMarker(marker);
    console.log("marker lnegth: " + markerList.length);
    
    const contentString = `<h1>`
        + nameInputString
        + `</h1><p style= "font-size: 20px;" >Is located at: <b>`
        + streetInputString + ", "
        + postalCodeInputString
        + `</b></p>`;

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: nameInputString
    });

    marker.addListener("click", () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });

}

const setMarker = (marker) => {
    console.log("SET MARKER!!!");
    markerList.push(marker);
}

window.initMap = initMap;
