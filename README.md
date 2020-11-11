# Minesweeper React Client

This is the client application that complements Minesweeper's API

## Important Design considerations

- Given that the project wouldn't require many different components inter-communicating
between each other, I decided to keep the project as simple as possible and *not
to use Redux/MobX* in order to manage the application state.


- I've often found that even though these libraries are a must in big projects
it's rarely needed when the complexity is low.

- The state of the game is only sent to the server when user clicks on 'save' the rest of the time it's stored on local component state.

- Enjoy!
