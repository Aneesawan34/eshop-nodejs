var { expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET"] },
      { url: /\/product(.*)/, methods: ["GET"] },
      { url: /\/category(.*)/, methods: ["GET"] },
      { url: /\/order(.*)/, methods: ["GET", "POST", "DELETE", "PUT"] },
      { url: /\/order-item(.*)/, methods: ["GET", "POST", "DELETE", "PUT"] },
      "/user/login",
      "/user/register",
    ],
  });
}

const isRevoked = async (_req, token) => {
  if (!token.payload.isAdmin) {
    return true;
  } else {
    return false;
  }
};

module.exports = authJwt;
