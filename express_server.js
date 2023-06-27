const express = require("express"); // Import the express library
const cookieParser = require("cookie-parser"); // Import the cookie-parser library

const app = express(); // Define our app as an instance of express
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set("view engine", "ejs");

/***
 * When our browser submits a POST request, the data in the request body is sent as a Buffer.
 * While this data type is great for transmitting data, it's not readable for us humans.
 * To make this data readable, we will need to use another piece of middleware which will translate, or parse the body.
 */
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Implement the function to generate a random short URL ID
const generateRandomString = function() {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

// console.log(generateRandomString());

// Add root route /
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Add route /urls.json to see a JSON string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Add route /hello to send send data to hello_world.ejs
app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

// Add route /urls to send data to urls_index.ejs
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Add route /urls/new to send data to urls_new.ejs
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies.username };
  res.render("urls_new", templateVars);
});

// Add route /urls/:id to send data to urls_show.ejs
app.get("/urls/:id", (req, res) => {
  const templateVars = { username: req.cookies.username, id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

// Redirect any request to "/u/:id" to its longURL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// Add route /register to send data to register.ejs
app.get('/register', (req, res) => {
  res.render('register');
});

//  Add a POST route to receive the Form Submission
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL; // Save the id-longURL pair to the urlDatabase
  // console.log(req.body); // Log the POST request body to the console
  // console.log(urlDatabase); // Log the updated urlDatabase to the console
  res.redirect(`/urls/${shortURL}`); // Redirect to the new short URL's show page
});

// Add a POST route that removes a URL resource: POST /urls/:id/delete
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

// POST route to update a URL resource: POST /urls/:id
app.post('/urls/:id', (req, res) => {
  const urlId = req.params.id; // Get the URL ID from the route parameter
  const newLongURL = req.body.longURL; // Get the updated long URL from req.body

  // Update the stored long URL with the new value
  urlDatabase[urlId] = newLongURL;

  res.redirect('/urls'); // Redirect the client back to /urls
});

// Add a POST route to /login to set the values on the cookie
app.post('/login', (req, res) => {
  const username = req.body.username;

  // Set the username cookie
  res.cookie('username', username);

  res.redirect('/urls'); // Redirect the browser back to the /urls page
});

// Add a POST route to /logout endpoint so that it clears the username cookie
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});