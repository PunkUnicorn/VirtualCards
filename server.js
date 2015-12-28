
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

//var whiteCardsMain = {deck:[], deckTitle: '', blankTypes: new hashmap.HashMap(), notes:'answer cards'};
//var blackCardsMain = {deck:[], deckTitle: '', blankTypes: new hashmap.HashMap(), notes:'questions'};

const example_deckInfo_instance = { startIndex:0, endIndex:0 };
var allCards = [ {deck: [], deckInfo: new hashmap.HashMap(/*deckTitle, deckInfo*/)},
                 {deck: [], deckInfo: new hashmap.HashMap(/*deckTitle, deckInfo*/)} ];
const WHITE = 0;
const BLACK = 1;               

//var date = new Date();


const TheOneWeWant = '______';
function TEST_makeUnderscoresTheSame() {
    var tryIt = function(testQuestion, expectedAnswer) {
        console.log('');
        //console.log(testQuestion);
        var result = makeUnderscoresTheSame(testQuestion);
        console.log(testQuestion + '<-ACTUAL')
        console.log(result+'<-RESULT');
        console.log(expectedAnswer+'<-EXPECTED');
        console.log('');
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log('');
        if (expectedAnswer == result) {
            return true;
        }
        return false;
    }
    const test1a = 'ah _ hello __  ___ ! _____ ? _______ yes ________ no _________';
    const expected1a = 'ah ______ hello ______  ______ ! ______ ? ______ yes ______ no ______';

    const test1b = 'maybe __________ word ___________ up ____________ cmon _____________ yee _____________';
    const expected1b = 'maybe ______ word ______ up ______ cmon ______ yee ______';
    
    if (!tryIt(test1a, expected1a)) console.log('first a failed xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    if (!tryIt(test1b, expected1b)) console.log('first b failed xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    
    // const test2 = 'the _\' quick __" brown ___! fox _____: jumped _______;over ________. the _________, lazy __________? manager ___________ ';
    // const expected2 = '______\' ______" ______! ______: ______. ______, ______? ______ ';
    // if (!tryIt(test2, expected2)) console.log('second failed xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    const test2a = '"_ the "__" quick "___!" brown"_____: Dance moves that are just sex"_______;';
    const test2b = 'jumped "________. over "_________, the "__________? lazy "___________ MORTAL COMBAT!!!.';
    
    const expected2a = '"______ the "______" quick "______!" brown"______: Dance moves that are just sex"______;';
    const expected2b = 'jumped "______. over "______, the "______? lazy "______ MORTAL COMBAT!!!.';
    
    if (!tryIt(test2a, expected2a)) console.log('second a failed xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    if (!tryIt(test2b, expected2b)) console.log('second b failed xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
};

function makeUnderscoresTheSame(question) {
    
    // WIP
    const punctuation = [' ','"','!','?',':',';','#','.',',','-'];
    const expressionForPunctuation = [' ','"','\!','\?','\:',';','#','\.',',','-'];
    //var regexp = new RegExp("/[A-Z|a-z]_{7,14}\./g");
    //delete regexp;
    // WIP
    
    //var question = questionP;
    
     // accomodate the regular expression a little
    //question = question;
    if (question.substr(question.length-1, 1) == '_') 
        question += ' ';
    
    if (question.substr(0, 1) == '_')
        question = ' ' + question;

    question = question.replace(/ _{7,14}\./g, ' '+TheOneWeWant+'.');
    question = question.replace(/ _{7,14}\?/g, ' '+TheOneWeWant+'?');
    question = question.replace(/ _{7,14}\!/g, ' '+TheOneWeWant+ '!');
    question = question.replace(/ _{7,14};/g, ' '+TheOneWeWant+';');
    question = question.replace(/ _{7,14}\:/g, ' '+TheOneWeWant+':');
    question = question.replace(/ _{7,14} /g, ' '+TheOneWeWant+' ');
    question = question.replace(/ _{7,14},/g, ' '+TheOneWeWant+',');
    question = question.replace(/ _{7,14}"/g, ' '+TheOneWeWant+'"');

    question = question.replace(/"_{7,14}\./g, '"'+TheOneWeWant+'.');
    question = question.replace(/"_{7,14}\?/g, '"'+TheOneWeWant+'?');
    question = question.replace(/"_{7,14}\!/g, '"'+TheOneWeWant+ '!');
    question = question.replace(/"_{7,14};/g, '"'+TheOneWeWant+';');
    question = question.replace(/"_{7,14}\:/g, '"'+TheOneWeWant+':');
    question = question.replace(/"_{7,14} /g, '"'+TheOneWeWant+' ');
    question = question.replace(/"_{7,14},/g, '"'+TheOneWeWant+',');
    question = question.replace(/"_{7,14}"/g, '"'+TheOneWeWant+'"');
    
    
    question = question.replace(/ _{1,5}\./g, ' '+TheOneWeWant+'.');
    question = question.replace(/ _{1,5}\?/g, ' '+TheOneWeWant+'?');
    question = question.replace(/ _{1,5}\!/g, ' '+TheOneWeWant+ '!');
    question = question.replace(/ _{1,5};/g, ' '+TheOneWeWant+';');
    question = question.replace(/ _{1,5}\:/g, ' '+TheOneWeWant+':');
    question = question.replace(/ _{1,5} /g, ' '+TheOneWeWant+' ');
    question = question.replace(/ _{1,5},/g, ' '+TheOneWeWant+',');
    question = question.replace(/ _{1,5}"/g, ' '+TheOneWeWant+'"');

    question = question.replace(/"_{1,5}\./g, '"'+TheOneWeWant+'.');
    question = question.replace(/"_{1,5}\?/g, '"'+TheOneWeWant+'?');
    question = question.replace(/"_{1,5}\!/g, '"'+TheOneWeWant+ '!');
    question = question.replace(/"_{1,5};/g, '"'+TheOneWeWant+';');
    question = question.replace(/"_{1,5}\:/g, '"'+TheOneWeWant+':');
    question = question.replace(/"_{1,5} /g, '"'+TheOneWeWant+' ');
    question = question.replace(/"_{1,5},/g, '"'+TheOneWeWant+',');
    question = question.replace(/"_{1,5}"/g, '"'+TheOneWeWant+'"');
    
    return question.trim();
};


// Hello

//    _                 _______          _    
//   | |               | |  _  \        | |   
//   | | ___   __ _  __| | | | |___  ___| | __
//   | |/ _ \ / _` |/ _` | | | / _ \/ __| |/ /
//   | | (_) | (_| | (_| | |/ /  __/ (__|   < 
//   |_|\___/ \__,_|\__,_|___/ \___|\___|_|\_\
                                         
function loadDeckSimple(getIndexVar, file, colour /*'black' 'white' or 'mixed' for unknown*/, startDeckTitle, doAcceptCard, doHasDeckInfo, doSetDeckInfo) {
    //console.log('loadDeckSimple:', file, colour);

    var doUnderscoreTest = false;
    
    var buffer = fs.readFileSync(file, 'utf8');

    const startTrigger = 'Cards Against Humanity:';	
    console.log('bytes read:', buffer.length);
    var bigString = buffer.toString();        
    arrayOfLines = bigString.match(/[^\r\n]+/g); //http://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
    //console.log(arrayOfLines.length);
    
    var makeDeckInfo = function() {
        return { startIndex:0, endIndex:0 };
    };
    
    var makeDeckTitle = function (deckTitle, colour) {
        var key = deckTitle.trim() + ' (' + colour + ')';
        var count = 0;
        while (doHasDeckInfo(colour, key)) {
            key += ' and another';
            count++;
        }
        return key;
    };
    
    var deckTitle = makeDeckTitle(startDeckTitle, colour);
    var deckInfo = makeDeckInfo();
    //var cardNo = startCardNo;
    var setStartIndex = true;
    var setEndIndex = false;
    var lastDecentLineNo = 0;
    var isBlackCard = false;
    for (var lineIndex in arrayOfLines) {
        var line = arrayOfLines[lineIndex].trim();
        if (line.length == 0) continue;    
        
        if (line.substr(0, startTrigger.length) === startTrigger) {
            //console.log('new heading ');
            if (setEndIndex) {
                deckInfo.endIndex = lastDecentLineNo;
                //console.log('deck end:', deckTitle, JSON.stringify(deckInfo));
                
                console.log('Deck: ' + deckTitle);
                
                doSetDeckInfo(colour, deckTitle, /*JSON.parse(JSON.stringify(*/deckInfo/*))*/);
                deckInfo = makeDeckInfo();
            }

            var possibleDeckTitle = line
                .substr(startTrigger.length)
                .trim();
            
            if (possibleDeckTitle.length > 0) {
                deckTitle = makeDeckTitle(possibleDeckTitle, colour);
            } else {
                //continue;
                deckTitle = startDeckTitle;
            }

            setStartIndex = true;
            setEndIndex = true;
        }
        else {
            // underscores test
            isBlackCard = (colour == 'black') || (colour == 'mixed' &&  (line.indexOf('_') > -1 || line.indexOf('?') == line.length-1));
            if (isBlackCard) {
                var testLine = makeUnderscoresTheSame(line);                
                //If any underscores after this we failed at making them standard
                var failed = testLine
                        .replace(/______/g, 'XXXXXX')
                        .indexOf('_') > -1 ? true : false;
                                                
                if (failed) {
                    console.log('ERROR ERIC:'+testLine);
                }
                
                line = testLine;
            }
            
            if (doAcceptCard(isBlackCard, line)) {
                if (setStartIndex) {
                    deckInfo.startIndex = getIndexVar(isBlackCard, false);                
                    setStartIndex = false;
                    setEndIndex = true;
                }
            
            //cards.deck.push(line);
            
                lastDecentLineNo = getIndexVar(isBlackCard, false);
                getIndexVar(isBlackCard, true);
            }
        }
    }

    if (setEndIndex) {
        deckInfo.endIndex = lastDecentLineNo;
        setEndIndex = false;
        doSetDeckInfo(colour, deckTitle, JSON.parse(JSON.stringify(deckInfo)));
    }

    //deckInfo.startIndex = cardNo;
    //allCards.deckInfo.set(possibleDeckTitle, deckInfo);        

    bigString = '';
    arrayOfLines = 0;
    
    //return cardNo;
}

function loadAllDecks() {
    var addCard = function(isBlackCard, card) {
        if (isBlackCard) 
            allCards[BLACK].deck.push(card);
        else 
            allCards[WHITE].deck.push(card);
        
        return true;
    }
    var hasDeckInfo = function(colour, deckTitle) {
        switch (colour) {
            case 'black': return allCards[BLACK].deckInfo.has(deckTitle);
            case 'white': return allCards[WHITE].deckInfo.has(deckTitle);

            case 'mixed':
            default:
                return ( allCards[BLACK].deckInfo.has(deckTitle)
                         || allCards[WHITE].deckInfo.has(deckTitle) );
        }
    }
    var setDeckInfo = function(colour, deckTitle, deckInfo) {
        switch (colour) {
            case 'black':
                allCards[BLACK].deckInfo.set(deckTitle, deckInfo);
                break;
                
            case 'white':
                allCards[WHITE].deckInfo.set(deckTitle, deckInfo);
                break;
                
            case 'mixed':
            default:
                if (!allCards[BLACK].deckInfo.has(deckTitle)) 
                    allCards[BLACK].deckInfo.set(deckTitle, deckInfo);
                
                if (!allCards[WHITE].deckInfo.has(deckTitle)) 
                    allCards[WHITE].deckInfo.set(deckTitle, deckInfo);
                
                break;
        }        
        return true;
    }
    
    var startWhiteCardNo = 0;
    var startBlackCardNo = 0;
    
    var getIndexVar = function(isBlackCard, incrementItToo) {
        if (isBlackCard)
            return (incrementItToo) ? startBlackCardNo++ : startBlackCardNo;
        else
            return (incrementItToo) ? startWhiteCardNo++ : startWhiteCardNo;
    };
    loadDeckSimple(getIndexVar,'./cards/CaHMainBlack.txt', 'black', 'Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar, './cards/CaHMainWhite.txt', 'white', 'Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHUkMainBlack.txt', 'black', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHUkMainWhite.txt', 'white', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHExpansionsBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHExpansionsWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHCrabsAdjustHumidityBlack.txt', 'black', 'Crabs Adjust Humidity', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHCrabsAdjustHumidityWhite.txt', 'white','Crabs Adjust Humidity', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHHolidaySpecialsMixed.txt', 'mixed', 'Holiday Special', addCard, hasDeckInfo, setDeckInfo);
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
        var cardDesc = allCards[WHITE].deck[heldCardsIndexes[cardIndex]];
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
        encodedCards.push( encodeURIComponent( allCards[WHITE].deck[cards[cardIndex]] ) );
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

function purgeOldGames(games, now) {
    // delete games that haven't had activity for pfffft... 3 hours (give them time to have  second breakfast and watch an episode of Game of Thrones)
}

function updateScore(gameObj) {
	//var game = games[gameInfo.indxed];
	//var playerScores = [];	
	
	//for ( var countish in gameObj.list) playerScores[player] = 0;
	
	for (var player in gameObj.list) {
		var otherPlayerName = gameObj.list[player];

		if (gameObj.votes.has( otherPlayerName )) {
            var votedFor = gameObj.votes.get( otherPlayerName );
			updatePlayerScore(gameObj, gameObj.list[player], 1);
            //playerScores[ votedFor ] += 1;
		}
	}
}

function updatePlayerScore(gameObj, playerName, score){
	playerActivity = gameObj.playerActivity.get(playerName);
    playerActivity.score += score;    
}

function updateActivity(gameObj, playerName, lastActivity){
    var hasThem = gameObj.playerActivity.has(playerName);
    if (hasThem) {
        playerActivity = gameObj.playerActivity.get(playerName);
    } else {
        playerActivity = {};
		playerActivity.score = 0;
    }
    playerActivity.lastActivityOn = Date.now();
    playerActivity.lastActivity = lastActivity;    
    if (!hasThem) gameObj.playerActivity.set(playerName, playerActivity);
}

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
    };
    console.log(' ---------------------------------> ' + reqObj.pathname);
    switch (reqObj.pathname) {
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
                    var send = {};
                    send.game = games[gameInfo.index].game;
                    send.creator = games[gameInfo.index].creator;
                    send.list = games[gameInfo.index].list;
                    send.roundCount = games[gameInfo.index].roundCount;
                    
                    res.write(JSON.stringify(send));
                    updateActivity(games[gameInfo.index], pram.playerName, 'Joined');
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
                
                if (pram.isOk) {
                    gameObj.game = pram.game;
                    var anArray = [];
                    gameObj.list = anArray;
                    gameObj.creator = pram.playerName;
                    gameObj.createdOn = Date.now();
                    gameObj.roundCount = 0; 
                    gameObj.heldCards = null;
                    gameObj.votes = new hashmap.HashMap();
                    gameObj.readyForNextRound = new hashmap.HashMap();
                    gameObj.playerActivity = new hashmap.HashMap();
                    games.push(gameObj);
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
                            
                            games[gameInfo.index].blackCards = [];
                            games[gameInfo.index].blackCardIndex = 0;
                            for (var cardIndex in allCards[BLACK].deck) {
                                games[gameInfo.index].blackCards.push(cardIndex);
                            }

                            games[gameInfo.index].whiteCards = [];
                            games[gameInfo.index].whiteCardIndex = 0;
                            for (var cardIndex in allCards[WHITE].deck) {
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

                var phaseThreeRoundWeGoAgain = function(games, gameInfo, initGame) {
                    console.log('allocating round info');
                    var roundObj = {};              
                    var useIndex = getBlackCard(games, gameInfo);
                    var question = allCards[BLACK].deck[useIndex];                    
					
                    roundObj.question = makeUnderscoresTheSame(question);
                    var count = (roundObj.question.match(/______/g) || []).length;
                    //console.log('the after question :'+roundObj.question);
                    if (count == 0) {
						if (roundObj.question[roundObj.question.length-1] == '?') { //allow any number of cards if no blanks and no question mark
							var inYourHand = roundObj.question.indexOf('in your hand');
							if (inYourHand > -1) {
								var checkBeforeForAmount = roundObj.question.substr(0, inYourHand); //'in your hand' specifies the number of cards as written quantity
								const amounts = ['any', 'one', 'two', 'three', 'four'];
								for (var i=0; i < amounts.length; i++) {
									var foundAmount = checkBeforeForAmount.indexOf(amounts[i]);
									if (foundAmount > -1) {
										count = amounts.indexOf(foundAmount);
										if (count == 0)
											count = -1; //any
										
										break;
									}
								}
							} else {
								count = 1;	
							}							
						} else { 
							count = -1
						}
                    }

                    roundObj.question = encodeURIComponent( roundObj.question );
                    roundObj.questionBlankCount = count;
                    roundObj.players = { list:[], submitted:[], voted :[], readyForNextRound: [] };
                    roundObj.players.list = JSON.parse( JSON.stringify(games[gameInfo.index].list) ); //clone
                    roundObj.game = games[gameInfo.index].game; //(this is the game name)
                    roundObj.createdOn = Date.now();

                    roundObj.roundCount = ( ++games[gameInfo.index].roundCount );
                    
					//update scores from previous round
					if (!initGame) updateScore(games[gameInfo.index]);
					
                    games[gameInfo.index].votes.clear(); 
                    games[gameInfo.index].readyForNextRound.clear();
                    
                    if (typeof games[gameInfo.index].round != 'undefined'  && games[gameInfo.index].round != null) {
                        delete games[gameInfo.index].round;
                    }
                    games[gameInfo.index].round = roundObj;
                    
                    //console.log(JSON.stringify(roundObj));

                    return roundObj;
                };
                
                // Only the creator can make the first round
                if (initGame && !retObjPhaseOne.iMadeThisGame) return true;
                
                // Any tom, dick or harry can make subsiquent rounds as long as the round hasn't been created already
                if (retObjPhaseOne.Current != games[retObjPhaseOne.gameInfo.index].roundCount) return true;
                
                var roundObj = phaseThreeRoundWeGoAgain(games, retObjPhaseOne.gameInfo, initGame);


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
                if (!pram.isOk) break;
                var gameInfo = getGameIndex(games, pram);
                if (!gameInfo.gameExists || !gameInfo.playerInGame) break;
                if (games[gameInfo.index].roundCount == 0) break;
                
                doPageFile('VirtualCards.html', reqObj, res);
                ok = true;
                break;
            }            
            if (!ok) res.end();
            break;
            
        case '/SubmitAnswer': //just '/Answer'
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
					var rightCardsSubmitted = (b.cardsSubmitted.length != games[b.gameInfo.index].round.questionBlankCount);
					var anyCardsAllowed = (games[b.gameInfo.index].round.questionBlankCount == -1 && b.cardsSubmitted.length > 0);
                    if (rightCardsSubmitted || anyCardsAllowed) 
                        return b;

                    b.isInList = false;
                    
                    var listOfCards = games[b.gameInfo.index].round.players.submitted;
                    for (var s in listOfCards) {
                        if (JSON.stringify(listOfCards[s]) == b.cardsSubmitted) b.isInList = true;
                        if (b.isInList) return b;
                    }
                    
                    updateActivity(games[b.gameInfo.index], b.pram.playerName, 'Submitted');
                    
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
            
            
        case '/SubmitVote': //just '/Vote'
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
                
                updateActivity(games[b.gameInfo.index], b.pram.playerName, 'Voted');

                res.write('{ yes: "You voted", boomshanka:"well done" }');
                ok = true;
                break;
            }
            res.end();
            break;

        case '/UpdateRound': // '/GetRound'
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
            updateActivity(games[gameInfo.index], pram.playerName, 'Next');                
            res.write(JSON.stringify( cloneOfRound ) );
            res.end();
            break;
            
        case '/Games':
            res.writeHeader(200, {"Content-Type": "application/json"});
            var gamesNames = [];
            for (var game in games) {
                gamesNames.push(games[game].game);
            }
            var giveThem = {};
            giveThem.games = gameNames;
            res.write(JSON.stringify(giveThem));
            res.end();
            break;
			
		case '/Players':
			var pram = preamble(reqObj);
            if (pram.game == '') {
				res.end();
				break;
			}
			
            res.writeHeader(200, {"Content-Type": "application/json"});
			var playerNames = [];

			var gameObj = null;
			for (var index = 0; index < games.length; index++) {
				if (games[index].game == pram.game) {
					gameObj = games[index];
					break;
				}
			}
			if (gameObj == null){
				res.end();
				break;
			} 
			
			//var gameInfo = getGameIndex(games, pram);
			var retObj = {};
			retObj.activity = [];
			retObj.list = [];
			retObj.game = pram.game;
			console.log(JSON.stringify(gameObj));
			for (var player in gameObj.list) {
				var name = gameObj.list[player];
				
				var playerName = gameObj.list[player];
				console.log(JSON.stringify(playerName));
				//var lastActivity = games[gameInfo.index].playerActivity.get[name];
				var hasThem = gameObj.playerActivity.has(playerName);
				var playerActivity = null;
				if (hasThem) {
					playerActivity = gameObj.playerActivity.get(playerName);
				} else {
					continue;
				}
				console.log('pusheed');
				retObj.activity.push(playerActivity);
				retObj.list.push(playerName);
			}
			res.write(JSON.stringify(retObj));
			res.end();
			break;
            
        case '/DumpGames':
            res.writeHeader(200, {"Content-Type": "text/plain"});  //application/json
            var gameName = getGame(reqObj);
            if (gameName == '') {
                for (var g in games) {
                    res.write(JSON.stringify(games[g].game));
                }
            } else {
                for (var g in games) {
                    if (games[g].game == gameName) {
                        res.write(games[g].game + ', rounds:' + games[g].roundCount + ', players:' + JSON.stringify(games[g].list));
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


function doPageFile(file, reqObj, res) {
    try {
        var isHtml = file.toLowerCase().substr(-4) == 'html';
        var isCSS = file.toLowerCase().substr(-3) == 'css';

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
        if (err != null) console.log(err);
    });
};
    
function afterLoadDumpDecks(diag) {
    var cardIndex = 0;
    for (var colouredDeck in allCards) {
        var thisDeck = allCards[colouredDeck];
        var deckKeys = thisDeck.deckInfo.keys();
        
        if (diag) {
            console.log('');
            console.log('');
            console.log('Deck count:', deckKeys.length);
            console.log('');
        }
        
        for (var deck in deckKeys) {
            var deckInfo = thisDeck.deckInfo.get(deckKeys[deck]);
            
            if (diag) {
                console.log(deckKeys[deck], '    <---===============<<<');
                console.log(JSON.stringify(deckInfo));
                console.log('\tfirst:', thisDeck.deck[deckInfo.startIndex]);
                console.log('\tlast:', thisDeck.deck[deckInfo.endIndex]);
            }
            cardIndex++;
            if (diag) console.log('');
        }
    }

    birdFile();
    console.log('http://www.chris.com/ascii/');
    TEST_makeUnderscoresTheSame();
};
    
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var isHosted = (server_port != 8080);

function startServer() {
        
    //Create a server
    var server = http.createServer(handleRequest);

    

    //Lets start our server
    server.listen(server_port, server_ip_address, function(){ //PORT
        //Callback triggered when server is successfully listening. Hurray!
        console.log('Server listening on: http://'+ server_ip_address+':%s', server_port); //PORT localhost
    });
};

loadAllDecks();
afterLoadDumpDecks(false);//!isHosted);
startServer();