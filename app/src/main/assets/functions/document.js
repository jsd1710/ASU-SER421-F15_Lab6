"use strict";
function populateSelectBox(boxID, itemArray)
{
    let destSelBox = document.getElementById(boxID);
    let fragment = document.createDocumentFragment();

    itemArray.forEach(
        function (option, index)
        {
            let opt = document.createElement("option");
            opt.innerHTML = option;
            opt.value = option;
            fragment.appendChild(opt);
        }
    );
    destSelBox.appendChild(fragment);
}

function welcomeName(formID, userNameBoxID)
{
    let nameForm = document.getElementById( formID );
    let userName = document.getElementById( userNameBoxID ).value;
    
    addPlayer(userName);
    startGame();

    nameForm.innerHTML = "Welcome, " + userName + ". You have the cards: " + getPlayer(userName)["cards"]["rooms"] + "," + getPlayer(userName)["cards"]["guests"] + "," + getPlayer(userName)["cards"]["weapons"];

    document.getElementById("GuessButton").disabled = false;
}