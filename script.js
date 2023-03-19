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
  let xPlayerName;
  let oPlayerName;
  let activePlayer;

  const handlePvp = e => {
    e.preventDefault();
    const xPlayerInput = document.querySelector("#x-player");
    const oPlayerInput = document.querySelector("#o-player");
    const pvpModal = document.querySelector(".pvp-modal");
    const errorMessage = document.querySelector(".pvp-error");
    xPlayerName = xPlayerInput.value;
    oPlayerName = oPlayerInput.value;
    if (
      xPlayerName === oPlayerName ||
      xPlayerName === "" ||
      oPlayerName === ""
    ) {
      errorMessage.style.display = "block";
      return;
    }
    pvpModal.style.display = "none";
    activePlayer = xPlayerName;
    return { xPlayerName, oPlayerName, activePlayer };
  };

  const getPlayerMark = () => (activePlayer === xPlayerName ? "X" : "O");

  const switchPlayer = () =>
    (activePlayer = activePlayer === xPlayerName ? oPlayerName : xPlayerName);

  const startNewRound = () => {
    Gameboard.getBoard();
  };

  const checkWin = (gameboard, currentPlayerMark) => {
    if (gameboard[0] === currentPlayerMark) {
      if (
        gameboard[1] === currentPlayerMark &&
        gameboard[2] === currentPlayerMark
      ) {
        return true;
      } else if (
        gameboard[3] === currentPlayerMark &&
        gameboard[6] === currentPlayerMark
      ) {
        return true;
      } else if (
        gameboard[4] === currentPlayerMark &&
        gameboard[8] === currentPlayerMark
      ) {
        return true;
      }
    }
    if (gameboard[8] === currentPlayerMark) {
      if (
        gameboard[2] === currentPlayerMark &&
        gameboard[5] === currentPlayerMark
      ) {
        return true;
      } else if (
        gameboard[6] === currentPlayerMark &&
        gameboard[7] === currentPlayerMark
      ) {
        return true;
      }
    }
    if (gameboard[4] === currentPlayerMark) {
      if (
        gameboard[1] === currentPlayerMark &&
        gameboard[7] === currentPlayerMark
      ) {
        return true;
      } else if (
        gameboard[3] === currentPlayerMark &&
        gameboard[5] === currentPlayerMark
      ) {
        return true;
      } else if (
        gameboard[2] === currentPlayerMark &&
        gameboard[6] === currentPlayerMark
      ) {
        return true;
      }
    }
    if (emptySquares().length === 0) {
      return "draw";
    }
  };

  const handleModal = () => {
    const modal = document.querySelector(".modal");
    const message = document.querySelector(".message");
    const newGameButton = document.querySelector(".new-game");
    const restartButton = document.querySelector(".restart");
    const vsModal = document.querySelector(".vs-modal");
    const currentPlayerMark = getPlayerMark();
    if (checkWin(Gameboard.gameboard, currentPlayerMark) === "draw") {
      message.textContent = "DRAW!";
    } else {
      message.textContent = `${activePlayer} WON!`;
    }
    modal.style.display = "block";
    newGameButton.onclick = () => {
      modal.style.display = "none";
      vsModal.style.display = "block";
    };
    restartButton.onclick = () => {
      modal.style.display = "none";
    };
  };

  const restartGame = () => {
    const errorMessage = document.querySelector(".pvp-error");
    const xPlayerInput = document.querySelector("#x-player");
    const oPlayerInput = document.querySelector("#o-player");
    Gameboard.getBoard().buttons.forEach(button => {
      button.textContent = "";
    });
    Gameboard.remakeArrays();
    activePlayer = xPlayerName;
    errorMessage.style.display = "none";
    xPlayerInput.value = "";
    oPlayerInput.value = "";
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

  return { addMark, handlePvp };
})();

const Game = (() => {
  const vsModal = document.querySelector(".vs-modal");
  const pvpButton = document.querySelector(".pvp-button");
  const pveButton = document.querySelector(".pve-button");
  const pvpModal = document.querySelector(".pvp-modal");
  const pvpStartButton = document.querySelector(".pvp-start-button");
  const gameboardDiv = document.querySelector(".gameboard");

  const startGame = () => {
    pvpButton.addEventListener("click", handleVsModal);

    pvpStartButton.addEventListener("click", Controller.handlePvp);

    gameboardDiv.addEventListener("click", Controller.addMark);
  };

  const handleVsModal = () => {
    pvpModal.style.display = "block";
    vsModal.style.display = "none";
  };

  startGame();

  return { startGame };
})();
