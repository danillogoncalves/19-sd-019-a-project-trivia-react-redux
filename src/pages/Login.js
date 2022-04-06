import React from 'react';
import { IoIosSettings } from 'react-icons/io';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import actionFetchToken from '../actions/actionThunk';
import { receiveInfoPlayer } from '../actions';
import '../assets/Login.css';

const imgs = ['https://www.aeof.pt/wp-content/uploads/2014/05/qqsm.gif'];

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      validButton: true,
    };
  }

  validateBtn = () => {
    const { name, email } = this.state;
    const emailRegex = /\S+@\S+\.\S+/;
    const validEmail = emailRegex.test(email);
    const validName = name.length >= 1;
    if (validEmail && validName) {
      this.setState({ validButton: false });
    } else {
      this.setState({ validButton: true });
    }
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, this.validateBtn);
  }

  handleClick = async () => {
    const { history, getSaveToken, getInfoPlayer } = this.props;
    const { name, email } = this.state;
    const lowerCaseEmail = email.toLowerCase();
    const emailHash = md5(lowerCaseEmail).toString();
    await getSaveToken();
    getInfoPlayer(name, email, emailHash);
    history.push('/game');
  }

  render() {
    const { email, name, validButton } = this.state;
    return (
      <section className="login-section">
        <Link to="/settings">
          <button className="settings-button" type="button" data-testid="btn-settings">
            <IoIosSettings />
          </button>
        </Link>
        <div>
          <img src={ imgs[0] } alt="Logo Trivia" />
          <input
            data-testid="input-player-name"
            type="text"
            name="name"
            value={ name }
            placeholder="Insira seu nome"
            onChange={ this.handleChange }
          />
          <input
            data-testid="input-gravatar-email"
            name="email"
            type="email"
            value={ email }
            placeholder="Insira seu email"
            onChange={ this.handleChange }
          />
          <button
            className="play-button"
            type="submit"
            data-testid="btn-play"
            disabled={ validButton }
            onClick={ this.handleClick }
          >
            Play
          </button>
        </div>
      </section>
    );
  }
}

Login.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  getSaveToken: PropTypes.func.isRequired,
  getInfoPlayer: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  getSaveToken: () => dispatch(actionFetchToken()),
  getInfoPlayer: (...payload) => dispatch(receiveInfoPlayer(...payload)),
});

export default connect(null, mapDispatchToProps)(Login);
