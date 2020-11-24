
//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
//var path = require('path');
var url = require('url');
var util = require('util');
var hashmap = require('./hashmap-2.0.4/hashmap');
//var querystring = require("querystring");
var os = require('os');
//var crypto = require('crypto');

const example_deckInfo_instance = { startIndex:0, endIndex:0 };
var allCards = [ {deck: [], deckInfo: new hashmap.HashMap(/*deckTitle, deckInfo*/)},
                 {deck: [], deckInfo: new hashmap.HashMap(/*deckTitle, deckInfo*/)} ];
const WHITE = 0;
const BLACK = 1;

//var date = new Date();

// https://stackoverflow.com/questions/194846/is-there-any-kind-of-hash-code-function-in-javascript
String.prototype.hashCode = function () {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

const TheOneWeWant = '______';
function TEST_makeUnderscoresTheSame() {
    var tryIt = function(testQuestion, expectedAnswer) {
        console.log('');
        //console.log(testQuestion);
        var result = makeUnderscoresTheSame(testQuestion);
        console.log(testQuestion + '<-INPUT')
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

    const test2a = '"_ _- the "__" quick "___!" brown"_____: Dance moves that are just sex"_______;';
    const test2b = 'jumped "________. over "_________, the "__________? lazy "___________ MORTAL COMBAT!!!.';

    const expected2a = '"______ ______- the "______" quick "______!" brown"______: Dance moves that are just sex"______;';
    const expected2b = 'jumped "______. over "______, the "______? lazy "______ MORTAL COMBAT!!!.';

    if (!tryIt(test2a, expected2a)) console.log('second a failed xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    if (!tryIt(test2b, expected2b)) console.log('second b failed xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
};

function makeUnderscoresTheSame(question) {

    // WIP
    const punctuation = [' ','"','“','”','!','?',':',';','#','.',',','-'];
    const expressionForPunctuation = [' ','"','“','”','\!','\?','\:',';','#','\.',',','-'];
    //var regexp = new RegExp("/[A-Z|a-z]_{7,14}\./g");
    //delete regexp;
    // WIP


     // accomodate the regular expression a little
    //question = question;
    if (question.substr(question.length-1, 1) == '_')
        question += ' ';

    if (question.substr(0, 1) == '_')
        question = ' ' + question

    question = question.replace('“', '"');
    question = question.replace('”', '"');

    question = question.replace(/ _{7,14}\./g, ' '+TheOneWeWant+'.');
    question = question.replace(/ _{7,14}\?/g, ' '+TheOneWeWant+'?');
    question = question.replace(/ _{7,14}\!/g, ' '+TheOneWeWant+ '!');
    question = question.replace(/ _{7,14};/g, ' '+TheOneWeWant+';');
    question = question.replace(/ _{7,14}\:/g, ' '+TheOneWeWant+':');
    question = question.replace(/ _{7,14} /g, ' '+TheOneWeWant+' ');
    question = question.replace(/ _{7,14},/g, ' '+TheOneWeWant+',');
    question = question.replace(/ _{7,14}"/g, ' '+TheOneWeWant+'"');
    question = question.replace(/ _{7,14}-/g, ' '+TheOneWeWant+'-');

    question = question.replace(/"_{7,14}\./g, '"'+TheOneWeWant+'.');
    question = question.replace(/"_{7,14}\?/g, '"'+TheOneWeWant+'?');
    question = question.replace(/"_{7,14}\!/g, '"'+TheOneWeWant+ '!');
    question = question.replace(/"_{7,14};/g, '"'+TheOneWeWant+';');
    question = question.replace(/"_{7,14}\:/g, '"'+TheOneWeWant+':');
    question = question.replace(/"_{7,14} /g, '"'+TheOneWeWant+' ');
    question = question.replace(/"_{7,14},/g, '"'+TheOneWeWant+',');
    question = question.replace(/"_{7,14}"/g, '"'+TheOneWeWant+'"');
    question = question.replace(/"_{7,14}-/g, '"'+TheOneWeWant+'-');

    question = question.replace(/ _{1,5}\./g, ' '+TheOneWeWant+'.');
    question = question.replace(/ _{1,5}\?/g, ' '+TheOneWeWant+'?');
    question = question.replace(/ _{1,5}\!/g, ' '+TheOneWeWant+ '!');
    question = question.replace(/ _{1,5};/g, ' '+TheOneWeWant+';');
    question = question.replace(/ _{1,5}\:/g, ' '+TheOneWeWant+':');
    question = question.replace(/ _{1,5} /g, ' '+TheOneWeWant+' ');
    question = question.replace(/ _{1,5},/g, ' '+TheOneWeWant+',');
    question = question.replace(/ _{1,5}"/g, ' '+TheOneWeWant+'"');
    question = question.replace(/ _{1,5}-/g, ' '+TheOneWeWant+'-');

    question = question.replace(/"_{1,5}\./g, '"'+TheOneWeWant+'.');
    question = question.replace(/"_{1,5}\?/g, '"'+TheOneWeWant+'?');
    question = question.replace(/"_{1,5}\!/g, '"'+TheOneWeWant+ '!');
    question = question.replace(/"_{1,5};/g, '"'+TheOneWeWant+';');
    question = question.replace(/"_{1,5}\:/g, '"'+TheOneWeWant+':');
    question = question.replace(/"_{1,5} /g, '"'+TheOneWeWant+' ');
    question = question.replace(/"_{1,5},/g, '"'+TheOneWeWant+',');
    question = question.replace(/"_{1,5}"/g, '"'+TheOneWeWant+'"');
    question = question.replace(/"_{1,5}-/g, '"'+TheOneWeWant+'-');

    return question.trim();
};


// Hello

//    _                 _______          _
//   | |               | |  _  \        | |
//   | | ___   __ _  __| | | | |___  ___| | __
//   | |/ _ \ / _` |/ _` | | | / _ \/ __| |/ /
//   | | (_) | (_| | (_| | |/ /  __/ (__|   <
//   |_|\___/ \__,_|\__,_|___/ \___|\___|_|\_\

function loadDeckSimple(tags, getIndexVar, file, colour /*'black' 'white' or 'mixed' for unknown*/, startDeckTitle, doAcceptCard, doHasDeckInfo, doSetDeckInfo) {
    var doUnderscoreTest = false;

    var buffer = fs.readFileSync(file, 'utf8');

    const startTrigger = 'Cards Against Humanity:';
    console.log('bytes read:', buffer.length);
    var bigString = buffer.toString();
    arrayOfLines = bigString.match(/[^\r\n]+/g); //http://stackoverflow.com/questions/5034781/js-regex-to-split-by-line

    var makeDeckInfo = function(tags) {
        return { startIndex:0, endIndex:0, tags:tags };
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
    var deckInfo = makeDeckInfo(tags);
    //var cardNo = startCardNo;
    var setStartIndex = true;
    var setEndIndex = false;
    var lastDecentLineNo = 0;
    var isBlackCard = false;
    for (var lineIndex in arrayOfLines) {
        var line = arrayOfLines[lineIndex].trim();
        if (line.length == 0) continue;

        if (line.substr(0, startTrigger.length) === startTrigger) {
            if (setEndIndex) {
                deckInfo.endIndex = lastDecentLineNo;
                console.log('Deck: ' + deckTitle);

                doSetDeckInfo(colour, deckTitle, deckInfo);
                deckInfo = makeDeckInfo(tags);
            }

            var possibleDeckTitle = line
                .substr(startTrigger.length)
                .trim();

            if (possibleDeckTitle.length > 0) {
                deckTitle = makeDeckTitle(possibleDeckTitle, colour);
            } else {
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

    bigString = '';
    arrayOfLines = 0;
}

/*


    //loadDeckSimple(getIndexVar,'./cards/CaHCrabsAdjustHumidityBlack.txt', 'black', 'Crabs Adjust Humidity', addCard, hasDeckInfo, setDeckInfo);
    //loadDeckSimple(getIndexVar,'./cards/CaHCrabsAdjustHumidityWhite.txt', 'white','Crabs Adjust Humidity', addCard, hasDeckInfo, setDeckInfo);
    //loadDeckSimple(getIndexVar,'./cards/CaHHolidaySpecialsMixed.txt', 'mixed', 'Holiday Special', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple(getIndexVar, './cards/CaHExpansionsBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar, './cards/CaHExpansionsWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple(getIndexVar,'./cards/CaHUkMainBlack.txt', 'black', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHUkMainWhite.txt', 'white', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple(getIndexVar,'./cards/CaHExpansion90sBlack.txt', 'black', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar,'./cards/CaHExpansion90sWhite.txt', 'white', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple(getIndexVar, './cards/CaHJamieQBlack.txt', 'black', 'Jamie Q', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple(getIndexVar, './cards/CaHJamieQWhite.txt', 'white', 'Jamie Q', addCard, hasDeckInfo, setDeckInfo);

    // loadDeckSimple(getIndexVar,'./cards/CaHDevOpsAgainstHumanityBlack.txt', 'black', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
    // loadDeckSimple(getIndexVar,'./cards/CaHDevOpsAgainstHumanityWhite.txt', 'white', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);

 */ 

function getDeckList() {
    //const decklist = allCards[WHITE].deckInfo.keys().concat(allCards[BLACK].deckInfo.keys())
    //    .map(m => m.replace(" (white)", "").replace(" (black)", ""));    
    //const uniqueArray = [...new Set(decklist)];
    //return uniqueArray;

    const deckDetails = allCards[WHITE].deckInfo.keys().map(function( value, index) {
        return {
            selected:true,
            tags: allCards[WHITE].deckInfo.get(value).tags.split(',').join(', '), 
            title:value.replace(" (white)", "")
        };
    });

    return deckDetails;
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



// DEBUG
//    loadDeckSimple('expansion,test', getIndexVar,'./cards/testQuestions.txt', 'black', 'Test cards', addCard, hasDeckInfo, setDeckInfo);
//    loadDeckSimple('expansion,test', getIndexVar, './cards/testAnswers.txt', 'white', 'Test cards', addCard, hasDeckInfo, setDeckInfo);
// DEBUG

    /////////loadDeckSimple(getIndexVar, './cards/CaHExpansionsBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    /////////loadDeckSimple(getIndexVar, './cards/CaHExpansionsWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
	
    loadDeckSimple('country,AU', getIndexVar, './cards/CaHAustraliaMainBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('country,AU', getIndexVar, './cards/CaHAustraliaMainWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,crabs', getIndexVar, './cards/CaHCrabsAdjustHumidityBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,crabs', getIndexVar, './cards/CaHCrabsAdjustHumidityWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,devops', getIndexVar, './cards/CaHDevOpsAgainstHumanityBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,devops', getIndexVar, './cards/CaHDevOpsAgainstHumanityWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,90s', getIndexVar,'./cards/CaHExpansion90sBlack.txt', 'black', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,90s', getIndexVar,'./cards/CaHExpansion90sWhite.txt', 'white', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('country,CA', getIndexVar, './cards/CaHExpansionCanadianConversionBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('country,CA', getIndexVar, './cards/CaHExpansionCanadianConversionWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,houseofcards', getIndexVar, './cards/CaHExpansionHouseOfCardsBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,houseofcards', getIndexVar, './cards/CaHExpansionHouseOfCardsWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,pax', getIndexVar, './cards/CaHExpansionOopsBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,pax', getIndexVar, './cards/CaHExpansionOopsWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,pax', getIndexVar, './cards/CaHExpansionPaxVariousBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,pax', getIndexVar, './cards/CaHExpansionPaxVariousWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,reject', getIndexVar, './cards/CaHExpansionRejectPackBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,reject', getIndexVar, './cards/CaHExpansionRejectPackWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
  
    loadDeckSimple('expansion,science', getIndexVar, './cards/CaHExpansionScienceBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,science', getIndexVar, './cards/CaHExpansionScienceWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion', getIndexVar, './cards/CaHExpansionsBlack.txt', 'black', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion', getIndexVar, './cards/CaHExpansionsWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);

    loadDeckSimple('expansion,box', getIndexVar, './cards/CaHExpansionBoxWhite.txt', 'white', 'Expansions', addCard, hasDeckInfo, setDeckInfo);
    
    loadDeckSimple('country,UK', getIndexVar,'./cards/CaHUkMainBlack.txt', 'black', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('country,UK', getIndexVar,'./cards/CaHUkMainWhite.txt', 'white', 'UK/AU Main Deck', addCard, hasDeckInfo, setDeckInfo);
	
    loadDeckSimple('expansion,qanon', getIndexVar, './cards/CaHJamieQBlack.txt', 'black', 'Q-tard 2020', addCard, hasDeckInfo, setDeckInfo);
    loadDeckSimple('expansion,qanon', getIndexVar, './cards/CaHJamieQWhite.txt', 'white', 'Q-tard 2020', addCard, hasDeckInfo, setDeckInfo); 
}


//http://book.mixu.net/node/ch10.html

//var players = { list: []/*, aliveTest: []*/ };
//var playersMap = {};
var games = []; //{ list: { name: '', players: [] } };
//var rounds = { };



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

// Convert to 32bit integer 
function stringToHash(string) {                             
    var hash = 0; 
    
    if (string.length == 0) return hash; 
    
    for (i = 0; i < string.length; i++) { 
        char = string.charCodeAt(i); 
        hash = ((hash << 5) - hash) + char; 
        hash = hash & hash; 
    }                     
    return hash; 
} 

function getPlayerChecksum(name) {
    return stringToHash(name);
}

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
        if (!player) return '';
        console.log('@' + player);
        var playerCheck = player.split('_');
        if (playerCheck.length !== 2) {
            reqObj.isOk = false;
            console.log('er wut....... ');
            return '';
        }
        var checkSum = getPlayerChecksum(playerCheck[0]);
        if (checkSum != playerCheck[1]) {
            reqObj.isOk = false;
            console.log('er wut.. ');
            return '';
        }    
    }
    catch(err) {
        reqObj.isOk = false;
        console.log('er....... ' + err);
    }
    


    return (typeof player == 'undefined') ? '' : player;
};


function getCards(reqObj) {
    var cards = [];
    try {
        //console.log('CARDS:', reqObj.query.Cards);
        //console.log(', ', reqObj.query.Cards);//decodeURIComponent();

        cards = JSON.parse( reqObj.query.Cards);//decodeURIComponent();
        console.log('@' + JSON.stringify(cards));
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

function getActive(reqObj, defaultValue) {
    var active = defaultValue;
    try {
        active = JSON.parse( reqObj.query.Active );
        console.log('@' + JSON.stringify(active));
        if (active === 1) active = true;
        if (active === 0) active = false;
    }
    catch(err) {
        console.log('rrffreeer...... ' + err);
    }
    return active;
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






    // Add playerName hash to playername with _ or something, then check it and remove it serverside & client side

    // Use string.hashCode()










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
        if (games[gameInfo.index] == null) continue;
        if (games[gameInfo.index].game == pram.game) {
            gameInfo.gameExists = true;
            try {
                if (!games[gameInfo.index].list) continue;
            } catch(err) {
                continue;
            }

            //console.log('players ' + games[gameInfo.index].list.length);

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

function canDoNextRoundCheck(gameObj, roundCount) {
    retObj = {};
    retObj.waitForPriorRound = false;

    var activeCount = 0;
    var voteCount = 0;
    var readyCount = 0;

    retObj.playerNames = [];
    retObj.isActive = [];
    retObj.votes = [];
    retObj.readyForNextRound = [];

    retObj.checkPriorGame = (roundCount > 0);
    if (retObj.checkPriorGame) {
        for (var player in gameObj.round.players.list) { //gameObj.list) {
            var playerName = gameObj.list[player];
            retObj.playerNames.push(playerName);

            var isActive = isPlayerActive(gameObj, playerName);
            retObj.isActive.push(isActive);
            if (isActive) {
                activeCount++;
                var voted = (gameObj.votes.has(playerName)) ? true : false;
                if (voted) voteCount++;
                retObj.votes.push(voted);
                var ready = ( (gameObj.readyForNextRound.has(playerName)) ? gameObj.readyForNextRound.get(playerName) : false );
                if (ready) readyCount++;
                retObj.readyForNextRound.push( ready );
            } else {
                retObj.votes.push( true );
                retObj.readyForNextRound.push( true );
            }
        }

        retObj.allVoted = (voteCount == activeCount);
        retObj.waitForPriorRound = !retObj.allVoted; //not everyone has yet voted

        var readyCountOk = (readyCount == activeCount);
        retObj.waitForPriorRound = retObj.waitForPriorRound || !readyCountOk;

        retObj.allReady = (retObj.readyForNextRound.indexOf(false) == -1) ;
        retObj.waitForPriorRound = retObj.waitForPriorRound || !retObj.allReady;
    }

    return retObj;
};

function cloneRound(games, gameInfo, pram) {
    var cloneOfRound = JSON.parse( JSON.stringify(games[gameInfo.index].round) );
    var check = canDoNextRoundCheck(games[gameInfo.index], games[gameInfo.index].roundCount);

    cloneOfRound.heldCards = [];

    var heldCardsSource = games[gameInfo.index].heldCards;
    var cards = heldCardsSource.get(pram.playerName);

    var encodedCards = [];
    for (var cardIndex in cards) {
        encodedCards.push(allCards[WHITE].deck[cards[cardIndex]] );
    }
    cloneOfRound.heldCards = encodedCards;


    var playerIndex =  cloneOfRound.players.list.indexOf(pram.playerName);
    var playerName = games[gameInfo.index].list[playerIndex];

    cloneOfRound.haveSubmitted = false;
    try {
        cloneOfRound.haveSubmitted = (cloneOfRound.players.submitted[playerIndex].length > 0);
    } catch (err) { cloneOfRound.haveSubmitted = false; }

    cloneOfRound.canVoteYet = false;
    try {
        const countOfSubmittedArray = cloneOfRound.players.submitted.filter(name => name!=null&&name.length > 0);
        const countOfSubmitted = countOfSubmittedArray != null ? countOfSubmittedArray.length : 0;
        //console.log(cloneOfRound);
        var countOfActive=0;
        const playersToCheck = cloneOfRound.players.list.forEach(function (value, index){
            if (games[gameInfo.index].playerActivity.get(value).isActive) {
                countOfActive++;
            }
        });
        cloneOfRound.canVoteYet = countOfSubmitted >= countOfActive;
        console.log('#countOfSubmitted', countOfSubmitted);
        console.log('#countOfActive', countOfActive);

    } catch (err) { console.log(err); cloneOfRound.canVoteYet = false; }



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

    var playerCount = 0;

    //var encodedList = [];
    cloneOfRound.isActive = isPlayerActive(games[gameInfo.index], playerName);
    for (var player in cloneOfRound.players.list) {
        var otherPlayerName = cloneOfRound.players.list[player];
        //encodedList.push(encodeURIComponent( cloneOfRound.players.list[player]) );
        if (games[gameInfo.index].votes.has( otherPlayerName )) {
            var votedFor = games[gameInfo.index].votes.get( otherPlayerName );
            cloneOfRound.players.voted[player] = true;
            playerScores[ votedFor ] += 1;
            voteCount++;
        } else {
            cloneOfRound.players.voted[player] = false;
        }

        if (isPlayerActive(games[gameInfo.index], cloneOfRound.players.list[player])) {
            playerCount++;
            if (games[gameInfo.index].readyForNextRound.has( otherPlayerName )) {
                cloneOfRound.players.readyForNextRound[player] = games[gameInfo.index].readyForNextRound.get( otherPlayerName );
            } else {
                cloneOfRound.players.readyForNextRound[player] = false;
            }
        } else {
            cloneOfRound.players.readyForNextRound[player] = true; //they're "ready" because they're not playing (i.e. don't wait for them)
        }
    }

    var readyForNextRoundCount = 0;
    for (var ready in cloneOfRound.players.readyForNextRound) {
        if (cloneOfRound.players.readyForNextRound[ready]) {
            readyForNextRoundCount++;
        }
    }
    cloneOfRound.haveScores = false;

    if (check.allVoted) {
        cloneOfRound.scores = playerScores;
        cloneOfRound.haveScores = true;
    } else {
        cloneOfRound.scores = [];
    }

    cloneOfRound.readyForNextRound = false;
    if (cloneOfRound.haveScores) {
        if (cloneOfRound.players.readyForNextRound.indexOf(false) == -1) {
            cloneOfRound.readyForNextRound = true;
        }
    }

    //cloneOfRound.list = encodedList;
    return cloneOfRound;
};

const threeHOURS = 10800000;
function purgeOldGames(games, now) {
    //console.log('purging old games ', Date.now());
    // delete games that haven't had activity for pfffft... 3 hours (give them time to have  second breakfast and watch an episode of Game of Thrones)
    var deleteGames = [];
    for (var game in games) {
        if (games[game] == null) continue;
        console.log('purging old games, looking at ', games[game].game);
        var mostRecent = 0;
        var keys = games[game].playerActivity.keys();
        for (var activity in keys) {
            var act = games[game].playerActivity.get(keys[activity]);
            if (act.lastActivityOn > mostRecent) {
                mostRecent = act.lastActivityOn
                //console.log('purging old games, looking at ', games[game].game);
            }
        }

        var testDate = Date.now() - threeHOURS;
        if (mostRecent > 0 && mostRecent < testDate) {
            deleteGames.push(games[game]);
            console.log('purging old games, going to delete ', games[game].game);
        }
    }

    for (var del in deleteGames) {
        console.log('purging old games, deleting ', games[game].game);
        var gameObj = deleteGames[del];

        delete gameObj.votes;
        delete gameObj.readyForNextRound;
        delete gameObj.playerActivity;
        if (gameObj.heldCards != null) delete gameObj.heldCards;
        var nullMe = games.indexOf(gameObj);
        games[nullMe] = null;
        console.log('purging old games, deleted!');
    }
}

function updateScore(gameObj) {
    var playerScores = [];
    for (var player in gameObj.list) { playerScores.push(0); }

    for (var player in gameObj.list) {
        var otherPlayerName = gameObj.list[player];

        if (gameObj.votes.has( otherPlayerName )) {
            var votedFor = gameObj.votes.get( otherPlayerName );
            playerScores[ votedFor ] += 1;
        }
    }

    for (var i in playerScores) {
        updatePlayerScore(gameObj, gameObj.list[i], playerScores[i]);
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
        playerActivity.isActive = true;
    }
    playerActivity.lastActivityOn = Date.now();
    playerActivity.lastActivity = lastActivity;
    if (!hasThem) gameObj.playerActivity.set(playerName, playerActivity);
    broadcastChange(playerActivity, playerName);
}

function isPlayerActive(gameObj, playerName) {
    var hasThem = gameObj.playerActivity.has(playerName);
    if (hasThem) {
        return gameObj.playerActivity.get(playerName).isActive;
    } else {
        return false;
    }
}

function setPlayerActive(gameObj, playerName, active) {
    var hasThem = gameObj.playerActivity.has(playerName);
    if (hasThem) {
        gameObj.playerActivity.get(playerName).isActive = active;
        return true;
    }
    return false;
}

function dealPlayerCards(games, gameInfo, heldCards, player) {
    var cardArray = [];
    const TENCARDS = 10;
    for (var i = 0; i < TENCARDS; i++) {
        var cardToAdd = getWhiteCard(games, gameInfo);
        if (typeof cardToAdd == 'undefined') {


            // HAVE RUN OUT OF CARDS


        }
        cardArray.push(cardToAdd);
    }

    heldCards.set(player, cardArray);
};



var createDeck = function(reqObj, games, gameInfo) {
    // or http://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
    var shuffle = function (array) { //http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        var currentIndex = array.length;//, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            const temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    console.log('creating deck');

    function deckIsSelected(cardsObj, selectedDecks, cardIndex) {
        const colours = [" (white)", " (black)"];
        for (const colourIndex in colours) {
            var colour = colours[colourIndex];
            for (const deck in selectedDecks) {
                const key = selectedDecks[deck];
                var thisDeck = cardsObj.deckInfo.get(key + colour);
                if (!thisDeck) continue;
                if (thisDeck.startIndex <= cardIndex && thisDeck.endIndex >= cardIndex) {
                    return true;
                }
            }
        }
        return false;
    }

    if (!reqObj.query.Decks) 
        reqObj.query.Decks = "";

    if (!games[gameInfo.index].selectedDecks || games[gameInfo.index].selectedDecks.length == 0)
        games[gameInfo.index].selectedDecks = reqObj.query.Decks.split(',').map(m => m.trim());





    /* HERE IS THE TIME TO ADD CUSTOM DECKS INTO THE allCards ARRAY */




    const selectedDecksArray = games[gameInfo.index].selectedDecks;
    games[gameInfo.index].blackCards = [];
    games[gameInfo.index].blackCardIndex = 0;
    for (var cardIndex in allCards[BLACK].deck) { 
        if (deckIsSelected(allCards[BLACK], selectedDecksArray, cardIndex))
            games[gameInfo.index].blackCards.push(cardIndex);
    }

    games[gameInfo.index].whiteCards = [];
    games[gameInfo.index].whiteCardIndex = 0;
    for (var cardIndex in allCards[WHITE].deck) { 
        if (deckIsSelected(allCards[WHITE], selectedDecksArray, cardIndex))
            games[gameInfo.index].whiteCards.push(cardIndex);
    }

    games[gameInfo.index].blackCards = shuffle(games[gameInfo.index].blackCards);
    games[gameInfo.index].whiteCards = shuffle(games[gameInfo.index].whiteCards);
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
    reqObj.req = req;

    var listProperties = function(req) {
        console.log(util.inspect(req));
    };
    console.log(' ---------------------------------> ' + reqObj.pathname);
    switch (reqObj.pathname) {
        case '/':
            doPageFile('index.html', reqObj, res);
            break;

        case '/GetDeckList':
            console.log(getDeckList());
            var decklist = getDeckList();//[].map.call(getDeckList(), x => x.description);

            res.writeHeader(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(decklist));
            res.end();
            break;

        case '/JoinGame':
            var doJoinGame = function(games, reqObj, res) {
                pram = preamble(reqObj);
                if (!pram.isOk) return false;
                var gameInfo = getGameIndex(games, pram);

                // if joining the game after its started
                var cardState = hasCardsBeenDelt(games, gameInfo, pram);
                var playerLateToJoin = (cardState.cardsDelt && !cardState.hasCards);
                if (playerLateToJoin) {
                    dealPlayerCards(games, gameInfo, games[gameInfo.index].heldCards, pram.playerName);
                    setPlayerActive(games[gameInfo.index], pram.playerName, false);
                }

                if (gameInfo.gameExists && !gameInfo.playerInGame) {
                    games[gameInfo.index].list.push(pram.playerName);
                }

                if (gameInfo.gameExists) {
                    var send = {};
                    send.game = games[gameInfo.index].game;
                    send.creator = games[gameInfo.index].creator;
                    send.list = games[gameInfo.index].list;
                    send.roundCount = games[gameInfo.index].roundCount;

                    res.writeHeader(200, {"Content-Type": "text/plain"});
                    res.write(JSON.stringify(send));
                    updateActivity(games[gameInfo.index], pram.playerName, playerLateToJoin ? 'Paws' : 'Joined');
                } else {
                    var gameObj = {};
                    gameObj.game = 'WTF!!!1';
                    res.writeHeader(200, {"Content-Type": "text/plain"});
                    res.write(JSON.stringify(gameObj));
                }
                return true;
            };

            if (!doJoinGame(games, reqObj, res)) {
                res.writeHeader(200, {"Content-Type": "text/plain"});
                res.write("I'm sorry Dave I can't let you do that");
                res.error = 405;
            }
            res.end();
            break;

        case '/Auto':
            var doAuto = function (games, reqObj, res, pram, gameObj) {
                var auto = getActive(reqObj, false);
                var playerName = getPlayer(reqObj);




                if (playerName.length == 0) { return null; }
                



                
                if (auto) {
                    //console.log('adding', auto);
                    addClientConnection(playerName, res, reqObj.req);
                } else {
                    //console.log('taking', auto);
                    takeClientConnection(playerName, res, reqObj.req);
                }
            };

            doAuto(games, reqObj, res, pram, gameObj);
            break;

        case '/CreateGame':
            var doCreateGame = function(games, pram, gameObj) {
                //var pram = ;
                if (!pram.isOk) return false;

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
                    //gameObj.allCards = [];
                    games.push(gameObj);
                }

                return true;
            };

            var gameObj = {};
            if (!doCreateGame(games, preamble(reqObj), gameObj)) {
                gameObj.game = 'WTF!!';
            }

            res.writeHeader(200, {"Content-Type": "text/plain"});
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
                retObj.iMadeThisGame = (retObj.pram.playerName === games[retObj.gameInfo.index].creator);

                return retObj;
            };

            var doCreateRound = function(games, reqObj, pram, gameObj, retObjPhaseOne) {
                var phaseTwoDealWithTheDeck = function(games, gameInfo, pram, initGame) {
                    var retObj = {};
                    retObj.result = false;
                    retObj.cardState = hasCardsBeenDelt(games, gameInfo, pram);

                    if (initGame) {
                        console.log('Decks:', reqObj.query.Decks);
                        createDeck(reqObj, games, gameInfo);
                        console.log('dealt cards');
                    }
                    retObj.result = true;
                    return retObj;
                };

                var initGame = (games[retObjPhaseOne.gameInfo.index].roundCount == 0);
                var retObjPhaseTwo = phaseTwoDealWithTheDeck(games, retObjPhaseOne.gameInfo, pram, initGame);
                if (!retObjPhaseTwo.result) return false;

                var phaseThreeRoundWeGoAgain = function(games, gameInfo, initGame) {
                    console.log('allocating round info');

                    //update scores from previous round
                    if (!initGame) updateScore(games[gameInfo.index]);

                    var roundObj = {};
                    var useIndex = getBlackCard(games, gameInfo);
                    if (typeof useIndex == 'undefined') {




                        // HAVE RUN OUT OF CARDS!!!!!



                    }
                    var question = allCards[BLACK].deck[useIndex];
                    const amounts = ['any', 'one', 'two', 'three', 'four'];
                    roundObj.question = makeUnderscoresTheSame(question);
                    var count = (roundObj.question.match(/______/g) || []).length;
                    if (count == 0) {
                        if (roundObj.question[roundObj.question.length-1] == '?') { //allow any number of cards if no blanks and no question mark
                            var inYourHand = roundObj.question.indexOf('in your hand');
                            if (inYourHand > -1) {
                                var checkBeforeForAmount = roundObj.question.substr(0, inYourHand); //'in your hand' specifies the number of cards as written quantity
                                
                                for (var i=0; i < amounts.length; i++) {
                                    var foundAmount = checkBeforeForAmount.indexOf(amounts[i]);
                                    if (foundAmount > -1) {
                                        count = amounts.indexOf(amounts[i]);
                                        if (count == 0) {
                                            count = -1; //any
                                            //but look for a better option if available
                                            continue;
                                        }

                                        break;
                                    }
                                }
                            } else {
                                count = 1;
                            }
                        } else {
                            count = -1                            
                            for (var i=0; i < amounts.length; i++) {
                                var foundAmount = roundObj.question.indexOf(amounts[i]);
                                if (foundAmount > -1) {
                                    count = amounts.indexOf(amounts[i]);
                                    if (count == 0) {
                                        count = -1; //any
                                        //but look for a better option if available
                                        continue;
                                    }

                                    break;
                                }
                            }                            

                        }
                    }

                    //roundObj.question = roundObj.question;
                    roundObj.questionBlankCount = count;
                    roundObj.players = { list:[], submitted:[], voted :[], readyForNextRound: [] };
                    roundObj.players.list = JSON.parse( JSON.stringify(games[gameInfo.index].list) );
                    roundObj.game = games[gameInfo.index].game; //(this is the game name)
                    roundObj.createdOn = Date.now();

                    roundObj.roundCount = ( ++games[gameInfo.index].roundCount );

                    // // // //update scores from previous round
                    // // // if (!initGame) updateScore(games[gameInfo.index]);

                    games[gameInfo.index].votes.clear();
                    games[gameInfo.index].readyForNextRound.clear();

                    if (typeof games[gameInfo.index].round != 'undefined'  && games[gameInfo.index].round != null) {
                        delete games[gameInfo.index].round;
                    }
                    games[gameInfo.index].round = roundObj;

                    return roundObj;
                };

                // Only the creator can make the first round
                if (initGame && !retObjPhaseOne.iMadeThisGame) return true;

                // Any tom, dick or harry can make subsequent rounds as long as the round hasn't been created already
                if (retObjPhaseOne.Current != games[retObjPhaseOne.gameInfo.index].roundCount) return true;

                var roundObj = phaseThreeRoundWeGoAgain(games, retObjPhaseOne.gameInfo, initGame);


                var phaseFourTheCardsYoureDelt = function(games, gameInfo, roundObj) {
                    console.log('dealing first cards');
                    var heldCards
                        = games[gameInfo.index].heldCards
                            = new hashmap.HashMap();

                    var playerList = roundObj.players.list;
                    for (var playerIndex in playerList) {
                        var player = playerList[playerIndex];
                        dealPlayerCards(games, gameInfo, heldCards, player);
                    }
                };

                if (initGame)
                    phaseFourTheCardsYoureDelt(games, retObjPhaseOne.gameInfo, roundObj);

                return true;
            };

            var retObjPhaseOne = phaseOneAuthenticate(games, reqObj);

            if (!retObjPhaseOne.result && !retObjPhaseOne.pram.isOk)
            {
                res.end();
                break;
            }

            var gameObj = games[retObjPhaseOne.gameInfo.index];







            if (typeof gameObj =='undefined')
            {
                res.writeHeader(200, {"Content-Type": "text/plain"});
                console.log('why are you doing that dave');
                res.write('why are you doing that dave');
                res.end();
                return;
            }







            var check = canDoNextRoundCheck(gameObj, gameObj.roundCount);

            if (retObjPhaseOne.result && !check.waitForPriorRound && doCreateRound(games, reqObj, retObjPhaseOne.pram, gameObj, retObjPhaseOne)) {
                var clone = cloneRound(games, retObjPhaseOne.gameInfo, retObjPhaseOne.pram);
                res.writeHeader(200, {"Content-Type": "text/plain"});
                res.write( JSON.stringify(clone) );
            } else {
                res.writeHeader(200, {"Content-Type": "text/plain"});
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
                if (!gameInfo.gameExists || !gameInfo.playerInGame) {
                    res.write('error');
                    break;
                }
                if (games[gameInfo.index].roundCount == 0) break;

                doPageFile('VirtualCards.html', reqObj, res);
                ok = true;
                break;
            }
            if (!ok) {
                res.end();
            }

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
                    var rightCardsSubmitted = (b.cardsSubmitted.length == games[b.gameInfo.index].round.questionBlankCount);
                    var anyCardsAllowed = (games[b.gameInfo.index].round.questionBlankCount == -1 && b.cardsSubmitted.length > 0);
                    if (!rightCardsSubmitted && !anyCardsAllowed)
                        return b;

                    b.isInList = false;

                    var listOfCards = games[b.gameInfo.index].round.players.submitted;
                    for (var s in listOfCards) {
                        if (JSON.stringify(listOfCards[s]) == b.cardsSubmitted) b.isInList = true;
                        if (b.isInList) return b;
                    }

                    updateActivity(games[b.gameInfo.index], b.pram.playerName, 'Answered');

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
                res.writeHeader(200, {"Content-Type": "text/plain"});
                res.write(JSON.stringify(cloneOfRound));

                ok = true;
                break;
            }
            res.end();
            break;

		case '/Discard':
			console.log('Discard');
			var d = {};
			d.pram = preamble(reqObj);
			if (!d.pram.isOk)
				return d;

			//console.log('Discard ok1');
			d.gameInfo = getGameIndex(games, d.pram);
			if (!d.gameInfo.gameExists || !d.gameInfo.playerInGame)
				return d;

			//console.log('Discard ok2');
			d.cardsSubmitted = getCards(reqObj);
			replaceCards(games, d.gameInfo, d.pram, d.cardsSubmitted);
			
			var cloneOfRound = cloneRound(games, d.gameInfo, d.pram);
			//console.log(cloneOfRound);
			res.writeHeader(200, {"Content-Type": "text/plain"});
			res.write(JSON.stringify(cloneOfRound));
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

                updateActivity(games[b.gameInfo.index], b.pram.playerName, 'Voted');

                res.writeHeader(200, {"Content-Type": "text/plain"});
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

                if (!gameInfo.gameExists || !gameInfo.playerInGame) {
                    res.write('error');
                    break;
                }

                var cloneOfRound = cloneRound(games, gameInfo, pram);

                res.writeHeader(200, {"Content-Type": "text/plain"});
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
                res.write('error');
                res.end();
                break;
            }
            var Current = getCurrent(reqObj);
            if (typeof Current === 'undefined') {
                res.end();
                break;
            }

            // if the game round is already created don't worry about it
            // hint: Next Round is clicked by all three players and the last of the three triggers the
            // CreateRound. The other two still click Next Round but this is from the previous round

            if (Current == games[gameInfo.index].roundCount) {
                games[gameInfo.index].readyForNextRound.set(pram.playerName.toString(), true);
                updateActivity(games[gameInfo.index], pram.playerName, 'Next');
            } else if (Current == 0) {
                updateActivity(games[gameInfo.index], pram.playerName, 'Next');
            }

            var cloneOfRound = cloneRound(games, gameInfo, pram);
            res.writeHeader(200, {"Content-Type": "text/plain"});
            res.write(JSON.stringify( cloneOfRound ) );
            res.end();
            break;

        case '/Games':
            res.writeHeader(200, {"Content-Type": "text/plain"});
            var gamesNames = [];
            for (var game in games) {
                if (games[game] == null) continue;
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

            res.writeHeader(200, {"Content-Type": "text/plain"});
            //var playerNames = [];

            var gameObj = null;
            for (var index = 0; index < games.length; index++) {
                if (games[index] == null) continue;
                if (games[index].game == pram.game) {
                    gameObj = games[index];
                    break;
                }
            }
            if (gameObj == null){
                res.end();
                break;
            }

            var retObj = {};
            retObj.activity = [];
            retObj.list = [];
            //retObj.decks = getDeckList();
            retObj.game = pram.game;
            for (var player in gameObj.list) {
                var name = gameObj.list[player];
                var playerName = gameObj.list[player];
                var hasThem = gameObj.playerActivity.has(playerName);
                var playerActivity = null;
                if (hasThem) {
                    playerActivity = gameObj.playerActivity.get(playerName);
                } else {
                    continue;
                }
                retObj.activity.push(playerActivity);
                retObj.list.push(playerName);
            }
            res.write(JSON.stringify(retObj));
            res.end();
            break;

        case '/Active':
            var doPause = function(res, games, reqObj) {
                var pram = preamble(reqObj);
                if (!pram.isOk) return false;

                var gameInfo = getGameIndex(games, pram);
                if (!gameInfo.gameExists || !gameInfo.playerInGame) {
                    res.write('error');
                    return false;
                }

                var active = getActive(reqObj, false);

                if (!setPlayerActive(games[gameInfo.index], pram.playerName, active))
                    return false;

                updateActivity(games[gameInfo.index], pram.playerName, active ? 'Back' : 'Away');

                res.writeHeader(200, {"Content-Type": "text/plain"});
                res.write(JSON.stringify(cloneRound(games, gameInfo, pram)));
                return true;
            };
            doPause(res, games, reqObj);
            res.end();
            break;

        case '/DumpGames':
            res.writeHeader(200, {"Content-Type": "text/plain"});  //application/json
            var gameName = getGame(reqObj);
            if (gameName == '') {
                for (var g in games) {
                    if (games[g] == null) continue;
                    res.write(JSON.stringify(games[g].game));
                }
            } else {
                for (var g in games) {
                    if (games[g] == null) continue;
                    if (games[g].game == gameName) {
                        res.write(games[g].game + ', rounds:' + games[g].roundCount + ', players:' + JSON.stringify(games[g].list));
                        break;
                    }
                }
            }
            res.end();
            break;

        case '/DumpPlayer':
            res.writeHeader(200, {"Content-Type": "text/plain"});
            var playerName = getPlayer(reqObj);
            if (playerName == '') {
            } else {
                var inGames = [];
                for (var g in games) {
                    if (games[g] == null) continue;
                    if (games[g].list.indexOf(playerName) > -1) {
                        inGames.push(games[g].game);
                    }
                }
                res.write(JSON.stringify(inGames));
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
                try {
                    if (err != null) console.log('error: ' + err);
                    if (isHtml) {
                        res.writeHeader(200, {"Content-Type": "text/html"});
                    } else if (isCSS) {
                        res.writeHeader(200, {"Content-Type": "text/css"});
                    }
                    res.write(data);
                } catch (err) {
                    console.log('readFile error:', err);
                }
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
console.log('Port:', JSON.stringify(process.env));
var server_port = process.env.PORT /*Heroku*/ || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address =  'intense-stream-56355.herokuapp.com' /*Heroku*/ || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var isHosted = (server_port != 8080);

/////////////////////////////////
//http://www.smartjava.org/content/html5-server-sent-events-angularjs-nodejs-and-expressjs
var openConnections = new hashmap.HashMap();

 function removeResFromConnections(playerName, res) {
    var toRemove;
    console.log('AUTO  REMOVE  FROM CONNECTIONS', playerName);

    if (openConnections.has(playerName)) {
        console.log('AUTO  REMOVE  FROM CONNECTIONS have player', playerName);
        openConnections.remove(playerName);
    }
    console.log(openConnections.keys().length);
}

// simple route to register the clients
function addClientConnection(playerName, res, req) {
    // set timeout as high as possible
    const fiveMINS = 5 * 60 * 1000;
    req.socket.setTimeout(fiveMINS);

    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

    if (!openConnections.has(playerName)) {
        // push this res object to our global variable
        //console.log('two');
        openConnections.set(playerName, res);
        console.log('AUTO adding player ', playerName);
        //openConnections.push(res);
    } else {
        console.log('AUTO have player ', playerName);

    }

    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    //console.log('three');
    req.on("close", function() { removeResFromConnections(playerName, res); });
};

function takeClientConnection(playerName, res, req) {
    removeResFromConnections(playerName, res);
}

var broadcastChangeIndex  = 0;
function broadcastChange(playerActivity, playerName) {
    // we walk through each connection
    openConnections.forEach(function(resp,name) {
        console.log(name);
        resp.write('id:' + (++broadcastChangeIndex) + '\n');
        var clone = JSON.parse(JSON.stringify(playerActivity));
        clone.player = playerName;
        resp.write('data:' + JSON.stringify(clone) + '\n\n');
    });

}

function startServer() {

    //Create a server
    var server = http.createServer(handleRequest);

    var purgeCycle = function() {
        setTimeout(function() { purgeOldGames(games, Date.now()); purgeCycle(); }, threeHOURS);
    };

    purgeCycle();

    server.listen(server_port);
    //Lets start our server
    //server.listen(server_port, server_ip_address, function(){ //PORT
    //    //Callback triggered when server is successfully listening. Hurray!
    //    console.log('Server listening on: http://'+ server_ip_address+':%s', server_port); //PORT localhost
    //});
};

loadAllDecks();
afterLoadDumpDecks(false);//!isHosted);
console.log('listening on', server_port);
startServer();
