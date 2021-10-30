const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const SECRETKEY = "secret";
const { promisify } = require("util");
const {
  fbLoginUrl,
  getAccessTokenFromCode,
  getFacebookUserData,
} = require("../utils/fbconfig");

exports.registerUser = async function (req, res) {
  try {
    // 1) check if the user exists
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      // user already exists
      res.status(403).json({
        success: false,
        message: "User already exists",
      });
    }
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const savedUser = await newUser.save();
    // create a token
    let token = jwt.sign({ _id: savedUser._id }, SECRETKEY, {
      expiresIn: "5d",
    });

    console.log(savedUser);
    res.status(201).json({
      success: true,
      savedUser,
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.loginUser = async function (req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "username not found",
      });
    }

    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!validated) {
      return res.status(400).json({
        success: false,
        message: "wrong password retry...",
      });
    }
    // create a token
    let token = jwt.sign({ _id: user._id }, SECRETKEY, {
      expiresIn: "5d",
    });
    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// portect is a function that is ment to be ran before as a middleware before protected

exports.protect = async (req, res, next) => {
  // only bearer token allowed
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: " user not logged in, token not found",
    });
  }
  // verify token
  try {
    let decoded = await promisify(jwt.verify)(token, SECRETKEY);

    // find user if not found user was deleted but token was leaked
    const currentUser = await UserModel.findById(decoded._id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "token belonging to this user no longer exists",
      });
    }
    req.user = currentUser;
    //   next();
    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "wrong token login again",
    });
  }
};
//FB:redirect url= http://localhost:5000/api/auth/redirect/fb
exports.fbRedirect = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(501).json({
      success: false,
      message: "something went wrong with fb login code",
    });
  }

  try {
    const access_token = await getAccessTokenFromCode(code);
    const data = await getFacebookUserData(access_token);
    // here as the user is authenticated we send him the token,all fb data need not to be stored
    let token = jwt.sign({ id: data.id, fb: true }, SECRETKEY, {
      expiresIn: "5d",
    });
    res.json({
      data,
      token,
    });
  } catch (err) {
    return res.status(501).json({
      success: false,
      message: `something went wrong with acess fb${err}`,
    });
  }
};
exports.fbGetLoginUrl = (req, res) => {
  res.json({
    login_url: fbLoginUrl,
  });
};
