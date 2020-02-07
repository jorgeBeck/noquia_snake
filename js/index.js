"use strict";

// Constantes de las teclas de flechitas
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

/**
 * Dimensiones de la cuadríucula. Arreglo de dos números. Estos deben ser mayores a 5
 */
const DIMENSIONS = [30, 50];

/**
 * Configuraciones de la vívora en tiempo real.
 */
const MainSnake = {
  direction: RIGHT, // Debe comenzar al lado opuesto a donde está volteando
  bodyPositions: [
    [5, 4],
    [6, 4],
    [7, 4],
    [8, 4],
    [9, 4],
    [10, 4],
    [11, 4],
    [12, 4],
    [13, 4]
  ],
  headPosition: [14, 4]
};

/**
 * Instancia del tablero principal del juego.
 */
const Screen = document.getElementById("screen");

const init = () => {
  if (
    DIMENSIONS[0] &&
    DIMENSIONS[0] > 5 &&
    DIMENSIONS[1] &&
    DIMENSIONS[1] > 5
  ) {
    buildScreen();
    renderMainSnake();
  } else {
    alert("FAIL: Corregir configuraciones del juego");
  }
};

/**
 * Construye los pixeles del juego de acuerdo a las dimensiones.
 */
const buildScreen = () => {
  // TODO: inicializar vívora
  for (let i = 0; i < DIMENSIONS[0]; i++) {
    const newLayer = document.createElement("div");
    newLayer.className = "layer";
    newLayer.id = `layer-${i}`;
    for (let j = 0; j < DIMENSIONS[1]; j++) {
      const newPixel = document.createElement("div");
      newPixel.className = "pixel";
      newPixel.id = `pixel-${i}-${j}`;
      newPixel.title = `pixel-${i}-${j}`;
      newLayer.appendChild(newPixel);
    }
    Screen.appendChild(newLayer);
  }
};

/**
 * Evento para las teclas de flechas.
 */
document.onkeydown = function(e) {
  if (
    e.keyCode == LEFT ||
    e.keyCode == UP ||
    e.keyCode == RIGHT ||
    e.keyCode == DOWN
  ) {
    setMainSnakePosition(e.keyCode);
  } else {
    console.log(e.keyCode); // TODO: teclas restantes
  }
};

/**
 * Hace set de los valores de la posición de la vívora. Llama a renderMainSnake
 * @param {Number} direction
 */
const setMainSnakePosition = direction => {
  // Posición antigual de cabeza
  let oldHeadPosition = [...MainSnake.headPosition];
  switch (direction) {
    case LEFT:
      if (MainSnake.direction === RIGHT) return;
      if (MainSnake.headPosition[0] <= 0) return;
      if (
        snakeColide([
          Number(MainSnake.headPosition[0]) - 1,
          MainSnake.headPosition[1]
        ])
      ) {
        return;
      }
      MainSnake.headPosition[0]--;
      break;
    case UP:
      if (MainSnake.direction === DOWN) return;
      if (MainSnake.headPosition[1] <= 0) return;
      if (
        snakeColide([
          MainSnake.headPosition[0],
          Number(MainSnake.headPosition[1]) - 1
        ])
      ) {
        return;
      }
      MainSnake.headPosition[1]--;
      break;
    case RIGHT:
      if (MainSnake.direction === LEFT) return;
      if (MainSnake.headPosition[0] >= DIMENSIONS[1] - 1) return;
      if (
        snakeColide([
          Number(MainSnake.headPosition[0]) + 1,
          MainSnake.headPosition[1]
        ])
      ) {
        return;
      }
      MainSnake.headPosition[0]++;
      break;
    case DOWN:
      if (MainSnake.direction === UP) return;
      if (MainSnake.headPosition[1] >= DIMENSIONS[0] - 1) return;
      if (
        snakeColide([
          MainSnake.headPosition[0],
          Number(MainSnake.headPosition[1]) + 1
        ])
      ) {
        return;
      }
      MainSnake.headPosition[1]++;
      break;
  }
  // Cambiar dirección de la vívora
  MainSnake.direction = direction;
  // Remover cola y guardar para borrar del render
  let oldTailPosition = MainSnake.bodyPositions.splice(0, 1);
  // Incluir elemento en el cuerpo de la vívora
  MainSnake.bodyPositions.push(oldHeadPosition);
  renderMainSnake(oldTailPosition[0]);
};

/**
 * Determina si en la coordenada se encuentra el cuerpo de una vívora
 * @param {object} oldTailPosition [x, y] Coordenada siguiente
 */
const snakeColide = pixel => {
  if (MainSnake.bodyPositions.some(bp => bp.equals(pixel))) {
    return true;
  }
  return false;
};

/**
 * Imprime la vívora visual en pantalla
 * @param {object} oldTailPosition [x, y] Si se incluye, borra la coordenada seleccionada
 */
const renderMainSnake = (oldTailPosition = false) => {
  // Cabeza
  Screen.children[MainSnake.headPosition[1]].children[
    MainSnake.headPosition[0]
  ].className = "pixel pixel-snake-head-present";
  // Cuerpo
  MainSnake.bodyPositions.forEach(bp => {
    Screen.children[bp[1]].children[bp[0]].className =
      "pixel pixel-snake-present";
  });
  // Limpiar el camino que deja la vívora // TODO: no es la mejor manera
  if (typeof oldTailPosition === "object") {
    Screen.children[oldTailPosition[1]].children[oldTailPosition[0]].className =
      "pixel";
  }
};

init();

/**
 * Timer DUMMY
 */
function snakeLoop() {
  setTimeout(() => {
    setMainSnakePosition(MainSnake.direction);
    snakeLoop();
  }, 35);
}
