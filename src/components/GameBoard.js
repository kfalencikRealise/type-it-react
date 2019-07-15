import React, { Component } from 'react'

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      difficulty: this.props.difficulty,
      dictionary: this.props.dictionary,
      dictionarySize: this.props.dictionarySize,
      currentWord: "",
      currentDesc: "",
      message: "",
      messageClass: "good",
      currentWordLetters: [],
      currentWordLength: 0,
      currentCharacter: 0,
      streak: 0,
      score: 0,
      wordCount: 0,
      timeLeft: 0,
      timer: this.props.timer,
      dPenalty: this.props.dPenalty,
      dMultiplier: this.props.dMultiplier,
      dBonus: this.props.dBonus,
      dTimeFreeze: this.props.dTimeFreeze,
      dStreak: this.props.dStreak,
      explosion: false,
      superPowerFreeze: false,
      superPowerDouble: false,
      timerInterval: null,
      superPowerInterval: null
    };

    this.gameOver = this.gameOver.bind(this);
    this.getNextWord = this.getNextWord.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.goodLetter = this.goodLetter.bind(this);
    this.badLetter = this.badLetter.bind(this);
    this.checkLetter = this.checkLetter.bind(this);
  }

  gameOver() {
    const { score } = this.state;
    const { onGameOver } = this.props;

    onGameOver(score);
  }

  getNextWord() {
    const { dictionary, dictionarySize } = this.state;

    let number = Math.floor(Math.random() * dictionarySize);
    let words = Object.keys(dictionary).map(function(number) {
      return dictionary[number];
    });

    this.setState({
      currentWord: Object.keys(dictionary)[number],
      currentDesc: words[number]
    });
  }

  startTimer() {
    const self = this;
    

    this.state.timerInterval = setInterval(function() {
      let color = '';
      let { timer } = self.state;

      if (timer <= 80) {
        color = '#46aaff';
      }
      if (timer <= 60) {
        color = '#99b7d0';
      }
      if (timer <= 40) {
        color = '#ffad16';
      }
      if (timer <= 20) {
        color = '#fd5e22';
      }
      if (timer <= 10) {
        color = '#ef3434';
      }

      if(timer <= 0) {
        self.gameOver();
      }

      self.setState({
        timer: self.state.timer - 1
      });

      document.querySelector('body').style.backgroundColor = color;
    }, 1000);
  }

  checkLetter(key) {
    if(this.state.currentWord.split("")[this.state.currentCharacter].toLowerCase()){
      if (key.toLowerCase() === this.state.currentWord.split("")[this.state.currentCharacter].toLowerCase()) {
        this.state.currentWordLetters.push(key);
        this.goodLetter();
      } else {
        this.badLetter();
      }
    }
  }

  goodLetter() {
    if (this.state.currentCharacter + 1 === this.state.currentWord.length) {
      this.correctWord();
    } else {
      let newCharacter = this.state.currentCharacter + 1;
      this.setState({currentCharacter: newCharacter});
    }
  }

  badLetter() {
    const self = this;

    this.setState({
      currentWordLetters: [],
      currentCharacter: 0,
      streak: 0,
      timer: this.state.timer - this.state.dPenalty,
      superPowerFreeze: false,
      superPowerDouble: false,
      message: '-' + this.state.dPenalty + 's',
      messageClass: 'bad'
    });

    clearTimeout(this.state.messageTimeout);

    this.setState({
      messageTimeout: setTimeout(function() {
        self.setState({message: ''});
      }, 5000)
    });

    this.getNextWord();
  }

  correctWord() {
    let time = parseInt(this.state.currentWord.length / this.state.dMultiplier) + 1;
    let newTimer = this.state.timer + time;
    let points = 0;
    const self = this;

    if (this.state.superPowerDouble) {
      points = parseInt(this.state.currentWord.length / this.state.dMultiplier) * 400;
    } else {
      points = parseInt(this.state.currentWord.length / this.state.dMultiplier) * 200;
    }

    this.setState({
      streak: this.state.streak + 1,
      message: '+' + points + ' points, +' + time + 's',
      messageClass: 'good'
    });

    clearTimeout(this.state.messageTimeout);

    this.setState({
      messageTimeout: setTimeout(function() {
        self.setState({message: ''});
      }, 5000)
    });

    // Streak super power
    if (this.state.streak === this.state.dStreak) {
      this.setState({streak: 0});
      let number = Math.floor(Math.random() * 3);     

      if (number === 1) {
        this.setState({superPowerDouble: true});

        // For limited time add bonus points to score
        this.state.superPowerInterval = setTimeout(function() {
          self.setState({superPowerDouble: false});
        }, self.state.dTimeFreeze);
      } else {
        this.setState({superPowerFreeze: true});
        clearInterval(self.state.timerInterval);
        clearTimeout(self.state.superPowerInterval);

         // Freeze timer for a while
         this.setState({superPowerInterval: 
          setTimeout(function() {
            self.startTimer();
            self.setState({superPowerFreeze: false});
          }, self.state.dTimeFreeze)
        });
      }

      this.setState({streak: 0, explosion: true});

      setTimeout(function() {
        self.setState({explosion: false});
      }, 1000)
    }

    this.setState({
      currentWordLetters: [],
      wordCount: this.state.wordCount + 1,
      currentCharacter: 0,
      score: this.state.score + points,
      timer: newTimer
    });

    this.getNextWord();
  }

  componentDidMount() {
    this.getNextWord();
    this.startTimer();
    const self = this;

    document.addEventListener('keyup', function(e) {
      let key = e.key;

      if(key !== 13 && key !== 'return' && key !== 'Enter' && key !== undefined) {
        self.checkLetter(key);
      }
    });
  }

  render() {
    const { timer, score, wordCount, streak, message, messageClass, currentWord, currentDesc, currentWordLetters, currentCharacter, explosion, superPowerFreeze } = this.state;

    const n = currentWord.length; 
    let inputs = [...Array(n)].map(function(e, i){
      let input = '';
      if(currentCharacter > i){
        input = <input className="good" type="text" key={i} value={currentWordLetters[i]} />
      } else {
        input = <input type="text" key={i} value="" />
      }

      return input;
    })

    let stars = [...Array(streak)].map(function(e, i){
      return <div className="streak-star"></div>
    })

    const x = 20; 
    let particles = [...Array(x)].map(function(e, i){
      return <div className="particle"></div>
    })

    return (
      <div id="gameboard">
        <div className="game-word">
          <div className="current-word">
            { currentWord }
          </div>
        </div>

        <div className="game-stats">
          {superPowerFreeze === true && 
            <div className="stat frozen"><span className="timer">{ timer }</span> seconds</div>
          }
          {superPowerFreeze === false && 
            <div className="stat"><span className="timer">{ timer }</span> seconds</div>
          }
          <div className="stat"><span className="score">{ score }</span></div>
          <div className="stat"><span className="words">{ wordCount }</span></div>
        </div>
        <div className="game-messages">
        {message !== '' && messageClass === 'good' && 
          <div className="message good">{ message }</div> 
        }
        {message !== '' && messageClass === 'bad' && 
          <div className="message bad">{ message }</div> 
        }
        </div>

        {explosion === true && 
          <div className="game-effects">
            { particles }
          </div>
        }

        <div className="game-stars">
          { stars }
        </div>
        <div className="game-typing">
          <div className="text-input">
            { inputs }
          </div>
        </div>
        <div className="game-word-description">
          <div className="current-word-desc">{ currentDesc }</div>
        </div>
      </div>
    );
  }
}

export default Form;