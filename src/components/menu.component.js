import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";

import API  from '../services/api'

class Menu extends Component {


	constructor(props){
	  super(props);
	  this.state = {
	  	savedGames: [],
	  	email: ''
	  }
	}

	componentDidMount(){
		API.fetch_user_games()
			.then(response => {
				this.setState({savedGames : response.result})
			})

		this.setState({ email: localStorage['minesweeper-email'] })

		this.logOut = this.logOut.bind(this);

	}


	// Some quick and dirty date formatting to make the saved game items
	// look a bit better
	formatDate(date){
		let d = new Date(date)
		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
	}

	logOut(){
		localStorage.removeItem('minesweeper-email')
		localStorage.removeItem('minesweeper-token')
		this.props.history.push('/')
	}

	render(){
		return (
			<div className="App">
			  <header className="App-header">
			    <h4> Hi <span className='greetings'>{ this.state.email } </span></h4>
			    <h2> Minesweeper </h2>
			  </header>

			  <Link to="/new"><h1> New Game </h1></Link>

			  <header className="saved-games">
			    <h2> Saved Games </h2>
			  </header>

			  { this.state.savedGames.map( (saved_game, index) => {

			  	return <Link key={saved_game.created_at} to={"/play/" + saved_game.uuid}><h2> { this.formatDate(saved_game.updated_at) } </h2></Link>

			  })}

			  { this.state.savedGames.length == 0 &&
			  	"-empty-"
			  }

			  <hr className="menu-hr" />

			  <header className="log-out">
			    <h4 onClick={ this.logOut }> Log out </h4>
			  </header>


			</div>
		)
	}

}

export default withRouter(Menu);