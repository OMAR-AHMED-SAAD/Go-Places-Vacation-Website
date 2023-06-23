# Go Places Vacation Website

Go Places is a vacation website that allows users to browse and search for destinations, add destinations to their want-to-go list, and watch embedded videos that provide more information about the destinations. The website is built using Node.js, Express.js, and EJS files, and it is connected to MongoDB to store user credentials.

## Getting Started

To get started with the project, you can either:

1. Click on this URL: https://go-places.onrender.com
2. Use the admin credentials: username - admin, password - admin
   OR
3. Download the repository, unzip it, and open it in your preferred IDE.
4. Run `npm install` to install the necessary dependencies.
5. Run `npm start` to start the server.
6. Open your browser and go to `localhost:3000`.

## Features

The website has the following features:

### Navigation

The website provides smooth navigation to the users. Users can click on the navigation bar to access different pages.

### Registration

Users can create an account by registering with a unique username and a password. The registration form checks that the username is not already in the database and that the username and password fields are not empty. If there is an error, the user sees an error message. If the registration is successful, the user is redirected to the login page.

### Login

Users can log in using their username and password. The login form checks that the username and password are correct. If there is an error, the user sees an error message. If the login is successful, the user is redirected to the home page.

### Multiple Users [Sessions]

The website handles multiple users logged in at the same time. Users can access different pages only if they are logged in. If they are not logged in, they are redirected to the login page.

### Videos

The website provides embedded videos that provide more information about the destinations. Users can watch the videos by clicking on the video thumbnail.

### Adding to Want-to-Go List

Users can add destinations to their want-to-go list by clicking on the "Add to Want-to-Go List" button on the destination page. If the destination is already in the user's want-to-go list, an error message is displayed. If it was not, it is added to the user's want-to-go list in the database.

### Viewing Want-to-Go List

Users can view their want-to-go list by clicking on the "Want-to-Go List" button on the navigation bar. The website displays the destinations in the current user's want-to-go list.

### Search

Users can search for a destination by name. If the search key is found as a substring of a destination's name, the destination is displayed in the list of search results. The search results are clickable, and users can be directed to that specific destination's page. If the search key is not found, a "Not found" message is displayed.

