// Development only axios helpers!
// import axios from "axios";
// window.axios = axios;

// Using Geocode api
function getPostCode(results) {
  results &&
    results.forEach(result => {
      const postalCode = result.address_components.find(component =>
        component.types.includes("postal_code")
      );
      console.log("postalCode : ", postalCode.long_name);
    });
}

if (navigator.geolocation) {
  const apiKey = "AIzaSyANnHw1ovBfQ1yC4R_ZMsvIq6-v_ARs96s";
  navigator.geolocation.getCurrentPosition(function(position) {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`
    )
      .then(res => res.json())
      .then(response => {
        console.log(response);
        getPostCode(response.results);
      });
  });
}

// PostalPinCode
// fetch("https://api.postalpincode.in/pincode/110017")
//   .then(res => res.json())
//   .then(data => {
//     if (data && data[0] && data[0].PostOffice) {
//       const state = data[0].PostOffice[0].State;
//       const country = data[0].PostOffice[0].Country;
//       const pinCode = data[0].PostOffice[0].Pincode;
//     }
//   });
