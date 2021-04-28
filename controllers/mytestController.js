 const Test = require('../models/myTest')
 const Bus = require('../models/myTest');
 const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.getTestData = (req, res) => {
	let data = [
		new Test('Test name', 12),
		new Test('Second name', 13)
	];
	res.render('mytestView', {
		data : data,
	});
};

exports.getSecondTestData = (req, res) => {
	let data = [
		new Test('other name', 15),
		new Test('other second name', 16)
	];
	res.render('mytestView', {
		data : data,
	});
};

exports.getBusData = (req, res) => {
    getdata(req.params.postcode, res)
}

function getdata(postcode, res) {
    var validRequest = new XMLHttpRequest()
   var validUrl = `http://api.postcodes.io/postcodes/${postcode}/validate`
   validRequest.open('GET', validUrl, true)
   validRequest.onload = function () {
     var response = JSON.parse(validRequest.responseText)
     var result = response.result
     if (!result) {
         return res.render('invalid.ejs')
     }else{
         var postcodeRequest = new XMLHttpRequest()
         postcodeRequest.open('GET', 'http://api.postcodes.io/postcodes/'+postcode, true)
         postcodeRequest.onload = function () {
              const postcodeResponse = JSON.parse(postcodeRequest.responseText);
              const location = getLatLong(postcodeResponse)
              nearestBusstops(location, res, postcode)
             }
   postcodeRequest.send()
   
 }
 }
 validRequest.send()
   }
 
 function getLatLong(data) {
   return {
     longitude: Object.values(data)[1].longitude,
     latitude: Object.values(data)[1].latitude,
   }
 }
 
 function nearestBusstops(location, res, postcode) {
   var requestBus = new XMLHttpRequest()
   var url = `http://transportapi.com/v3/uk/places.json?lat=${location.latitude}&lon=${location.longitude}&type=bus_stop&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`
     requestBus.open('GET', url, true)
   requestBus.onload = function () {
     var stopResponse = JSON.parse(requestBus.responseText)
     //console.log(stopResponse)
     const busStop1 = stopResponse.member[0].atcocode
     const busStop2 = stopResponse.member[1].atcocode
    //document.getElementById('r').innerHTML = stopResponse.member[0].name
     printDepartures(busStop1, res, postcode)
 
     printDepartures(busStop2, res, postcode)
   }
 
   requestBus.send()
 }
 
  printDepartures = (atcocode, res, postcode) =>{
   var requestDepartures = new XMLHttpRequest()
   var departureBoard = []
     var urldep = `http://transportapi.com/v3/uk/bus/stop/${atcocode}/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`
     requestDepartures.open('GET', urldep, true)
   requestDepartures.onload = function () {
     var depResponse = JSON.parse(requestDepartures.responseText)
     //console.log(depResponse);
     var departures = depResponse.departures
          // console.log(departures)
          for (var prop in departures){
          departureBoard = departureBoard.concat(Object.values(departures[prop]).map(departure=>{
             var bus = new Bus(departure.line, departure.direction, departure.expected_departure_time);
 return bus;
          }));
         }
         if(departureBoard.length == 0){
             res.render('nobuses.ejs')
         }else if(departureBoard.length>5){
             departureBoard = departureBoard.slice(0, 5)
         }
 console.log(departureBoard)
           
     //for (let i = 0; i < 6 || i < departureBoard.length; i++) {
         // departureBoard.map(departure =>{
         // let bus =new Bus(departure.line, departure.direction, departure.expected_departure_time);
         // return bus
         //});
     //}
         return res.render('mytestView', {
             data : departureBoard,
             postcode: postcode
         })
       //departureboard(departureBoard[i])
     }
   requestDepartures.send()
 }
 
 

// function extractLatLong(postcodeResponse){
//     return {
//         "latitude": postcodeResponse.result.latitude,
//         "longitude": postcodeResponse.result.longitude
//     }
//     }

//     function checkPostcodeValid(postcode, res) {
//         var validRequest = new XMLHttpRequest();
//         var validUrl = `http://api.postcodes.io/postcodes/${postcode}/validate`;
//         validRequest.open('GET', validUrl, true);
//         validRequest.onload = function () {
//             var response = JSON.parse(validRequest.responseText);
//             var result = response.result;
            
//             if (!result) {
//                 res.render('invalid.ejs')
//             }else{
//                 var postcodeRequest = new XMLHttpRequest();
// postcodeRequest.open('GET', 'http://api.postcodes.io/postcodes/'+postcode, true)
// postcodeRequest.onload = function () {
//      const postcodeResponse = JSON.parse(postcodeRequest.responseText);
//      //console.log(postcodeResponse);
//      const location = extractLatLong(postcodeResponse);
//      findNearestStops(location, res, postcode);                             
//      }
     
// postcodeRequest.send();

//             } 
//         }
//         validRequest.send();
//     }

// function busboard(postcode, res){
//     checkPostcodeValid(postcode, res);
    
// }



//     function findNearestStops(location, res, postcode){

//         var stopRequest = new XMLHttpRequest();
//         var postcodeurl = `http://transportapi.com/v3/uk/places.json?lat=${location.latitude}&lon=${location.longitude}&type=bus_stop&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`;
//         stopRequest.open('GET',postcodeurl, true)
//         stopRequest.onload = function () {
//             var stopResponse = JSON.parse(stopRequest.responseText);
//             const busStop1 = stopResponse.member[0].atcocode;
//            // const busStop2 = stopResponse.member[1].atcocode;
//       var allBuses = [];
//       findSoonest5Buses(busStop1, res, allBuses, postcode);
       
//         }
//         stopRequest.send();
        
//         }

//         findSoonest5Buses = function(busStop1, res, allBuses, postcode) {
//             var departureBoard = [];
//             var request = new XMLHttpRequest();
//             var url = `http://transportapi.com/v3/uk/bus/stop/${busStop1}/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`;
//         request.open('GET',url, true)
//         request.onload = function () {

//             var response = JSON.parse(request.responseText);
//            var departures = response.departures;
          
//             for (let busRoute in departures) {        
//                 departureBoard = departureBoard.concat(departures[busRoute].map(departure => {
//                     var bus = new Bus(departure.line, departure.aimed_departure_time, departure.expected_departure_time, departure.direction);
//                     return bus;
//                 }));
//             }   
//                 departureBoard.sort(function (a, b) {
//                     var keyA = a.expected_departure_time;
//                     var keyB = b.expected_departure_time;
//                     if(keyA<keyB) return -1;
//                     if(keyB<keyA) return 1;
//                     return 0;
                    
//                 })
                
//                 if(departureBoard.length ==0){
//                     res.render('nobuses.ejs', {
//                         postcode:postcode,
//                     })
//                 }else if(departureBoard.length >= 5) {
//                     allBuses = departureBoard.slice(0,5);
//                 } else {
//                     allBuses = departureBoard.slice(0,departureBoard.length)
//                 }
//                 res.render('mytestView', {
//                     data: allBuses,
//                     postcode: postcode,
//                 })
//            }
           

//     request.send();
// }

        
        
    
