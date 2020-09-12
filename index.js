/*
 * 
 * 
 */

const chalk = require('chalk');
var readline = require('readline-sync');

var winner = false;
var currentPlayer = 0;
var phase = 0; // 0: place the pawns 1: move the pawns
var board = [-1,0,1,-1,-1,-1,-1,-1,-1]; // init the board with no pawns
var nbTurns = 0;

console.log(chalk.blue('Hello world!'));

function print(msg){
	console.log("this is a test");
}
 
while(!winner){

    //check game's phase
    if(nbTurns > 5) phase=1;

    play(currentPlayer, phase);   
    
    currentPlayer = (currentPlayer+1)%2;
    nbTurns++;

    winner = checkWinner();
    displayBoard();

}

function play(player, phase){

    // Get the input from the player
    info(player, "Player " + (player+1) + "'s turn (phase " + (phase==0?"placement":"moves")+")");
    var nextMove = readline.question(colorize(player,"What's your next move? "));

    // Validate the input from the player

    // Make the move on the board
    
}

function checkWinner(){
    return false;
}

function info(player, msg){
    console.log(colorize(player,msg));
}

function colorize(player,msg){
    var coloredMsg = msg;
    if(player==0){
        coloredMsg = chalk.blue(msg);
    } else if(player==1) {
        coloredMsg = chalk.red(msg);
    } else {
        coloredMsg = msg;
    }
    return coloredMsg;
}

function displayBoard(){

    console.log(colorize(-1,"     A   B   C  "));    
    for(i=0 ; i<3 ; i++){ // for each line
        line = colorize(-1, " " + (i+1) + " |");
        for(j=0 ; j<3 ; j++){ // for each column
            line += " " + pawn(board[(i*3)+j]) + " |";
        }
        console.log(line);
    }
}

function pawn(player){
    var pawn = "*";
    if(player==0){
        pawn = colorize(player, 'x');
    } else if(player==1) {
        pawn = colorize(player, 'o');
    } else {
        pawn = colorize(player, '-');
    }
    return pawn;
}
