import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };
const COUNTDOWN_TIME = 5;

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [gameStarted, setGameStarted] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Check for collisions
    if (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE ||
      newSnake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => prevScore + 1);
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = setInterval(moveSnake, 150);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [moveSnake, gameStarted]);

  useEffect(() => {
    if (countdown > 0 && !gameStarted) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
    }
  }, [countdown, gameStarted]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
    setCountdown(COUNTDOWN_TIME);
    setGameStarted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-green-500 font-mono">
      <h1 className="text-4xl font-bold mb-4 pixelated">Snake Game</h1>
      <div 
        className="relative border-4 border-green-500" 
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00',
        }}
      >
        <div className="absolute inset-0 bg-black">
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-green-500"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
                boxShadow: '0 0 2px #00ff00, 0 0 4px #00ff00',
              }}
            />
          ))}
          <div
            className="absolute bg-red-500"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
              boxShadow: '0 0 2px #ff0000, 0 0 4px #ff0000',
            }}
          />
          {!gameStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
              <p className="text-6xl font-bold pixelated">{countdown}</p>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-xl pixelated">Score: {score}</p>
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-red-500 pixelated">Game Over!</p>
          <button
            className="mt-2 px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 pixelated"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}
      <style jsx>{`
        @font-face {
          font-family: 'PressStart2P';
          src: url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        }
        .pixelated {
          font-family: 'PressStart2P', monospace;
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
};

export default SnakeGame;
