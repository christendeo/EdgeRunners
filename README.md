# FuelMe
## CS554WS EdgeRunners Group Members:
    Payton Bates 
    Christen Diwen De Ocampo 
    Richard Devitt
    Anthony Eryan
    Kayla Hartland

## Table of Contents
* [Introduction](#introduction)
* [Course Technologies](#course-technologies)
* [Independent Technologies](#independent-technologies)
* [Setup Installation](#setup-installation)
* [GitHub Repository](#github-repository)

## Introduction
* FuelMe is designed to help users set and achieve fitness goals such as weight loss, muscle gain, and maintenance. The application calculates personalized daily calorie and macronutrient targets based on user metadata such as height, weight, activity level, and fitness goals. Users can log daily food intake to track progress toward these targets. The app contains foods with nutritional data from open-source databases, which allows users to search for foods that align with their fitness goals. Users can also add custom foods and create meal combinations.
* While personal data remains private, users will have the option to share their progress publicly via a profile page by posting blogs, as a Twitter/X timeline approach, where users can view the blogs at their feed and like and comment. Additionally, they can share their daily food intake in terms of calories and macros as well as actual foods and meals they consumed as well as filter blogs by options such as (all users, following only, by goal type). Users will have the ability to add custom foods and meals to the public database, or they can choose to keep them for private use. 

## Course Technologies
* **MongoDB:** A NoSQL database that stores data in a JSON-like format called documents. Our application will use MongoDB to store all necessary data, such as user information, nutritional data, and blog posts.
* **GraphQL:** A type of schema that allows clients to request many resources in one request while meeting the specified data requirements, hence increasing data fetching efficiency. We will utilize this to assist with fetching the user’s personalized daily targets along with foods, meals, logs, and blog posts through queries, and update those resources through mutations based on their goals and food log submissions while keeping the user interface updated. 
* **Redis:** A fast in-memory data structure known for its high-performing lookup on its read and write operations, as well as storing multiple data types like strings, lists, sets, sorted sets, hashes, and bit arrays. We will utilize this to cache the user’s custom foods, meal recipes, health goals and dashboard. This will allow us to mitigate repeated API calls when new logs are created and ensure the latest data is loaded quickly as the relevant cache is refreshed.  
* **React with Next.js:** React is a front-end library with its coding architecture based on writing front-end code in snippets (components) and combining them while being performant and easily maintainable (components practice single source of truth). React also eliminates any opportunities for XSS attacks.  Next.js is one of the recommended frameworks from the React time to use as it implements backend capability such as Next.js API Routes, server-side rendering (SSR), and static site generation (SSG) and performance optimizations. These technologies will effectively load all data and static HTML in a performant and scalable manner.  

## Independent Technologies
* **ElasticSearch:** A distributed search and analytics engine. Our application will use ElasticSearch to allow users to perform real-time searches for food, meals and more.  
* **Docker:** Used to containerize the application’s services, such as those listed above.  We will create Dockerfiles for each service, and a docker compose file to handle multiple containers.  We will use Docker to streamline our continuous integration workflow by minimizing environment-related bugs as we will all be working in the same environment.  Using a container to deploy our program will eliminate concerns about compatibility and facilitate ease of use.  
* **ImageMagick (Not Yet Confirmed):** A library that supports multiple digital image manipulation functionalities such as creating, editing, composing, and converting bitmap images. Our application will use ImageMagick to edit user’s profile pictures as well as the images of foods and meals stored in our database.  

## Setup Installation
1. Clone the Repository:
`git clone https://github.com/christendeo/EdgeRunners.git`
2. Open docker desktop. Open the project folder in a terminal. Run the command 'docker-compose up --build'
3. Seed the database with the command 'docker exec -it edgerunners-server node tasks/seed.js'
3. Run the application from the docker desktop application

## GitHub Repository
* https://github.com/christendeo/EdgeRunners