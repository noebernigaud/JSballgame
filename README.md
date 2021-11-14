This game was programmed as an improvement to the game made in the module 2 of the javascript course. Here is a list of improvement that I made.

### Features

- Addition of a **Leaderboard** that conserves best scores and player's name.
- Addition of an **obstacle**. Other balls can go in it but player can't, but he can jump over it.
- There is one **Bowser** ball per level. The difference with other ennemies is that Bowser has a bowser image, is slower, bigger, and instead of sticking to his trajectory Bowser **follows the player** and tries to catch him.
- The **Heart** ball give back a life to the player when he catches it. Hearts doesn't count as good balls, and therefore it is not needed to catch them to go to the next levels.
- The player can now **throw fireballs** using the *ZQSD* keys to kill the gumbas/boos. Bowser is invicible to fireballs and absorbs them. Fireballs have a cooldown.

### Skins

- **Images** to make the game look better. Player, ennemies, background, and new features such as obstacles, hearts, bowser and fireball have an image.

### Settings

- Addition of a button to display **rules** and tips in the settings.
- Settings now includes **personnage choice (Mario or Luigi)**, **opponent choice (Gumba or Boo)**, **environment choice (meadow or factory)**, and **fireball cooldown choice**.

### Bugfixes and corrections

- The game now always spawns the right number of good balls / coins.
- The mouse now indicates the center of the player.
- The global speed multiplier is reseted when heading to the next game.

### Miscellaneous

- The current level is now displayed on the top right of the canvas.
- If the player press another key than space on a menu, the game tells him to press space to play the game.
