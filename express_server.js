const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
let unique = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    unique += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return unique;
}

const urlDatabase = {
  "userRandomID": {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
  let userObject = users[userID];
  let shortURLS = [];
  for (let i in urlDatabase) {
    for (let shortUrl in urlDatabase[i]) {
      shortURLS.push(shortUrl)
    }
  }
  let templateVars = {
    urls: urlDatabase[userID],
    shortUrl: shortURLS,
    user: userObject
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/login", (req, res) => {
  res.render("urls_login")
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: req.cookies["user_id"] };
  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars)
  } else {
    res.redirect("/urls/login")
  }
});

app.get("/urls/register", (req, res) => {

  res.render("urls_register")
})

app.get("/urls/:id", (req, res) => {
  const username = req.cookies["username"];
  let templateVars = {
    shortURL: req.params.id,
    user: req.cookies["user_id"]
  };
  res.render("urls_show", templateVars)
})

app.get("/u/:id", (req, res) => {
  const shortRandomURL = req.params.shortURL;
  const userId = req.cookies["user_id"];
  let keyFound = ""
  for (owner in urlDatabase) {
    if(userId === owner) {
      for (data in urlDatabase[owner]) {
        if (data === shortRandomURL) {
          res.redirect(urlDatabase[owner][data])
        }
      }
    }
  }
})

app.post("/urls/register", (req, res) => {
  const userEmail = req.body.email
  const userPassword = req.body.password

  if (userEmail === "" || userPassword === "") {
    res.status(400).end();
    return;
  }

  let userExist = false;
  for (let id in users) {
    if (userEmail === users[id]["email"]) {
      userExist = users[id];
    }
  }
  if (userExist) {
    res.status(400).end();
  } else {
    let userId = generateRandomString();
    let register = {
      id: userId,
      email: userEmail,
      password: userPassword
    };
    urlDatabase[userId] = {}
    users[userId] = register
    res.cookie("user_id", userId);
    res.redirect("/urls")
  }
});






app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString()
  const userId = req.cookies["user_id"]
  const userURL = req.body.longURL
  if (userId) {
    urlDatabase[userId][newShortURL] = userURL;
    res.redirect("/urls")
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies["user_id"]
  const id = req.params.id
  delete urlDatabase[userId][id]
  res.redirect("/urls")
})

app.post("/urls/:id/edit", (req, res) => {
  const userId =  req.cookies["user_id"]
  urlDatabase[userId][req.params.id] = req.body.newURL;
  res.redirect("/urls");
});

app.post("/urls/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
})

app.post("/urls/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})


