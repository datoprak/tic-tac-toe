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

    const buttons = document.querySelectorAll(".square");
    buttons.forEach((btn, index) => {
      btn.dataset.index = index;
    });

    return { gameboard, gameboardOneDimArray };
  })();

  const getBoard = () => {
    const buttons = document.querySelectorAll(".square");
    buttons.forEach((button, index) => {
      button.textContent = gameboard[button.dataset.row][button.dataset.column];
      button.textContent = gameboardOneDimArray[index];
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
  let aiPlayerMark;
  const aiPlayer = "__ai";

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
    playRound();
    return { xPlayerName, oPlayerName, activePlayer };
  };

  const handlePve = e => {
    e.preventDefault();
    const playerNameInput = document.querySelector("#player");
    const playerMarkInput = document.querySelector(
      "input[name='mark']:checked"
    );
    const pveModal = document.querySelector(".pve-modal");
    const errorMessage = document.querySelector(".pve-error");
    const playerName = playerNameInput.value;
    const playerMark = playerMarkInput.value;
    if (!playerName) {
      errorMessage.style.display = "block";
      return;
    }
    xPlayerName = playerMark === "X" ? playerName : aiPlayer;
    oPlayerName = playerMark === "O" ? playerName : aiPlayer;
    aiPlayerMark = playerMark === "X" ? "O" : "X";
    pveModal.style.display = "none";
    activePlayer = xPlayerName;
    console.log({ xPlayerName, oPlayerName, activePlayer });
    playRound();
    return { xPlayerName, oPlayerName, activePlayer, aiPlayerMark };
  };

  const getPlayerMark = () => (activePlayer === xPlayerName ? "X" : "O");

  const switchPlayer = () =>
    (activePlayer = activePlayer === xPlayerName ? oPlayerName : xPlayerName);

  const startNewRound = () => {
    Gameboard.getBoard();
  };

  const checkWin = (gameboard, currentPlayerMark) => {
    currentPlayerMark = currentPlayerMark === "X" ? "O" : "X";
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
  };

  const checkDraw = gameboard => {
    return gameboard.every(el => el === "X" || el === "O");
  };

  const handleModal = result => {
    const modal = document.querySelector(".modal");
    const message = document.querySelector(".message");
    const newGameButton = document.querySelector(".new-game");
    const restartButton = document.querySelector(".restart");
    const vsModal = document.querySelector(".vs-modal");
    if (result === "draw") {
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
  };

  const makeAimove = () => {
    const emptySquare = Gameboard.gameboardOneDimArray.find(
      el => el !== "X" && el !== "O"
    );
    const index = Gameboard.gameboardOneDimArray.indexOf(emptySquare);
    Gameboard.gameboardOneDimArray[index] = getPlayerMark();
    switchPlayer();
    playRound();
  };

  const playRound = () => {
    const gameboardDiv = document.querySelector(".gameboard");
    let result;
    if (checkWin(Gameboard.gameboardOneDimArray, getPlayerMark())) {
      result = "win";
      switchPlayer();
      handleModal(result);
      restartGame();
      return;
    }
    if (checkDraw(Gameboard.gameboardOneDimArray)) {
      result = "draw";
      handleModal(result);
      restartGame();
      return;
    }
    if (isAiTurn()) {
      makeAimove();
      startNewRound();
    } else {
      gameboardDiv.addEventListener("click", addMark);
      startNewRound();
    }
  };

  const isAiTurn = () => (activePlayer === "__ai" ? true : false);

  const addMark = e => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    const index = e.target.dataset.index;
    const gameboard = Gameboard.gameboard;
    const gameboardArray = Gameboard.gameboardOneDimArray;

    if (
      e.target.value === undefined ||
      gameboard[row][column] !== "" ||
      gameboardArray[index] !== ""
    )
      return;

    gameboardArray[index] = getPlayerMark();

    gameboard[row][column] = getPlayerMark();
    switchPlayer();
    playRound();
  };

  return { addMark, handlePvp, handlePve, playRound };
})();

const Game = (() => {
  const vsModal = document.querySelector(".vs-modal");
  const pvpButton = document.querySelector(".pvp-button");
  const pveButton = document.querySelector(".pve-button");
  const pvpModal = document.querySelector(".pvp-modal");
  const pvpStartButton = document.querySelector(".pvp-start-button");
  const pveStartButton = document.querySelector(".pve-start-button");
  const pveModal = document.querySelector(".pve-modal");
  const gameboardDiv = document.querySelector(".gameboard");

  const startGame = () => {
    pvpButton.addEventListener("click", handlePvpModal);

    pveButton.addEventListener("click", handlePveModal);

    pvpStartButton.addEventListener("click", Controller.handlePvp);

    pveStartButton.addEventListener("click", Controller.handlePve);
  };

  const handlePvpModal = () => {
    pvpModal.style.display = "block";
    vsModal.style.display = "none";
  };

  const handlePveModal = () => {
    pveModal.style.display = "block";
    vsModal.style.display = "none";
  };

  startGame();

  return { startGame };
})();
