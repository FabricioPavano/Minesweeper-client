import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import '../styles/UserForm.css';


class SignUp extends Component {


	constructor(props) {
	  super(props);
	  this.state = {
			email: '',
			password: ''
	  };

	  this.handleInputChange = this.handleInputChange.bind(this);
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

		const options =  {
		  method: 'post',
		  headers:  {
	      "Content-Type": "application/json",
	      "Accept": "application/json"
   		},
   		body: JSON.stringify(this.state)
   	}

		fetch('http://localhost:3000/users', options).then( (response) => {
		  return response.json();
		})
		.then( (data) => {
			console.log('data', data)
		  this.props.history.push('/signin')
		});

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

			  <br />

			  <div className="form-label start-game">
			  	<a onClick={ () => this.createUser() }> Sign up! </a>
			  </div>
			</div>
		)
	}

}

export default withRouter(SignUp);