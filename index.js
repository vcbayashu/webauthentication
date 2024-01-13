const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
app.use(cookies());
const verifyToken = require("./tokens/verifyToken");
const generateToken = require("./tokens/generateToken");
require("dotenv").config();

app.get("/public", (req, res) => {
  try {
    return res.json({ success: true, message: "Hello from the public api " });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/login", (req, res) => {
  try {
    console.log(req.body);
    let userid = req.body.userid;

    if (req.body.password === 12345) {
      const token = generateToken(userid);
      console.log(token);
      res.cookie("web_tk", token); // cookie set code
      return res.json({ success: true, message: "Cookie generate success" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect credentials" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const testMiddleWareFunction = (req, res, next) => {
  if (verifyToken(req.cookies.web_tk)) {
    const userinfo = verifyToken(req.cookies.web_tk);
    console.log(userinfo);
    next();
  } else {
    return res.status(400).json({ success: false, error: "UNAUTHORIZED" });
  }
};
app.get("/profile", testMiddleWareFunction, (req, res) => {
  try {
    return res.json({ success: true, message: "hello this is your profile" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/youtubehistory", testMiddleWareFunction, (req, res) => {
  try {
    return res.json({ success: true, message: "hello this is your friends" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/chats", testMiddleWareFunction, (req, res) => {
  try {
    return res.json({ success: true, message: "hello this is your chats" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/test", testMiddleWareFunction, (req, res) => {
  try {
    return res.json({ success: true, message: "Hello from the middleware" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running at port 5000");
});

// Cookies are small files of information (encrypted long string of token) that a web server(backend)
//  generates (while logging) and sends to a web browser (frontend).
//  Web browsers store the cookies they receive for a predetermined period of time,
//   or for the length of a user's session on a website.
//    They attach the relevant cookies to any future requests the user makes of the web server.

// Cookies are help in authenticating whether the user is logged in or not
// Cookies not only authenticate the user but also stores the details about the current user
// because using these details from the cookies, the backend server send the respective data.

// A middleware is a function which runs in between the request and response cycle.
// This middleware function contains three arguments
// which are request and response objects, along with next argument
// Next argument is responsible for further processing of response
// operation
