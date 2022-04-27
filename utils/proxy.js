'use strict';

module.exports = {
    getProxy: function (path, params) {

        let map=new Map();
        map.set("user","crawler");
        map.set("password","roadprotect1342");
        map.set("host","160.116.14.63");
        map.set("port","2331");
        return map;
    }
}
