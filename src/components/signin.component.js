import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import SimpleReactValidator from 'simple-react-validator';
import API  from '../services/api'
import '../styles/UserForm.css';


class SignIn extends Component {


	constructor(props) {
	  super(props);
	  this.state = {
			email: '',
			password: '',
			login_error: false
	  };

	  this.handleInputChange = this.handleInputChange.bind(this);
	  this.validator = new SimpleReactValidator();
	}

	handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

	signIn = () => {

		this.setState({ login_error: false })

		// Performs basic validation
		if (this.validator.allValid()) {
			var data = {'auth':
			  {
			  	'email' : this.state.email,
			    'password': this.state.password
			  }
			};

		  API.sign_in(data)
  		  .then(result => {


  		  	localStorage.setItem('minesweeper-token', result['jwt'])
  		  	this.props.history.push('/menu')
  		  })
  		  .catch(error => this.setState({ login_error: true }));

		} else {
		  this.validator.showMessages();
		  this.forceUpdate();
		}

	}

	render(){
		return (

			<div className="user-form">

				{ this.state.login_error && (

					<div class="srv-validation-message">
						User or password is incorrect.
					</div>

				)}

			  <div className="form-label">
			  	Email
			  </div>

			  <div className="input-wrapper">
			  	<input
			  		name="email"
			  	  type="text"
			  	  value={ this.state.email }
			  	  onChange={this.handleInputChange}
			  	/>
			  </div>

			   
			  { this.validator.message('email', this.state.email, 'required|email') }

			  <div className="form-label">
			  	Password
			  </div>

			  <div className="input-wrapper">
			  	<input
			  		name="password"
			  	  type="password"
			  	  value={ this.state.password }
			  	  onChange={this.handleInputChange}
			  	/>
			  </div>

			  { this.validator.message('password', this.state.password, 'required|min:6') }

			  <br />

			  <div className="form-label start-game">
			  	<a onClick={ () => this.signIn() }> Log in! </a>
			  </div>
			</div>
		)
	}

}

export default withRouter(SignIn);