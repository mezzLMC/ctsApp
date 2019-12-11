function doubleCut(list) {
	let l = [];
	list.forEach(function(element) {
		if (l.includes(element)) {
		} else {
			l.push(element);
		}
	});
	return l;
}

function addFav(arg) {
	favoris.push(arg);
	localStorage.setItem("favoris", favoris);
}

//##################################################################################
const token = "14df45e6-40b1-4d94-bce2-0535fcdb1c42";
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://api.cts-strasbourg.eu/v1/siri/2.0/stoppoints-discovery";

let headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");
headers.append("Access-Control-Allow-Origin", "http://localhost");
headers.append("Access-Control-Allow-Credentials", "true");
headers.append("GET", "POST", "OPTIONS");
headers.append("Authorization", "Basic " + btoa(token + ":" + "password"));
let nameCode = {};
let stopnames = [];
let lineNames = [];
let lineRefs = {};
let cts = {
	method: "GET",
	headers: headers,
	mode: "cors"
};

let getStopNames = async function() {
	let data = await fetch(proxyurl+url, cts)
		.then(response => response.json())
		.then(function(response) {
			response.StopPointsDelivery.AnnotatedStopPointRef.forEach(function(
				element
			) {
				stopnames.push(element.StopName);
				nameCode[element.StopName] = element.Extension.LogicalStopCode;
			});
			datalist1 = document.getElementById("stopnames");
			datalist2 = document.getElementById("stopnames2");
			stopnames = doubleCut(stopnames);
			stopnames.forEach(function(element) {
        datalist1.innerHTML = datalist1.innerHTML + '<option value="' +element +'"></option>';
		datalist2.innerHTML = datalist2.innerHTML + '<option value="' +element +'"></option>';

	});
		});
};

let getLineNames = async function() {
	let data = await fetch(proxyurl + "https://api.cts-strasbourg.eu/v1/siri/2.0/lines-discovery", cts)
		.then(response => response.json())
		.then(function(response) {
			response.LinesDelivery.AnnotatedLineRef.forEach(function(element) {
				lineNames.push(element.LineName);
				lineRefs[element.StopName] = element.LineRef;
			});
			datalist = document.getElementById("lineNames");
			lineNames = doubleCut(lineNames);
			lineNames.forEach(function(element) {
        datalist.innerHTML = datalist.innerHTML + '<option value="' +element +'"></option>';
      });
		});
};

let fetchSchedules = async function(arg) {
	let data = await fetch(
		proxyurl + "https://api.cts-strasbourg.eu/v1/siri/2.0/stop-monitoring?MonitoringRef=" + arg +"&MonitoringRef=",cts);
	return data;
};


function SetSchedules(json) {
	var d = new Date();
	let actualTime = new Date();
	let actualSecond =
		actualTime.getHours() * 3600 + actualTime.getMinutes() * 60;
	let array =
		json.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;
	let list = [];
	array.forEach(function(element) {
		let data = element.MonitoredVehicleJourney;
		let ExpectedArrivalTime = data.MonitoredCall.ExpectedArrivalTime.split("T")[1].split("+")[0].split(":");
		let hours = ExpectedArrivalTime[0];
		hours = Number(hours);
		let minutes = ExpectedArrivalTime[1];
		minutes = Number(minutes);
		let seconds = hours * 3600 + minutes * 60;
		let secondDif = seconds - actualSecond;
		minutesRemaining = String(Math.trunc(secondDif / 60)) + "'";
		ExpectedArrivalTime =
			ExpectedArrivalTime[0] + ":" + ExpectedArrivalTime[1];
		list.push(data.LineRef +" - " +data.DestinationName +": " +ExpectedArrivalTime +" - " +minutesRemaining);
	});
	return list;
}

let StopMonitor = async function(arg) {
	let data = await fetchSchedules(arg)
		.then(response => response.json())
		.then(json => SetSchedules(json));
	return data;
};

function getStopPoints(LineRef) {
  let l = []
	data = fetch(proxyurl + "https://api.cts-strasbourg.eu/v1/siri/2.0/estimated-timetable?LineRef=" + LineRef, cts)
		.then(response => response.json())
		.then(json =>json.ServiceDelivery.EstimatedTimetableDelivery[0].EstimatedJourneyVersionFrame[0].EstimatedVehicleJourney[0].EstimatedCalls)
    .then(function(array){
      array.forEach(function(element){
        l.push(element.StopPointName)
      })
      return l
    })
    return data
};



let home = document.getElementById("favBut");
let homeBut = document.getElementById("fav");
let clock = document.getElementById("clock");
let clockBut = document.getElementById("clockBut");
let path = document.getElementById("path");
let pathBut = document.getElementById("pathBut");
const buttons = [home, clock, path];
const favInner =
	'<button type="button" id="fav" onclick="homeF()"><i class="fas fa-star" id="favBut"></i></button><button type="button" id="clock" onclick="clockF()"><i class="far fa-clock" id="clockBut"></i></button><button type="button" id="path" onclick="pathF()"><i class="far fa-code-commit" id="pathBut"></i></button>';
const clockInner =
	'<button type="button" id="fav" onclick="homeF()"><i class="far fa-star" id="favBut"></i></button><button type="button" id="clock" onclick="clockF()"><i class="fas fa-clock" id="clockBut"></i></button><button type="button" id="path" onclick="pathF()"><i class="far fa-code-commit" id="pathBut"></i></button>';
const pathInner =
	'<button type="button" id="fav" onclick="homeF()"><i class="far fa-star" id="favBut"></i></button><button type="button" id="clock" onclick="clockF()"><i class="far fa-clock" id="clockBut"></i></button><button type="button" id="path" onclick="pathF()"><i class="fas fa-code-commit" id="pathBut"></i></button>';


function keyboardFix(){
	$(".bottom").css("position","absolute")
	$(".bottom").css("bottom","-270px")
}	
function keyboardClean(){
	$(".bottom").css("position","fixed")
	$(".bottom").css("bottom","0")
}
function homeF() {
	document.getElementById("bottom").innerHTML = favInner;
	$("#favPage").css("display", "block")
	$("#clockPage").css("display", "none")
	$("#pathPage").css("display", "none")
	$(".top").css("display","block")
	$(".veryTop").innerHTML = "home"
	$("#searchInput").innerHTML = "<input class=\"searchText\" id=\"searchText\" list=\"stopnames\" type=\"text\" placeholder=\"recherche...\">"
}
function clockF() {
	document.getElementById("bottom").innerHTML = clockInner;
	let int = window.setInterval(function(){
		let heures = document.getElementById("heures")
		let minutes = document.getElementById("minutes")
		if(minutes.value!="" && Number(minutes.value)>59 || minutes.value!="" && Number(heures.value)==NaN){
			minutes.value=""
		}
		if(heures.value!="" && Number(heures.value)>23 || heures.value!="" && Number(heures.value)==NaN){
			heures.value=""
		}
		if(heures.value!="" && Number(heures.value)<24 && heures.value.split("").length == 2){
			keyboardClean()
			heures.blur()
			minutes.focus()
		}
		if(minutes.value!="" && Number(minutes.value)<60 && minutes.value.split("").length == 2){
			minutes.blur()
			window.clearInterval(int)
		}
	},1000)
	$("#favPage").css("display", "none")
	$("#clockPage").css("display", "block")
	$("#pathPage").css("display", "none")
	$(".veryTop").innerHTML = "clock"
	$(".top").css("display","none")
}
function pathF() {
	document.getElementById("bottom").innerHTML = pathInner;
	$("#favPage").css("display", "none")
	$("#clockPage").css("display", "none")
	$("#pathPage").css("display", "block")
	$(".veryTop").innerHTML = "path"
	$(".top").css("display","none")
  document.getElementById("searchInput").innerHTML = "<input class=\"searchText\" id=\"searchText\" list=\"lineNames\" type=\"text\" placeholder=\"recherche...\">"
}
function clockSend(){
	let now = new Date();
	let jour = now.getDate()
	let mois = now.getMonth() + 1;
	let année = now.getFullYear()
	let heures = document.getElementById("heures").value
	let minutes = document.getElementById("minutes").value
	let arret = document.getElementById("clockSearch").value
	arret= nameCode[arret]
	let format = ""
	format+=année +"-"
	format+=mois +"-"
	format+=jour +"T"
	format+= heures+"%3A"+minutes+"%3A00%2B01%3A00"
	let data = fetch(proxyurl + "https://api.cts-strasbourg.eu/v1/siri/2.0/stop-monitoring?MonitoringRef=" + arret +"&StartTime=" + format,cts)
	.then(response=>response.json())
	.then(json => json.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit)
	.then(function(array){
		let list = []
		let obj = {}
		array.forEach(function(element){
			let lineref = element.MonitoredVehicleJourney.LineRef
			DestinationName = element.MonitoredVehicleJourney.DestinationName
			let arrival = element.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime
			obj = {
				"LineRef" : lineref,
				"DestinationName" : DestinationName,
				"ExpectedArrivalTime" : arrival
			}
			list.push(obj)
		})
		console.log(list)
	})
	
}

getStopNames()
clockF()
