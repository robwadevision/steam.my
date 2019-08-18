console.log('It works!');

import gamesList from "./gamesList.js";

function populate() {

    for(i = 0; i < gamesList.length; i++){
    
    const gameName = gamesList[i].name;
    const gameTime = gamesList[i].hours_forever;
    console.log(`${ gameName }`)

    var table = document.getElementById('gameTable');
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = gameName;
    cell2.innerHTML = gameTime;

    }
};

