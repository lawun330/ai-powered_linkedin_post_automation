const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { getTokenVersionByUserId } = require("../services/userRepository");

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "missing or invalid authorization header",
    });
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.decode(token, { complete: true });

    // validate token algorithm
    const tokenAlg = decoded?.header?.alg;
    if (tokenAlg !== "HS256") {
      return res.status(401).json({
        success: false,
        message: "invalid token algorithm",
      });
    }

    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });

    if (!payload || !payload.id) {
      return res.status(401).json({
        success: false,
        message: "invalid token payload",
      });
    }

    const tokenVersion = Number(payload.tokenVersion);
    if (!Number.isFinite(tokenVersion) || tokenVersion < 1) {
      return res.status(401).json({
        success: false,
        message: "invalid token payload",
      });
    }

    let storedTokenVersion;
    try {
      storedTokenVersion = await getTokenVersionByUserId(payload.id);
    } catch (dbErr) {
      console.error("auth tokenVersion lookup failed:", dbErr);
      return next(dbErr);
    }

    if (storedTokenVersion === null) {
      return res.status(401).json({
        success: false,
        message: "invalid or expired token",
      });
    }

    if (tokenVersion !== storedTokenVersion) {
      return res.status(401).json({
        success: false,
        message: "session ended or token revoked",
      });
    }

    req.user = payload;
    return next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({
      success: false,
      message: "invalid or expired token",
    });
  }
}

module.exports = authMiddleware;
