//globals to control the board
let board;
let turn = 1;
let gameOver = false;

//globals parameters for graphics and board
let rowCount = 6;
let colCount = 7;
let inRow = 4;
let sqSize = 100;
let scr = 0;
let dia = (sqSize - 10);
let tie = false;
let ai = 0;

//load image for homepage
let logo;

function preload() {
  logo = loadImage('Logo.png');
}

//initial canvas setup
function setup() {
  createCanvas(colCount * sqSize, (rowCount + 1) * sqSize);
  board = createBoard();
  printBoard(board);
}

//draw loop for graphics of the game
function draw() {
  if (scr == 0) {
    homePage();
  } else if (scr == 2) {
    lvlSel();
  } else {
    if (gameOver == false) {
      drawBoard();
      if (turn == 1) {
        fill("red");
        stroke("red");
      } else {
        fill("yellow");
        stroke("yellow");
      }
      if (mouseX > sqSize * colCount)
        ellipse((sqSize * colCount), sqSize / 2, dia);
      else if (mouseX < 0)
        ellipse(sqSize / 2, sqSize / 2, dia);
      else
        ellipse(mouseX, sqSize / 2, dia);
    } else {
      if (tie == true) {
        drawBoard();
        fill("green");
        stroke("green");
        textStyle(ITALIC);
        textSize(75);
        text("Ends in a tie", 110, 70);
      } else if ((turn == 1) && (ai == 0)) {
        drawBoard();
        fill("yellow");
        stroke("yellow");
        textStyle(ITALIC);
        textSize(75);
        text("Player 2 Wins", 110, 70);
      } else if ((turn == 1)) {
        drawBoard();
        fill("yellow");
        stroke("yellow");
        textStyle(ITALIC);
        textSize(75);
        text("AI Wins", 210, 70);
      } else if ((turn == 2) && (ai == 0)) {
        drawBoard();
        fill("red");
        stroke("red");
        textStyle(ITALIC);
        textSize(75);
        text("Player 1 Wins", 110, 70);
      } else {
        drawBoard();
        fill("red");
        stroke("red");
        textStyle(ITALIC);
        textSize(75);
        text("Player Wins", 120, 70);
      }
    }
  }
}

//sets up the initial board based on rows and cols
function createBoard() {
  let temp = [];
  for (let i = 0; i < rowCount; i++) {
    temp.push([]);

    for (let j = 0; j < colCount; j++) {
      temp[i].push(0);
    }
  }
  return temp;
}

//based on user input the board is refreshed and checked for a winner
function refreshBoard() {
  if (ai == 0) {
    if (turn == 1) {
      let inp = range(mouseX);
      if (addBoard(inp)) {
        printBoard(board);
        gameOver = checkGame(board);
        turn = 2;
      }
    } else if (turn == 2) {
      let inp = range(mouseX);
      if (addBoard(inp)) {
        printBoard(board);
        gameOver = checkGame(board);
        turn = 1;
      }
    }
  } else if (ai == 1) {
    if (turn == 1) {
      let inp = range(mouseX);
      if (addBoard(inp)) {
        printBoard(board);
        gameOver = checkGame(board);
        if (gameOver) {
          turn = 2;
        } else {
          //delayTime(.5);
          turn = 2;
          inp = random([0, 1, 2, 3, 4, 5, 6]);
          while (addBoard(inp) == false) {
            inp = random([0, 1, 2, 3, 4, 5, 6]);
          }
          printBoard(board);
          gameOver = checkGame(board);
          draw();
          turn = 1;
        }
      }
    }
  } else if (ai == 2) {
    if (turn == 1) {
      let inp = range(mouseX);
      if (addBoard(inp)) {
        printBoard(board);
        gameOver = checkGame(board);
        if (gameOver) {
          turn = 2;
        } else {
          //delayTime(.5);
          turn = 2;
          inp = pickBest(board, 2); //random([0,1,2,3,4,5,6]);
          while (addBoard(inp) == false) {
            inp = pickBest(board, 2); //random([0,1,2,3,4,5,6]);
          }
          printBoard(board);
          gameOver = checkGame(board);
          draw();
          turn = 1;
        }
      }
    }
  } else if (ai == 3) {
    if (turn == 1) {
      let inp = range(mouseX);
      if (addBoard(inp)) {
        printBoard(board);
        gameOver = checkGame(board);
        if (gameOver) {
          turn = 2;
        } else {
          //delayTime(.5);
          turn = 2;
          inp = minimax(board, 4, -Infinity, Infinity, true)[0];
          while (addBoard(inp) == false) {
            inp = minimax(board, 4, -Infinty, Infinity, true)[0];
          }
          printBoard(board);
          gameOver = checkGame(board);
          draw();
          turn = 1;
        }
      }
    }
  }
}

//prints the boar on the console used just for testing
function printBoard(boar) {
  let str = "[";

  for (let i = 0; i < rowCount - 1; i++) {
    str = str + "[" + boar[i].toString() + "]" + "," + "\n "
  }
  str = str + "[" + boar[rowCount - 1].toString() + "]" + "]"

  print(str);
}

//draws the board graphically
function drawBoard() {
  background(0, 0, 0)
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      fill("blue");
      stroke("blue");
      rect(c * sqSize, (r * sqSize) + sqSize, sqSize, sqSize);

      if (board[r][c] == 0) {
        fill("black");
        stroke("black");
      } else if (board[r][c] == 1) {
        fill("red");
        stroke("red");
      } else {
        fill("yellow");
        stroke("yellow");
      }

      ellipse((c * sqSize + sqSize / 2), ((r * sqSize) + sqSize) + sqSize / 2, dia);
    }
  }
}

//checks the scenarios for winning the game
//helper for refresh board
function checkGame(boar) {
  //check horizontel win
  for (let c = 0; c < (colCount - (inRow - 1)); c++) {
    for (let r = 0; r < rowCount; r++) {
      if (boar[r][c] == turn && boar[r][c + 1] == turn && boar[r][c + 2] == turn && boar[r][c + 3] == turn)
        return true;
    }
  }

  //check vertical win
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < (rowCount - (inRow - 1)); r++) {
      if (boar[r][c] == turn && boar[r + 1][c] == turn && boar[r + 2][c] == turn && boar[r + 3][c] == turn)
        return true;
    }
  }

  //check diagnol win

  //pos diagnol
  for (let c = 0; c < (colCount - (inRow - 1)); c++) {
    for (let r = 0; r < (rowCount - (inRow - 1)); r++) {
      if (boar[r][c] == turn && boar[r + 1][c + 1] == turn && boar[r + 2][c + 2] == turn && boar[r + 3][c + 3] == turn)
        return true;
    }
  }

  //neg diagnol
  for (let c = 0; c < (colCount - (inRow - 1)); c++) {
    for (let r = (inRow - 1); r < rowCount; r++) {
      if (boar[r][c] == turn && boar[r - 1][c + 1] == turn && boar[r - 2][c + 2] == turn && boar[r - 3][c + 3] == turn)
        return true;
    }
  }
  if (tieCheck(boar) && boar == board) {
    tie = true;
    return true;
  } else if (tieCheck(boar)) {
    return true;
  }
  //else return false
  return false;
}

//adds a piece to the board and checks if its a valid move-helper for refreshboard
function addBoard(sel) {
  let temp = rowCount - 1;
  if (sel > -1 && sel < colCount) {
    while (temp >= 0) {
      if (board[temp][sel] == 0) {
        board[temp][sel] = turn;
        return true;
      } else {
        temp--;
      }
    }
    return false;
  } else {
    return false
  }
}

//mouse inputs functions that depend on certain scenarios
function mouseReleased() {
  if (scr != 0) {
    if (!gameOver)
      refreshBoard();
  }
}

function mouseClicked() {

  if (scr == 0) {
    if (mouseX >= (width * (1 / 5)) && mouseX <= (width * (4 / 5))) {
      if (mouseY >= (height * (8.5 / 20)) && mouseY <= (height * (11.5 / 20))) {
        scr = 2;
      } else if ((mouseY > (height * (12.5 / 20)) && mouseY <= (height * (15.5 / 20)))) {
        scr = 1;
        ai = 0;
        newGame();
      }
    }
  } else if (scr == 2) {
    if (mouseX >= (width * (1 / 5)) && mouseX <= (width * (4 / 5))) {
      if (mouseY >= (height * (8.5 / 20)) && mouseY <= (height * (11.5 / 20))) {
        scr = 1;
        ai = 1;
        newGame();
      } else if ((mouseY > (height * (12.5 / 20)) && mouseY <= (height * (15.5 / 20)))) {
        scr = 1;
        ai = 2;
        newGame();
      } else if ((mouseY > (height * (16 / 20)) && mouseY <= (height * (19 / 20)))) {
        scr = 1;
        ai = 3;
        newGame();
      }
    }
  }
}

function doubleClicked() {
  if (scr == 0) {} else if (scr == 1) {
    if (gameOver) {
      scr = 0;
    }
  }
}

//rests globals for a new game
function newGame() {
  board = createBoard();
  turn = 1;
  gameOver = false;
  tie = false;
}

//helper function for graphics
function range(temp) {
  if (temp < sqSize)
    return 0;
  else if (temp >= ((colCount - 1) * sqSize))
    return colCount - 1;
  else
    return parseInt(temp / sqSize);
}

//loads the homepage UI
function homePage() {
  background(0, 0, 0);
  image(logo, 0, 0, width);
  if (mouseX >= (width * (1 / 5)) && mouseX <= (width * (4 / 5))) {
    if (mouseY >= (height * (8.5 / 20)) && mouseY <= (height * (11.5 / 20))) {
      fill("yellow");
      strokeWeight(8);
      stroke(55, 229, 61);
      ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

      fill("red");
      stroke("yellow")
      strokeWeight(4);
      ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));
    } else if ((mouseY > (height * (12.5 / 20)) && mouseY <= (height * (15.5 / 20)))) {
      fill("red");
      strokeWeight(8);
      stroke(55, 229, 61);
      ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));

      fill("yellow");
      stroke("red")
      strokeWeight(4);
      ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));
    } else {
      fill("yellow");
      stroke("red")
      strokeWeight(4);
      ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

      fill("red");
      stroke("yellow")
      strokeWeight(4);
      ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));
    }
  } else {
    fill("yellow");
    stroke("red")
    strokeWeight(4);
    ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

    fill("red");
    stroke("yellow")
    strokeWeight(4);
    ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));
  }

  fill("black");
  stroke("black");
  textStyle(ITALIC);
  textSize(45);
  text("Singleplayer", width * (33 / 100), height * (51.5 / 100));
  text("Multiplayer", width * (34 / 100), height * (72 / 100));


}

//helper for checkGame looks for tie
function tieCheck(boar) {
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (boar[r][c] == 0) {
        return false;
      }
    }
  }
  return true;
}

function count(arr, piece) {
  let ct = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == piece) {
      ct++;
    }
  }
  return ct;
}

//see if piece is dropped in a valid location
function validLoc(boar, col) {
  return boar[0][col] == 0;
}

//gets the next avaliable row
function getNextRow(boar, col) {
  for (let r = rowCount - 1; r >= 0; r--) {
    if (boar[r][col] == 0) {
      return r
    }
  }
  return -1;
}

//evaluates the score for a segment helper for scorePos
function evalSegment(segment, piece) {
  let score = 0;
  let oppPiece = 1;
  if (piece == 1) {
    oppPiece = 2;
  }
  let ct = count(segment, piece)
  if (ct == 4) {
    score += 100
  } else if (ct == 3 && count(segment, 0) == 1) {
    score += 10
  } else if (ct == 2 && count(segment, 0) == 2) {
    score += 5
  }
  if (count(segment, oppPiece) == 3 && count(segment, 0) == 1) {
    score -= 30
  } else if (count(segment, oppPiece) == 2 && count(segment, 0) == 2) {
    score -= 8
  }
  return score;
}

//gets the score at each helper for pickBest
function scorePos(boar, i) {
  let score = 0;

  //prioritize center
  cent = getVert(boar, 3);
  centCount = count(cent, i)
  score += centCount * 6;

  //horizontel
  for (let r = 0; r < rowCount; r++) {
    let rowArr = boar[r];
    for (let c = 0; c < colCount - 3; c++) {
      let segment = rowArr.slice(c, c + 4)
      score += evalSegment(segment, i);

    }
  }
  //vertical
  for (let c = 0; c < colCount; c++) {
    let colArr = getVert(boar, c);
    for (let r = 0; r < rowCount - 3; r++) {
      let segment = colArr.slice(r, r + 4)
      score += evalSegment(segment, i);
    }
  }
  //diagnol
  for (let r = 0; r < rowCount - 3; r++) {
    for (let c = 0; c < colCount - 3; c++) {
      let segment = getDiag(boar, r, c);
      score += evalSegment(segment, i);
    }
  }
  for (let r = 0; r < rowCount - 3; r++) {
    for (let c = 0; c < colCount - 3; c++) {
      let segment = [boar[r + 3][c], boar[r + 2][c + 1], boar[r + 1][c + 2], boar[r][c + 3]];
      score += evalSegment(segment, i);
    }
  }
  return score;
}

//used to get an array of validlocations helper for pickBest
function getLocs(boar) {
  let validLocs = [];
  for (let c = 0; c < colCount; c++) {
    if (validLoc(boar, c)) {
      validLocs.push(c);
    }
  }
  return validLocs;
}

//drops the piece on a temp board helper for pickbest
function dropPiece(sel, boar, piece) {
  let temp = rowCount - 1;
  if (sel > -1 && sel < colCount) {
    while (temp >= 0) {
      if (boar[temp][sel] == 0) {
        boar[temp][sel] = piece;
        return true;
      } else {
        temp--;
      }
    }
    return false;
  } else {
    return false
  }
}

//picks the best location to drop
function pickBest(boar, piece) {
  let locations = getLocs(boar);
  bestScore = 0;
  bestCol = random(locations)
  for (let c = 0; c < locations.length; c++) {
    let tempBoard = getCopy(boar);
    dropPiece(locations[c], tempBoard, piece);
    score = scorePos(tempBoard, piece);
    if (score > bestScore) {
      bestScore = score;
      bestCol = locations[c];
    }
  }
  return bestCol;
}

//gets a copy of the matrix for debugging
function getCopy(mat) {
  return mat.map(row => row.map(col => col))
}

//gets a vertical array helper for pickBest
function getVert(boar, col) {
  let temp = [];
  for (let r = rowCount - 1; r >= 0; r--) {
    temp.push(boar[r][col]);
  }
  return temp;
}

//gets diagnoal array helper for pickBest
function getDiag(boar, r, c) {
  let temp = []

  for (let i = 0; i < 4; i++) {
    temp[i] = boar[r + i][c + i]
  }
  return temp;
}

//loads UI for AI lvl selection
function lvlSel() {
  background(0, 0, 0);
  image(logo, 0, 0, width);
  if (mouseX >= (width * (1 / 5)) && mouseX <= (width * (4 / 5))) {
    if (mouseY >= (height * (8.5 / 20)) && mouseY <= (height * (11.5 / 20))) {
      fill("yellow");
      strokeWeight(8);
      stroke(55, 229, 61);
      ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

      fill("red");
      stroke("yellow")
      strokeWeight(4);
      ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));

      fill(18, 111, 248);
      stroke("red")
      strokeWeight(4);
      ellipse(width / 2, height * (18 / 20), width * (3 / 5), height * (3 / 20));

    } else if ((mouseY > (height * (12.5 / 20)) && mouseY <= (height * (15.5 / 20)))) {
      fill("red");
      strokeWeight(8);
      stroke(55, 229, 61);
      ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));

      fill("yellow");
      stroke(18, 111, 248)
      strokeWeight(4);
      ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

      fill(18, 111, 248);
      stroke("red")
      strokeWeight(4);
      ellipse(width / 2, height * (18 / 20), width * (3 / 5), height * (3 / 20));

    } else if ((mouseY > (height * (16.5 / 20)) && mouseY <= (height * (19.5 / 20)))) {
      fill(18, 111, 248);
      strokeWeight(8);
      stroke(55, 229, 61);
      ellipse(width / 2, height * (18 / 20), width * (3 / 5), height * (3 / 20));

      fill("yellow");
      stroke(18, 111, 248)
      strokeWeight(4);
      ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

      fill("red");
      stroke("yellow")
      strokeWeight(4);
      ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));
    } else {
      fill("yellow");
      stroke(18, 111, 248)
      strokeWeight(4);
      ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

      fill("red");
      stroke("yellow")
      strokeWeight(4);
      ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));

      fill(18, 111, 248);
      stroke("red")
      strokeWeight(4);
      ellipse(width / 2, height * (18 / 20), width * (3 / 5), height * (3 / 20));
    }
  } else {
    fill("yellow");
    stroke(18, 111, 248)
    strokeWeight(4);
    ellipse(width / 2, height * (10 / 20), width * (3 / 5), height * (3 / 20));

    fill("red");
    stroke("yellow")
    strokeWeight(4);
    ellipse(width / 2, height * (14 / 20), width * (3 / 5), height * (3 / 20));

    fill(18, 111, 248);
    stroke("red")
    strokeWeight(4);
    ellipse(width / 2, height * (18 / 20), width * (3 / 5), height * (3 / 20));
  }

  fill("black");
  stroke("black");
  textStyle(ITALIC);
  textSize(45);
  text("Easy", width * (42 / 100), height * (51.5 / 100));
  text("Medium", width * (39 / 100), height * (72 / 100));
  text("Hard", width * (42 / 100), height * (92.25 / 100));

}

//algoithm for the actual minimax AI -used in Hard
function minimax(boar, depth, alpha, beta, maxPlayer) {
  let locs = getLocs(boar)
  let terminalNode = checkGame(boar)

  if (depth == 0 || terminalNode) {
    if (terminalNode) {
      if (winningMove(boar, 2)) {
        return [null, 1000000];
      } else if (winningMove(boar, 1)) {
        return [null, -1000000];
      } else {
        return [null, 0]
      }
    } else {
      return [null, scorePos(boar, 2)]
    }
  }
  if (maxPlayer) {
    let value = (-1) * Infinity
    let col = random(locs)
    for (let c = 0; c < locs.length; c++) {
      let bCopy = getCopy(boar)
      dropPiece(locs[c], bCopy, 2)
      let newScore = minimax(bCopy, depth - 1, alpha, beta, false)[1]
      if (newScore > value) {
        value = newScore
        col = locs[c]
      }
      alpha = Math.max(alpha, value)
      if(alpha >= beta)
      {
        break
      }
    }
    return [col, value];
  } else {
    let value = Infinity
    let col = random(locs)
    for (let c = 0; c < locs.length; c++) {
      let bCopy = getCopy(boar)
      dropPiece(locs[c], bCopy, 2)
      let newScore = minimax(bCopy, depth - 1, alpha, beta, true)[1]
      if (newScore < value) {
        value = newScore
        col = locs[c]
      }
      beta = Math.min(beta, value)
      if(alpha>= beta)
      {
        break
      }
    }
    return [col, value];
  }

}

//helper algorithm for the minimax
function winningMove(boar, piece) {
  for (let c = 0; c < (colCount - (inRow - 1)); c++) {
    for (let r = 0; r < rowCount; r++) {
      if (boar[r][c] == piece && boar[r][c + 1] == piece && boar[r][c + 2] == piece && boar[r][c + 3] == piece)
        return true;
    }
  }

  //check vertical win
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < (rowCount - (inRow - 1)); r++) {
      if (boar[r][c] == piece && boar[r + 1][c] == piece && boar[r + 2][c] == piece && boar[r + 3][c] == piece)
        return true;
    }
  }

  //check diagnol win

  //pos diagnol
  for (let c = 0; c < (colCount - (inRow - 1)); c++) {
    for (let r = 0; r < (rowCount - (inRow - 1)); r++) {
      if (boar[r][c] == piece && boar[r + 1][c + 1] == piece && boar[r + 2][c + 2] == piece && boar[r + 3][c + 3] == piece)
        return true;
    }
  }

  //neg diagnol
  for (let c = 0; c < (colCount - (inRow - 1)); c++) {
    for (let r = (inRow - 1); r < rowCount; r++) {
      if (boar[r][c] == piece && boar[r - 1][c + 1] == piece && boar[r - 2][c + 2] == piece && boar[r - 3][c + 3] == piece)
        return true;
    }
  }
  return false;
}
