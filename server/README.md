So far this server is connecting to our mongodb database and pulling our sample text adventure.
This serves as the initial steps to creating a backend with CRUD functionality.

Added functionality of a file called mongouri.txt which I added to the gitignore list.
This file needs to be made by the person trying to host our app, and contains a connection uri
for connecting to mongodb. This will prevent our passwords from being leaked on github.

Model and Controller require "npm install mongoose", "npm install MongoDB", and "npm install express". Running "node adventures_controller.mjs"
Listening begins on port 3001.
