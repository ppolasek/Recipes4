# My Favorite Recipes 4
Organize all your favorite recipes!

Keep track of:
1. which cookbook your recipe is in and the page number
2. or the URL to your favorite recipe
4. Notes on what the heck went wrong, or what you had to change
    1. e.g. used different ingredients, or how much

## Technology
Recipes4 uses Node.js with MongoDb and ReactiveX for the backend services,
and the web front-end is using Angular + Typescript and ReactiveX.

This project was created to demonstrate my use of Angular + Typescript and ReactiveX in the UI,
and converting the recipe-server from callback hell to using ReactiveX.

## Getting Started
#### Server Install
1. Note: this does require a working install of MongoDb at port 27017  
1. Open a terminal window and navigate to Recipes4/recipe-server/  
1. Type 'npm install'
#### Web Install
1. Open a second terminal window and navigate to Recipes4/recipe-web/  
1. Type 'npm install'
#### Server Start
1. Return to the recipe-server terminal and type 'npm start'
1. If desired, tail the log file recipe-server/logs/recipe_server.log
#### Web Start
1. Return to the recipe-web terminal and type 'npm start'
1. In a browser window enter the URL http://localhost:4200/


### See LICENSE
