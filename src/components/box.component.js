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

			// Updates state on general game (does not cause a re-render)
			this.props.updateState([
															{ row: this.props.row,
				                       col: this.props.col,
				                       new_status: 'uncovered'
				                     },
         											{ row: this.props.row + 1,
                                col: this.props.col,
                                new_status: 'uncovered'
                              } ]
				                     )

			// Updates state on this particular box
			this.setState({ status: 'uncovered', value: this.props.adjacent })
		}

	}

	componentDidUpdate(prevProps, prevState) {

		//Change status if prop changed
	  if (this.props.status !== prevProps.status) {
	    this.setState( { 'status': this.props.status })
	  }

	  if (this.props.status != 'covered' && prevState.status == 'covered')
	  	this.setState( { 'value': this.props.adjacent })

	}


	render(){



		console.info('Box rendered')

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