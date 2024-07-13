const gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(createCell());
    }
  }

  function getBoard() {
    return board;
  }

  function createCell() {
    let value = 0;

    function addMark(playerMark) {
      value = playerMark;
    }

    function getValue() {
      return value;
    }

    return { addMark, getValue };
  }

  function chooseCell(row, column, playerMark) {
    const chosenCell = board[row][column];
    chosenCell.addMark(playerMark);
  }

  function printBoard() {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  }

  return { getBoard, chooseCell, printBoard };
})();

const gameManager = ((
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) => {
  const players = [
    {
      name: playerOneName,
      mark: "x",
      markPlacement: {
        rows: [0, 0, 0],
        columns: [0, 0, 0],
        leftDiagonal: [0, 0, 0],
        rightDiagonal: [0, 0, 0],
      },
    },
    {
      name: playerTwoName,
      mark: "o",
      markPlacement: {
        rows: [0, 0, 0],
        columns: [0, 0, 0],
        leftDiagonal: [0, 0, 0],
        rightDiagonal: [0, 0, 0],
      },
    },
  ];

  let activePlayer = players[0];

  function switchPlayerTurn() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function printNewRound() {
    gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  }

  function isWin(row, column) {
    // Update markPlacement to keep track of players marks
    // to make checking for win condition more efficient.
    // Otherwise wer would need to scan the whole board state
    // for all possible win conditions after every move
    getActivePlayer().markPlacement.rows[row]++;
    getActivePlayer().markPlacement.columns[column]++;

    if (row === 0 && column === 0) {
      getActivePlayer().markPlacement.leftDiagonal[0]++;
    } else if (row === 1 && column === 1) {
      getActivePlayer().markPlacement.leftDiagonal[1]++;
    } else if (row === 2 && column === 2) {
      getActivePlayer().markPlacement.leftDiagonal[2]++;
    }

    if (row === 0 && column === 2) {
      getActivePlayer().markPlacement.rightDiagonal[0]++;
    } else if (row === 1 && column === 1) {
      getActivePlayer().markPlacement.rightDiagonal[1]++;
    } else if (row === 2 && column === 0) {
      getActivePlayer().markPlacement.rightDiagonal[2]++;
    }

    // console.log(
    //   `${getActivePlayer().name}'s rows look like this ${
    //     getActivePlayer().markPlacement.rows
    //   } and columns look like this ${
    //     getActivePlayer().markPlacement.columns
    //   } and left diagonal ${
    //     getActivePlayer().markPlacement.leftDiagonal
    //   } and right diagonal ${getActivePlayer().markPlacement.rightDiagonal}`
    // );

    let gameWon = false;

    // Test if player won by row, column, left or right diagonal
    if (
      getActivePlayer().markPlacement.rows.includes(3) ||
      getActivePlayer().markPlacement.columns.includes(3) ||
      getActivePlayer().markPlacement.leftDiagonal.reduce(
        (sum, number) => sum + number
      ) === 3 ||
      getActivePlayer().markPlacement.rightDiagonal.reduce(
        (sum, number) => sum + number
      ) === 3
    ) {
      gameWon = true;
    }

    return gameWon;
  }

  function playRound(row, column) {
    // Check if cell is empty before placing mark
    if (gameboard.getBoard()[row][column].getValue() !== 0) {
      console.log("You can't put your mark onto another players mark");
      console.log("Please go again");
      return;
    }

    // Mark a cell for the current player
    console.log(`${getActivePlayer().name} placed his mark`);
    gameboard.chooseCell(row, column, getActivePlayer().mark);

    // This is where we check for a winner and handle that logic, such as a win message.
    if (isWin(row, column)) {
      console.log(`Congratulations, ${getActivePlayer().name} won the game`);
      // somehow stop game here cause it is over
      return;
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  }

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
})();
