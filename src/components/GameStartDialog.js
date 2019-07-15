import React, { Component } from 'react'
import logo from '../assets/logo.png';

class Form extends Component {
  constructor(props) {
    super(props);

    this.setDifficulty = this.setDifficulty.bind(this);
  }

  setDifficulty(difficulty, event) {
    event.preventDefault();
    const { onGameStarted } = this.props;

    onGameStarted(difficulty);
  }

  render() {
    return (
      <div id="dialog-start" className="site-dialog">
        <header className="dialog-header">
          <img src={logo} alt="logo" />
        </header>
        <div className="dialog-content">
          <p>The objective of the game is to type in the word shown as quickly as possible but look out as the time is ticking and every misspelled word results in a time penalty.</p>
          <button onClick={(event) => {this.setDifficulty('easy', event)}} className="difficulty-btn btn btn-block">Undemanding</button>
          <button onClick={(event) => {this.setDifficulty('average', event)}} className="difficulty-btn btn btn-block btn-orange">Strenuous</button>
          <button onClick={(event) => {this.setDifficulty('insane', event)}} className="difficulty-btn btn btn-block btn-red">Merciless</button>
        </div>
      </div>
    );
  }
}

export default Form;