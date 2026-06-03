# retro-game-pacman-clone
This is an excersize in keeping my problem solving and coding skills sharp and creating a PacMan clone from scratch without the use of AI.

I plan to figure out the ghost algos (Pursuing and fleeing) as well as the level design etc using vanilla JS, HTML and CSS. 

I will be updating this README.MD along the way as this project takes shape.

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
