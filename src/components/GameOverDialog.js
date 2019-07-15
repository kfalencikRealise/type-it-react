import React, { Component } from 'react'

class Form extends Component {
  render() {
    const { score } = this.props;

    return (
      <div id="dialog-game-over" className="site-dialog">
        <header className="dialog-header">
          <h1>Game over</h1>
        </header>
        <div className="dialog-content">
          <p>Your score:</p>
          <p className="scoreboard-score">{ score }</p>
          <p>Press any key to start again</p>
        </div>
      </div>
    );
  }
}

export default Form;