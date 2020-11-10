import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import SimpleReactValidator from 'simple-react-validator';
import API  from '../services/api'
import '../styles/UserForm.css';


class SignUp extends Component {


	constructor(props) {
	  super(props);
	  this.state = {
			email: '',
			password: ''
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

	createUser = () => {


		// Does some basic validation first

		if (this.validator.allValid()) {
		  API.sign_up(this.state)
		  	.then( (data) => {
		  		console.log('data', data)
		  	  this.props.history.push('/signin')
		  	});
		} else {
		  this.validator.showMessages();
		  this.forceUpdate();
		}

	}

	render(){
		return (
			<div className="user-form">
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
			  	<a onClick={ () => this.createUser() }> Sign up! </a>
			  </div>
			</div>
		)
	}

}

export default withRouter(SignUp);