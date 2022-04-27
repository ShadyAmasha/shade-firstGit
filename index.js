const fs = require('fs')
const request = require('request');
let axioscall = require('./axiosoperations/axioscall');




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
  
	
	
	redirect();
});

async function redirect()
{
	
	let infringemetList = await axioscall.makeGetWithHeaders('https://fleet.roadprotect.co.il/api/v1/query/infringement?limit=500&page=1&filter%5B0%5D=status%7C%7Cin%7C%7CDue%2CApproved%20for%20Payment&filter%5B1%5D=nomination.status%7C%7Cin%7C%7CNew%2CRedirection%20Error%2CRedirection%20Request%20Error&filter%5B2%5D=infringementContract.document%7C%7Cnotnull&mine=false&via=onVehicles&graphing=false&startDate=undefined&endDate=undefined&vehicleRegistration=null&infringementStatus=null',myToken);
	console.log(infringemetList);
	let validInfringements=[];
	console.log(infringemetList.data.length);
	for(let i=0;i<infringemetList.data.length;i++)
	{
			
				validInfringements.push(infringemetList.data[i].nomination.nominationId);
	}
	
    for(let i=0;i<validInfringements.length;i++)
	{
		try{
		//	let sendRequest=  await axioscall.makePostWithHeaders('https://fleet.roadprotect.co.il/api/v1/nomination/'+validInfringements[i]+'/redirect/municipal','{}',myToken);
		}
		catch(error)
		{console.log(error);}
	}
}



function map_to_object(map) {
    const out = Object.create(null)
    map.forEach((value, key) => {
        if (value instanceof Map) {
            out[key] = map_to_object(value);
        }
        else {
            out[key] = value;
        }
    })
    return out;
}

