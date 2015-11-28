"use strict";
var GAME_PIECES_FILES = "data/gamePieces.json";
var gameJSON;
var showHistory = false;

var gameOver;
var playerTurn;
var mainPlayer;
var winner;

var secret;

var availableRoomCards;
var availableGuestCards;
var availableWeaponCards;

var history = document.getElementById("history");

var players =
{
    "computer":
    {
        "cards": 
            {
                "rooms": [],
                "guests": [],
                "weapons": []
            }
    }
};

function getPlayer(name)
{
    return players[name];
}

function getRooms()
{
    return gameJSON["Rooms"];
}

function getGuests()
{
    return gameJSON["Guests"];
}

function getWeapons() {
    return gameJSON["Weapons"];
}

function loadClueJSON()
{
    let request = new XMLHttpRequest();
    request.open("GET", GAME_PIECES_FILES, false);

    request.onreadystatechange = function ()
    {
        if (request.readyState == 4 && request.status == 200)
        { //if done loading and okay.
            if (request.responseText)
            {
                gameJSON = JSON.parse(request.responseText);
            }
            else
            {
                console.log("Your JSON file is empty.");
            }
        }
        else if (request.readyState == 4)
        { //if done loading and not okay.
            console.log("The game-pieces file does not exist!");
            return false;
        }
        
    };
    request.send(null);
}

function getClueJSON()
{
    if (!gameJSON)
    {
        loadClueJSON();
    }
    return gameJSON;
}

function generateSecret()
{
    secret =
    {
        "room": rooms[parseInt(Math.random() * availableRoomCards.length)],
        "guest": guests[parseInt(Math.random() * availableGuestCards.length)],
        "weapon": weapons[parseInt(Math.random() * availableWeaponCards.length)]
    };

    let roomIndex = availableRoomCards.indexOf(secret["room"]);
    availableRoomCards.splice(roomIndex, 1);

    let guestIndex = availableGuestCards.indexOf(secret["guest"]);
    availableGuestCards.splice(guestIndex, 1);

    let weaponIndex = availableWeaponCards.indexOf(secret["weapon"]);
    availableWeaponCards.splice(weaponIndex, 1);

    console.log(secret);
}

function assignPlayerCards(name)
{
    let playerCount = Object.keys(players).length;
    for (let i = 0; i < getRooms().length/playerCount-1; i++)
    {
        let randomIndex = parseInt(Math.random() * availableRoomCards.length);
        players[name]["cards"]["rooms"].push(availableRoomCards[randomIndex]);
        availableRoomCards.splice(randomIndex, 1);
    }

    for (let i = 0; i < getGuests().length / playerCount-1; i++) {
        let randomIndex = parseInt(Math.random() * availableGuestCards.length);
        players[name]["cards"]["guests"].push(availableGuestCards[randomIndex]);
        availableGuestCards.splice(randomIndex, 1);
    }

    for (let i = 0; i < getWeapons().length / playerCount-1; i++) {
        let randomIndex = parseInt(Math.random() * availableWeaponCards.length);
        players[name]["cards"]["weapons"].push(availableWeaponCards[randomIndex]);
        availableWeaponCards.splice(randomIndex, 1);
    }
}

function addPlayer(name)
{
    players[name] = {
        "cards": {
            "rooms": [],
            "guests": [],
            "weapons": []
        }
    };
    mainPlayer = name;
    playerTurn = name;
}

function startGame()
{
    gameOver = false;

    availableRoomCards = getRooms().slice();
    availableGuestCards = getGuests().slice();
    availableWeaponCards = getWeapons().slice();

    generateSecret();

    let playerCount = Object.keys(players).length;
    for (let i = 0; i < playerCount; i++ )
    {
        let playerName = Object.keys(players)[i];
        assignPlayerCards(playerName);
        let player = players[playerName];
    }
}

function guessSecret()
{
    if (gameOver)
    {
        document.getElementById("nameForm").innerHTML = "Player '" + winner + "' is the winner!";
        document.getElementById("GameOutput").innerHTML += "<input type='button' value='Reset Game?' onclick='clearOutput(); startGame();'/>";

        return;
    }

    let playerArray = Object.keys(players);
    let playerIndex = playerArray.indexOf(playerTurn);

    if (playerArray[playerIndex] != mainPlayer)
    {
        let room = getRooms()[parseInt(Math.random() * getRooms().length)];
        let guest = getGuests()[parseInt(Math.random() * getGuests().length)];
        let weapon = getWeapons()[parseInt(Math.random() * getWeapons().length)];

        if (secret["room"] == room && secret["guest"] == guest && secret["weapon"] == weapon) {
            gameOver = true;
            winner = playerTurn;
            document.getElementById("GameOutput").innerHTML = "Player '" + playerTurn + "' guessed correctly with " + room + ", " + guest + ", " + weapon + ".";
        }
        else
        {
            let statement = "Player '" + playerTurn + "' guessed incorrectly with " + room + ", " + guest + ", " + weapon + ". <br />";
            document.getElementById("GameOutput").innerHTML = statement;
            document.getElementById("history").appendChild(document.createTextNode(statement));
            document.getElementById("GameOutput").innerHTML += "<input type='button' value='Continue' onclick='clearOutput();'/>";
        }

        playerIndex = (playerIndex + 1) % playerArray.length;
        playerTurn = playerArray[playerIndex];
    }
    else
    { //if main player
        let room = document.getElementById("RoomSelect").value;
        let guest = document.getElementById("SuspectSelect").value;
        let weapon = document.getElementById("WeaponSelect").value;

        if (secret["room"] == room && secret["guest"] == guest && secret["weapon"] == weapon)
        {
            gameOver = true;
            winner = playerTurn
            document.getElementById("GameOutput").innerHTML = "Player '" + playerTurn + "' guessed correctly with " + room + ", " + guest + ", " + weapon + ". <br />";
            document.getElementById("GameOutput").innerHTML += "<input type='button' value='Continue' onclick='clearOutput(); guessSecret();'/>";

        }
        else
        {
            let hint;
            if (secret["room"] == room)
            {
                hint = room;
            }
            else if (secret["guest"] == guest)
            {
                hint = guest;
            }
            else if (secret["weapon"] == weapon)
            {
                hint = weapon;
            }
            
            if (hint)
            {
                let statement = "You were incorrect. HINT: " + hint + " was correct. <br />";
                document.getElementById("GameOutput").innerHTML += statement;
                document.getElementById("history").appendChild(document.createTextNode(statement));
                document.getElementById("GameOutput").innerHTML += "<input type='button' value='Continue' onclick='clearOutput(); guessSecret();'/>";
            }
            else
            {
                let statement = "You were incorrect. HINT: Nothing was correct. <br />";
                document.getElementById("GameOutput").innerHTML += statement;
                document.getElementById("history").appendChild(document.createTextNode(statement));
                document.getElementById("GameOutput").innerHTML += "<input type='button' value='Continue' onclick='clearOutput(); guessSecret();'/>";

            }

        }

        playerIndex = (playerIndex + 1) % playerArray.length;
        playerTurn = playerArray[playerIndex];
    }
}

function clearOutput()
{
    document.getElementById("GameOutput").innerHTML = "";
}

function toggleHistory()
{
    showHistory = !showHistory;

    if (showHistory)
    {
        document.getElementById("history").style.display = "block";
        document.getElementById("HistoryToggle").value = "Hide History";
    }
    else
    {
        document.getElementById("history").style.display = "none";
        document.getElementById("HistoryToggle").value = "Show History";
    }

}