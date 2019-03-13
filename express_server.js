const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars)
})

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString()
  longURL = req.body.longURL
  urlDatabase[newShortURL] = longURL
  res.redirect("/urls/");
});

app.get("/u/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id]

  res.redirect(longURL);
})

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
})

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL
  res.redirect("/urls");
});




