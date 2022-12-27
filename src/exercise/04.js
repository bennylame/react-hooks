// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useState, useEffect} from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )

  const [history, setHistory] = useLocalStorageState(
    'history',
    Array(1).fill(Array(9).fill(null)),
  )

  const [step, setStep] = useLocalStorageState('step', 0)

  let nextValue = calculateNextValue(squares)
  let winner = calculateWinner(squares)
  let status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) return

    let copySquares = [...squares]
    copySquares[square] = nextValue
    setSquares(copySquares)

    const historyCopy = [...history]
    historyCopy.push(squares)
    setHistory(historyCopy)

    setStep(step + 1)
  }

  function selectStep(i) {
    setSquares(history[i])
    setStep(i)
  }

  const moves = history.map((x, i) => {
    const description = i === step ? 'Go to game start' : `Go to move #${i}`
    const isCurrentStep = i === step

    return (
      <li key={i}>
        <button disabled={isCurrentStep} onClick={() => selectStep(i)}>
          {description} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  function restart() {
    setSquares(Array(9).fill(null))
    setHistory(Array(1).fill(Array(9).fill(null)))
    setStep(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="history">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
