const { getAuth } = require("../db");
const isAuthenticated = async (req, res) => {
  // getting authorization token
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    // if token did not found make the auth token null
    req.authToken = null;
  }
  try {
    const auth = getAuth();
    // extract auth token from request header
    const { authToken } = req;
    // verify the token
    const userInfo = await auth.verifyIdToken(authToken);
    // assing user uid to re.authId
    req.authId = userInfo.uid;
    return next();
  } catch (e) {
    // send error response
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};
module.exports = isAuthenticated;
