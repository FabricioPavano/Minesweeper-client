import React, { Component } from 'react';


// This component represents each of the boxes inside a game
class Box extends Component {

	constructor(props) {
	  super(props);

	  this.uncoverBox  = this.uncoverBox.bind(this)

	  this.state = {
	  	status: this.props.status,
	  	value: ''
	  };
	}

	uncoverBox(){

		// Does not allow you to continue playing if game has ended
		if(this.props.game_ended){
			return
		}

		// Checks if there's a mine in the box

		if(this.props.has_mine){
			this.setState({ status: 'uncovered mine'})
			this.props.endGame()
		}
		else{
			this.setState({ status: 'uncovered', value: this.props.adjacent })
		}

	}

	render(){
		return (
			<React.Fragment>
				<div onClick={ this.uncoverBox } data-color={ 'color-' + this.props.adjacent } className={'box ' + this.state.status} >
					{ this.state.value }
				</div>
				<br />
				{ this.state.game && this.state.game.ended && (
					<div> Game Over! </div>
				)}
			</React.Fragment>
		)
	}

}

export default Box;