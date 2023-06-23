const express = require("express"); // Import the express library
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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Add route /urls/new to send data to urls_new.ejs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Add route /urls/:id to send data to urls_show.ejs
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: 'http://www.lighthouselabs.ca' };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});