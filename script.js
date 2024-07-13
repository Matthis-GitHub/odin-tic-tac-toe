let game;

const startButton = document.querySelector(".start-button");
const playerOne = document.querySelector("#player-one");
const playerTwo = document.querySelector("#player-two");
const gameStatusText = document.querySelector(".container-left p");

startButton.addEventListener("click", () => {
  let playerOneName = playerOne.value;
  let playerTwoName = playerTwo.value;

  if (playerOneName === "") {
    playerOneName = "Player One";
  }
  if (playerTwoName === "") {
    playerTwoName = "Player Two";
  }

  game = gameManager(playerOneName, playerTwoName);
});

function gameManager(playerOneName, playerTwoName) {
  const displayManager = (() => {
    const boardFields = document.querySelectorAll(".gameboard button");

    boardFields.forEach((field) => {
      field.addEventListener("click", eventHandler);
    });

    function removeAllEventListeners() {
      boardFields.forEach((field) => {
        field.removeEventListener("click", eventHandler);
      });
    }

    function eventHandler(e) {
      playRound(
        Number(e.target.getAttribute("data-row")),
        Number(e.target.getAttribute("data-column"))
      );
    }

    function setGameStatusText(message) {
      gameStatusText.textContent = message;
    }

    function displayBoardState() {
      for (let i = 0; i < gameboard.getBoard().length; i++) {
        gameboard.getBoard()[i].forEach((cell, index) => {
          boardFields[index + i * 3].textContent = cell.getValue();
        });
      }
    }

    return {
      displayBoardState,
      removeAllEventListeners,
      setGameStatusText,
    };
  })();

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
      let value = "";

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
      //   console.log(boardWithCellValues);
    }

    return { getBoard, chooseCell, printBoard };
  })();

  const players = (() => {
    const allPlayers = [
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

    let activePlayer = allPlayers[0];

    function switchPlayerTurn() {
      activePlayer =
        activePlayer === allPlayers[0] ? allPlayers[1] : allPlayers[0];
    }

    function getActivePlayer() {
      return activePlayer;
    }

    return { switchPlayerTurn, getActivePlayer };
  })();

  function printNewRound() {
    gameboard.printBoard();
    // console.log(`${players.getActivePlayer().name}'s turn.`);
    displayManager.setGameStatusText(
      `It's ${players.getActivePlayer().name}'s turn`
    );
  }

  function isWin(row, column) {
    // Update markPlacement to keep track of players marks
    // to make checking for win condition more efficient.
    // Otherwise wer would need to scan the whole board state
    // for all possible win conditions after every move
    players.getActivePlayer().markPlacement.rows[row]++;
    players.getActivePlayer().markPlacement.columns[column]++;

    if (row === 0 && column === 0) {
      players.getActivePlayer().markPlacement.leftDiagonal[0]++;
    } else if (row === 1 && column === 1) {
      players.getActivePlayer().markPlacement.leftDiagonal[1]++;
    } else if (row === 2 && column === 2) {
      players.getActivePlayer().markPlacement.leftDiagonal[2]++;
    }

    if (row === 0 && column === 2) {
      players.getActivePlayer().markPlacement.rightDiagonal[0]++;
    } else if (row === 1 && column === 1) {
      players.getActivePlayer().markPlacement.rightDiagonal[1]++;
    } else if (row === 2 && column === 0) {
      players.getActivePlayer().markPlacement.rightDiagonal[2]++;
    }

    let gameWon = false;

    // Test if player won by row, column, left or right diagonal
    if (
      players.getActivePlayer().markPlacement.rows.includes(3) ||
      players.getActivePlayer().markPlacement.columns.includes(3) ||
      players
        .getActivePlayer()
        .markPlacement.leftDiagonal.reduce((sum, number) => sum + number) ===
        3 ||
      players
        .getActivePlayer()
        .markPlacement.rightDiagonal.reduce((sum, number) => sum + number) === 3
    ) {
      gameWon = true;
    }

    return gameWon;
  }

  function isDraw() {
    let isDraw = true;
    gameboard.getBoard().forEach((row) =>
      row.forEach((cell) => {
        if (cell.getValue() === "") {
          isDraw = false;
        }
      })
    );
    return isDraw;
  }

  function playRound(row, column) {
    // Check if cell is empty before placing mark

    if (gameboard.getBoard()[row][column].getValue() !== "") {
      //   console.log("You can't put your mark onto another players mark");
      displayManager.setGameStatusText(
        "You can't put your mark onto another players mark"
      );
      return;
    }

    // Mark a cell for the current player
    // console.log(`${players.getActivePlayer().name} placed his mark`);
    gameboard.chooseCell(row, column, players.getActivePlayer().mark);

    // This is where we check for a winner and handle that logic, such as a win message.
    if (isWin(row, column)) {
      //   console.log(
      //     `Congratulations, ${players.getActivePlayer().name} won the game`
      //   );
      displayManager.setGameStatusText(
        `${
          players.getActivePlayer().name
        } won the game. Press start to play again`
      );
      displayManager.displayBoardState();
      // Remove interactivity so you cant make new turn
      displayManager.removeAllEventListeners();
    }
    // Check if it was a draw
    else if (isDraw()) {
      displayManager.setGameStatusText(
        "It's a draw. Press start to play again"
      );
      displayManager.displayBoardState();
      displayManager.removeAllEventListeners();
    } else {
      // Switch player turn
      players.switchPlayerTurn();
      printNewRound();
      displayManager.displayBoardState();
    }
  }

  // Initial play game message
  printNewRound();
  displayManager.displayBoardState();

  // Make function accessible so it can be played from console
  return {
    playRound,
  };
}
