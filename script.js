const Gameboard = (() => {
  const gameboard = [];
  const gameboardOneDimArray = [];
  const gameboardDiv = document.querySelector(".gameboard");

  const createBoard = (() => {
    for (let i = 0; i < 3; i++) {
      gameboard[i] = [];
      for (let j = 0; j < 3; j++) {
        gameboard[i].push("");
        gameboardOneDimArray.push("");
        const button = document.createElement("button");
        button.classList.add("square");
        button.dataset.row = i;
        button.dataset.column = j;
        gameboardDiv.appendChild(button);
      }
    }

    return { gameboard, gameboardOneDimArray };
  })();

  const getBoard = () => {
    const buttons = document.querySelectorAll(".square");
    buttons.forEach(button => {
      button.textContent = gameboard[button.dataset.row][button.dataset.column];
    });
    return { buttons };
  };

  const remakeArrays = () => {
    gameboardOneDimArray.length = 0;
    for (let i = 0; i < 3; i++) {
      gameboard[i] = [];
      for (let j = 0; j < 3; j++) {
        gameboard[i].push("");
        gameboardOneDimArray.push("");
      }
    }
    return { gameboard, gameboardOneDimArray };
  };

  return { getBoard, gameboard, gameboardOneDimArray, remakeArrays };
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

  const checkWin = (gameboard, currentPlayer) => {
    if (gameboard[0] === currentPlayer) {
      if (gameboard[1] === currentPlayer && gameboard[2] === currentPlayer) {
        return true;
      } else if (
        gameboard[3] === currentPlayer &&
        gameboard[6] === currentPlayer
      ) {
        return true;
      } else if (
        gameboard[4] === currentPlayer &&
        gameboard[8] === currentPlayer
      ) {
        return true;
      }
    }
    if (gameboard[8] === currentPlayer) {
      if (gameboard[2] === currentPlayer && gameboard[5] === currentPlayer) {
        return true;
      } else if (
        gameboard[6] === currentPlayer &&
        gameboard[7] === currentPlayer
      ) {
        return true;
      }
    }
    if (gameboard[4] === currentPlayer) {
      if (gameboard[1] === currentPlayer && gameboard[7] === currentPlayer) {
        return true;
      } else if (
        gameboard[3] === currentPlayer &&
        gameboard[5] === currentPlayer
      ) {
        return true;
      } else if (
        gameboard[2] === currentPlayer &&
        gameboard[6] === currentPlayer
      ) {
        return true;
      }
    }
    // gameboardArray.every(el => el === "X" || el === "O")
    if (emptySquares().length === 0) {
      return "draw";
    }
  };

  const handleModal = () => {
    const modal = document.querySelector(".modal");
    const closeButton = document.querySelector(".close");
    const message = document.querySelector(".message");
    const currentPlayer = getPlayerMark();
    if (checkWin(Gameboard.gameboard, currentPlayer) === "draw") {
      message.textContent = "DRAW!";
    } else {
      message.textContent = `${currentPlayer} WON!`;
    }
    modal.style.display = "block";
    closeButton.onclick = () => (modal.style.display = "none");
    window.onclick = e => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    };
  };

  const restartGame = () => {
    Gameboard.getBoard().buttons.forEach(button => {
      button.textContent = "";
    });
    Gameboard.remakeArrays();
    activePlayer = "playerOne";
    Game.startGame();
  };

  const playRound = gameboard => {
    if (checkWin(gameboard, getPlayerMark())) {
      handleModal();
      restartGame();
      return;
    }

    startNewRound();

    switchPlayer();
  };

  const addMark = e => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    const gameboard = Gameboard.gameboard;
    const gameboardArray = Gameboard.gameboardOneDimArray;
    const buttons = document.querySelectorAll(".square");

    if (e.target.value === undefined || gameboard[row][column] !== "") return;

    buttons.forEach((button, index) => {
      if (e.target === button) {
        gameboardArray[index] = getPlayerMark();
      }
    });

    gameboard[row][column] = getPlayerMark();
    playRound(gameboardArray);
  };

  const emptySquares = () => {
    const gameboardArray = Gameboard.gameboardOneDimArray;
    return gameboardArray.filter(el => el !== "X" && el !== "O");
  };

  return { addMark };
})();

const Game = (() => {
  const startGame = () => {
    const gameboardDiv = document.querySelector(".gameboard");
    gameboardDiv.addEventListener("click", Controller.addMark);
  };

  startGame();

  return { startGame };
})();
