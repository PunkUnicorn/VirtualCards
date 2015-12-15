
//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var util = require('util');
var hashmap = require('./hashmap-2.0.4/hashmap');
var querystring = require("querystring");

//Lets define a port we want to listen to
const PORT=8080; 

var whiteCards = {deck:[], notes:'answer cards'};
var blackCards = {deck:[], notes:'questions'};

//http://stackoverflow.com/questions/11286979/how-to-search-in-an-array-in-node-js-in-a-non-blocking-way

//    _                 _______          _    
//   | |               | |  _  \        | |   
//   | | ___   __ _  __| | | | |___  ___| | __
//   | |/ _ \ / _` |/ _` | | | / _ \/ __| |/ /
//   | | (_) | (_| | (_| | |/ /  __/ (__|   < 
//   |_|\___/ \__,_|\__,_|___/ \___|\___|_|\_\
                                         

function loadDeck(file, cards) {  
    // http://anwajler.com/node.html
    var path = file;
    var offset = 0;
    var buffer;
    var position = null;

    var fd = fs.openSync(path ,'rs');

    fs.stat(path, function(err, stats) {	
        buffer = new Buffer(stats.size);
        fs.open(path, 'r', function(err, fd) {
            console.log('File opened');
            fs.read(fd, buffer, offset, buffer.length, position, function(err, bytesRead, buffer) {
                console.log('Read ' + bytesRead + ' bytes from file');

                var bigString = buffer.toString();
                arrayOfLines = bigString.match(/[^\r\n]+/g); //http://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
                var started = false;
                for (var line in arrayOfLines) {
                    var splitLine = arrayOfLines[line].split('\t');//\s*[\s\t]\s*/);
                    var columnCount = 0;
                    for (var col in splitLine) {
                        columnCount++;
                        if (columnCount == 2) {
                            if (splitLine[col].trim().length == 0) continue; //ignore blank entries in column 2

                            var startTrigger = 'Cards Against Humanity:';							
                            var endTrigger='TOTALS';
                            
                            //console.log(splitLine[col].substr(0,startTrigger.length));
                            //console.log(startTrigger);
                            if (started == false) {
                                started = (splitLine[col].substr(0,startTrigger.length).toString() === startTrigger.toString());
                                //console.log('##################################################################' + started);
                            } else {
                                if (splitLine[col] === endTrigger) break;
                                cards.deck.push(splitLine[col]);
                            }
                        }
                    }
                }
                bigString = '';
                arrayOfLines = 0;
            });	
            fs.close(fd, function(err){
                console.log('File closed');
                //console.log(file + ' contents start');
                //for (var card in cards.deck) {
                //    console.log(cards.deck[card]);
                //}
                console.log(file + 'Deck:' + cards.deck.length);				
            });
        });	
    });	
}

//http://book.mixu.net/node/ch10.html

var players = { list: []/*, aliveTest: []*/ };
var playersMap = {};
var games = []; //{ list: { name: '', players: [] } };
var rounds = { };



//             _   _____                      
//            | | |  __ \                     
//   __ _  ___| |_| |  \/ __ _ _ __ ___   ___ 
//  / _` |/ _ \ __| | __ / _` | '_ ` _ \ / _ \
// | (_| |  __/ |_| |_\ \ (_| | | | | | |  __/
//  \__, |\___|\__|\____/\__,_|_| |_| |_|\___|
//   __/ |                                    
//  |___/  
       
function getGame(reqObj) {
    var name = '';
    try {
        name = reqObj.query.Game;
        console.log('@' + name);
    }
    catch(err) {
        console.log('er... ' + err);                    
    }
    return name;                
};


/*          _  ______ _                       
           | | | ___ \ |                      
  __ _  ___| |_| |_/ / | __ _ _   _  ___ _ __ 
 / _` |/ _ \ __|  __/| |/ _` | | | |/ _ \ '__|
| (_| |  __/ |_| |   | | (_| | |_| |  __/ |   
 \__, |\___|\__\_|   |_|\__,_|\__, |\___|_|   
  __/ |                        __/ |          
 |___/                        |___/  
  */
function getPlayer(reqObj) {
    var player = '';
    try {
        player = reqObj.query.Player;
        console.log('@' + player);
    }
    catch(err) {
        console.log('er... ' + err);                    
    }
    return player;
};       


function getCards(reqObj) {
    var cards = [];
    try {
        cards = JSON.parse( reqObj.query.Cards );
        console.log('@' + JSON.stringify(cards));
    }
    catch(err) {
        console.log('er... ' + err);       
    }
    return cards;
};                                                                                          
                                // _     _      
                               // | |   | |     
 // _ __  _ __ ___  __ _ _ __ ___ | |__ | | ___ 
// | '_ \| '__/ _ \/ _` | '_ ` _ \| '_ \| |/ _ \
// | |_) | | |  __/ (_| | | | | | | |_) | |  __/
// | .__/|_|  \___|\__,_|_| |_| |_|_.__/|_|\___|
// | |                                          
// |_| 


function preamble(reqObj) {
    var ret = {};
    ret.isOk = true;
    if (reqObj.query == null) ret.isOk = false;

    ret.game = getGame(reqObj);
    if (ret.game == '') ret.isOk = false;

    ret.playerName = getPlayer(reqObj);
    if (ret.playerName == '') ret.isOk = false;

    return ret;
};

/*          _   _    _ _     _ _       _____               _ 
           | | | |  | | |   (_) |     /  __ \             | |
  __ _  ___| |_| |  | | |__  _| |_ ___| /  \/ __ _ _ __ __| |
 / _` |/ _ \ __| |/\| | '_ \| | __/ _ \ |    / _` | '__/ _` |
| (_| |  __/ |_\  /\  / | | | | ||  __/ \__/\ (_| | | | (_| |
 \__, |\___|\__|\/  \/|_| |_|_|\__\___|\____/\__,_|_|  \__,_|
  __/ |                                                      
 |___/  
 */

function getWhiteCard(games, gameInfo) {
    return games[gameInfo.index].whiteCards[games[gameInfo.index].whiteCardIndex++];
}
/* 
            _  ______ _            _    _____               _ 
           | | | ___ \ |          | |  /  __ \             | |
  __ _  ___| |_| |_/ / | __ _  ___| | _| /  \/ __ _ _ __ __| |
 / _` |/ _ \ __| ___ \ |/ _` |/ __| |/ / |    / _` | '__/ _` |
| (_| |  __/ |_| |_/ / | (_| | (__|   <| \__/\ (_| | | | (_| |
 \__, |\___|\__\____/|_|\__,_|\___|_|\_\\____/\__,_|_|  \__,_|
  __/ |                                                       
 |___/     
 */

function getBlackCard(games, gameInfo) {
    return games[gameInfo.index].blackCards[games[gameInfo.index].blackCardIndex++];    
}

/*          _   _____                     _____          _           
           | | |  __ \                   |_   _|        | |          
  __ _  ___| |_| |  \/ __ _ _ __ ___   ___ | | _ __   __| | _____  __
 / _` |/ _ \ __| | __ / _` | '_ ` _ \ / _ \| || '_ \ / _` |/ _ \ \/ /
| (_| |  __/ |_| |_\ \ (_| | | | | | |  __/| || | | | (_| |  __/>  < 
 \__, |\___|\__|\____/\__,_|_| |_| |_|\___\___/_| |_|\__,_|\___/_/\_\
  __/ |                                                              
 |___/       */

function getGameIndex(games, pram) {
    var gameInfo = {};
    gameInfo.index = 0;
    gameInfo.gameExists = false;
    gameInfo.playerInGame = false;
    
    for (; gameInfo.index < games.length; gameInfo.index++) {
        if (games[gameInfo.index].game == pram.game) {
            gameInfo.gameExists = true;
            try {
                if (!games[gameInfo.index].list) continue;
            } catch(err) {
                continue;
            }                            

            console.log('players ' + games[gameInfo.index].list.length);
            
            var playerIndex = games[gameInfo.index].list.indexOf(pram.playerName);
            gameInfo.playerInGame = (playerIndex > -1) ? true : false;
            break;
        }
    }
    return gameInfo;
};

function replaceCards(games, gameInfo, pram, cards) {
    var heldCards = games[gameInfo.index].heldCards;
    var heldCardsIndexes = heldCards.get(pram.playerName);
    
    var removeIndexes = [];
    for (var cardIndex in heldCardsIndexes) {
        var cardDesc = whiteCards.deck[heldCardsIndexes[cardIndex]];
        var removeIndex = cards.indexOf(cardDesc);
        if (removeIndex > -1)  removeIndexes.push( heldCardsIndexes[cardIndex] );                    
    }
    
    // console.log('game.heldCardsIndexes: ' + JSON.stringify(heldCardsIndexes));
    // console.log('removeIndexes: ' + JSON.stringify(removeIndexes));
    
    var removeIndexesIndexes = []; //yo dawg
    for (var spentIndex in removeIndexes) {
        for (var index in heldCardsIndexes) {
            if (heldCardsIndexes[index] == removeIndexes[spentIndex]) {
                removeIndexesIndexes.push(index);
                break; 
            }
        }
    }                
    
    for (var removeThisIndexFromHeldCards in removeIndexesIndexes) {
        //console.log('remove this index from heldCardsIndexes' + removeIndexesIndexes[removeThisIndexFromHeldCards]);
        var newCard = getWhiteCard(games, gameInfo);
        heldCardsIndexes.splice(removeIndexesIndexes[removeThisIndexFromHeldCards], 1, newCard);
    }
};

function hasCardsBeenDelt(game, gameInfo, pram) {
    var retval = {};
    retval.cardsDelt = false;
    retval.hasCards = false;
    try {        
        retval.cardsDelt = (games[gameInfo.index].heldCards.keys().length > 0);
        retval.hasCards = games[gameInfo.index].heldCards.has(pram.playerName);
    } catch (err) {
        retval.cardsDelt = false ;                    
    }
    return retval;
};

function cloneRound(games, gameInfo, pram) {
        
    var cloneOfRound = JSON.parse( JSON.stringify(games[gameInfo.index].round) ); //clone
    cloneOfRound.heldCards = [];

    var heldCards = games[gameInfo.index].heldCards;
    var cards = heldCards.get(pram.playerName);

    for (var cardIndex in cards) {
        cloneOfRound.heldCards.push(whiteCards.deck[cards[cardIndex]]);
    }
    
    var playerIndex =  cloneOfRound.players.list.indexOf(pram.playerName);    
    
    cloneOfRound.haveSubmitted = false; 
    try {        
        cloneOfRound.haveSubmitted = (cloneOfRound.players.submitted[playerIndex].length > 0);
    } catch (err) { cloneOfRound.haveSubmitted = false; }
    
    cloneOfRound.haveVoted = false; 
    try {        
        cloneOfRound.haveVoted = (cloneOfRound.players.votes[playerIndex].length > 0);
    } catch (err) { cloneOfRound.haveVoted = false; }
    
    return cloneOfRound;
};

/* 
 _                     _ _     ______                           _   
| |                   | | |    | ___ \                         | |  
| |__   __ _ _ __   __| | | ___| |_/ /___  __ _ _   _  ___  ___| |_ 
| '_ \ / _` | '_ \ / _` | |/ _ \    // _ \/ _` | | | |/ _ \/ __| __|
| | | | (_| | | | | (_| | |  __/ |\ \  __/ (_| | |_| |  __/\__ \ |_ 
|_| |_|\__,_|_| |_|\__,_|_|\___\_| \_\___|\__, |\__,_|\___||___/\__|
                                             | |                    
                                             |_|      
 */

//We need a function which handles requests and send response
function handleRequest(req, res) {
    var reqObj = url.parse(req.url, true);

    var listProperties = function(req) {
        console.log(util.inspect(req));
        console.log('============================================');
    };
    console.log(reqObj.pathname);
    switch (reqObj.pathname) {
        case '/card':
            doCard(reqObj, res);
            break;

        case '/': //Ui
            console.log('index');
            doPageFile('./index.html', reqObj, res, true);
            break;

        case '/CreatePlayer':
            var doCreatePlayer = function(reqObj, res) {
                // ???REJECT DUPLICATE GAME NAMES???
                var isOk = true;
                if (reqObj.query == null) isOk = false;
                var playerName = getPlayer(reqObj);
                if (playerName == '') isOk = false;

                // cool
                // https://github.com/flesler/hashmap/releases

                if (isOk) {
                    players.list.push( { name: playerName, ip: req.ip } );
                    res.write(playerName);
                } else {
                    res.write('WTF');
                }
                res.end();
            };
            
            doCreatePlayer(reqObj, res);
            break;

        case '/ChooseGameUi':
            if (reqObj.query == null) break;
            var playerName = getPlayer(reqObj);
            if (playerName == '') break;

            doPageFile('ChooseGame.html', reqObj, res, true);
            break;

        case '/JoinGame':
            var doJoinGame = function(games, reqObj, res, pram, gameObj) {
                var pram = preamble(reqObj);
                if (!pram.isOk) return false;                    
                var gameInfo = getGameIndex(games, pram);                
                
                var cardState = hasCardsBeenDelt(games, gameInfo, pram);
                if (cardState.cardsDelt && !cardState.hasCards) return false;

                if (gameInfo.gameExists && !gameInfo.playerInGame) {                    
                    games[gameInfo.index].list.push(pram.playerName);
                }
                               
                if (gameInfo.gameExists) {
                    res.write(JSON.stringify(games[gameInfo.index]));
                } else {
                    var gameObj = {};
                    gameObj.game = 'WTF!!!1';
                    res.write(JSON.stringify(gameObj));
                }
                res.end();
                
                return true;
            };
            
            if (!doJoinGame(games, reqObj, res, pram, gameObj)) {
                res.write("I'm sorry Dave I can't let you do that");
                res.error = 405;
                res.end();
            }
            break;

        case '/CreateGame':            
            var doCreateGame = function(games, reqObj, pram, gameObj) {               
                var pram = preamble(reqObj);
                if (!pram.isOk) return false;
                
                // will currently alow duplicate names but not by design
                
                console.log(pram.playerName + ', ' + pram.game + ', ' + pram.isOk);
                
                if (pram.isOk) {
                    gameObj.game = pram.game;
                    var anArray = [];
                    gameObj.list = anArray;
                    gameObj.creator = pram.playerName;
                    gameObj.roundCount = 0; 
                    gameObj.heldCards = {};
                    games.push(gameObj);
                    //console.log('CreateGame:' + JSON.stringify( games[0] ));
                } 
                
                return true;
            };
            
            var gameObj = {};
            if (!doCreateGame(games, reqObj, pram, gameObj)) {
                gameObj.game = 'WTF!!';
            }
            
            res.write(JSON.stringify(gameObj));
            res.end();
            break;

        case '/CreateRound':
            var doCreateRound = function(games, reqObj, pram, gameObj) {
                
                var phaseOneAuthenticate = function (games, reqObj, pram) { 
                    var retObj = {};
                    retObj.result = false;
                    var pram = preamble(reqObj);
                    if (!pram.isOk) return retObj;
                    
                    retObj.gameInfo = getGameIndex(games, pram);
                    if (!retObj.gameInfo.gameExists) return retObj;
                        
                    var iMadeThisGame = (pram.player == retObj.gameInfo.creator);
                    if (!iMadeThisGame) return retObj;
                    
                    retObj.result = true;
                    return retObj;
                };
                var retObjPhaseOne = phaseOneAuthenticate(games, reqObj, pram);
                if (!retObjPhaseOne.result) return false;                

                
                var phaseTwoDealWithTheDeck = function(games, gameInfo, pram) {
                    var retObj = {};
                    retObj.result = false;                    
                    retObj.cardState = hasCardsBeenDelt(games, gameInfo, pram);
                    
                    if (!retObj.cardState.cardsDelt) { 
                    
                        if (games[gameInfo.index].roundCount > 0) return retObj; 
                       
                        var dealCards = function(games, gameInfo) {
                            // ??SHUFFLE THE CARDS??
                            games[gameInfo.index].blackCards = [];
                            games[gameInfo.index].blackCardIndex = 0;
                            for (var cardIndex in blackCards.deck) {
                                games[gameInfo.index].blackCards.push(cardIndex);
                            }

                            games[gameInfo.index].whiteCards = [];
                            games[gameInfo.index].whiteCardIndex = 0;
                            for (var cardIndex in whiteCards.deck) {
                                games[gameInfo.index].whiteCards.push(cardIndex);
                            }
                        };
                        
                        dealCards(games, gameInfo);
                    }
                    retObj.result = true;
                    return retObj;
                };                
                var retObjPhaseTwo = phaseTwoDealWithTheDeck(games, retObjPhaseOne.gameInfo, pram);
                if (!retObjPhaseTwo.result) return false;


                var phaseThreeRoundWeGoAgain = function(games, gameInfo, cardState) {
                    // phase three make a new round
                                    
                    console.log( JSON.stringify(gameInfo) );
                    
                    // get a question card
                    roundObj = {};
                    var useIndex = getBlackCard(games, gameInfo);
                    
                    roundObj.question = blackCards.deck[useIndex].replace(/________/g, '______');;            
                    var count = (roundObj.question .match(/______/g) || []).length;
                    
                    roundObj.questionBlankCount = count;
                    roundObj.players = { list:[], submitted:[], voted :[], };
                    roundObj.players.list = JSON.parse( JSON.stringify(games[gameInfo.index].list) ); //clone
                    roundObj.game = games[gameInfo.index].game; //(this is the game name)
                    
                    if (!cardState.cardsDelt) {
                        roundObj.roundCount = (++games[gameInfo.index].roundCount);
                    } else {
                        roundObj.roundCount = games[gameInfo.index].roundCount;
                    }
                    
                    games[gameInfo.index].round = roundObj;
                    return roundObj;
                };
                var gameInfo = retObjPhaseOne.gameInfo;
                var roundObj = phaseThreeRoundWeGoAgain(games, retObjPhaseOne.gameInfo, retObjPhaseTwo.cardState);
                
                
                var phaseFourTheCardsYoureDelt = function(games, gameInfo, roundObj) {
                    var heldCards 
                        = games[gameInfo.index].heldCards 
                            = new hashmap.HashMap();
                            
                    var playerList = roundObj.players.list;
                    for (var playerIndex in playerList) {                
                        var cardArray = [];
                        const FIVECARDS = 5;
                        for (var i = 0; i < FIVECARDS; i++) 
                            cardArray.push(getWhiteCard(games, gameInfo));

                        var player = playerList[playerIndex];
                        heldCards.set(player, cardArray);
                        //console.log(JSON.stringify(heldCards));
                    }                    
                };
                if (!retObjPhaseTwo.cardState.cardsDelt)
                    phaseFourTheCardsYoureDelt(games, retObjPhaseOne.gameInfo, roundObj);

                
                var thisGame = games[gameInfo.index];
                res.write(JSON.stringify(thisGame.round));                
                return true;
            };
            
            if (!doCreateRound(games, reqObj, pram, gameObj)) {                
                res.write('why are you doing that dave');
            }
            res.end();
            break;

        case '/PlayRoundUi':
            var pram = preamble(reqObj);
            if (!pram.isOk) break;
            var gameInfo = getGameIndex(games, pram);
            if (!gameInfo.gameExists || !gameInfo.playerInGame) break;
            
            if (games[gameInfo.index].roundCount == 0) break;
            
            doPageFile('VirtualCards.html', reqObj, res, true);
            break;

        case '/SubmitAnswer':
            var pram = preamble(reqObj);
            if (!pram.isOk) break;
            var gameInfo = getGameIndex(games, pram);
            if (!gameInfo.gameExists || !gameInfo.playerInGame) break;
                   
            var cards = getCards(reqObj);
            
            if (cards.length != games[gameInfo.index].round.questionBlankCount) break;
                        
            var alreadySubmitted = games[gameInfo.index].round.players.submitted;
            var isAlreadySubmitted = false;
                            
            for (var s in alreadySubmitted) {
                if (JSON.stringify(alreadySubmitted[s]) == cards) isAlreadySubmitted = true;
                if (isAlreadySubmitted) break;
            }
            
            //???OR IF ANYTHING IN SUBMITTED IS ALREADY SUBMITTED??? do we really need to match what was delt to them?

            if (!isAlreadySubmitted) {
                var playerList = games[gameInfo.index].round.players.list;
                var playerIndex = playerList.indexOf(pram.playerName);
                if (playerIndex == -1) break;
                
                alreadySubmitted[playerIndex] = JSON.parse( JSON.stringify(cards) ) /*clone wars*/;
                replaceCards(games, gameInfo, pram, cards);
            }
            
            var cloneOfRound = cloneRound(games, gameInfo, pram);
            res.write(JSON.stringify(cloneOfRound));
            res.end();
            break;

        case '/UpdateRound':
            var pram = preamble(reqObj);
            if (!pram.isOk) break;
            var gameInfo = getGameIndex(games, pram);			
            if (!gameInfo.gameExists || !gameInfo.playerInGame) break;

            var cloneOfRound = cloneRound(games, gameInfo, pram);
            
            res.write(JSON.stringify(cloneOfRound));
            res.end();
            break;
            
        default:
            try {
                var isHtml = reqObj.pathname.substr(-4) == 'html';
                doPageFile('.' + reqObj.pathname, reqObj, res, isHtml);
            } catch(err) {
                console.log(err.message);
            }
    }
}

/*

submit answer (formatted string)

submit vote (formatted string)

*/

function doCard(reqObj, res) {
    console.log('card');
    res.write('CARD');
    res.end();
}

function doPageFile(file, reqObj, res, isHtml) {
    //console.log(util.inspect(reqObj));
    //console.log(util.inspect(res));
    try {
        console.log(file);
        setTimeout( function() {
            fs.readFile(file, function (err, data){
                console.log('error: ' + err);
                if (isHtml) {
                    res.writeHeader(200, {"Content-Type": "text/html"});
                }
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

// load cards
loadDeck('./cards/CardsAgainstHumanityMainDeckQuestions.txt', blackCards);
loadDeck('./cards/CardsAgainstHumanityMainDeckWhite.txt', whiteCards);

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});