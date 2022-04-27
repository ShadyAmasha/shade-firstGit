"use strict";
const axios = require('axios')
// const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
//axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
const axiosHttpsProxy = require('axios-https-proxy');
axios.interceptors.request.use(axiosHttpsProxy);
const proxy = require('../utils/proxy');
const fs = require('fs')
const FormData = require('form-data'); // npm install --save form-data
const request=require('request');

module.exports = {
    makePostProxy: function (path, params) {
        return new Promise(function (resolve, reject) {
                let proxyDetails=proxy.getProxy();
            axios.post(path, params,{jar: cookieJar, withCredentials: true
}).then(
                (response) => {
                                    let result = response.data;
                    resolve(result);
                },
                (error) => {
                    console.log(error)
                }
            );
        });
    },
        makePostStickyProxy: function (path, params,stickyProxy) {
        return new Promise(function (resolve, reject) {
                let proxyDetails=stickyProxy;
            axios.post(path, params,{jar: cookieJar, withCredentials: true
}).then(
                (response) => {
                                    let result = response.data;
                    resolve(result);
                },
                (error) => {
                    console.log(error)
                }
            );
        });
    },
    makeGetProxy: function (path) {
        return new Promise(function (resolve, reject) {
                let proxyDetails=proxy.getProxy();
                axios.get(path, {jar: cookieJar, withCredentials: true
        }).then((response) => {
                    let result = response.data;
                    //console.log(response.headers);
                    //console.log(response.headers['connection']);
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },

        makeGetStickyProxy: function (path,stickyProxy) {
        return new Promise(function (resolve, reject) {
                let proxyDetails=stickyProxy;
                axios.get(path, {jar: cookieJar, withCredentials: true
        }).then((response) => {
                    let result = response.data;
                    //console.log(response.headers);
                    //console.log(response.headers['connection']);
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },

         makePost: function (path, params) {
        return new Promise(function (resolve, reject) {
            axios.post(path, params,{jar: cookieJar, withCredentials: true
                        }).then(
                (response) => {
                                    let result = response.data;
                    resolve(result);
                },
                (error) => {
                    console.log(error)
                }
            );
        });
    },
    makeGet: function (path) {
        return new Promise(function (resolve, reject) {
            axios.get(path, {jar: cookieJar, withCredentials: true
}).then((response) => {
                    let result = response.data;
                    //console.log(response.headers);
                    //console.log(response.headers['connection']);
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },
            makeDelete: function (path) {
        return new Promise(function (resolve, reject) {
            axios.delete(path, {jar: cookieJar, withCredentials: true
}).then((response) => {
                    let result = response.data;
                    //console.log(response.headers);
                    //console.log(response.headers['connection']);
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },
 makeGetImageProxy: function (path) {
        return new Promise(function (resolve, reject) {
                let proxyDetails=proxy.getProxy();
                        axios.get(path, {responseType: 'arraybuffer'
                }).then(
                response => {
                let result =  Buffer.from(response.data, 'base64');
                resolve(result);
                },(error) => {
                    reject(error);
                }
        );
     });
    },
        makeGetImageStickyProxy: function (path,stickyProxy) {
        return new Promise(function (resolve, reject) {
                let proxyDetails=stickyProxy;
                        axios.get(path, {responseType: 'arraybuffer'
                }).then(
                response => {
                let result =  Buffer.from(response.data, 'base64');
                resolve(result);
                },(error) => {
                    reject(error);
                }
        );
     });
    },
     makeNoRedirectPost: function (path, params) {
        return new Promise(function (resolve, reject) {
            axios.post(path, params, {timeout: 60 * 10 * 1000, jar: cookieJar, withCredentials: true,maxRedirects:0}).then(
                (response) => {
                    let result = response.data;
                    resolve(result);
                },
                (error) => {
                        resolve(error.response.data);

                }
            );
        });
    },
        makePostFormData: function (path, formData) {
            return new Promise(function (resolve, reject) {
            axios.post(path, formData, {
  // You need to use `getHeaders()` in Node.js because Axios doesn't
  // automatically set the multipart form boundary in Node.
  headers: formData.getHeaders()
}).then(
                (response) => {
                                    let result = response.data;
                    resolve(result);
                },
                (error) => {
                    console.log(error)
                                        reject(error);
                }
            );
        });
    },
         makePostNoProxy: function (path, params) {
        return new Promise(function (resolve, reject) {
            axios.post(path, params,{jar: cookieJar, withCredentials: true
}).then(
                (response) => {
                                    let result = response.data;
                    resolve(result);
                },
                (error) => {
                    console.log(error)
                }
            );
        });
    },
    makeGetNoProxy: function (path) {
        return new Promise(function (resolve, reject) {
            axios.get(path, {jar: cookieJar, withCredentials: true
}).then((response) => {
                    let result = response.data;
                    //console.log(response.headers);
                    //console.log(response.headers['connection']);
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },
         makeGetProxyNoCookies: function (path, stickyProxy) {
        return new Promise(function (resolve, reject) {


                        const sample = array => array[Math.floor(Math.random() * array.length)];

const headers = [
  {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Ch-Ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  },
  {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.5',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0',
  },
];
            let proxyDetails=stickyProxy;
                        console.log(proxyDetails);
                        axios.get(path, { headers: sample(headers) }).then((response) => {
                    let result = response.data;
                                        //console.log(result);
                    //console.log(response.headers);
                    //console.log(response.headers['connection']);
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },
makePostWithHeaders: function (path, params,myToken) {
        return new Promise(function (resolve, reject) {
            axios.post(path, params,{headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ myToken}}).then(
                (response) => {
                                    let result = response.data;
                    resolve(result);
                },
                (error) => {

                                        resolve(error);
                }
            );
        });
    },
makeGetWithHeaders: function (path,myToken) {
        return new Promise(function (resolve, reject) {
            axios.get(path,{headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ myToken}}).then(
                (response) => {
                                        let result = response.data;
                    resolve(result);
                },
                (error) => {
                                        console.log(error);

                        resolve("NONE");
                }
            );
        });
    },
makeDeleteWithHeaders: function (path,myToken) {
        return new Promise(function (resolve, reject) {
            axios.delete(path,{headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ myToken}}).then(
                (response) => {
                                        let result = response.data;
                    resolve(result);
                },
                (error) => {
                                        console.log(error);

                        resolve("NONE");
                }
            );
        });
    },
        makeGetFileWithHeaders: function (path,myToken) {
        return new Promise(function (resolve, reject) {
            axios.get(path,{ responseType: "arraybuffer" ,headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ myToken}}).then(
                (response) => {
                                        //fs.promises.writeFile('./salman.pdf', response.data);
                    resolve(response);
                },
                (error) => {
                                        console.log(error);

                        resolve("NONE");
                }
            );
        });
    },
        makePostFormDataMetropark: function (path, filePath,post_data) {
                return new Promise(function (resolve, reject) {
                        const form = new FormData();
                        //const image = fs.readFileSync(filePath);
                        for (const [key, value] of Object.entries(post_data)) {
                                //console.log(key, value);
                                form.append(key,value);
                        }
                        for (const [key, value] of Object.entries(filePath)) {
                                let fileContent = fs.readFileSync('/tmp/'+value);
                                form.append(key, fileContent, value)
                        }
                        //form.append('file', image, 'error.jpg');
                        //form.append('file', image, 'errr.jpg');
                        axios.post(path, form).then(
                                                (response) => {
                                                        console.log("in response");
                                                        console.log(response);
                                                        let result = response.data;
                                                        resolve(result);
                                                },
                                                (error) => {
                                                        console.log("in error");
                                                        //console.log(error);
                                                        resolve(error);
                                                }
                                        );
                        }
                )
    },
        makePostFormDataWithHeaders: function (path, filePath) {
                return new Promise(function (resolve, reject) {
                        let options = {
                          'method': 'POST',
                          'url': 'https://fleet.roadprotect.co.il/api/v1/auth/login/developer',
                          'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJlbWFpbCI6ImVtaWx5QGVudHJvc3RhdC5jb20iLCJhY2NvdW50SWQiOjYxMiwiYWNjb3VudFVzZXJJZCI6Njc2MSwiaWF0IjoxNjE5NjEyNjM3LCJleHAiOjE2MTk3ODU0Mzd9.VyQk982v06pL0RPbueBsopkZInoYHv_u8s24HeoI9e0'
                          },
                          form: {
                                'email': 'virtual@roadprotect.co.il',
                                'password': 'ec2dfdbf5d1e6be14b83527807f3847278380d00ea82113fd66210bda7dd495f90b86c9498be9f8a7c93fc43a1733d0c751e9be61e62c8fe08c0e1f0f99baada'
                          }
                        };
                        let myToken="";
                        request(options, function (error, response) {
                                if (error) throw new Error(error);
                        myToken= JSON.parse(response.body).token;
                                const form = new FormData();
                                const image = fs.readFileSync(filePath);
                                form.append('file', image, 'error.jpg');
                                //form.append('file', image, 'errr.jpg');
                                axios.post(path, form,{headers: {
                                'Authorization': 'Bearer '+ myToken,
                                  ...form.getHeaders(),
                                  }
                                 }).then(
                                        (response) => {
                                                console.log(response);
                                                let result = response.data;
                                                resolve(result);
                                        },
                                        (error) => {
                                                console.log(error);
                                                resolve(error);
                                        }
                                );
                        });
                });
    },
};
