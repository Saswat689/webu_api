const axios = require("axios");
const queryString = require("query-string");

const stringifiedParams = queryString.stringify({
  client_id: process.env.FB_CLIENT_ID,
  redirect_uri: "http://localhost:5000/api/auth/redirect/fb",
  scope: ["email", "user_friends"].join(","), // comma seperated string
  response_type: "code",
  auth_type: "rerequest",
  display: "popup",
});

const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

exports.fbLoginUrl = facebookLoginUrl;
// gets accessToken from code which(accessToken) will allow us get the user info
exports.getAccessTokenFromCode = async (code) => {
  const { data } = await axios({
    url: "https://graph.facebook.com/v4.0/oauth/access_token",
    method: "get",
    params: {
      client_id: process.env.FB_CLIENT_ID,
      client_secret: process.env.FB_CLIENT_SECRET,
      redirect_uri: "http://localhost:5000/api/auth/redirect/fb",
      code,
    },
  });
  return data.access_token;
};
// get data from fb API using access token
exports.getFacebookUserData = async (access_token) => {
  const { data } = await axios({
    url: "https://graph.facebook.com/me",
    method: "get",
    params: {
      fields: ["id", "email", "first_name", "last_name"].join(","),
      access_token: access_token,
    },
  });
  //console.log(data); // { id, email, first_name, last_name }
  return data;
};
