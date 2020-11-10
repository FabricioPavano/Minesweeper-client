import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import '../styles/UserForm.css';


class SignIn extends Component {


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

	signIn = () => {

		
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var raw = JSON.stringify(
			{"auth":
			  {
			  	"email":this.state.email,
			    "password":this.state.password
			  }
			});

		var requestOptions = {
		  method: 'POST',
		  headers: myHeaders,
		  body: raw,
		  redirect: 'follow'
		};

		fetch("http://localhost:3000/user_token", requestOptions)
		  .then( (response) => {
		    return response.json();
		  })
		  .then(result => {
		  	console.log(typeof result, result)
		  	localStorage.setItem('minesweeper-token', result['jwt'])
		  	this.props.history.push('/menu')
		  })
		  .catch(error => console.log('error', error));

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
			  	<a onClick={ () => this.signIn() }> Log in! </a>
			  </div>
			</div>
		)
	}

}

export default withRouter(SignIn);