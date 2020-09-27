/*
 * 
 * 
 */

const DEBUG = false; // enable debug logging in the console
const chalk = require('chalk');
const Font = require('ascii-art-font');
var readline = require('readline-sync');

var winner = false;
var currentPlayer = 0;
var phase = 0; // 0: place the pawns 1: move the pawns
var board = [-1,-1,-1,-1,-1,-1,-1,-1,-1]; // init the board with no pawns
var nbTurns = 0;
var computer = 3; 



Font.create('Welcome  to Tapatan', 'Doom', function(err,rendered){
    console.log(colorize(computer,rendered));
    mainGameLoop();
});

function mainGameLoop(){
    while(!winner){
        
        displayBoard();

        //check game's phase
        if(nbTurns > 5) phase=1;
        if(nbTurns == 6){
            phase=1;
            info(computer,"Ok! Let's switch to Move Phase!");
        }

        play(currentPlayer, phase);      
        winner = checkWinner();
        if(! winner){
          currentPlayer = (currentPlayer+1)%2;        
        }
        nbTurns++;
    }

    displayWinner(currentPlayer)
    
}
function displayWinner(winnerPlayer){

    info(winnerPlayer,"Player " + (winnerPlayer+1) + " wins !!");
    displayBoard();
}

function play(player, phase){

    var valid = false;
    
    while(!valid){
        // Get the input from the player
        info(player, "Player " + (player+1) + "'s turn (phase " + (phase==0?"placement":"moves")+")");
        var move = readline.question(colorize(player,"What's your next move? "));

        // Validate the input from the player
        if(phase == 0 ){
            // placing phase
            var x = decodePawn(move);
            if( x <= -1){
                error("Unexpected move format("+ move +"). Waiting for b3");
                valid = false;
            } else {
                if(board[x] != -1){
                    error("Unauthorized move ("+ move +"). You must aim an EMPTY space");
                    valid = false;

                } else {
                    board[x] = player; // store move on the board
                    valid = true;
                }                
            }
            
        } else {
            // moving phase : a1:a2
            var m = decodeMove(move);
            if( m <= -1){
                error("Unexpected move format("+ move +"). Waiting for b3:b2");
                valid = false;
            } else {
                if(board[before] == player && board[after] == -1){ // check that this move is autohrized for the player

                    valid = true;
                    // store the move on the board (permute the two pawns)
                    tmp = board[after];
                    board[after] = board[before];
                    board[before] = tmp;
                } else {                    
                    error("Unauthorized move ("+ move +"). You must move YOUR pawn to an empty space");
                    valid = false;
                }                
            }
        }
    }
}

function decodeMove(move){

    // moving phase : a1:a2
    if(typeof move != 'string' || move.length != 5) return -1;
    before = decodePawn(move.substring(0,1));
    after = decodePawn(move.substring(3,4));
    if( before <= -1 ||  after <= -1 ) return -1;

    return [before , after];
}

function decodePawn(pawnCoord){
    if(typeof pawnCoord != 'string' || pawnCoord.length != 2) return -1;
    
    var column = pawnCoord.substring(0,1);
    if( column != 'a' && column != 'b' && column != 'c' ) return -1;
    var c = -1;
    switch(column){
        case 'a' : c = 0; break;
        case 'b' : c = 1; break;
        case 'c' : c = 2; break;
    }

    var line = pawnCoord.substring(1,2);
    if( line != '1' && line != '2' && line != 3) return -1;
    var l = -1;
    switch(line){
        case '1' : l = 0; break;
        case '2' : l = 1; break;
        case '3' : l = 2; break;
    }

    return (c*3) + l;
}

function checkWinner(){
    
    // each position on the grid has a score. The score is 2^index_of_position
    var currentPlayerCumulatedSum = 0; // sum scores of each positionned pawn for the current player
    var winingSums =  [7,56,73,84,146,273,292,448]; // there are only 8 3 in-a-row way to win, these are the summed scores of each of these wining placements

    for(i = 0 ; i < board.length ; i++){
        if(board[i] == currentPlayer){
            currentPlayerCumulatedSum += Math.pow(2,i);
        }
    }
    debug("cum sum for player " + currentPlayer + ": " + currentPlayerCumulatedSum);
    
    for(j = 0 ; j < winingSums.length ; j++){
        if(winingSums[j] == currentPlayerCumulatedSum){
            // we got a winner !
            return true;
        }
    }

    return false;
}

function error(msg){
    console.log(colorize(-1,msg));
}

function debug(msg){
    if(DEBUG) console.log(colorize(-2,msg));
}

function info(player, msg){
    console.log(colorize(player,msg));
}

function colorize(player,msg){
    var coloredMsg = msg;
    if(player==0){
        coloredMsg = chalk.blue(msg);
    } else if(player==-2) {
        coloredMsg = chalk.redBright(msg);
    } else if(player==1) {
        coloredMsg = chalk.green(msg);
    } else if(player== -1) {
        coloredMsg = chalk.red(msg);
    } else if(player== 3) {
        coloredMsg = chalk.yellow(msg);
    } else {
        coloredMsg = msg;
    }
    return coloredMsg;
}

function displayBoard(){

    lines = ['A','B','C'];
    console.log(colorize(computer,"     1   2   3  "));    
    for(i=0 ; i<3 ; i++){ // for each line
        line = colorize(computer, " " + lines[i] + " |");
        for(j=0 ; j<3 ; j++){ // for each column
            line += " " + pawn(board[(i*3)+j]) + colorize(computer," |");
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
