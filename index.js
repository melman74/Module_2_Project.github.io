let guessCount = 1;
let number = 0;
let gandalfScore = 0;
let playerScore = 0;


//Target the Player Name input box and store the value in a variable
//for use throughout the game.
let pName = document.getElementById("playerName");
let playerName = "";

//Various subfunctions are defined here...
//They manipulate the DOM objects in a modular way, and basically 
//support the UI handlers defined last.

function exposeGamePlayArea() {
  //Exposes the game play area so it's visible.
  //When a new player comes on, the only thing to be displayed is 
  //basic instructions and a prompt for their name.
    document.getElementById("scoreBoardDiv").style.display = "block";
    document.getElementById("SBPlayerName").innerHTML = playerName + "'s Score"
    document.getElementById("guessesDiv").style.display = "block";
    document.getElementById("guessesTitle").innerText=playerName + "'s Guesses ";
    document.getElementById("statusLine").style.display = "block";
    document.getElementById("buttons").style.display = "block";
}

function hideGamePlayArea() {
  //Hides the game play area so it's not visible.
  //When a player quits the game, the game play area is hidden
  //to welcome the next player.
    document.getElementById("scoreBoardDiv").style.display = "none";
    document.getElementById("guessesDiv").style.display = "none";
    document.getElementById("statusLine").style.display = "none";
    document.getElementById("buttons").style.display = "none";
    pName.value = "";
}

function updateScoreBoard() {
  //Updates the scoreboard with the current scores.
  //To be called once each round is over.
    document.getElementById("playerScore").innerHTML = playerScore;
    document.getElementById("GandalfScore").innerHTML = gandalfScore;
}

function highlightGuessBox(guessCount) {
  //This function makes writable and highlights the appropriate guess box
  //for the player to enter their current guess.
  //It also unhighlights and prevents data entry into any inactive guess boxes.
    let guessBox = document.getElementById("guess" + guessCount);
    for (let i = 1; i < 7; i++) {
        if (i == guessCount) {
            guessBox = document.getElementById("guess" + guessCount);
            guessBox.style.backgroundColor = "yellow"
            guessBox.readOnly = false;
        } else {
            guessBox = document.getElementById("guess" + i);
            guessBox.style.backgroundColor = "white"
            guessBox.readOnly = true;
        }
  }
}

function clearRoundData() {
    //This function clears the data from the previous round.
    //It is called when the player has either won or lost the round.
    for (let i = 1; i < 7; i++) {
        document.getElementById("guess" + i).value = "";
        document.getElementById("result" + i).innerHTML = "";
        document.getElementById("guess" + i).style.backgroundColor = "white";
        document.getElementById("guess" + i).style.color = "black";
        guessCount = 1;
    }
}

function clearGameData() {
    //This function clears the data from the previous game.
    //It is called when the player quits the game.
    clearRoundData();
    gandalfScore = 0;
    playerScore = 0;
    updateScoreBoard()
    playerName = ""
    document.getElementById("SBPlayerName").innerHTML = playerName + "Player's Score";
    document.getElementById("guessesTitle").innerText=playerName + "PLAYER'S GUESSES";
}

function enablePlayAgainButton() {
    //This function enables the "Play Again" button.
    //It is called when the player has either won or lost the round.
    document.getElementById("playAgainButton").disabled = false;
}

function disablePlayAgainButton() {
    //This function disables the "Play Again" button.
    //It is called when the game starts.
    document.getElementById("playAgainButton").disabled = true;
}

function enableSubmitButton() {
    //This function enables the "Submit Guess" button.
    //It is called when the game starts.
    document.getElementById("submitButton").disabled = false;
}

function disableSubmitButton() {
    //This function disables the "Submit Guess" button.
    //It is called when the player has either won or lost the round.
    document.getElementById("submitButton").disabled = true;
}


function playGame() {
    //This basically gets the game started by welcoming the player and
    //setting up the game board for the first guess.
      number = Math.floor(Math.random() * 100) + 1;
        console.log(number);
      let statusMsg = document.getElementById("status");
      statusMsg.value = "Welcome " + playerName + "! Type your guess in the Yellow Box and press 'Submit Guess.'"; 
      disablePlayAgainButton();
      enableSubmitButton();
      highlightGuessBox(guessCount);
     }
  



//The various button handlers are defined below...

//"Start the Game" Button Handler
//This basically kicks everything off by getting the player's name
//and exposing the game play area.
document.getElementById("startButton").onclick = welcomePlayer;
function welcomePlayer() {
    playerName = pName.value;
    exposeGamePlayArea();
    playGame();
}

//"Submit Guess" Button Handler
//Most of the functionality goes here as this is basically
//what the player is doing (guessing and submitting).
document.getElementById("submitButton").onclick = submitGuess;
function submitGuess() {
    //target appropriate UI elements in use by the function
    //(guess is the player's current guess value; 
    // guessBox is the current input box;
    // statusMsg is the computer's status message to the player)
    let guess = document.getElementById("guess" + guessCount).value;
    let guessBox = document.getElementById("guess" + guessCount)
    let statusMsg = document.getElementById("status");
    //Here we are evaluating the player's guess and responding accordingly.
    //First we check validity of the data... then we check its value...
    //we return from the function immediately if the guess is invalid or if
    //the player has guessed correctly.
    if (isNaN(guess) || guess < 1 || guess > 100) {
       statusMsg.value = ("Your guess was invalid. Please Guess a number between 1 and 100 and submit again...");
       guessBox.style.backgroundColor = "red";
       return;      
    } else if (guess < number) {
        document.getElementById("result" + guessCount).innerHTML = "Higher!";
        guessCount++;
        statusMsg.value = "Guess again using a higher number."
    } else if (guess > number) {
        document.getElementById("result" + guessCount).innerHTML = "Lower!";
        guessCount++;
        statusMsg.value = "Guess again using a lower number."
    } else {
        document.getElementById("result" + guessCount).innerHTML = "Correct!";
        statusMsg.value = ("You are a genius!  You guessed my number!!  Press 'Play Again' to play another round, or 'Quit' to end the game.");
        guessBox.style.backgroundColor = "green";
        guessBox.style.color = "white";
        playerScore++;
        updateScoreBoard();
        disableSubmitButton();
        enablePlayAgainButton();
        return;
    }

    //Now we check to see if the player has used all their guesses.
    //If not, we highlight the next guess box and return from the function.
    if (guessCount <= 6) {
        highlightGuessBox(guessCount);
    } else {
        statusMsg.value = "Sorry " + playerName + "! You have used all your guesses this round. The number was " + number + ". Press 'Play Again' to play another round, or 'Quit' to end the game.";
        gandalfScore++;
        updateScoreBoard();
        disableSubmitButton();
        enablePlayAgainButton();
    }
}

//"Play Again" Button Handler
//This basically clears the round's data and prepares for a new round.
document.getElementById("playAgainButton").onclick = playAgain;
function playAgain() {
    clearRoundData();
    playGame();
}

//"Quit Game" Button Handler
// This basically just clears the game data, hides the game play area, and
// readies itself for a new player.

document.getElementById("quitButton").onclick = quitGame;
function quitGame() {
    clearGameData();
    hideGamePlayArea();
}


