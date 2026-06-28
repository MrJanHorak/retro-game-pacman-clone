# retro-game-pacman-clone
This is an excersize in keeping my problem solving and coding skills sharp and creating a PacMan clone from scratch without the use of AI.

I plan to figure out the ghost algos (Pursuing and fleeing) as well as the level design etc using vanilla JS, HTML and CSS. 

I will be updating this README.MD along the way as this project takes shape.

### State of project: June 20, 2026:

Game play it essentially fully completed in a basci MVP manner.

What is working:

* Keyboard control WASD and arrow keys for PacMan movement.
* Pellet 'chomping' adds to score.
* Ghost chase player based upon original chasing patterns of the original game.
* 'Super-pellets' activate ghost flee behavior.
* PacMan can chomp the ghosts when they are blue in the scared mode.
* game over condition is set when PacMan loses all lives.
* ghost speed to decrease when scared.
* animation polish of characters.

What still needs to be implemented:

* win condition when all pellets are gone.
* bonus items
* Blinky's angry mode
* storing/persisting of Hi-Score in local storage.

Notes to expand upon:
* chase behaviors of individual ghosts.
* speed of characters through-out the game






### File Structure:

#### Folders
* JS for all JavaScript files (And potentially classes)
* CSS for all the CSS, most likely one long styles.css stylesheet.
* data a folder for levels in json format?

#### Root directory file
* HTML current just one index.HTML in future perhaps others but I will try to do most DOM manipulation through JS and user Modals for instructions etc.

#### Brainstorming Ideas for Ice Box features:
* multi-player pacman? Additional players connect through web-sockets and play the ghosts?
* level designer: Users make thier own levels.

#### Sources of infoormation to help plan and prepare:

* [PacMan Fandom Wiki](https://pacman.fandom.com/wiki/Pac-Man_Wiki)
* [Google searches for instance the grid size for the maze](https://www.google.com/search?q=pacman+field+grid+size%3F&num=10&newwindow=1&sca_esv=9a26454b369da4f9&sxsrf=ANbL-n7MMxsxKBkgOYaOy8kIlZbG8tYwjg%3A1780479892485&ei=lPcfasSuHaGJxc8PpObpmQM&biw=1007&bih=841&ved=0ahUKEwjEyJW85OqUAxWhRPEDHSRzOjMQ4dUDCBA&uact=5&oq=pacman+field+grid+size%3F&gs_lp=Egxnd3Mtd2l6LXNlcnAiF3BhY21hbiBmaWVsZCBncmlkIHNpemU_MgUQIRigATIFECEYoAEyBRAhGKABMgUQIRigATIFECEYoAEyBRAhGJ8FSOojULUEWJMgcAF4AZABAJgBqQGgAc8JqgEDNC43uAEDyAEA-AEBmAIMoAKSCsICChAAGEcY1gQYsAPCAgsQABiABBiKBRiRAsICBRAAGIAEwgIGEAAYFhgewgIHECEYChigAZgDAIgGAZAGCJIHBDIuMTCgB7YrsgcEMS4xMLgHjgrCBwUwLjcuNcgHJYAIAQ&sclient=gws-wiz-serp)

#### Notable Notes (Things I have learned about Pac Man I would like to implement)
* [Specific Ghost related behavior for each Ghost. Specifc target in chase modes and scatter modes ](https://pacman.fandom.com/wiki/Ghost_(species))
* [Blinky has a Cruise ELroy mode triggered by how many pellets PacMan 'eats'](https://pacman.fandom.com/wiki/Cruise_Elroy)
* [Specific bonus points earned for catching ghosts](https://pacman.fandom.com/wiki/Vulnerable_Ghost)
* [So called Coffee Break scenes between certain levels](https://pacman.fandom.com/wiki/Vulnerable_Ghost)
* Official grid is 224 x 288 pixels or 28 tiles wide and 36 tiles high. Game board is 28 x 31 to leave room for status bars at th top and bottom of the screen.


#### Level design guide/legend/key

Game Grid Design legend: (Numbers in the level data to represent items in the game and game board aprox: 39-40 Sprites)

0 = empty
1 = top left corner
2 = top right corner 
3 = bottom right corner
4 = bottom left corner 
5 = horizontal
6 = vertical 
9 = ghost gate

10 = double lined top left
11 = double lined top right
12 = double lined bottom right
13 = double lined bottom left
14 = double horizontal
15 = double vertical

20 = horizontal straight with top left
21 = horizontal straight with top right
22 = horizontal straight with bottom right
23 = horizontal straight with bottom left
24 = horizontal straight with top left
25 = horizontal straight with top right
26 = horizontal straight with bottom right
27 = horizontal straight with bottom left

50 = square double-lined top-left corner
51 = square double-lined top-right corner
52 = square double-lined bottom-right corner
53 = square double-lined bottom-left corner

60 = Cherry
61 = Strawberry
62 = Orange
63 = Apple
64 = Melon
65 = Galboss
66 = Bell
65 = Key

70 = paceman
71 = Blinky
72 = Pinky
73 = Inky
74 = Clyde

80 = pellet
81 = power-up