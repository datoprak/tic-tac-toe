const Gameboard = (() => {
  const gameboard = [];
  const gameboardDiv = document.querySelector(".gameboard");

  const createBoard = (() => {
    for (let i = 0; i < 9; i++) {
      gameboard.push("");
      const button = document.createElement("button");
      button.classList.add("square");
      button.dataset.index = i;
      gameboardDiv.appendChild(button);
    }

    return gameboard;
  })();

  const getBoard = () => {
    const buttons = document.querySelectorAll(".square");
    buttons.forEach((button, index) => {
      button.textContent = gameboard[index];
    });
    return { buttons };
  };

  const remakeArrays = () => {
    gameboard.length = 0;
    for (let i = 0; i < 9; i++) {
      gameboard.push("");
    }

    return gameboard;
  };

  return { getBoard, gameboard, remakeArrays };
})();

const Handlers = () => {
  const vsModal = document.querySelector(".vs-modal");
  const pvpModal = document.querySelector(".pvp-modal");
  const pveModal = document.querySelector(".pve-modal");
  const pvpErrorMessage = document.querySelector(".pvp-error");
  const pveErrorMessage = document.querySelector(".pve-error");
  const modal = document.querySelector(".modal");
  const message = document.querySelector(".message");
  const newGameButton = document.querySelector(".new-game");
  const restartButton = document.querySelector(".restart");

  const handlePvpModal = () => {
    pvpModal.style.display = "block";
    vsModal.style.display = "none";
  };

  const handlePveModal = () => {
    pveModal.style.display = "block";
    vsModal.style.display = "none";
  };

  const handlePvp = e => {
    e.preventDefault();
    const xPlayerInput = document.querySelector("#x-player");
    const oPlayerInput = document.querySelector("#o-player");
    const xPlayerName = xPlayerInput.value;
    const oPlayerName = oPlayerInput.value;
    if (
      xPlayerName === oPlayerName ||
      xPlayerName === "" ||
      oPlayerName === ""
    ) {
      pvpErrorMessage.style.display = "block";
      return;
    }
    pvpModal.style.display = "none";
    let activePlayer = xPlayerName;
    Controller.playRound(xPlayerName, oPlayerName, activePlayer);
  };

  const handlePve = e => {
    e.preventDefault();
    const playerNameInput = document.querySelector("#player");
    const playerMarkInput = document.querySelector(
      "input[name='mark']:checked"
    );
    const playerName = playerNameInput.value;
    const playerMark = playerMarkInput.value;
    if (!playerName) {
      pveErrorMessage.style.display = "block";
      return;
    }
    const aiPlayer = "__ai";
    const xPlayerName = playerMark === "X" ? playerName : aiPlayer;
    const oPlayerName = playerMark === "O" ? playerName : aiPlayer;
    const aiPlayerMark = playerMark === "X" ? "O" : "X";
    pveModal.style.display = "none";
    let activePlayer = xPlayerName;
    Controller.playRound(xPlayerName, oPlayerName, activePlayer, aiPlayerMark);
  };

  const handleModal = (
    result,
    xPlayerName,
    oPlayerName,
    activePlayer,
    aiPlayerMark
  ) => {
    if (result === "draw") {
      message.textContent = "DRAW!";
    } else {
      message.textContent = `${
        activePlayer === "__ai" ? "AI" : activePlayer.toUpperCase()
      } WIN!`;
    }
    modal.style.display = "block";
    newGameButton.onclick = () => {
      modal.style.display = "none";
      vsModal.style.display = "block";
      Controller.restartGame(activePlayer, xPlayerName);
    };
    restartButton.onclick = () => {
      modal.style.display = "none";
      activePlayer = Controller.restartGame(activePlayer, xPlayerName);
      Controller.playRound(
        xPlayerName,
        oPlayerName,
        activePlayer,
        aiPlayerMark
      );
    };
  };

  return { handlePvpModal, handlePveModal, handlePvp, handlePve, handleModal };
};

const Controller = (() => {
  const getPlayerMark = (xPlayerName, activePlayer) =>
    activePlayer === xPlayerName ? "X" : "O";

  const switchPlayer = (xPlayerName, oPlayerName, activePlayer) =>
    (activePlayer = activePlayer === xPlayerName ? oPlayerName : xPlayerName);

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

    return false;
  };

  const checkDraw = gameboard => {
    return gameboard.every(el => el === "X" || el === "O");
  };

  const restartGame = (activePlayer, xPlayerName) => {
    const pvpErrorMessage = document.querySelector(".pvp-error");
    const pveErrorMessage = document.querySelector(".pve-error");
    const xPlayerInput = document.querySelector("#x-player");
    const oPlayerInput = document.querySelector("#o-player");
    const playerInput = document.querySelector("#player");
    Gameboard.getBoard().buttons.forEach(button => {
      button.textContent = "";
    });
    Gameboard.remakeArrays();
    activePlayer = xPlayerName;
    pvpErrorMessage.style.display = "none";
    pveErrorMessage.style.display = "none";
    xPlayerInput.value = "";
    oPlayerInput.value = "";
    playerInput.value = "";
    return activePlayer;
  };

  const emptySquares = () => {
    let emptySquaresIndex = [];
    Gameboard.gameboard.filter((el, index) => {
      if (el !== "X" && el !== "O") {
        emptySquaresIndex.push(index);
      }
    });
    return emptySquaresIndex;
  };

  const minimax = (gameboard, player, aiPlayerMark) => {
    const emptySquaresArray = emptySquares();
    const humanPlayerMark = aiPlayerMark === "X" ? "O" : "X";

    if (checkWin(gameboard, aiPlayerMark)) {
      return { score: -10 };
    } else if (checkWin(gameboard, humanPlayerMark)) {
      return { score: 10 };
    } else if (emptySquaresArray.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < emptySquaresArray.length; i++) {
      const move = {};
      move.index = emptySquaresArray[i];
      gameboard[emptySquaresArray[i]] = player;

      if (player === aiPlayerMark) {
        const result = minimax(gameboard, humanPlayerMark, aiPlayerMark);
        move.score = result.score;
      } else {
        const result = minimax(gameboard, aiPlayerMark, aiPlayerMark);
        move.score = result.score;
      }

      gameboard[emptySquaresArray[i]] = "";
      moves.push(move);
    }

    let bestMove;
    if (player === aiPlayerMark) {
      let bestScore = -1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };

  const makeAimove = (xPlayerName, oPlayerName, activePlayer, aiPlayerMark) => {
    const bestMove = minimax(
      Gameboard.gameboard,
      aiPlayerMark,
      aiPlayerMark
    ).index;

    Gameboard.gameboard[bestMove] = aiPlayerMark;
    activePlayer = switchPlayer(xPlayerName, oPlayerName, activePlayer);
    playRound(xPlayerName, oPlayerName, activePlayer, aiPlayerMark);
  };

  const playRound = (
    xPlayerName,
    oPlayerName,
    activePlayer,
    aiPlayerMark = ""
  ) => {
    const gameboardDiv = document.querySelector(".gameboard");
    let result;
    Gameboard.getBoard();
    if (
      checkWin(Gameboard.gameboard, getPlayerMark(xPlayerName, activePlayer))
    ) {
      result = "win";
      activePlayer = switchPlayer(xPlayerName, oPlayerName, activePlayer);
      Handlers().handleModal(
        result,
        xPlayerName,
        oPlayerName,
        activePlayer,
        aiPlayerMark
      );
      return;
    }
    if (checkDraw(Gameboard.gameboard)) {
      result = "draw";
      Handlers().handleModal(
        result,
        xPlayerName,
        oPlayerName,
        activePlayer,
        aiPlayerMark
      );
      return;
    }
    if (isAiTurn(activePlayer)) {
      makeAimove(xPlayerName, oPlayerName, activePlayer, aiPlayerMark);
      Gameboard.getBoard();
    } else {
      gameboardDiv.param = { xPlayerName, oPlayerName, activePlayer };
      gameboardDiv.addEventListener("click", addMark);
      Gameboard.getBoard();
    }
  };

  const isAiTurn = activePlayer => (activePlayer === "__ai" ? true : false);

  const addMark = e => {
    const index = e.target.dataset.index;
    const param = e.currentTarget.param;
    const xPlayerName = param.xPlayerName;
    const oPlayerName = param.oPlayerName;
    let activePlayer = param.activePlayer;
    let aiPlayerMark;
    if (xPlayerName === "__ai") {
      aiPlayerMark = "X";
    } else if (oPlayerName === "__ai") {
      aiPlayerMark = "O";
    }

    if (e.target.value === undefined || Gameboard.gameboard[index] !== "")
      return;

    Gameboard.gameboard[index] = getPlayerMark(xPlayerName, activePlayer);

    activePlayer = switchPlayer(xPlayerName, oPlayerName, activePlayer);

    playRound(xPlayerName, oPlayerName, activePlayer, aiPlayerMark);
  };

  return { playRound, restartGame };
})();

const StartGame = (() => {
  const pvpButton = document.querySelector(".pvp-button");
  const pveButton = document.querySelector(".pve-button");
  const pvpStartButton = document.querySelector(".pvp-start-button");
  const pveStartButton = document.querySelector(".pve-start-button");

  pvpButton.addEventListener("click", Handlers().handlePvpModal);

  pveButton.addEventListener("click", Handlers().handlePveModal);

  pvpStartButton.addEventListener("click", Handlers().handlePvp);

  pveStartButton.addEventListener("click", Handlers().handlePve);
})();
