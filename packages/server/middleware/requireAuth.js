import jwt from "jsonwebtoken";
import keys from "../config/keys";
import User from "../models/user";

export default async function requireAuth(req, res, next) {
  const authHeader = req.get("authorization");
  if (!authHeader) return res.status(401).json({ message: "Unauthorized error" });

  const accessToken = authHeader.replace("Bearer ", "");

  jwt.verify(accessToken, keys.auth.accessTokenSecret, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized error" });
    }
    if (!payload.sub) return res.status(401).json({ message: "Unauthorized error" });

    User.findOne({ email: payload.sub }).then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Unauthorized error" });
      }

      req.user = user;
      next();
    });
  });
}
