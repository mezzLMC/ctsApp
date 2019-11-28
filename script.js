function doubleCut(list){
    let l = []
    list.forEach(function(element){
        if(l.includes(element)){}
        else{
            l.push(element)
        }
    })
    return l;
}

function addFav(arg){
    favoris.push(arg)
    localStorage.setItem("favoris",favoris)
}


// just a commit test
// localStorage
//##################################################################################
const token = "14df45e6-40b1-4d94-bce2-0535fcdb1c42"
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://api.cts-strasbourg.eu/v1/siri/2.0/stoppoints-discovery"

let headers = new Headers()
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', 'http://localhost');
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('GET', 'POST', 'OPTIONS');
headers.append('Authorization', 'Basic ' + btoa(token + ":" + "password"));
let nameCode = {}
let stopnames = []
let cts = {
    method: "GET",
    headers: headers,
    mode : "cors"
}

let getStopNames = async function(){
    let data = await fetch(proxyurl+url,cts).then(response=>response.json()).then(function(response){
        response.StopPointsDelivery.AnnotatedStopPointRef.forEach(function(element){
            stopnames.push(element.StopName)
            nameCode[element.StopName]=element.Extension.LogicalStopCode
        })
        datalist = document.getElementById('stopnames')
        stopnames = doubleCut(stopnames)
        stopnames.forEach(function(element){
            datalist.innerHTML = datalist.innerHTML+'<option value=\"'+element+'\"></option>'
        })
    })
}

let fetchSchedules = async function(arg){
    let data = await fetch(proxyurl + "https://api.cts-strasbourg.eu/v1/siri/2.0/stop-monitoring?MonitoringRef="+arg+"&MonitoringRef=" ,cts)
    return data
}

function SetSchedules(json){
  var d = new Date();
  let actualTime = new Date()
  let actualSecond = actualTime.getHours()*3600 + actualTime.getMinutes()*60
  let array = json.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit
  let list = []
  array.forEach(function(element){
    let data = element.MonitoredVehicleJourney
    let ExpectedArrivalTime = data.MonitoredCall.ExpectedArrivalTime.split("T")[1].split("+")[0].split(":")
    let hours = ExpectedArrivalTime[0]
    hours = Number(hours)
    let minutes = ExpectedArrivalTime[1]
    minutes = Number(minutes)
    let seconds = hours*3600+minutes*60
    let secondDif = seconds - actualSecond
    minutesRemaining = String(Math.trunc(secondDif/60))+"'";
    ExpectedArrivalTime = ExpectedArrivalTime[0]+":"+ExpectedArrivalTime[1]
    list.push(data.LineRef+" - "+data.DestinationName+": "+ExpectedArrivalTime + " - " + minutesRemaining)
  })
  return list
}

let StopMonitor = async function(arg){
  let data = await fetchSchedules(arg).then(response=>response.json()).then(json=>SetSchedules(json))
  return data
}
getStopNames()


let home = document.getElementById('favBut')
let homeBut = document.getElementById('fav')
let clock = document.getElementById('clock')
let clockBut = document.getElementById('clockBut')
let path = document.getElementById('path')
let pathBut = document.getElementById('pathBut')
const buttons = [home,clock,path]
const favInner ="<button type=\"button\" id=\"fav\" onclick=\"homeF()\"><i class=\"fas fa-star\" id=\"favBut\"></i></button><button type=\"button\" id=\"clock\" onclick=\"clockF()\"><i class=\"far fa-clock\" id=\"clockBut\"></i></button><button type=\"button\" id=\"path\" onclick=\"pathF()\"><i class=\"farfa-code-commit\" id=\"pathBut\"></i></button>"
const clockInner = "<button type=\"button\" id=\"fav\" onclick=\"homeF()\"><i class=\"far fa-star\" id=\"favBut\"></i></button><button type=\"button\" id=\"clock\" onclick=\"clockF()\"><i class=\"fas fa-clock\" id=\"clockBut\"></i></button><button type=\"button\" id=\"path\" onclick=\"pathF()\"><i class=\"far fa-code-commit\" id=\"pathBut\"></i></button>"
const pathInner = "<button type=\"button\" id=\"fav\" onclick=\"homeF()\"><i class=\"far fa-star\" id=\"favBut\"></i></button><button type=\"button\" id=\"clock\" onclick=\"clockF()\"><i class=\"far fa-clock\" id=\"clockBut\"></i></button><button type=\"button\" id=\"path\" onclick=\"pathF()\"><i class=\"fas fa-code-commit\" id=\"pathBut\"></i>"

function homeF(){
    document.getElementById("bottom").innerHTML = favInner
    document.getElementById("favPage").style.display = "block"
    document.getElementById("clockPage").style.display = "none"
    document.getElementById("pathPage").style.display = "none"
}
function clockF(){
  document.getElementById("bottom").innerHTML = clockInner
  document.getElementById("favPage").style.display = "none"
  document.getElementById("clockPage").style.display = "block"
  document.getElementById("pathPage").style.display = "none"
}
function pathF(){
  document.getElementById("bottom").innerHTML = pathInner
  document.getElementById("favPage").style.display = "none"
  document.getElementById("clockPage").style.display = "none"
  document.getElementById("pathPage").style.display = "block"
}






/*.then(response=>response.json())
.then(json=>json.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit)
.then(function(array){
  let list = []
  array.forEach(function(element){
    let data = element.MonitoredVehicleJourney
    let ExpectedArrivalTime = data.MonitoredCall.ExpectedArrivalTime.split("T")[1].split("+")[0].split(":")
    let hours = ExpectedArrivalTime[0]
    hours = Number(hours)
    let minutes = ExpectedArrivalTime[1]
    minutes = Number(minutes)
    let seconds = hours*3600+minutes*60
    let secondDif = seconds - actualSecond
    minutesRemaining = String(Math.trunc(secondDif/60))+"'";
    ExpectedArrivalTime = ExpectedArrivalTime[0]+":"+ExpectedArrivalTime[1]
    list.push(data.LineRef+" - "+data.DestinationName+": "+ExpectedArrivalTime + " - " + minutesRemaining)
  })
  return list
})*/
