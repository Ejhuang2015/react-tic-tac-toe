import { useEffect, useState } from "react";
import Square from "./Square";

type Scores = {
  [key: string]: number
}

const INITIAL_GAME_STATE =  ["", "", "", "", "", "", "", "", ""];
const INITIAL_SCORES: Scores =  { X: 0, O: 0};
const INITIAL_GAME_LOG: number[] = [];
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

function Game() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [gameLog, setGameLog] = useState(INITIAL_GAME_LOG);

  useEffect( () => {
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  };

  useEffect(() => {
    if (gameState === INITIAL_GAME_STATE) {
      return;
    }
    checkForWinner();
  }, [gameState]);

  const resetBoard = () => {
    setGameState(INITIAL_GAME_STATE);
    setGameLog(INITIAL_GAME_LOG);
  }

  const handleWin = () => {
    window.alert(`Congratulations player ${currentPlayer}! You've won!`);
    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = {...scores};
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));

    resetBoard();
  }
  const handleDraw = () => {
    window.alert("Too bad, no winners here.")  
    resetBoard();
  }

  const checkForWinner = () => {
    let roundWon = false;

    for (let i = 0; i < WINNING_COMBOS.length; i ++) {
      const winCombo = WINNING_COMBOS[i];

      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];
  
      if ([a,b,c].includes("")) {
        continue;
      }
  
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      setTimeout(() => handleWin(), 500);
      return;
    }
    
    if (!gameState.includes("")) {
      setTimeout(() => handleDraw(), 500);
      return;
    }

    changePlayer();
  };

  const resetScore = () => {
    setScores(INITIAL_SCORES);
    localStorage.setItem("scores", JSON.stringify(INITIAL_SCORES));
  };

  const handleCellClick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"))

    const currentValue = gameState[cellIndex];
    if(currentValue) {
      return;
    }

    const newLog = [...gameLog];
    newLog.push(cellIndex);
    setGameLog(newLog);
    
    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);
  };
  
  const undoMove = () => {
    if (gameLog.length <= 0) {
      return
    }
    
    const lastMove = gameLog[gameLog.length - 1];

    const newLog = [...gameLog];
    newLog.pop();
    setGameLog(newLog);  

    const newValues = [...gameState];
    newValues[lastMove] = "";
    setGameState(newValues);
  };

  const textColor = currentPlayer === "X" ? "text-yellow-200" : "text-fuchsia-300";
  const buttonStyle = "w-24 py-2 rounded-md duration-300 ease-in-out hover:-translate-y-1 hover:drop-shadow-2xl";
  const disabledStyle = "w-24 py-2 cursor-not-allowed rounded-md bg-gray-400 hover:bg-gray-400";
  const checkUndo = gameLog.length <= 0 ? disabledStyle : buttonStyle;

  return (
    <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      
      <h1 className="text-center text-5xl mb4 font-display text-white">Tic-Tac-Toe</h1>

      <div>

        <div className="grid grid-cols-3 gap-3 mx-auto w-96">
          {
            gameState.map((player, index) => (
              <Square key={index} onClick={handleCellClick} {...{ index, player }}/>
            ))
          }
        </div>

        <div className="mx-auto w-96 text-2xl text-serif text-white">
        
          <p className="text-center mt-5">Next Player: <span className={`${textColor}`}>{currentPlayer}</span></p>

          <div className="mt-5 flex justify-evenly">
            <p>Player <span className="text-yellow-200">X</span> wins: <span>{scores["X"]}</span></p>
            <p>|</p>
            <p>Player <span className="text-fuchsia-300">O</span> wins: <span>{scores["O"]}</span></p>
          </div>

        </div>

      </div>

{/* Footer Buttons: restart game | clear scores | undo */}
      <div className="mt-5 mx-auto w-96 flex justify-evenly text-white">
        <button className={`bg-rose-400 hover:bg-rose-500 ${buttonStyle}`} onClick={resetBoard}>
          Restart
        </button>
        <button className={`bg-orange-400 hover:bg-orange-500 ${checkUndo}`} onClick={undoMove}>
          Undo
        </button>
        <button className={`bg-red-400 hover:bg-red-500 ${buttonStyle}`} onClick={resetScore}>
          Clear Score
        </button>
      </div>
    </div>
  )
}

export default Game
