const Gameboard = (() => {
  const gameboard = ["x", "o", "x", "x", "o", "x", "x", "o", "x"];
  const squares = document.querySelectorAll(".square");
  squares.forEach((square, index) => {
    square.textContent = gameboard[index];
  });
})();

const Player = name => {
  const getName = () => name;
};

const Game = () => {};
