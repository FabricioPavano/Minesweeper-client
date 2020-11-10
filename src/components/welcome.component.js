import React, { Component } from 'react';
import { Link } from "react-router-dom";

const Welcome = () => {

	return (
		<div className="App">
		  <header className="App-header">
		    <h2> Minesweeper </h2>
		  </header>

		  <Link to="/signin"><h2> Log in </h2></Link>
		  <Link to="/signup"><h2> Sign up </h2></Link>

		</div>


		)
}



export default Welcome;