
//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var util = require('util');
var hashmap = require('./hashmap-2.0.4/hashmap');
var querystring = require("querystring");

//Lets define a port we want to listen to
//const PORT=8080; 

var whiteCardsMain = {deck:[], deckTitle: '', blankTypes: new hashmap.HashMap(), notes:'answer cards'};
var blackCardsMain = {deck:[], deckTitle: '', blankTypes: new hashmap.HashMap(), notes:'questions'};

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

    //we are not opening the file with the correct (ascii) encoding
    //var fd = fs.openSync(path ,'rs');

    //fs.stat(path, function(err, stats) {	
        //buffer = new Buffer(stats.size);
        //fs.open(path, 'r', function(err, fd) {
            console.log('File opened');
            var bytesRead = 0;
            fs.readFile(file, 'ascii', function(err, buffer) {
            //fs.read(fd, buffer, offset, buffer.length, position, function(err, bytesRead, buffer) {
                console.log('Read ' + bytesRead + ' bytes from file');
                
                bytesRead = buffer.length;
                
                var bigString = buffer.toString();
                arrayOfLines = bigString.match(/[^\r\n]+/g); //http://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
                var started = false;
                for (var line in arrayOfLines) {
                    var splitLine = arrayOfLines[line].split('\t');
                    var columnCount = 0;
                    for (var col in splitLine) {
                        columnCount++;
                        if (columnCount == 2) {
                            if (splitLine[col].trim().length == 0) continue; //ignore blank entries in column 2

                            var startTrigger = 'Cards Against Humanity:';							
                            var endTrigger='TOTALS';
                            
                            if (splitLine[col].substr(0,startTrigger.length).toString() === startTrigger.toString()) {
                                deckTitle = splitLine[col]
                                    .substr(startTrigger.length)
                                    .trim();
                                    
                                console.log('deckTitle: ' + deckTitle);
                                cards.deckTitle += ', ' + deckTitle;
                                
                                started = true;
                            } 
                            else {
                                if (splitLine[col] === endTrigger) break;
                                var pushCardText = splitLine[col] //opening with wrong encoding at the moment
                                        .replace('™', '\u2122').replace('®', '\u00AE');
                                        
                                cards.deck.push(pushCardText);
                                
                                var countingTheBlanks = (splitLine[col].indexOf('_') > -1);
                                var remainder = splitLine[col];
                                while (countingTheBlanks) {
                                    var lineLength = remainder.length;
                                    var chari = remainder.indexOf('_');
                                    remainder = remainder.substr(chari);
                                    for (chari = 0;;chari++) {
                                        if ( chari == lineLength) break;
                                        if (remainder[chari] != '_') break;
                                    }
                                    
                                    var key = remainder
                                        .substr(0, chari)
                                        .trim();
                                        
                                    if (!cards.blankTypes.has(key)) {
                                        //console.log('key = ' + key + ', (' + cards.blankTypes.keys().length + ')');
                                        cards.blankTypes.set(key, key);
                                    }

                                    if (chari == lineLength) break;
                                    remainder = remainder.substr(chari);
                                    countingTheBlanks = (remainder.indexOf('_') > -1);
                                }
                                
                                
                            }
                        }
                    }
                }
                bigString = '';
                arrayOfLines = 0;
            });	
            //fs.close(fd, function(err){
            //    console.log('File closed');
            //    console.log(file + 'Deck:' + cards.deck.length);				
            //});
        //});	
    //});	
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
        console.log('errr... ' + err);                    
    }
    
    return (typeof name == 'undefined') ? '' : name;

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
        console.log('er....... ' + err);                    
    }
    
    return (typeof player == 'undefined') ? '' : player;
};       


function getCards(reqObj) {
    var cards = [];
    try {
        cards = JSON.parse( decodeURIComponent(reqObj.query.Cards) );
        console.log('@' + JSON.stringify(decodeURIComponent(cards)));
    }
    catch(err) {
        console.log('erererr... ' + err);       
    }
    return cards;
};

function getVote(reqObj) {
    var vote = -1;
    try {
        vote = JSON.parse( reqObj.query.Vote );
        console.log('@' + JSON.stringify(vote));
    }
    catch(err) {
        console.log('eeeeer...... ' + err);       
    }
    return vote;
}

function getCurrent(reqObj) {
    var current = 0;
    try {
        current = JSON.parse( reqObj.query.Current );
        console.log('@' + JSON.stringify(current));
    }
    catch(err) {
        console.log('rrrrreeeeer...... ' + err);       
    }
    return current;
}

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
    return games[gameInfo.index].whiteCards[ games[gameInfo.index].whiteCardIndex++ ];
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
    var retval = games[gameInfo.index].blackCards[ games[gameInfo.index].blackCardIndex++ ];
    return retval;
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
        var cardDesc = whiteCardsMain.deck[heldCardsIndexes[cardIndex]];
        var removeIndex = cards.indexOf(cardDesc);
        if (removeIndex > -1) removeIndexes.push( heldCardsIndexes[cardIndex] );                    
    }
        
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

function canDoNextRound(games, gameInfo) {
    var waitForPriorRound = false;

    var checkPriorGame = (games[gameInfo.index].roundCount > 0);
    if (checkPriorGame) {
        var playerCount = games[gameInfo.index].list.length;
        
        var votes = games[gameInfo.index].votes.values();
        var readyForNextRound = games[gameInfo.index].readyForNextRound.values(); //.indexOf(null) > -1) return false;

        waitForPriorRound = (votes.length != playerCount); //not everyone has yet voted                
        waitForPriorRound = waitForPriorRound || (readyForNextRound.length != playerCount);
        waitForPriorRound = waitForPriorRound || (readyForNextRound.indexOf(false) > -1);

    }
    return waitForPriorRound;
};

function cloneRound(games, gameInfo, pram) {

    // //clones, take all at the same time
    // var cloneOfRound = JSON.parse( JSON.stringify(games[gameInfo.index].round) ); 
    // var gameVotes = JSON.parse( JSON.stringify(games[gameInfo.index].votes) );
    // var gameNextRound = JSON.parse( JSON.stringify(games[gameInfo.index].readyForNextRound) );

    //clones, take all at the same time
    var cloneOfRound = JSON.parse( JSON.stringify(games[gameInfo.index].round) ); 
    
    //var gameNextRound = JSON.parse( JSON.stringify(games[gameInfo.index].readyForNextRound) );
    cloneOfRound.heldCards = [];

    var heldCardsSource = games[gameInfo.index].heldCards;
    var cards = heldCardsSource.get(pram.playerName);

    var encodedCards = [];
    for (var cardIndex in cards) {
        encodedCards.push( encodeURIComponent( whiteCardsMain.deck[cards[cardIndex]] ) );
    }
    cloneOfRound.heldCards = encodedCards;
    
    var playerIndex =  cloneOfRound.players.list.indexOf(pram.playerName);    
    var playerName = games[gameInfo.index].list[playerIndex];
    
    cloneOfRound.haveSubmitted = false; 
    try {        
        cloneOfRound.haveSubmitted = (cloneOfRound.players.submitted[playerIndex].length > 0);
    } catch (err) { cloneOfRound.haveSubmitted = false; }
        
        
    cloneOfRound.haveVoted = false;    
    cloneOfRound.haveVoted = games[gameInfo.index].votes.has( playerName );
    if (cloneOfRound.haveVoted) {
        cloneOfRound.votedFor = games[gameInfo.index].votes.get( playerName );
    } else {
        cloneOfRound.votedFor = null;
    }
    
    var voteCount = 0;
        
    cloneOfRound.players.voted = [];
    for (var player in cloneOfRound.players.list) { cloneOfRound.players.voted.push(false); }

    cloneOfRound.players.readyForNextRound = [];
    for (var player in cloneOfRound.players.list) { cloneOfRound.players.readyForNextRound.push(false); }

    var playerScores = [];
    for (var player in cloneOfRound.players.list) { playerScores.push(0); }
    
    var readyForNextRoundCount = 0;
    for (var player in cloneOfRound.players.list) {
        var otherPlayerName = cloneOfRound.players.list[player];

        if (games[gameInfo.index].votes.has( otherPlayerName )) {
            var votedFor = games[gameInfo.index].votes.get( otherPlayerName );
            cloneOfRound.players.voted[player] = true;
            playerScores[ votedFor ] += 1;
            voteCount++;
        } else {
            cloneOfRound.players.voted[player] = false;
        }
        
        if (games[gameInfo.index].readyForNextRound.has( otherPlayerName )) {
            cloneOfRound.players.readyForNextRound[player] = games[gameInfo.index].readyForNextRound.get( otherPlayerName );
            if (cloneOfRound.players.readyForNextRound[player])
                readyForNextRoundCount++;
        } else {
            cloneOfRound.players.readyForNextRound[player] = false;
        }
        
    }    
    cloneOfRound.haveScores = false;
    
    var playerCount = cloneOfRound.players.list.length;
    if (cloneOfRound.haveVoted && voteCount == playerCount) {
        cloneOfRound.scores = playerScores;        
        cloneOfRound.haveScores = true;
    } else {
        cloneOfRound.scores = [];
    }

    if (cloneOfRound.haveScores) {
        if (cloneOfRound.players.readyForNextRound.indexOf(false) == -1) {
            cloneOfRound.readyForNextRound = true;
        }
        
    }
    
    cloneOfRound.readyForNextRound = (readyForNextRoundCount == playerCount);

    //console.log('cloneOfRound: %s', JSON.stringify(cloneOfRound) );
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
    console.log(' ---------------------------------> ' + reqObj.pathname);
    switch (reqObj.pathname) {
        // case '/card':
            // doCard(reqObj, res);
            // break;

        case '/': //Ui
            console.log('index');
            doPageFile('./index.html', reqObj, res);
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
            var ok = false;
            while (true) {
                if (reqObj.query == null) break;
                var playerName = getPlayer(reqObj);
                if (playerName == '') break;

                doPageFile('ChooseGame.html', reqObj, res);
                ok = true;
                break;                
            }
            if (!ok) res.end();
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
                return true;
            };
            
            if (!doJoinGame(games, reqObj, res, pram, gameObj)) {
                res.write("I'm sorry Dave I can't let you do that");
                res.error = 405;
            }
            res.end();
            break;

        case '/CreateGame':
            var doCreateGame = function(games, reqObj, pram, gameObj) {               
                var pram = preamble(reqObj);
                if (!pram.isOk) return false;
                
                // will currently alow duplicate names but not by design
                
                // player can create a game when it's already created but not by design
                
                console.log(pram.playerName + ', ' + pram.game + ', ' + pram.isOk);
                
                if (pram.isOk) {
                    gameObj.game = pram.game;
                    var anArray = [];
                    gameObj.list = anArray;
                    gameObj.creator = pram.playerName;
                    gameObj.createdOn = new Date();
                    gameObj.roundCount = 0; 
                    gameObj.heldCards = null;
                    gameObj.votes = new hashmap.HashMap();
                    gameObj.readyForNextRound = new hashmap.HashMap();
                    gameObj.playerActivity = new hashmap.HashMap();
                    games.push(gameObj);
                    //console.log(JSON.stringify(gameObj));
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
            var phaseOneAuthenticate = function (games, reqObj) { 
                var retObj = {};
                retObj.result = false;
                retObj.pram = preamble(reqObj);
                if (!retObj.pram.isOk) return retObj;
                
                retObj.gameInfo = getGameIndex(games, retObj.pram);
                if (!retObj.gameInfo.gameExists) return retObj;
                retObj.result = true;
                
                retObj.Current = getCurrent(reqObj);
                retObj.iMadeThisGame = (retObj.pram.playerName == games[retObj.gameInfo.index].creator);
                //if (!retObj.iMadeThisGame) return retObj;
                

                return retObj;
            };

            var doCreateRound = function(games, reqObj, pram, gameObj, retObjPhaseOne) {
                                           
                var phaseTwoDealWithTheDeck = function(games, gameInfo, pram, initGame) {
                    var retObj = {};
                    retObj.result = false;                    
                    retObj.cardState = hasCardsBeenDelt(games, gameInfo, pram);
                    
                    
                    if (initGame) {
                        var dealCards = function(games, gameInfo) {

                            var shuffle = function (array) { //http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
                                var currentIndex = array.length, temporaryValue, randomIndex ;

                                // While there remain elements to shuffle...
                                while (0 !== currentIndex) {

                                    // Pick a remaining element...
                                    randomIndex = Math.floor(Math.random() * currentIndex);
                                    currentIndex -= 1;

                                    // And swap it with the current element.
                                    temporaryValue = array[currentIndex];
                                    array[currentIndex] = array[randomIndex];
                                    array[randomIndex] = temporaryValue;
                                }

                                return array;
                            }
                            
                            console.log('initialising game');
                            
                            // ??SHUFFLE THE CARDS??
                            games[gameInfo.index].blackCards = [];
                            games[gameInfo.index].blackCardIndex = 0;
                            for (var cardIndex in blackCardsMain.deck) {
                                games[gameInfo.index].blackCards.push(cardIndex);
                            }

                            games[gameInfo.index].whiteCards = [];
                            games[gameInfo.index].whiteCardIndex = 0;
                            for (var cardIndex in whiteCardsMain.deck) {
                                games[gameInfo.index].whiteCards.push(cardIndex);
                            }
                            
                            games[gameInfo.index].blackCards = shuffle(games[gameInfo.index].blackCards);
                            games[gameInfo.index].whiteCards = shuffle(games[gameInfo.index].whiteCards);
                        };
                        
                        dealCards(games, gameInfo);
                    }
                    retObj.result = true;
                    return retObj;
                };
                
                var initGame = (games[retObjPhaseOne.gameInfo.index].roundCount == 0);
                var retObjPhaseTwo = phaseTwoDealWithTheDeck(games, retObjPhaseOne.gameInfo, pram, initGame);
                if (!retObjPhaseTwo.result) return false;


                var phaseThreeRoundWeGoAgain = function(games, gameInfo) {
                    console.log('allocating round info');
                    var roundObj = {};              
                    var useIndex = getBlackCard(games, gameInfo);
                    var question = blackCardsMain.deck[useIndex];


                     // accomodate the regular expression a little
                    const TheOneWeWant = '______';
                    console.log('the before question:'+question);
                    roundObj.question = question; 
                    if (roundObj.question.substr(question.length-1, 1) == '_')
                        roundObj.question += ' ';
                    
                    if (roundObj.question.substr(0, 1) == '_')
                        roundObj.question = ' ' + roundObj.question
                    
                    
                    // WIP
                    const punctuation = [' ','"','!','?',':',';','#','.',',','-'];
                    const expressionForPunctuation = [' ','"','\!','\?','\:',';','#','\.',',','-'];
                    var regexp = new RegExp("/[A-Z|a-z]_{7,14}\./g");
                    // WIP
                    
                    
                    roundObj.question = roundObj.question.replace(/ _{7,14}\./g, ' '+TheOneWeWant+'.');
                    roundObj.question = roundObj.question.replace(/ _{7,14}\?/g, ' '+TheOneWeWant+'?');
                    roundObj.question = roundObj.question.replace(/ _{7,14}\!/g, ' '+TheOneWeWant+ '!');
                    roundObj.question = roundObj.question.replace(/ _{7,14};/g, ' '+TheOneWeWant+';');
                    roundObj.question = roundObj.question.replace(/ _{7,14}\:/g, ' '+TheOneWeWant+':');
                    roundObj.question = roundObj.question.replace(/ _{7,14} /g, ' '+TheOneWeWant+' ');
                    roundObj.question = roundObj.question.replace(/ _{7,14},/g, ' '+TheOneWeWant+',');
                    roundObj.question = roundObj.question.replace(/ _{7,14}"/g, ' '+TheOneWeWant+'"');

                    roundObj.question = roundObj.question.replace(/"_{7,14}\./g, '"'+TheOneWeWant+'.');
                    roundObj.question = roundObj.question.replace(/"_{7,14}\?/g, '"'+TheOneWeWant+'?');
                    roundObj.question = roundObj.question.replace(/"_{7,14}\!/g, '"'+TheOneWeWant+ '!');
                    roundObj.question = roundObj.question.replace(/"_{7,14};/g, '"'+TheOneWeWant+';');
                    roundObj.question = roundObj.question.replace(/"_{7,14}\:/g, '"'+TheOneWeWant+':');
                    roundObj.question = roundObj.question.replace(/"_{7,14} /g, '"'+TheOneWeWant+' ');
                    roundObj.question = roundObj.question.replace(/"_{7,14},/g, '"'+TheOneWeWant+',');
                    roundObj.question = roundObj.question.replace(/"_{7,14}"/g, '"'+TheOneWeWant+'"');
                    
                    
                    roundObj.question = roundObj.question.replace(/ _{1,5}\./g, ' '+TheOneWeWant+'.');
                    roundObj.question = roundObj.question.replace(/ _{1,5}\?/g, ' '+TheOneWeWant+'?');
                    roundObj.question = roundObj.question.replace(/ _{1,5}\!/g, ' '+TheOneWeWant+ '!');
                    roundObj.question = roundObj.question.replace(/ _{1,5};/g, ' '+TheOneWeWant+';');
                    roundObj.question = roundObj.question.replace(/ _{1,5}\:/g, ' '+TheOneWeWant+':');
                    roundObj.question = roundObj.question.replace(/ _{1,5} /g, ' '+TheOneWeWant+' ');
                    roundObj.question = roundObj.question.replace(/ _{1,5},/g, ' '+TheOneWeWant+',');
                    roundObj.question = roundObj.question.replace(/ _{1,5}"/g, ' '+TheOneWeWant+'"');

                    roundObj.question = roundObj.question.replace(/"_{1,5}\./g, '"'+TheOneWeWant+'.');
                    roundObj.question = roundObj.question.replace(/"_{1,5}\?/g, '"'+TheOneWeWant+'?');
                    roundObj.question = roundObj.question.replace(/"_{1,5}\!/g, '"'+TheOneWeWant+ '!');
                    roundObj.question = roundObj.question.replace(/"_{1,5};/g, '"'+TheOneWeWant+';');
                    roundObj.question = roundObj.question.replace(/"_{1,5}\:/g, '"'+TheOneWeWant+':');
                    roundObj.question = roundObj.question.replace(/"_{1,5} /g, '"'+TheOneWeWant+' ');
                    roundObj.question = roundObj.question.replace(/"_{1,5},/g, '"'+TheOneWeWant+',');
                    roundObj.question = roundObj.question.replace(/"_{1,5}"/g, '"'+TheOneWeWant+'"');
                    

                    var count = (roundObj.question.match(/______/g) || []).length;
                    console.log('the after question :'+roundObj.question);
                    if (count == 0) {
                        count = 1;
                    }

                    
                    roundObj.question = encodeURIComponent( roundObj.question );
                    roundObj.questionBlankCount = count;
                    roundObj.players = { list:[], submitted:[], voted :[], readyForNextRound: [] };
                    roundObj.players.list = JSON.parse( JSON.stringify(games[gameInfo.index].list) ); //clone
                    roundObj.game = games[gameInfo.index].game; //(this is the game name)

                    roundObj.roundCount = ( ++games[gameInfo.index].roundCount );
                    
                    delete games[gameInfo.index].votes;
                    games[gameInfo.index].votes = new hashmap.HashMap(); 
                    delete games[gameInfo.index].readyForNextRound;

                    games[gameInfo.index].readyForNextRound = new hashmap.HashMap();

                    games[gameInfo.index].round = null;
                    games[gameInfo.index].round = roundObj;
                    
                    //console.log(JSON.stringify(roundObj));

                    return roundObj;
                };
                
                // Only the creator can make the first round
                if (initGame && !retObjPhaseOne.iMadeThisGame) return true;
                
                // Any tom, dick or harry can make subsiquent rounds as long as the round hasn't been created already
                if (retObjPhaseOne.Current != games[retObjPhaseOne.gameInfo.index].roundCount) return true;
                
                var roundObj = phaseThreeRoundWeGoAgain(games, retObjPhaseOne.gameInfo);


                var phaseFourTheCardsYoureDelt = function(games, gameInfo, roundObj) {
                    console.log('dealing first cards');
                    var heldCards 
                        = games[gameInfo.index].heldCards 
                            = new hashmap.HashMap();

                    var playerList = roundObj.players.list;
                    for (var playerIndex in playerList) {
                        var cardArray = [];
                        const TENCARDS = 10;
                        for (var i = 0; i < TENCARDS; i++) 
                            cardArray.push(getWhiteCard(games, gameInfo));

                        var player = playerList[playerIndex];
                        heldCards.set(player, cardArray);
                    }                    
                };
                
                if (initGame) 
                    phaseFourTheCardsYoureDelt(games, retObjPhaseOne.gameInfo, roundObj);
              
                return true;
            };
            
            var retObjPhaseOne = phaseOneAuthenticate(games, reqObj);
            //console.log('retObjPhaseOne:', JSON.stringify(retObjPhaseOne));

            var waitForPriorRound = canDoNextRound(games, retObjPhaseOne.gameInfo);
                 
            if (retObjPhaseOne.result && !waitForPriorRound && doCreateRound(games, reqObj, retObjPhaseOne.pram, gameObj, retObjPhaseOne)) {                
                var gameIndex = retObjPhaseOne.gameInfo.index;
                res.write( JSON.stringify(cloneRound(games, retObjPhaseOne.gameInfo, retObjPhaseOne.pram)) );
            } else {
                console.log('why are you doing that dave');
                res.write('why are you doing that dave');
            }
            res.end();
            break;

        case '/PlayRoundUi':
            var ok =false;
            for (; ok = true;) {
                var pram = preamble(reqObj);
                //console.log(JSON.stringify(pram));
                if (!pram.isOk) break;
                var gameInfo = getGameIndex(games, pram);
                //console.log(JSON.stringify(gameInfo));
                if (!gameInfo.gameExists || !gameInfo.playerInGame) break;
                
                //console.log(JSON.stringify(games[gameInfo.index]));
                if (games[gameInfo.index].roundCount == 0) break;
                
                doPageFile('VirtualCards.html', reqObj, res);
                ok = true;
                break;
            }            
            if (!ok) res.end();
            break;
            
        case '/SubmitAnswer':
            var ok =false
            while(true) {
                var doSubmitAnswerChecks = function(games, reqObj) {
                    var b = {};
                    b.result = false;
                    
                    b.pram = preamble(reqObj);
                    if (!b.pram.isOk) 
                        return b;
                    
                    b.gameInfo = getGameIndex(games, b.pram);
                    if (!b.gameInfo.gameExists || !b.gameInfo.playerInGame) 
                        return b;
                    
                    b.cardsSubmitted = getCards(reqObj);            
                    if (b.cardsSubmitted.length != games[b.gameInfo.index].round.questionBlankCount) 
                        return b;

                    b.isInList = false;
                    
                    var listOfCards = games[b.gameInfo.index].round.players.submitted;
                    for (var s in listOfCards) {
                        if (JSON.stringify(listOfCards[s]) == b.cardsSubmitted) b.isInList = true;
                        if (b.isInList) return b;
                    }
                    
                    b.result = true;
                    return b;
                };

                var b = doSubmitAnswerChecks(games, reqObj);
                if (!b.result) break;
                


                if (!b.isAlreadySubmitted) {
                    var playerList = games[b.gameInfo.index].list;
                    var playerIndex = playerList.indexOf(b.pram.playerName);
                    if (playerIndex == -1) break;
                    
                    var alreadySubmitted = games[b.gameInfo.index].round.players.submitted;
                    alreadySubmitted[playerIndex] = JSON.parse( JSON.stringify(b.cardsSubmitted) );
                    replaceCards(games, b.gameInfo, b.pram, b.cardsSubmitted);
                }
            
                var cloneOfRound = cloneRound(games, b.gameInfo, b.pram);
                res.write(JSON.stringify(cloneOfRound));
                
                ok = true;
                break;
            }
            res.end();
            break;
            
            
        case '/SubmitVote':
            var doSubmitVoteChecks = function(games, reqObj) {
                var b = {};
                b.result = false;
                
                b.pram = preamble(reqObj);
                if (!b.pram.isOk) 
                    return b;
                
                b.gameInfo = getGameIndex(games, b.pram);
                if (!b.gameInfo.gameExists || !b.gameInfo.playerInGame) 
                    return b;
                
                b.vote = getVote(reqObj);
                if (b.vote == -1) return b;
                
                b.result = true;
                return b;    
            };
            var b = doSubmitVoteChecks(games, reqObj);
            
            var ok = false
            while(true) {
                if (!b.result) break;

                var playerList = games[b.gameInfo.index].list;
                var myIndex = playerList.indexOf(b.pram.playerName);
                if (myIndex == -1) break;
                
                games[b.gameInfo.index].votes.set(playerList[myIndex].toString(), b.vote);                
                var cloneOfRound = cloneRound(games, b.gameInfo, b.pram);
                
                res.write('{ yes: "You voted", boomshanka:"well done" }');
                ok = true;
                break;
            }
            res.end();
            break;

        case '/UpdateRound':
            var ok = false;
            while (true) {
                var pram = preamble(reqObj);
                if (!pram.isOk) break;
                var gameInfo = getGameIndex(games, pram);			
                if (!gameInfo.gameExists || !gameInfo.playerInGame) break;

                var cloneOfRound = cloneRound(games, gameInfo, pram);

                res.write(JSON.stringify(cloneOfRound));
                ok = true;
                break;
            }
            
            res.end();
            break;
        
        case '/NextRound':
            var pram = preamble(reqObj);
            if (!pram.isOk) break;
            var gameInfo = getGameIndex(games, pram);			
            if (!gameInfo.gameExists || !gameInfo.playerInGame) {
                res.end();
                break;
            }
            var Current = getCurrent(reqObj);
            if (typeof Current == 'undefined') {
                res.end();
                break;
            }
            console.log('%s ready for next round', pram.playerName);
            
            // if the game round is already created don't worry about it
            // hint: Next Round is clicked by all three players and the last of the three triggers the 
            // CreateRound. The other two still click Next Round but this is from the previous round
            
            if (Current == games[gameInfo.index].roundCount) {
                games[gameInfo.index].readyForNextRound.set(pram.playerName.toString(), true);
            }
            
            var cloneOfRound = cloneRound(games, gameInfo, pram);
            res.write(JSON.stringify( cloneOfRound ) );
            res.end();
            break;
            
        case '/DumpGames':
            res.writeHeader(200, {"Content-Type": "text/plain"});
            var gameName = getGame(reqObj);
            if (gameName == '') {
                for (var g in games) {
                    res.write(JSON.stringify(games[g].game));
                }
            } else {
                for (var g in games) {
                    if (games[g].game == gameName) {
                        res.write(JSON.stringify(games[g]));
                        break;
                    }
                }
            }
            res.end();
            break;

        case '/DumpPlayers':
            res.writeHeader(200, {"Content-Type": "text/plain"});
            var playerName = getPlayer(reqObj);
            if (playerName == '') {
                console.log('players list:' + JSON.stringify(players.list));
                res.write(JSON.stringify(players.list));
            } else {
               
                for (var p in players.list) {
                    if (players.list[p].name == playerName) {
                        res.write(JSON.stringify(players.list[p]));
                        var inGames = [];
                        for (var g in games) {
                            if (games[g].list.indexOf(playerName) > -1) {
                                inGames.push(games[g].game);
                            }
                        }
                        res.write(JSON.stringify(inGames));
                        break;
                    }
                }
            }
            res.end();
            break;

        default:
            try {
                doPageFile('.' + reqObj.pathname, reqObj, res);
            } catch(err) {
                console.log(err.message);
            }
    }
}

/*

submit answer (formatted string)

submit vote (formatted string)

*/

// function doCard(reqObj, res) {
    // console.log('card');
    // res.write('CARD');
    // res.end();
// }

function doPageFile(file, reqObj, res) {
    //console.log(util.inspect(reqObj));
    //console.log(util.inspect(res));
    try {//reqObj.pathname
        var isHtml = file.toLowerCase().substr(-4) == 'html';
        var isCSS = file.toLowerCase().substr(-3) == 'css';
        //console.log('isHtml:' + isHtml);
        //console.log('isCSS' + isCSS);
        console.log(file);
        setTimeout( function() {
            fs.readFile(file, function (err, data){
                if (err != null) console.log('error: ' + err);
                if (isHtml) {
                    res.writeHeader(200, {"Content-Type": "text/html"});
                } else if (isCSS) {
                    res.writeHeader(200, {"Content-Type": "text/css"});
                }
                res.write(data);
                res.end();
            });
        }, 0);
    } catch (err) {
        console.log(err.message);
    }
}


var birdFile = function () {    
    fs.readFile('./ChrisDotCom-hrr.txt', 'ascii', function (err, data){
        console.log(data);
        if (err != null) {
            console.log(err);
        }
    });

};



// load cards
loadDeck('./cards/CardsAgainstHumanityMainDeckQuestions.txt', blackCardsMain);
loadDeck('./cards/CardsAgainstHumanityExpansionsQuestions.txt', blackCardsMain);
loadDeck('./cards/CardsAgainstHumanityCrabsQuestions.txt', blackCardsMain);

loadDeck('./cards/CardsAgainstHumanityMainDeck.txt', whiteCardsMain);
loadDeck('./cards/CardsAgainstHumanityExpansions.txt', whiteCardsMain);
loadDeck('./cards/CardsAgainstHumanityCrabs.txt', whiteCardsMain);

birdFile();
console.log('http://www.chris.com/ascii/');
    

//Create a server
var server = http.createServer(handleRequest);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

//Lets start our server
server.listen(server_port, server_ip_address, function(){ //PORT
    //Callback triggered when server is successfully listening. Hurray!
    console.log('Server listening on: http://'+ server_ip_address+':%s', server_port); //PORT localhost
});
