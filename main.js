var origBoard;
var huPlayer = "X";
var aiPlayer = "O";
var currentTurn;
var checkOBtn = document.getElementById("choiceO");
var checkXBtn = document.getElementById("choiceX");

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];
const cells = document.querySelectorAll(".cell");
startGame();

function selectOption(current) {
  console.log(current);
  if (current.value === "X") {
    huPlayer = "X";
    aiPlayer = "O";
  } else if (current.value === "O") {
    huPlayer = "O";
    aiPlayer = "X";
    turn(emptySquares()[firstMove()], aiPlayer);
    checkXBtn.disabled = true;
  }
}

function firstMove() {
  checkOBtn.disabled = true;
  return Math.floor(Math.random() * 9) + 1;s
}
function startGame() {
  checkOBtn.disabled = false;
  checkXBtn.disabled = false;
  origBoard = Array.from(Array(9).keys());
  document.getElementById('endContainer').classList.remove('fade-in'); 
  document.getElementById('gameTable').classList.remove('fade-out'); 
  document.querySelector(".endgame").style.display = "none";

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
  if (checkOBtn.checked == true) {
    turn(emptySquares()[firstMove()], aiPlayer);
    checkOBtn.disabled = true;
  }
}

function turnClick(square) {
  if (checkOBtn.checked == true) {
    checkXBtn.disabled = true;
  } else if (checkXBtn.checked == true) {
    checkOBtn.disabled = true;
  }

  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "#0000cc" : "#e63946";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  setTimeout( function() {
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!") 
  }, 800);

}

function emptySquares() {
  return origBoard.filter(s => typeof s == "number");
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", turnClick, false);
    }
    setTimeout(function() {
      declareWinner("Tie Game!")
    }, 800);
    return true;
  }
  return false;
}

function declareWinner(who) {
  document.getElementById('gameTable').className += ' fade-out'; 
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerHTML = who;
  document.getElementById('endContainer').className += ' fade-in'; 
  checkOBtn.disabled = true;
  checkXBtn.disabled = true;
  checkXBtn.checked = true;
  huPlayer = "X";
  aiPlayer = "O";
}


function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
