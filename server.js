
//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var url = require('url');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(req, res){
    var path = url.parse(req.url).pathname;
    console.log('url: ' + req.url);

    switch (path) {
        case '/card':
            doCard(res);
            break;

        case '/':
            doPageFile('VirtualCards.html', res);
            break;

        default:
            try {
                doPageFile(req.url.substring(1), res);
            } catch(err) {
                console.log(err.message);
            }
    }
}

function doCard(res) {
    console.log('card');
    res.write('CARD');
    res.end();
}

function doPageFile(file, res) {
    try {

        setTimeout( function() {
            fs.readFile(file, function (err, data){
                console.log('error: ' + err);
                res.write(data);
                res.end();
            });
        }, 0);
    } catch (err) {
        console.log(err.message);
    }
}

function onClickDraw() {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST", 'localhost:8080/card');
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 400){
                console.log('ok');
            }else{
                console.log('error')
            }
        }
    }
    xmlhttp.send(data);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});