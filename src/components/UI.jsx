import React from 'react';

// A simple UI component for health bars and other info
const UI = ({ health }) => {
  return (
    <div className="ui-container">
      {/* Player Health */}
      <div className="health-bar-container player">
        <div className="health-bar" style={{ width: `${health.player}%` }}></div>
        <div className="health-text">Player: {health.player}</div>
      </div>

      {/* AI Health */}
      <div className="health-bar-container ai">
        <div className="health-bar" style={{ width: `${health.ai}%` }}></div>
        <div className="health-text">AI: {health.ai}</div>
      </div>
    </div>
  );
};

export default UI;