var macaddress = require('macaddress');
macaddress.one(function (err, mac) {
    console.log("Mac address for this host: %s", mac);  
});

