# TinyApp Project

TinyApp is build on a URL Shortener which is a service that takes a regular URL and transforms it into an encoded version, which redirects back to the original URL. For example:

https://www.lighthouselabs.ca → http://goo.gl/6alQXu

In order to create a service that shortens URLs we will need to apply the concepts such as HTTP redirection and APIs.

Additionally, We will use the specific technologies to illustrate these concepts:

Web Server: Node.js
Middleware: Express
Template Engine: EJS

We also installed Nodemon. s a utility that will monitor for any changes in our source code and automatically restart our server. Perfect for development.

## Getting Started

- Run the TinyApp project using the `node express_server.js` command.
- If Nodemon is installed, run the application with the following command 
  - ./node_modules/.bin/nodemon -L express_server.js
  OR
  - Edit the scripts section of package.json to look like the following
      "scripts": {
      "start": "./node_modules/.bin/nodemon -L express_server.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    }
  - From now on just run npm start, our application will run with nodemon! The days of restarting the server for every little change are finally over!
