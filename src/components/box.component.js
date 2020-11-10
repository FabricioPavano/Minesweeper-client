import React, { Component } from 'react';


// This component represents each of the boxes inside a game
class Box extends Component {

	constructor(props) {
	  super(props);

	  this.uncoverBox  = this.uncoverBox.bind(this)

	  // Every box keeps its own state to avoid having to re-render every time
	  // some one clicks on a box

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
			// Updates state on this particular box
			this.setState({ status: 'uncovered', value: this.props.adjacent })
		}

	}

	shouldComponentUpdate(nextProps){

		// change state when retrying
		if(nextProps.game_ended == false && this.props.game_ended == true){
			
		}


		return true
	}


	componentDidUpdate(prevProps, prevState) {

		// change state when retrying
		if(prevProps.game_ended == true && this.props.game_ended == false){
			if( (prevState.status != this.props.status) && this.props.status == 'covered'){
				this.setState({
					status: 'covered',
					value: ''
				})
			}
			else if (prevState.status != this.props.status) {
				this.setState({
					status:this.props.status
				})
			}
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