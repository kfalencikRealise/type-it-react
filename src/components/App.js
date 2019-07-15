import '../css/index.css';
import React from 'react'

import GameStartDialog from './GameStartDialog';
import GameBoard from './GameBoard'
import GameOverDialog from './GameOverDialog';

import dictionary from '../assets/dictionary.json';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameStarted: false,
      gameOver: false,
      difficulty: 'easy',
      score: 0,
      timer: 0,
      dPenalty: 0,
      dMultiplier: 0,
      dBonus: 0,
      dTimeFreeze: 0,
      dStreak: 0,
      dictionary: null,
      dictionarySize: null
    }

    this.onGameStarted = this.onGameStarted.bind(this);
    this.onGameOver = this.onGameOver.bind(this);
  }

  componentDidMount() {
    this.setState({
      dictionary: dictionary, 
      dictionarySize: Object.keys(dictionary).length
    });
  }

  onGameStarted(difficulty){
    const settings = {
      gameStarted: true, 
      difficulty
    };

    // Set difficulty
    switch (difficulty) {
      case 'insane':
        settings.timer = 15;
        settings.dPenalty = 15;
        settings.dMultiplier = 6;
        settings.dBonus = 1.5;
        settings.dTimeFreeze = 1500;
        settings.dStreak = 8;
        break;
      
      case 'average':
        settings.timer = 30;
        settings.dPenalty = 10;
        settings.dMultiplier = 4;
        settings.dBonus = 2;
        settings.dTimeFreeze = 3000;
        settings.dStreak = 6;
        break;

      default:
        settings.timer = 45;
        settings.dPenalty = 5;
        settings.dMultiplier = 2;
        settings.dBonus = 3;
        settings.dTimeFreeze = 5000;
        settings.dStreak = 2;
        break;
    }

    this.setState(settings);
  }

  onGameOver(score){
    this.setState({gameOver: true, score})
  }

  render() {  
    const { 
      gameStarted, 
      gameOver, 
      difficulty, 
      score, 
      timer, 
      dPenalty, 
      dBonus, 
      dMultiplier, 
      dStreak, 
      dTimeFreeze, 
      dictionary,
      dictionarySize
    } = this.state;

    return (
      <div>
        {gameStarted === false && gameOver === false && 
          <GameStartDialog 
            onGameStarted={this.onGameStarted} 
          />
        }

        {gameStarted === true && gameOver === false && 
          <GameBoard 
            difficulty={difficulty} 
            timer={timer} 
            dPenalty={dPenalty} 
            dBonus={dBonus} 
            dictionary={dictionary} 
            dictionarySize={dictionarySize} 
            dMultiplier={dMultiplier} 
            dStreak={dStreak} 
            dTimeFreeze={dTimeFreeze} 
            onGameOver={this.onGameOver} 
          />
        }

        {gameStarted === true && gameOver === true && 
          <GameOverDialog 
            score={score} 
          />
        }
      </div>
    );
  }
}

export default App