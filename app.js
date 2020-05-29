import { jsonURL, surveyID, assessmentUrl } from "./private.js";

//STATIC URLS
//HTML SECTION SELECTORS
const list_div = document.getElementById("list");
const item = document.querySelector("button_popup");
const button_popup = document.querySelector(".button_popup");
let stop_search = document.getElementById("search").value;
const init = document.getElementById("init-search");
const stopButton = document.getElementById("main");
let searchData;

// JAVASCRIPT VARIABLES
let stops, filtered_stops;
let filtered = false;
let assessments = {
    failed: [],
    approved: [],
    pending: [],
};
let failedList = [];

//POLYFILLS
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

const get_survey_data = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  let data = json.features;
  stops = data;
  return data;
};

const clear_data = async () => {
  list_div.innerHTML = "";
  document.getElementById("search").value = "";
  return;
};

const setStatus = (stop) => {
    if (assessments['failed'].includes(String(stop.properties.STP_ID))) {
        return 'red';
    } else if (assessments['approved'].includes(String(stop.properties.STP_ID))) {
        return 'green';
    } else if (assessments['pending'].includes(String(stop.properties.STP_ID))) {
        return 'yellow';
    } else {
        return 'blue'
    }
}

const render = async function(d){
  // SORTED DATA BY stop NUMBER
    const sorted_data = await d.sort(function (a, b) {
        if (a.properties.STP_ID < b.properties.STP_ID) {
        return -1;
        }
        if (b.properties.STP_ID < a.properties.STP_ID) {
        return 1;
        }
        return 0;
    });

    list_div.innerHTML = "";

    console.log(sorted_data);

    await sorted_data.forEach((element) => {
        console.log('here');
        list_div.innerHTML +=
            `<div id='${element.properties.STP_ID}' class='button_popup fl w-100 '>
                <a 
                    data-stopID = '${element.properties.STP_ID}'
                    data-onSt = '${element.properties.ON_ST}'
                    data-atSt = '${element.properties.AT_ST}'
                    data-stopName = '${element.properties.STP_NAME}'
                    data-installInfo = '${element.properties.LocChange}'
                    data-routes = '${element.properties.ROUTES}'
                    data-tParkPoles ='${element.properties.TParkPoles}'
                    data-tParkSigns = '${element.properties.TNPSigns}'
                    data-busStopPole = '${element.properties.TStopPoles}'
                    data-instPos = '${element.properties.InstPos}'
                    data-stdInstLoc = '${element.properties.StdInLoc}'
                    data-parkSignRear = '${element.properties.NPSign1}'
                    data-parkSignNSFront = '${element.properties.NPSign2}'
                    data-parkSignMBFront = '${element.properties.NPSign3}'
                    data-parkSignFarside = '${element.properties.NPSign4}'
                    data-gpsLat = '${element.geometry.coordinates[0]}'
                    data-gpsLon = '${element.geometry.coordinates[1]}'
                class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-${setStatus(element)}'>
                <ul>
                    <li class='f3 helvetica'><b>Stop ID:</b> ${element.properties.STP_ID}
                    </li>
                    <li class='f3 helvetica'><b>Stop Name:</b> ${element.properties.STP_NAME}
                    </li>    
                </ul>
                    </a>
            </div>`;
    });
};

const searching = (stop_search) => {
  list_div.innerHTML = "Data is loading...";
  get_survey_data(stop_search).then((data) => {
    render(data);
    console.log(data);
    searchData = data;
  });
};

const getAssessments = (url) => {
    get_survey_data(url).then((data) => { 
        console.log(data);
        data.forEach(el => {
            if (el.attributes.approved == "no" || el.attributes.approvalComments != null){
                document.getElementById('notification-icon').src = 'assets/notification2.svg';
                assessments['failed'].push(el.attributes.stopID);
            } else if (el.attributes.approved == "yes" ) {
                assessments['approved'].push(el.attributes.stopID);
            } else if (el.attributes.approved == null) {
                assessments['pending'].push(el.attributes.stopID);
            }
        })
    });
};

const getIssues = async () => {
    list_div.innerHTML = "Data is loading...";
    const whatever = async () => {
        let list = [];
        assessments['failed'].forEach(async item => {
            await get_survey_data(await jsonURL(item))
                .then(data => {
                    list.push(data[0]);
                })
        })
        return await list;
    };
    whatever().then(async data => {
        console.log(data);      
        let div = '';
        setTimeout(async() => {
            await data.forEach(async(element) => {
                console.log('here');
                list_div.innerHTML = ''
                list_div.innerHTML +=
                    `<div id='${element.properties.STP_ID}' class='button_popup fl w-100 '>
                        <a 
                            data-stopID = '${element.properties.STP_ID}'
                            data-onSt = '${element.properties.ON_ST}'
                            data-atSt = '${element.properties.AT_ST}'
                            data-stopName = '${element.properties.STP_NAME}'
                            data-installInfo = '${element.properties.LocChange}'
                            data-routes = '${element.properties.ROUTES}'
                            data-tParkPoles ='${element.properties.TParkPoles}'
                            data-tParkSigns = '${element.properties.TNPSigns}'
                            data-busStopPole = '${element.properties.TStopPoles}'
                            data-instPos = '${element.properties.InstPos}'
                            data-stdInstLoc = '${element.properties.StdInLoc}'
                            data-parkSignRear = '${element.properties.NPSign1}'
                            data-parkSignNSFront = '${element.properties.NPSign2}'
                            data-parkSignMBFront = '${element.properties.NPSign3}'
                            data-parkSignFarside = '${element.properties.NPSign4}'
                            data-gpsLat = '${element.geometry.coordinates[0]}'
                            data-gpsLon = '${element.geometry.coordinates[1]}'
                        class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-${setStatus(element)}'>
                        <ul>
                            <li class='f3 helvetica'><b>Stop ID:</b> ${element.properties.STP_ID}
                            </li>
                            <li class='f3 helvetica'><b>Stop Name:</b> ${element.properties.STP_NAME}
                            </li>    
                        </ul>
                            </a>
                    </div>`;
                console.log(div)
                return await div;
            })
            
        }, 3000)
    
    })
};

const clickEvent = async (event) => {
    event.preventDefault();
    const iframe_exists = document.getElementById("ifrm");
    stop_search = document.getElementById("search").value;
    const iframe = event.target.closest("#iframe");
    const search = event.target.closest("#search");
    const notification = event.target.closest('#notification-icon')

  if (event.type == "submit" && !iframe_exists) {
    searching(jsonURL(stop_search));
    return;
  }

  // CLOSE IFRAME / CLICK OFF IFRAME WHEN ITS OPEN
    if (!iframe && iframe_exists) {
        // CLOSE IFRAME
        iframe_exists.parentNode.removeChild(iframe_exists);
        return;

    } else if (notification) {
        getIssues();

    // SEARCH CLICK!!!
    } else if (search) {
        if (stop_search != "") {
        searching(stop_search);
        } else if (stop_search == "" && filtered) {
        render(vehicles);
        return;
        }
        // CLICK LIST ELEMENT AND OPEN IFRAME!!!
    } else if (event.target.closest(".openpop")) {
        let item = event.target.closest(".openpop");
        console.log(item);
        console.log(item.dataset);

    let url = `https://survey123.arcgis.com/share/${surveyID()}?field:stopID=${
      item.dataset.stopid
    }
                    &field:onSt=${item.dataset.onst} 
                    &field:atSt=${item.dataset.atst} 
                    &field:stopName=${item.dataset.stopname} 
                    &field:installInfo=${item.dataset.installinfo} 
                    &field:routes=${item.dataset.routes} 
                    &field:tParkPoles=${item.dataset.tparkpoles} 
                    &field:tParkSigns=${item.dataset.tparksigns} 
                    &field:installSurface=${item.dataset.installsurface}
                    &field:installBusStopPole=${
                      item.dataset.installpole == "0" ? "no" : "yes"
                    }
                    &field:assignedPos=${item.dataset.instpos} 
                    &field:parkSignRear=${item.dataset.parksignrear} 
                    &field:parkSignNSFront=${item.dataset.parksignnsfront} 
                    &field:parkSignMBFront=${item.dataset.parksignmbfront} 
                    &field:parkSignFarside=${item.dataset.parksignfarside} 
                    &field:gpsLat${item.dataset.gpslat}
                    &field:gpsLat${item.dataset.gpslon}`;
    console.log(url);
    const ifrm = document.createElement("iframe");
    const el = document.getElementById("marker");
    const main = document.querySelector("#main");

    ifrm.setAttribute("id", "ifrm"); // assign an id
    ifrm.setAttribute(`src`, url);

    main.parentNode.insertBefore(ifrm, el);
    return;
  }
};

clear_data();
getAssessments('https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/Contractor_Install_Survey_Copy_view/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=pyEcn9_-FVKVC9Ut22I2cXOgJF68ktmpW-ewoGzeoZtPWJhQMJLOhvkqqcSz9xOOxWYi4EoecgofXQTzvL98RGBI8bp4cJ6fFdEr6j8J955LMDRsqZh0TiRD8JoKg-un1i9TcU1aeplJ-172j_C6isiRyj5NKAF06emgS8PelVswBo3ipFRAlL1pu6WJVZ-8APaz5b5x9zMV4Gw3PlRFNeR8hDJiPoD03PF-zCJhGm9bco71698GDAuAQ3fPAU-PEcPSwWa7SB96dH50PAeiUg..');
window.addEventListener("click", clickEvent, false);
window.addEventListener("submit", clickEvent, false);
