cardApi = {
    getParameterByName: function(name) { //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        console.log(name);
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);

        console.log(results);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    joinOrCreateThing: function(xmlhttp, slocation, userVal, passName, playerName, successFunc, joinOnly) {
        var requestIt = function () {
            if (xmlhttp.readyState == 4) {
                $('.wait-for-load').hide();
                $('#btnJumpRefresh').removeClass('w3-spin');
                
                if (xmlhttp.status == 400 || xmlhttp.status == 200) {
                    successFunc(xmlhttp.responseText, userVal, passName, playerName, joinOnly);
                }
                else {
                    console.log('unsuccessful request');
                }
            }
        } 

        xmlhttp.open("GET", slocation);
        xmlhttp.onreadystatechange = requestIt;
        $('.wait-for-load').show();
        $('#btnJumpRefresh').addClass('w3-spin');
        xmlhttp.send();
    },
    
    sendSomething: function(takeMeWithYouSuccessILoveYou, thingParams, beforeSend, onSuccess, gameObj, passName, playerName) {
        var xmlhttp = new XMLHttpRequest();

        var url = this.getRoot(window.document.URL);
        var submitThingLocation = url + thingParams
        
        xmlhttp.open("GET", submitThingLocation);
        xmlhttp.onsubmit = function() { return false; };
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 400 || xmlhttp.status == 200) {
                    onSuccess(takeMeWithYouSuccessILoveYou, gameObj, passName, playerName, xmlhttp);
                }
            }
            
        };
        beforeSend();
        xmlhttp.send();                
    },

    getRoot: function(referrer) {
        var len = referrer.lastIndexOf('/');
        if (len == -1) len = referrer.length;
        var url = referrer.substr(0, len);
        return url;
    },
}