import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

const Menu = props => {


	return (
		<div className="App">
		  <header className="App-header">
		    <h2> Minesweeper </h2>
		  </header>

		  <Link to="/new"><h2> New Game </h2></Link>

		</div>
	)

}

export default Menu;