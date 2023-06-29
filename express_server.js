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

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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

// Helper function to find a user by email
const getUserByEmail = function(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

// Helper function which returns the URLs where the userID is equal to the id of the currently logged-in user
const urlsForUser = (id) => {
  const userUrls = {};
  for (const urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      userUrls[urlId] = urlDatabase[urlId];
    }
  }
  return userUrls;
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
  const userId = req.cookies.user_id;
  const user = users[userId];

  // console.log(users);
  // console.log(userId);
  // console.log(user);

  if (!user) {
    const templateVars = {
      user: null,
      urls: null
    };
    res.render("urls_index", templateVars);
    return;
  }

  const userUrls = urlsForUser(userId);

  const templateVars = {
    user: user,
    urls: userUrls
  };
  res.render("urls_index", templateVars);
});

// Add route /urls/new to send data to urls_new.ejs
app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if (!user) {
    // User is not logged in, redirect to /login
    res.redirect("/login");
    return;
  }

  const templateVars = {
    user: user,
  };

  res.render("urls_new", templateVars);
  });

// Add route /urls/:id to send data to urls_show.ejs
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  const urlId = req.params.id;
  const url = urlDatabase[urlId];

  if (!user) {
    const templateVars = {
      user: null,
    };
    res.render("urls_show", templateVars);
    return;
  }

  if (!url || url.userID !== userId) {
    const templateVars = {
      user: user,
    };

    res.render("urls_show", templateVars);
    return;
  }

  const templateVars = {
    user: user,
    id: urlId,
    longURL: url.longURL
  };
  res.render("urls_show", templateVars);
});

// Redirect any request to "/u/:id" to its longURL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;

  if (!longURL) {
    // Short URL does not exist, send an error message
    res.status(404).send("This shortened URL does not exist.");
  } else {
    res.redirect(longURL);
  }
});

// Add route /register to send data to register.ejs
app.get('/register', (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  const templateVars = {
    user: user
  };

  if (user) {
    // User is already logged in, redirect to /urls
    res.redirect('/urls');
    return;
  }

  // User is not logged in, render the registration form
  res.render('register', templateVars);
});

// Add route /login to send data to login.ejs
app.get('/login', (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  
  const templateVars = {
    user: user
  };

  if (user) {
    // User is already logged in, redirect to /urls
    res.redirect('/urls');
    return;
  }
  // User is not logged in, render the login form
  res.render('login', templateVars);
});

//  Add a POST route to receive the Form Submission
app.post("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if (!user) {
    // User is not logged in, respond with an HTML message
    res.status(401).send("You need to be logged in to create new URLs.");
    return;
  }

  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userId
  };

  res.redirect(`/urls/${shortURL}`); // Redirect to the new short URL's show page
});

// Add a POST route that removes a URL resource: POST /urls/:id/delete
app.post("/urls/:id/delete", (req, res) => {
  const urlId = req.params.id;  // Get the URL ID from the route parameter
  const userId = req.cookies.user_id;
  const url = urlDatabase[urlId];

  if (!url) {
    res.status(404).send("This URL does not exist.");
    return;
  }

  if (!userId) {
    res.status(401).send("You must be logged in to delete this URL");
    return;
  }

  if (url.userID !== userId) {
    res.status(403).send("You do not have permission to delete this URL.");
    return;
  }

  delete urlDatabase[urlId];
  res.redirect('/urls');
});

// POST route to update a URL resource: POST /urls/:id
app.post('/urls/:id', (req, res) => {
  const urlId = req.params.id; // Get the URL ID from the route parameter
  const userId = req.cookies.user_id;
  const url = urlDatabase[urlId];

  if (!url) {
    res.status(404).send("This URL does not exist.");
    return;
  }

  if (!userId) {
    res.status(401).send("You must be logged in to edit this URL");
    return;
  }

  if (url.userID !== userId) {
    res.status(403).send("You do not have permission to edit this URL.");
    return;
  }

  const newLongURL = req.body.longURL; // Get the updated long URL from req.body

  // Update the stored long URL with the new value
  url.longURL = newLongURL;

  res.redirect('/urls'); // Redirect the client back to /urls
});

// Add a POST route to /register endpoint to add a new user object to the global users object
app.post("/register", (req, res) => {
  const email = req.body.email; // Get the updated email from req.body
  const password = req.body.password; // Get the updated password from req.body

  // Error condition: Empty email or password
  if (!email || !password) {
    res.status(400).send('Email and password cannot be empty');
    return;
  }

  // Error condition: Email already exists
  if (getUserByEmail(email)) {
    res.status(400).send('Email already exists');
    return;
  }

  const userId = generateRandomString(); // Generate a random user ID

  // Create a new user object
  const newUser = {
    id: userId,
    email,
    password
  };

  // Add the user to the global users object
  users[userId] = newUser;

  // Set the user_id cookie containing the user's ID
  res.cookie('user_id', userId);

  // Redirect the user to the /urls page
  res.redirect('/urls');
});

// Add a POST route to /login endpoint
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user = getUserByEmail(email);

  if (!user) {
    // what if there is no users??
    res.status(403).send("User with that email address not found");
    return;
  }

  if (user.password !== password) {
    // verify password
    res.status(403).send("Incorrect password");
    return;
  }
  
  // Set the user_id cookie containing the user's ID
  res.cookie('user_id', user.id);
  res.redirect('/urls');
});

// Add a POST route to /logout endpoint so that it clears the user_id cookie
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});