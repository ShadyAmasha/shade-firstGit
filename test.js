const fs = require('fs');
const csvToJson = require('csvtojson');
const request = require('request');
let axioscall = require('./axiosoperations/axioscall');

let outstandingInfrengements = [];


let options = {
  'method': 'POST',
  'url': 'https://fleet.roadprotect.co.il/api/v1/auth/login/developer',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJlbWFpbCI6ImVtaWx5QGVudHJvc3RhdC5jb20iLCJhY2NvdW50SWQiOjYxMiwiYWNjb3VudFVzZXJJZCI6Njc2MSwiaWF0IjoxNjE5NjEyNjM3LCJleHAiOjE2MTk3ODU0Mzd9.VyQk982v06pL0RPbueBsopkZInoYHv_u8s24HeoI9e0'
  },
  form: {
    'email': 'virtual@roadprotect.co.il',
    'password': 'aa6437be5c2d73e104214c377ca21d9ffcf9b382a1a45134d41cbcc383b62dd6fd174f4aae2e0bb0cb29fb747f3ccbab842a391a75c6b3a69f4efd97c3d2dc4d'
  }
};
let toVerify=[];

let myToken="";
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log("IIIIIIIIIIIIIIIIIIII");
  myToken= JSON.parse(response.body).token;
  
	
	
	test();
});

async function test(){
    let infringemetList = await axioscall.makeGetWithHeaders('https://fleet.roadprotect.co.il/api/v1/query/infringement?limit=500&page=1&?filter=vehicleOwner||cont||Ore',myToken);
console.log(infringemetList.data[0]);
}


async function handleFile(){
    let csvTestArray = await csvToJson().fromFile('./infrengementsTest.csv');
    csvTestArray.forEach(infringement => { if(infringement.Status == "Outstanding"){
        outstandingInfrengements.push(infringement)
    }
        
    });

    console.log(outstandingInfrengements.length)
}
