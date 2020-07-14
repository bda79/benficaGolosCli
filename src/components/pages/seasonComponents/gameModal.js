import React from 'react';
import PropTypes from 'prop-types';
import './season.scss';

class GameModal extends React.Component {
  render() {
    if(!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50,
      zIndex: 9999
    };

    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="game_modal">
          {this.props.children}

          <footer className="footer">
            <button onClick={this.props.onClose}>
              Close
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

GameModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default GameModal;