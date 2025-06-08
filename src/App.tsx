import React, { useState } from 'react';
import './styles.css';

function generateRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(generateRandomNumber());
  const [guess, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [guessCount, setGuessCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;

    const guessNumber = parseInt(guess, 10);
    if (isNaN(guessNumber)) {
      setFeedback('Please enter a valid number.');
      return;
    }

    const newCount = guessCount + 1;
    setGuessCount(newCount);

    if (guessNumber < targetNumber) {
      setFeedback('Too low!');
    } else if (guessNumber > targetNumber) {
      setFeedback('Too high!');
    } else {
      setFeedback(`Correct! You guessed the number in ${newCount} attempts.`);
      setGameOver(true);
      if (typeof window.sendDataToGameLab === 'function') {
        window.sendDataToGameLab({
          attempts: newCount,
          target: targetNumber,
          timestamp: new Date().toISOString(),
        });
      }
    }
    setGuess('');
  };

  const handleReset = () => {
    setTargetNumber(generateRandomNumber());
    setGuess('');
    setFeedback('');
    setGuessCount(0);
    setGameOver(false);
  };

  return (
    <div className="App">
      <h1>Number Guessing Game</h1>
      <p>Guess a number between 1 and 100.</p>

      {!gameOver && (
        <form onSubmit={handleGuessSubmit}>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            min="1"
            max="100"
            placeholder="Your guess"
          />
          <button type="submit">Guess</button>
        </form>
      )}

      {feedback && <p className="feedback">{feedback}</p>}
      <p>Attempts: {guessCount}</p>

      {gameOver && (
        <button className="reset-button" onClick={handleReset}>
          Play Again
        </button>
      )}
    </div>
  );
}