const Gameboard = (() => {
  const createBoard = (() => {
    const gameboardDiv = document.querySelector(".gameboard");
    const gameboard = [];
    for (let i = 0; i < 3; i++) {
      gameboard[i] = [];
      for (let j = 0; j < 3; j++) {
        gameboard[i].push("");
        const button = document.createElement("button");
        button.classList.add("square");
        button.dataset.row = i;
        button.dataset.column = j;
        gameboardDiv.appendChild(button);
      }
    }

    return { gameboard };
  })();

  const getBoard = () => {
    const buttons = document.querySelectorAll(".square");
    buttons.forEach(button => {
      button.textContent =
        createBoard.gameboard[button.dataset.row][button.dataset.column];
    });
  };

  return { getBoard, createBoard };
})();

const Controller = (() => {
  let activePlayer = "playerOne";

  const getPlayerMark = () => (activePlayer === "playerOne" ? "X" : "O");

  const switchPlayer = () => {
    activePlayer = activePlayer === "playerOne" ? "playerTwo" : "playerOne";
  };

  const startNewRound = () => {
    Gameboard.getBoard();
  };

  const playRound = () => {
    startNewRound();
    // check for winner

    switchPlayer();
  };

  const addMark = e => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;

    if (
      e.target.value === undefined ||
      Gameboard.createBoard.gameboard[row][column] !== ""
    )
      return;

    Gameboard.createBoard.gameboard[row][column] = getPlayerMark();
    playRound();
  };

  return { addMark };
})();

const Game = (() => {
  Gameboard.createBoard;
  const gameboardDiv = document.querySelector(".gameboard");
  gameboardDiv.addEventListener("click", Controller.addMark);
})();
