const fs = require('fs')
const ftp = require("basic-ftp")
const request = require('request');
const csvToJson = require('csvtojson')
//const sleep = require('sleep');
const moment = require('moment');
let axioscall = require('../axiosoperations/axioscall');
let leaseContracts=[];
let ownerContracts=[];
let jsonstring=[];
let accountList=[];

getFiles();


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
let toUpdate=[];
let toInsert=[];
let leaseToUpdate=[];
let leaseToInsert=[];
let toDelete=[];
let myToken="";
request(options, function (error, response) {
  if (error) throw new Error(error);

  myToken= JSON.parse(response.body).token;
        options = {
    'method': 'GET',
    'url': 'https://fleet.roadprotect.co.il/api/v1/query/contract?limit=100000&page=1&mine=false&graphing=false&via=null&startDate=null&endDate=null',
    'headers': {
        'Authorization': 'Bearer '+myToken
        }
    };
        request(options, function (error, response) {
    if (error) throw new Error(error);
    let fleetContracts = JSON.parse(response.body).data;
        let fleetOwnerContracts=[];
        let fleetLeaseContracts=[];
        for(let i=0;i<fleetContracts.length;i++)
        {
                if(fleetContracts[i].type=='Ownership')
                        fleetOwnerContracts.push(fleetContracts[i]);
                else if(fleetContracts[i].type=='Lease')
                        fleetLeaseContracts.push(fleetContracts[i]);
        }

        fs.writeFileSync('./fleet_contracts.json', JSON.stringify(fleetContracts));
        fs.writeFileSync('./fleet_lease_contracts.json', JSON.stringify(fleetLeaseContracts));
        fs.writeFileSync('./fleet_owner_contracts.json', JSON.stringify(fleetOwnerContracts));

        // handle owner ship contracts

        for(let i=0;i<ownerContracts.length;i++)
        {
                        let isFound=false

                        for(let j=0;j<fleetOwnerContracts.length;j++)
                        {
                                if(fleetOwnerContracts[j].startDate.includes("22:00:00")||fleetOwnerContracts[j].startDate.includes("21:00:00"))
                                        fleetOwnerContracts[j].startDate=moment(fleetOwnerContracts[j].startDate).add(5, 'hours').format('YYYY-MM-DD');
                                if(ownerContracts[i]['Vehicle']==fleetOwnerContracts[j]['vehicle'].registration && fleetOwnerContracts[j].startDate.includes(ownerContracts[i]['StartDate']))
                                {
                                        let data=ownerContracts[i];
                                        let contractId=fleetOwnerContracts[j].contractId;
                                        // delete contract
                                        toDelete.push(fleetOwnerContracts[j]["contractId"]);
                                        break;
                                        //Update Fleet
                                        //updateOwner(myToken,fleetOwnerContracts[j].contractId,ownerContracts[i]);
                                        //let myCall = updateRecord(contractId,data,myToken);
                                        let map= new Map();
                                        map.set("contractId",contractId);
                                        map.set("data",data);
                                        map.set("myToken",myToken);
                                        toUpdate.push(map);
                                        isFound=true;

                                        break;
                                }
                        }

                        if(!isFound)
                        {
                                //insertOwner(myToken,ownerContracts[i]);
                                let data=ownerContracts[i];
                                //let myCall = insertRecord( data,myToken);
                                let map= new Map();
                                        map.set("data",data);
                                        map.set("myToken",myToken);
                                        toInsert.push(map);
                        }

        }
        getAccountList();


        for(let i=0;i<leaseContracts.length;i++)
        {
                        let isFound=false

                        for(let j=0;j<fleetLeaseContracts.length;j++)
                        {
                                if(fleetLeaseContracts[j].startDate.includes("22:00:00")||fleetLeaseContracts[j].startDate.includes("21:00:00"))
                                        fleetLeaseContracts[j].startDate=moment(fleetLeaseContracts[j].startDate).add(5, 'hours').format('YYYY-MM-DD');
                                if(leaseContracts[i]['Vehicle']==fleetLeaseContracts[j]['vehicle'].registration && fleetLeaseContracts[j].startDate.includes(leaseContracts[i]['StartDate']))
                                {
                                        if(!leaseContracts[i]['redirectionDocument'])
                                        {
                                                // delete contract
                                                toDelete.push(fleetLeaseContracts[j].contractId);
                                                break;
                                        }
                                        let data=leaseContracts[i];
                                        let contractId=fleetLeaseContracts[j].contractId;
                                        let map= new Map();
                                        map.set("contractId",contractId);
                                        map.set("data",data);
                                        map.set("myToken",myToken);
                                        leaseToUpdate.push(map);
                                        isFound=true;

                                        break;
                                }
                        }

                        if(!isFound)
                        {
                                let data=leaseContracts[i];
                                let map= new Map();
                                        map.set("data",data);
                                        map.set("myToken",myToken);
                                        leaseToInsert.push(map);
                        }

        }
                updateRecord();




});
});
async function deleteContract(contractId,myToken)
{
        try{
                console.log("Deleting "+contractId);
                let currAction=await axioscall.makeDeleteWithHeaders('https://fleet.roadprotect.co.il/api/v1/contract/'+contractId,myToken);
                return currAction;
        }catch (error)
        {
console.log(error);
        }
}
async function updateRecord()
{
        for(let i=0;i<toDelete.length;i++)
        {

                //let currAction=await axioscall.makeDeleteWithHeaders('https://fleet.roadprotect.co.il/api/v1/contract/'+toDelete[i],myToken);
                console.log("Deleted "+toDelete[i]);

        }

        for(let i=0;i<toUpdate.length;i++)
        {
                try
                {
                        let result =await axioscall.makePostWithHeaders('https://fleet.roadprotect.co.il/api/v1/contract/'+toUpdate[i].get("contractId")+'/end-date', JSON.stringify({"endDate":toUpdate[i].get("data")['EndDate'],"startDate":toUpdate[i].get("data")['StartDate']}),toUpdate[i].get("myToken"));
                        if(result.response)
                        {
                                toUpdate[i].set("myToken","");
                                toUpdate[i].set("reason",result.response.data.message);
                                console.log(JSON.stringify(map_to_object(toUpdate[i])));
                        }
                }catch(error)
                {
                                console.log(error);
                }
        }
        insertRecord();


}

async function insertRecord()
{
        for(let i=0;i<toInsert.length;i++)
        {
                try
                {
                        let result= await axioscall.makePostWithHeaders('https://fleet.roadprotect.co.il/api/v1/ownership-contract', JSON.stringify({"owner":toInsert[i].get("data")['Owner'],"vehicle":toInsert[i].get("data")['Vehicle'],"endDate":toInsert[i].get("data")['EndDate'],"startDate":toInsert[i].get("data")[
'StartDate']}),toInsert[i].get("myToken"));
                        if(result.response)
                        {
                                toInsert[i].set("myToken","");
                                toInsert[i].set("reason",result.response.data.message);
                                console.log(JSON.stringify(map_to_object(toInsert[i])));
                        }
                }catch(error)
                {
                console.log(error);
                }
        }
        updateLeaseRecord();
}


async function getAccountList()
{

        let accounts=await axioscall.makeGetWithHeaders('https://fleet.roadprotect.co.il/api/v1/account/dropdown',myToken);
    //console.log(accounts);
        let map = new Map();
    for (let i=0;i<accounts.length;i++)
        {
                let map = new Map();
                map.set("accountId",accounts[i].accountId);
                map.set("identifier",accounts[i].identifier);
                accountList.push(map);
        }
}


async function updateLeaseRecord()
{
        //console.log("=======================---------------"+leaseToUpdate.length);
        for(let i=0;i<leaseToUpdate.length;i++)
        {
                try
                {
                        let result =await axioscall.makePostWithHeaders('https://fleet.roadprotect.co.il/api/v1/contract/'+leaseToUpdate[i].get("contractId")+
'/end-date', JSON.stringify({"endDate":leaseToUpdate[i].get("data")['EndDate'],"startDate":leaseToUpdate[i].get("data")['StartDate']}),leaseToUpdate[i].get("myToken"));
                        if(result.response)
                        {

                                leaseToUpdate[i].set("myToken","");
                                leaseToUpdate[i].set("reason",result.response.data.message);
                                console.log(JSON.stringify(map_to_object(leaseToUpdate[i])));
                        }
                }
                catch(error){
                        console.log(error);
                }
        }
        insertLeaseRecord();
}

async function insertLeaseRecord()
{
        for(let i=0;i<leaseToInsert.length;i++)
        {
                try
                {
                        let result= await axioscall.makePostWithHeaders('https://fleet.roadprotect.co.il/api/v1/lease-contract', JSON.stringify({"user":leaseToInsert[i].get("data")['User'],"owner":leaseToInsert[i].get("data")['Owner'],"vehicle":leaseToInsert[i].get("data")['Vehicle'],"startDate":leaseToInsert[i].get("data")['StartDate'],"endDate":leaseToInsert[i].get("data")['EndDate']}),leaseToInsert[i].get("myToken"));
                        if(result.response)
                        {
                                leaseToInsert[i].set("myToken","");
                                leaseToInsert[i].set("reason",result.response.data.message);
                                console.log(JSON.stringify(map_to_object(leaseToInsert[i])));
                        }
                }
                catch(error)
                {
                        console.log(error);
                }
        }
}





async function getFiles() {
    const client = new ftp.Client()
    client.ftp.verbose = false;
    try {
        await client.access({
            host: 'ftp.taavura.co.il',
            user: 'RoadProtect',
            password: 'Ayukj9',
            secure: false
        })
    // console.log(await client.list())
        await client.downloadTo("./ftp.csv", "rp_veh.txt");
        console.log('ftp.csv --> loaded!');
    }
    catch (err) {
        console.log(err)
    }
    await handleFiles();
    client.close()
}


async function handleFiles() {
console.log("-------------------");
        let ftpContractsArray = await csvToJson().fromFile('./ftp.csv');
        let ftpIndex=0;

        while( ftpIndex<ftpContractsArray.length )
        {
                try
                {
                        jsonstring.push(handleDates(ftpContractsArray[ftpIndex]));
                        ftpIndex++;
                }catch(e)
                {
                        console.log("Bad record "+JSON.stringify(ftpContractsArray[ftpIndex]));
                                                ftpIndex++;

                }
        }

        let jsonIndex=0;

        while(jsonIndex<jsonstring.length)
        {
                if(jsonstring[jsonIndex]['rel_code']=='B')
                {
                        leaseContracts.push( jsonstring[jsonIndex]);
                }
                else
                {
                        ownerContracts.push( jsonstring[jsonIndex]);
                }
                jsonIndex++;
        }
        try {
          fs.writeFileSync('./ftp_owner_contracts.json', JSON.stringify(ownerContracts));
        } catch (err) {
          console.error(err);
        }


        let leaseIndex=0;
        let ownerIndex=0;

        for(let leaseIndex=0;leaseIndex<leaseContracts.length;leaseIndex++)
        {
                for(let ownerIndex=0;ownerIndex<ownerContracts.length;ownerIndex++)
                {
                        if(leaseContracts[leaseIndex]['Vehicle']== ownerContracts[ownerIndex]['Vehicle'] && Date.parse(leaseContracts[leaseIndex]['StartDate']
)>= Date.parse(ownerContracts[ownerIndex]['StartDate']) && Date.parse(leaseContracts[leaseIndex]['StartDate'])<= Date.parse(ownerContracts[ownerIndex]['EndDate']))
                        {
                                leaseContracts[leaseIndex]['Owner']=ownerContracts[ownerIndex]['Owner'];
                                break;
                        }
                }
        }

        try
        {
          fs.writeFileSync('./ftp_lease_contracts.json', JSON.stringify(leaseContracts));
        } catch (err) {
          console.error(err);
        }
}

function handleDates(contract)
{
        if(contract['rel_code'] == 'A' && contract['end_date']=='31/12/22')
        {
                contract['end_date']='31/12/44';
                //console.log(contract);
        }

        //console.log(contract);
        let pattern=/[0-9]{2}[\/][0-9]{2}[\/][0-9]{2}/g;
        let strDate= contract['end_date'].match(pattern);
        //console.log(contract);

        let newDate = strDate[0].split("\/").reverse().join("\/");
        newDate="20"+newDate;
        newDate = newDate.split("\/").reverse().join("\/");
        newDate= newDate.replace('/','-').replace('/','-');
        newDate = newDate.split("-").reverse().join("-");


        contract['end_date']=newDate+" 12:00:00";

        strDate= contract['start_date'].match(pattern);
        //console.log(contract);
        newDate = strDate[0].split("\/").reverse().join("\/");
        newDate="20"+newDate;
        newDate = newDate.split("\/").reverse().join("\/");
        newDate= newDate.replace('/','-').replace('/','-');
        newDate = newDate.split("-").reverse().join("-");

        contract['start_date']=newDate;
        let map =new Map();
        map.set("Vehicle",contract['veh_id']);
        map.set("rel_code",contract['rel_code']);
        map.set("Owner",contract['cust_id']);
        map.set("User",contract['cust_id']);
        map.set("StartDate",contract['start_date']);
        map.set("EndDate",contract['end_date']);


        return map_to_object(map);

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
