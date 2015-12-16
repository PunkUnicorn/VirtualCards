cardApi = {
    getParameterByName: function(name) { //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        console.log(name);
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);

        console.log(results);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    joinOrCreateThing: function(xmlhttp, location, passName, playerName, successFunc, joinOnly) {
        var requestIt = function () {
            if (xmlhttp.readyState == 4) {
                $('.wait-for-load').hide();
                if (xmlhttp.status == 400 || xmlhttp.status == 200) {
                    successFunc(xmlhttp, passName, playerName, joinOnly);
                }
                else {
                    console.log('unsuccessful request');
                }
            }
        } 

        xmlhttp.open("GET", location);
        xmlhttp.onreadystatechange = requestIt;
        $('.wait-for-load').show();
        xmlhttp.send();
    },
    
    sendSomething: function(takeMeWithYouSuccessILoveYou, thingParams, beforeSend, onSuccess) {
        var xmlhttp = new XMLHttpRequest();

        var url = getRoot(window.document.referrer);
        var submitThingLocation = url + thingParams
        
        xmlhttp.open("GET", submitThingLocation);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 400 || xmlhttp.status == 200) {
                    onSuccess(takeMeWithYouSuccessILoveYou);
                }
            }
            
        };
        beforeSend();
        xmlhttp.send();                
    },
                

}