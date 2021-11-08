const redirectUri = "http://localhost:5000/api/auth/google";
const axios = require("axios");
const queryString = require("query-string");

const stringifiedParams = queryString.stringify({
  client_id: process.env.google_client_id,
  redirect_uri: redirectUri,
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" "),
  response_type: "code",
  access_type: "offline",
  prompt: "consent",
});
exports.googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

exports.getGoogleAccessTokenFromCode = async (code) => {
  const { data } = await axios({
    url: "https://oauth2.googleapis.com/token",
    method: "post",
    data: {
      client_id: process.env.google_client_id,
      client_secret: process.env.google_secret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code,
    },
  });
  return data.access_token;
};

exports.getGoogleUserInfo = async (access_token) => {
  const { data } = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return data;
};
