const querystring = require("querystring");
const request = require("request");

const response_type = "code";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize?";
const redirect_uri = "https://musicplug-backend.onrender.com/spotify/callback";
const SCOPES = "user-read-private user-read-email";

exports.login = (req, res) => {
  res.redirect(
    SPOTIFY_AUTHORIZE_ENDPOINT +
      querystring.stringify({
        response_type,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: SCOPES,
        redirect_uri,
        show_dialog: true,
      })
  );
};

exports.callback = (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token,
        refresh_token = body.refresh_token;

      // const options = {
      // 	url: 'https://api.spotify.com/v1/me',
      // 	headers: { Authorization: 'Bearer ' + access_token },
      // 	json: true,
      // };

      res.redirect(
        "https://musicplug.vercel.app/redirect/#" +
          querystring.stringify({
            access_token,
            refresh_token,
          })
      );
    } else {
      res.redirect(
        "https://musicplug.vercel.app/redirect/#" +
          querystring.stringify({
            error: "invalid_token",
          })
      );
    }
  });
};

exports.refresh_token = (req, res) => {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token,
      });
    }
  });
};
