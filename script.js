const getDataBtn = document.getElementById("getData");
const googleMapContainer = document.querySelector(".google-map-container");
const resultsContainer = document.querySelector(".results-info");
const filterInput = document.getElementById("filter");
const main = document.getElementsByTagName("main")[0];
let iPAddress;
let postOffices;
const token = "ee388a11da41be";
//for getting ip address of client---

window.addEventListener("load", getIpAddress);

function getIpAddress() {
  $.getJSON("https://api.ipify.org?format=json")
    .done(function (data) {
      $("#ip-span").html(data.ip);
      iPAddress = data.ip;
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("Not able to fetch IP Address ", errorThrown);
    });
}

getDataBtn.addEventListener("click", fetchIPInfo);

async function fetchIPInfo() {
  try {
    const response=await fetch(`https://ipinfo.io/${iPAddress}/?token=${token}`);
    const data=await response.json();
    // const data = {
    //   ip: "103.104.181.67",
    //   city: "Kanpur",
    //   region: "Uttar Pradesh",
    //   country: "IN",
    //   loc: "26.4652,80.3498",
    //   org: "AS135212 Digiway Net Pvt Ltd",
    //   postal: "208002",
    //   timezone: "Asia/Kolkata",
    // };
    console.log(data);
    getDataBtn.style.display = "none";
    main.style.display = "block";
    showIPInfo(data);
  } catch (error) {
    console.error("failed to fetch IP related Info ", error);
  }
}

// ---for showing IP info ---
function showIPInfo(data) {
  const { ip, city, region, country, loc, org, postal, timezone } = data;
  const lat = loc.split(",")[0];
  const long = loc.split(",")[1];
  document.querySelector(".forLat span").innerHTML = lat;
  document.querySelector(".forLong span").innerHTML = long;
  document.querySelector(".forCity span").innerHTML = city;
  document.querySelector(".forOrg span").innerHTML = org;
  document.querySelector(".forRegion span").innerHTML = region;
  document.querySelector(".forHostname span").innerHTML = location.hostname;
  showGoogleMap(lat, long);
  showOtherInfo(timezone, postal);
  fetchPostOffices(postal);
}

// -----for google map -----------
function showGoogleMap(lat, long) {
  googleMapContainer.innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed"
width="360"
height="270" 
frameborder="0" 
style="border:0"></iframe> 
`;
}

// -----for otherinfo-------

function showOtherInfo(timezone, postal) {
  let dateTime = new Date().toLocaleString("en-US", { timezone: timezone });
  document.querySelector(".forTimeZone span").innerHTML = timezone;
  document.querySelector(".forDateTime span").innerHTML = dateTime;
  document.querySelector(".forPincode span").innerHTML = postal;
}



// ------for fetching and showing postOffices---------

async function fetchPostOffices(pincode) {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();
    console.log(data, data[0].Message);
    postOffices = data[0].PostOffice;
    document.querySelector(".forMessage span").innerHTML = data[0].Message;

    postOffices.forEach((postOffice) => {
      showPostOffices(postOffice);
    });
  } catch (error) {
    console.error("Not able to fetch post-offices ", error);
  }
}

function showPostOffices(postOffice) {
  resultsContainer.innerHTML += `
  <div class="postOffice-container">
  <p> Name: <span>${postOffice.Name}</span><p>
  <p> Branch Type: <span>${postOffice.BranchType}</span><p>
  <p> Delivery Status: <span>${postOffice.DeliveryStatus}</span><p>
  <p> District: <span>${postOffice.District}</span><p>
  <p> Division: <span>${postOffice.Division}</span><p>   
   </div>
  `;
}


// ---- -for filtering postoffices----------

// for performance optimization we will use debouncing for serach bar--

function filterPostOffices() {
  let inputValue = filterInput.value.trim().toLowerCase();
  console.log(inputValue);
  resultsContainer.innerHTML = "";
  if (inputValue && postOffices) {
    postOffices.forEach((postOffice) => {
      if (
        postOffice.Name.toLowerCase().includes(inputValue) ||
        postOffice.BranchType.toLowerCase().includes(inputValue)
      )
        showPostOffices(postOffice);
    });
  } else {
    postOffices.forEach((postOffice) => {
      showPostOffices(postOffice);
    });
  }
}

const debounceFn = function (callBack, delay) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callBack();
    }, delay);
  };
};

let optimizedFilterFn = debounceFn(filterPostOffices, 300);

filterInput.addEventListener("input", optimizedFilterFn);

