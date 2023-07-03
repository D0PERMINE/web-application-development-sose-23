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

//details-screen
updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    locationCanBeUpdated = true;

    updateLocation();

    // changeLocation(currentLocationIndex);

    // loadMainScreen(currentUser);

    updateForm.reset();
})

deleteButton.addEventListener("click", (e) => {
    locationSelect.removeChild(locationSelect.children[indexOfSelectedLocation]);
    locationList.splice(indexOfSelectedLocation, 1);

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
    //locationList[locationIndex].city = updateForm.city.value;
    locationList[locationIndex].district = updateForm.district.value;
    locationList[locationIndex].lat = updateForm.latitude.value;
    locationList[locationIndex].long = updateForm.longitude.value;
    let updatedLocationMarkerCoords = new google.maps.LatLng(updateForm.latitude.value, updateForm.longitude.value);
    // locationList[locationIndex].marker.setPosition(updatedLocationMarkerCoords);
    marker[locationIndex].marker.setPosition(updatedLocationMarkerCoords);
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

const inputHasCoordinatesAndIsANumberAddForm = () => {
    return (latitudeInput.value != "" && !isNaN(latitudeInput.value)) && (longitudeInput.value != "" && !isNaN(longitudeInput.value));
}

const inputHasAddressAddForm = () => {
    console.log("streetinput: " + updateForm.street.value)
    return streetInput.value != ""
        && postalCodeInput.value != ""
        && cityInput.value != "";
}

const inputHasCoordinatesAndIsANumberUpdateForm = () => {
    return (updateForm.latitude.value != "" && !isNaN(updateForm.latitude.value)) && (updateForm.longitude.value != "" && !isNaN(updateForm.longitude.value));
}

const inputHasAddressUpdateForm = () => {
    console.log("streetinput: " + updateForm.street.value)
    return updateForm.street.value != ""
        && updateForm.postalCode.value != ""
        && updateForm.city.value != "";
}

let locationCanBeCreated;

let locationCanBeUpdated;

const convertInputToMarker = () => {

    let locationProperties = {
        street: "",
        postalCode: "",
        city: "",
        district: "",
        lat: Number(""),
        lng: Number("")
    }

    /* 4 Fälle
    1. Weder adresse, noch koordinaten angegeben
    2. Nur koordinaten angegeben
    3. Nur adresse angegeben
    4. Adresse und koordinten angegeben   //brauch man nicht, weil wenn 
                                            Fall 2 eintritt, dann werden die Koordinaten so oder so bevorzugt
    */

    if (!inputHasAddressAddForm() && !inputHasCoordinatesAndIsANumberAddForm()) {
        alert("Please insert a valid address or valid coordinates.")
    }
    else if (inputHasCoordinatesAndIsANumberAddForm()) {
        setServiceType("CoordinatesToAddress");
        createNewLocationSetUp(locationProperties);

        makeGetRequest(url).then((result) => {
            console.log("LOLLLL added")
            createNewLocationWhenInputCoordinatesIsValid(locationProperties, result);
        })
        createAndAddNewElementToList();

        loadMainScreen(currentUser);
    }
    else if (inputHasAddressAddForm()) {
        setServiceType("AddressToCoordinates");
        createNewLocationSetUp(locationProperties);

        makeGetRequest(url).then((result) => {
            if (inputHasInvalidAddress(result)) {
                alert("This is not a valid address.\n"
                    + "Please enter a valid address or valid coordinates.");
            }
            else {
                console.log("LMAO added")
                createNewLocationWhenInputAddressIsValid(locationProperties, result);
            }
        }).catch((error) => alert("The request you have sent is invalid. Please try again."));

        createAndAddNewElementToList();

        loadMainScreen(currentUser);
    }

}

const updateLocation = () => {

    let locationProperties = {
        street: "",
        postalCode: "",
        city: "",
        district: "",
        lat: Number(""),
        lng: Number("")
    }

    /* 4 Fälle
    1. Weder adresse, noch koordinaten angegeben
    2. Nur koordinaten angegeben
    3. Nur adresse angegeben
    4. Adresse und koordinten angegeben   //brauch man nicht, weil wenn 
                                            Fall 2 eintritt, dann werden die Koordinaten so oder so bevorzugt
    */

    if (!inputHasAddressUpdateForm() && !inputHasCoordinatesAndIsANumberUpdateForm()) {
        alert("Please insert a valid address or valid coordinates.")
    }
    else if (inputHasCoordinatesAndIsANumberUpdateForm()) {
        setServiceType("CoordinatesToAddress");
        createNewLocationSetUp(locationProperties);

        makeGetRequest(url).then((result) => {
            console.log("IM HERE!!");
            createNewLocationWhenInputCoordinatesIsValid(locationProperties, result);
        })
        adjustElementNameInList();

        loadMainScreen(currentUser);
    }
    else if (inputHasAddressUpdateForm()) {
        setServiceType("AddressToCoordinates");
        createNewLocationSetUp(locationProperties);

        makeGetRequest(url).then((result) => {
            if (inputHasInvalidAddress(result)) {
                alert("This is not a valid address.\n"
                    + "Please enter a valid address or valid coordinates.");
            }
            else {
                createNewLocationWhenInputAddressIsValid(locationProperties, result);
            }
        }).catch((error) => alert("The request you have sent is invalid. Please try again."));

        adjustElementNameInList();

        loadMainScreen(currentUser);
    }

}

const createAndAddNewElementToList = () => {
    let newSelectOption = document.createElement("option");
    newSelectOption.innerHTML = addForm.name.value;

    locationSelect.appendChild(newSelectOption);
}

const adjustElementNameInList = () => {
    locationSelect[indexOfSelectedLocation].innerHTML = updateForm.name.value
}

const setNewLocation = (name, description, street, postalCode, city, district, lat, long) => {
    let newLocation = new Location(name, description, street, postalCode, city, district, lat, long);

    locationList.push(newLocation);
}

const updateCurrentLocation = (name, description, street, postalCode, city, district, lat, long) => {
    let newLocation = new Location(name, description, street, postalCode, city, district, lat, long);

    // console.log("name: " + newLocation.name + " street: " + newLocation.street + " postal code: " + newLocation.postalCode + " city: " + newLocation.city + " lat: " + newLocation.lat + " lng: " + newLocation.long)

    locationList[indexOfSelectedLocation] = newLocation;

    // locationList.push(newLocation);
}

const setServiceType = (serviceType) => {
    if (serviceType == "AddressToCoordinates" || serviceType == "CoordinatesToAddress") {
        this.serviceType = serviceType;
    } else {
        console.log("Invalid service type. Please only use 'AddressToCoordinates' or 'CoordinatesToAddress' as service type.");
    }
}

const createNewLocationSetUp = (locationProperties) => {
    setInputValues();
    prepareQueryParamValueForUrl();
    setUrl(responseType, queryParamValue, API_KEY, serviceType);
}

const prepareNameAndStreetForInfoWindow = (locationProperties) => {
    if(locationCanBeCreated) {
        nameInputString = nameInput.value;
    } else if (locationCanBeUpdated) {
        nameInputString = updateForm.name.value;
    }

    streetInputString = locationProperties.street;
    postalCodeInputString = locationProperties.postalCode;
}

const prepareQueryParamValueForUrl = () => {
    if(locationCanBeCreated) {
        if (serviceType == "AddressToCoordinates") {
            queryParamValue = streetInput.value + ", "
                + postalCodeInput.value + ", "
                + cityInput.value;
        } else if (serviceType == "CoordinatesToAddress") {
            queryParamValue = latitudeInput.value + ", "
                + longitudeInput.value;
        }
    } else if (locationCanBeUpdated) {
        if (serviceType == "AddressToCoordinates") {
            queryParamValue = updateForm.street.value + ", "
                + updateForm.postalCode.value + ", "
                + updateForm.city.value;
        } else if (serviceType == "CoordinatesToAddress") {
            queryParamValue = updateForm.latitude.value + ", "
                + updateForm.longitude.value;
        }
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
    if(locationCanBeCreated) {
        inputValues = [nameInput.value, descriptionInput.value, streetInput.value, postalCodeInput.value,
        cityInput.value, districtInput.value, latitudeInput.value, longitudeInput.value];
    } else if (locationCanBeUpdated) {
        inputValues = [updateForm.name.value, updateForm.description.value, updateForm.street.value, updateForm.postalCode.value,
            updateForm.city.value, updateForm.district.value, updateForm.latitude.value, updateForm.longitude.value];

        // console.log("name123: " + updateForm.name.value + " street: " + updateForm.street.value + " postal code: " + updateForm.postalCode.value + " city: " + updateForm.city.value + " lat: " + updateForm.latitude.value + " lng: " + updateForm.longitude.value)
    }
}

const createNewLocationWhenInputAddressIsValid = (locationProperties, result) => {
    setLocationProperties(locationProperties, result);
    prepareNameAndStreetForInfoWindow(locationProperties);
    setMarkerIsReady = true;
    //addMarker(locationProperties);
    console.log(result);
    
    if (locationCanBeCreated) {
        setNewLocation(inputValues[0], inputValues[1], locationProperties.street, locationProperties.postalCode, locationProperties.city, locationProperties.district, locationProperties.lat, locationProperties.lng);
        addMarker(locationProperties);

        locationCanBeCreated = false;
    } else if (locationCanBeUpdated) {
        // deleteMarker();
        updateCurrentLocation(inputValues[0], inputValues[1], locationProperties.street, locationProperties.postalCode, locationProperties.city, locationProperties.district, locationProperties.lat, locationProperties.lng);

        // console.log("loca: " + locationProperties.lat + ", " + locationProperties.lng)
        let latlng = new google.maps.LatLng(locationProperties.lat, locationProperties.lng);
        changeMarkerPosition(markerList[indexOfSelectedLocation], latlng);

        locationCanBeUpdated = false;
    }
}

const createNewLocationWhenInputCoordinatesIsValid = (locationProperties, result) => {
    setLocationProperties(locationProperties, result);
    prepareNameAndStreetForInfoWindow(locationProperties);
    setMarkerIsReady = true;
    addMarker(new google.maps.LatLng(inputValues[6], inputValues[7]));
    console.log(result);

    if (locationCanBeCreated) {
        setNewLocation(inputValues[0], inputValues[1], locationProperties.street, locationProperties.postalCode, locationProperties.city, locationProperties.district, inputValues[6], inputValues[7]);
        locationCanBeCreated = false;
    } else if (locationCanBeUpdated) {
        updateCurrentLocation(inputValues[0], inputValues[1], locationProperties.street, locationProperties.postalCode, locationProperties.city, locationProperties.district, inputValues[6], inputValues[7]);
        locationCanBeUpdated = false;
    }
}

const setLocationProperties = (locationProperties, data) => {
    if (locationProperties.postalCode = data.results[0].address_components.length > 7) {
        locationProperties.street = data.results[0].address_components[1].long_name + " "
            + data.results[0].address_components[0].long_name;

        locationProperties.postalCode = data.results[0].address_components[7].long_name;
        locationProperties.city = data.results[0].address_components[3].long_name;
        locationProperties.district = data.results[0].address_components[2].long_name;
    } else {
        alert("Those coordinates only provide very limited details about this location. Please enter appropriate coordinates for a better result.");
        locationProperties.street = "unknown";
        locationProperties.postalCode = "unknown";
        locationProperties.city = "Berlin";
        locationProperties.district = "unknown";
    }
    locationProperties.lat = data.results[0].geometry.location.lat;
    locationProperties.lng = data.results[0].geometry.location.lng;
}

// const setLocationCoordinates = (locationProperties, data) => {
//     locationProperties.lat = data.results[0].geometry.location.lat;
//     locationProperties.lng = data.results[0].geometry.location.lng;
// }

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

    locationCanBeCreated = true;
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
    locationCanBeCreated = false;
}

// Function for adding a marker to the page.
function addMarker(location) {
    let marker = new google.maps.Marker({
        position: location,
        map: map,
        title: nameInputString
    });
    
    setMarker(marker, location);
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

const setMarker = (marker, location) => {
    if(locationCanBeCreated) {
        console.log("SET MARKER!!!: " + marker);
        markerList.push(marker);
    } 
    // else if (locationCanBeUpdated) {
    //     markerList[indexOfSelectedLocation].setPosition(location);
    // } 
}

const changeMarkerPosition = (marker, location) => {
    // marker.setPosition(location);
    markerList[indexOfSelectedLocation].setPosition(location)
}

const deleteMarker = () => {
    console.log("index marker: " + indexOfSelectedLocation)
    markerList[indexOfSelectedLocation].setMap(null);
    console.log("index marker2: " + indexOfSelectedLocation)
    // markerList.splice(indexOfSelectedLocation, 1);
}

window.initMap = initMap;
