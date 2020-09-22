import React from 'react';
import './Login.scss';
import './style.scss';
import {Register} from './register';
import {Signin} from './signin';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true
    };
  }

  changeState() {
    this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }

  render() {
    const { isLogginActive } = this.state;
    return (
      <div className="Login">
        <div className="login">
          <div className="login_container" ref={ref => (this.container = ref)}>
            {isLogginActive && (
              <Signin containerRef={ref => (this.current = ref)} onClick={this.changeState.bind(this)} />
            )}
            {!isLogginActive && (
              <Register containerRef={ref => (this.current = ref)} onClick={this.changeState.bind(this)} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
