# Javascript-drone-game

**A simple "game" I have made when I started learning javascript.**  
![game](/resources/game.gif)  

You will notice that script is pretty inconsistent in tearms of different javascript technics. This is because as mentioned earlier I learned different aspects of js on this project.  

## Game discription
The "game" itself is very simple. It start upon loading the `game.html` file.  
4 droneports (O) are placed on a grid in a square formation. Each port contains 5 drones (X). At the start of the game a random number of boxes (◻) spawn on the grid. The drones find the closest box to their assigned port. Then each available drone in the port moves to that box by the shortest route, takes it and brings it to it's homeport. If there is not enough drone in the port for all closest boxes to be picked up, than any available drone is sent to take the box. By the end all boxes are taken and delivered to droneports.  


## Setup
There are 2 `.css` files 1 `.html` file and 1 `.js` file:  

> `GameScript.js` contains script that starts and runs the game
>
> `style.css` contains the grid parameters
>
> `base.css` contains visual settings for the game
>
> `game.html` central file containing  basic html syntaxis to run the game

The game itself runs on localhost. In order to ititialize it just open `game.html` in any browser available.
